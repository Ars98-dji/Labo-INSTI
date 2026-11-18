# backend/main.py - API des laboratoires de l'INSTI
# Les routes d'écriture (POST, PUT, DELETE) exigent un token JWT valide.

from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List, Optional
import uvicorn
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import shutil
import os
from pathlib import Path

from database import engine, get_db, Base
import models
import schemas
import crud

# Configuration JWT
SECRET_KEY = "votre_cle_secrete_tres_securisee_changez_moi_en_production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Configuration des uploads
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# Créer les tables
Base.metadata.create_all(bind=engine)

# Initialiser FastAPI
app = FastAPI(
    title="INSTI Laboratoires API",
    description="API pour la gestion des laboratoires pédagogiques de l'INSTI",
    version="1.0.0"
)

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exposer les fichiers uploadés : /api/v1/upload renvoie /uploads/<fichier>
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Configuration de la sécurité
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/token")

# Fonctions utilitaires d'authentification
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = crud.get_user_by_username(db, username=username)
    if user is None:
        raise credentials_exception
    return user

# Routes d'authentification
@app.post("/api/v1/token", response_model=schemas.Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_username(db, username=form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/v1/register", response_model=schemas.UserResponse)
async def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user, hashed_password=get_password_hash(user.password))

# Routes pour les départements
@app.get("/api/v1/departments", response_model=List[schemas.DepartmentResponse])
def get_departments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    departments = crud.get_departments(db, skip=skip, limit=limit)
    return departments

@app.post("/api/v1/departments", response_model=schemas.DepartmentResponse)
def create_department(
    department: schemas.DepartmentCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return crud.create_department(db=db, department=department)

# Routes pour les laboratoires
@app.get("/api/v1/laboratories", response_model=List[schemas.LaboratoryResponse])
def get_laboratories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    laboratories = crud.get_laboratories(db, skip=skip, limit=limit)
    return laboratories

@app.get("/api/v1/laboratories/{laboratory_id}", response_model=schemas.LaboratoryResponse)
def get_laboratory(laboratory_id: int, db: Session = Depends(get_db)):
    laboratory = crud.get_laboratory(db, laboratory_id=laboratory_id)
    if laboratory is None:
        raise HTTPException(status_code=404, detail="Laboratory not found")
    return laboratory

@app.post("/api/v1/laboratories", response_model=schemas.LaboratoryResponse)
def create_laboratory(
    laboratory: schemas.LaboratoryCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return crud.create_laboratory(db=db, laboratory=laboratory)

@app.put("/api/v1/laboratories/{laboratory_id}", response_model=schemas.LaboratoryResponse)
def update_laboratory(
    laboratory_id: int,
    laboratory: schemas.LaboratoryUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_laboratory = crud.update_laboratory(db=db, laboratory_id=laboratory_id, laboratory=laboratory)
    if db_laboratory is None:
        raise HTTPException(status_code=404, detail="Laboratory not found")
    return db_laboratory

# Suppression protégée par authentification JWT
@app.delete("/api/v1/laboratories/{laboratory_id}")
def delete_laboratory(
    laboratory_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    print(f"🗑️ Backend: Demande de suppression du laboratoire ID {laboratory_id}")
    success = crud.delete_laboratory(db=db, laboratory_id=laboratory_id)
    if not success:
        print(f"❌ Backend: Laboratoire ID {laboratory_id} non trouvé")
        raise HTTPException(status_code=404, detail="Laboratory not found")
    print(f"✅ Backend: Laboratoire ID {laboratory_id} supprimé avec succès")
    return {"message": "Laboratory deleted successfully", "id": laboratory_id}

# Routes pour les équipements
@app.get("/api/v1/equipments", response_model=List[schemas.EquipmentResponse])
def get_equipments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    equipments = crud.get_equipments(db, skip=skip, limit=limit)
    return equipments

@app.get("/api/v1/equipments/{equipment_id}", response_model=schemas.EquipmentResponse)
def get_equipment(equipment_id: int, db: Session = Depends(get_db)):
    equipment = crud.get_equipment(db, equipment_id=equipment_id)
    if equipment is None:
        raise HTTPException(status_code=404, detail="Equipment not found")
    return equipment

@app.post("/api/v1/equipments", response_model=schemas.EquipmentResponse)
def create_equipment(
    equipment: schemas.EquipmentCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return crud.create_equipment(db=db, equipment=equipment)

@app.put("/api/v1/equipments/{equipment_id}", response_model=schemas.EquipmentResponse)
def update_equipment(
    equipment_id: int,
    equipment: schemas.EquipmentUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_equipment = crud.update_equipment(db=db, equipment_id=equipment_id, equipment=equipment)
    if db_equipment is None:
        raise HTTPException(status_code=404, detail="Equipment not found")
    return db_equipment

# Suppression protégée par authentification JWT
@app.delete("/api/v1/equipments/{equipment_id}")
def delete_equipment(
    equipment_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    print(f"🗑️ Backend: Demande de suppression de l'équipement ID {equipment_id}")
    success = crud.delete_equipment(db=db, equipment_id=equipment_id)
    if not success:
        print(f"❌ Backend: Équipement ID {equipment_id} non trouvé")
        raise HTTPException(status_code=404, detail="Equipment not found")
    print(f"✅ Backend: Équipement ID {equipment_id} supprimé avec succès")
    return {"message": "Equipment deleted successfully", "id": equipment_id}

# Routes pour les TPs
@app.get("/api/v1/tps", response_model=List[schemas.TPResponse])
def get_tps(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    tps = crud.get_tps(db, skip=skip, limit=limit)
    return tps

@app.get("/api/v1/tps/{tp_id}", response_model=schemas.TPResponse)
def get_tp(tp_id: int, db: Session = Depends(get_db)):
    tp = crud.get_tp(db, tp_id=tp_id)
    if tp is None:
        raise HTTPException(status_code=404, detail="TP not found")
    return tp

@app.post("/api/v1/tps", response_model=schemas.TPResponse)
def create_tp(
    tp: schemas.TPCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return crud.create_tp(db=db, tp=tp)

@app.put("/api/v1/tps/{tp_id}", response_model=schemas.TPResponse)
def update_tp(
    tp_id: int,
    tp: schemas.TPUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_tp = crud.update_tp(db=db, tp_id=tp_id, tp=tp)
    if db_tp is None:
        raise HTTPException(status_code=404, detail="TP not found")
    return db_tp

# Suppression protégée par authentification JWT
@app.delete("/api/v1/tps/{tp_id}")
def delete_tp(
    tp_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    print(f"🗑️ Backend: Demande de suppression du TP ID {tp_id}")
    success = crud.delete_tp(db=db, tp_id=tp_id)
    if not success:
        print(f"❌ Backend: TP ID {tp_id} non trouvé")
        raise HTTPException(status_code=404, detail="TP not found")
    print(f"✅ Backend: TP ID {tp_id} supprimé avec succès")
    return {"message": "TP deleted successfully", "id": tp_id}

# Routes pour les images de laboratoires
@app.get("/api/v1/laboratory-images", response_model=List[schemas.LaboratoryImageResponse])
def get_laboratory_images(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    images = crud.get_laboratory_images(db, skip=skip, limit=limit)
    return images

@app.post("/api/v1/laboratory-images", response_model=schemas.LaboratoryImageResponse)
def create_laboratory_image(
    image: schemas.LaboratoryImageCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return crud.create_laboratory_image(db=db, image=image)

# Route pour l'upload de fichiers
@app.post("/api/v1/upload")
async def upload_file(
    file: UploadFile = File(...),
    current_user: models.User = Depends(get_current_user)
):
    file_extension = file.filename.split(".")[-1]
    file_name = f"{datetime.now().timestamp()}.{file_extension}"
    file_path = UPLOAD_DIR / file_name
    
    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    return {"filename": file_name, "url": f"/uploads/{file_name}"}

# Route de statistiques
@app.get("/api/v1/stats")
def get_stats(db: Session = Depends(get_db)):
    return {
        "total_laboratories": crud.count_laboratories(db),
        "total_equipments": crud.count_equipments(db),
        "total_tps": crud.count_tps(db),
        "total_departments": crud.count_departments(db)
    }

@app.get("/")
def read_root():
    return {
        "message": "Bienvenue sur l'API des Laboratoires de l'INSTI",
        "version": "1.0.0",
        "documentation": "/docs",
        "note": "Authentification JWT requise sur les routes d'écriture"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)