# backend/crud.py
from sqlalchemy.orm import Session
from sqlalchemy import func
import models
import schemas
from typing import List, Optional

# CRUD pour les utilisateurs
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate, hashed_password: str):
    db_user = models.User(
        username=user.username,
        email=user.email,
        full_name=user.full_name,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# CRUD pour les départements
def get_departments(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Department).offset(skip).limit(limit).all()

def get_department(db: Session, department_id: int):
    return db.query(models.Department).filter(models.Department.id == department_id).first()

def create_department(db: Session, department: schemas.DepartmentCreate):
    db_department = models.Department(**department.dict())
    db.add(db_department)
    db.commit()
    db.refresh(db_department)
    return db_department

def count_departments(db: Session):
    return db.query(models.Department).count()

# CRUD pour les laboratoires
def get_laboratories(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Laboratory).offset(skip).limit(limit).all()

def get_laboratory(db: Session, laboratory_id: int):
    return db.query(models.Laboratory).filter(models.Laboratory.id == laboratory_id).first()

def create_laboratory(db: Session, laboratory: schemas.LaboratoryCreate):
    db_laboratory = models.Laboratory(**laboratory.dict())
    db.add(db_laboratory)
    db.commit()
    db.refresh(db_laboratory)
    return db_laboratory

def update_laboratory(db: Session, laboratory_id: int, laboratory: schemas.LaboratoryUpdate):
    db_laboratory = get_laboratory(db, laboratory_id)
    if db_laboratory is None:
        return None
    
    update_data = laboratory.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_laboratory, key, value)
    
    db.commit()
    db.refresh(db_laboratory)
    return db_laboratory

def delete_laboratory(db: Session, laboratory_id: int):
    db_laboratory = get_laboratory(db, laboratory_id)
    if db_laboratory is None:
        return False
    
    db.delete(db_laboratory)
    db.commit()
    return True

def count_laboratories(db: Session):
    return db.query(models.Laboratory).count()

# CRUD pour les équipements
def get_equipments(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Equipment).offset(skip).limit(limit).all()

def get_equipment(db: Session, equipment_id: int):
    return db.query(models.Equipment).filter(models.Equipment.id == equipment_id).first()

def get_equipments_by_laboratory(db: Session, laboratory_id: int):
    return db.query(models.Equipment).filter(models.Equipment.laboratory_id == laboratory_id).all()

def create_equipment(db: Session, equipment: schemas.EquipmentCreate):
    db_equipment = models.Equipment(**equipment.dict())
    db.add(db_equipment)
    db.commit()
    db.refresh(db_equipment)
    return db_equipment

def update_equipment(db: Session, equipment_id: int, equipment: schemas.EquipmentUpdate):
    db_equipment = get_equipment(db, equipment_id)
    if db_equipment is None:
        return None
    
    update_data = equipment.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_equipment, key, value)
    
    db.commit()
    db.refresh(db_equipment)
    return db_equipment

def delete_equipment(db: Session, equipment_id: int):
    db_equipment = get_equipment(db, equipment_id)
    if db_equipment is None:
        return False
    
    db.delete(db_equipment)
    db.commit()
    return True

def count_equipments(db: Session):
    return db.query(models.Equipment).count()

# CRUD pour les TPs
def get_tps(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.TP).offset(skip).limit(limit).all()

def get_tp(db: Session, tp_id: int):
    return db.query(models.TP).filter(models.TP.id == tp_id).first()

def get_tps_by_laboratory(db: Session, laboratory_id: int):
    return db.query(models.TP).filter(models.TP.laboratory_id == laboratory_id).all()

def create_tp(db: Session, tp: schemas.TPCreate):
    db_tp = models.TP(**tp.dict())
    db.add(db_tp)
    db.commit()
    db.refresh(db_tp)
    return db_tp

def update_tp(db: Session, tp_id: int, tp: schemas.TPUpdate):
    db_tp = get_tp(db, tp_id)
    if db_tp is None:
        return None
    
    update_data = tp.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_tp, key, value)
    
    db.commit()
    db.refresh(db_tp)
    return db_tp

def delete_tp(db: Session, tp_id: int):
    db_tp = get_tp(db, tp_id)
    if db_tp is None:
        return False
    
    db.delete(db_tp)
    db.commit()
    return True

def count_tps(db: Session):
    return db.query(models.TP).count()

# CRUD pour les images de laboratoires
def get_laboratory_images(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.LaboratoryImage).offset(skip).limit(limit).all()

def get_images_by_laboratory(db: Session, laboratory_id: int):
    return db.query(models.LaboratoryImage).filter(
        models.LaboratoryImage.laboratory_id == laboratory_id
    ).order_by(models.LaboratoryImage.order).all()

def create_laboratory_image(db: Session, image: schemas.LaboratoryImageCreate):
    db_image = models.LaboratoryImage(**image.dict())
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    return db_image

def delete_laboratory_image(db: Session, image_id: int):
    db_image = db.query(models.LaboratoryImage).filter(models.LaboratoryImage.id == image_id).first()
    if db_image is None:
        return False
    
    db.delete(db_image)
    db.commit()
    return True

# CRUD pour les logs de modification
def create_modification_log(
    db: Session,
    entity_type: str,
    entity_id: int,
    action: str,
    user_id: int,
    old_data: dict = None,
    new_data: dict = None
):
    db_log = models.ModificationLog(
        entity_type=entity_type,
        entity_id=entity_id,
        action=action,
        user_id=user_id,
        old_data=old_data,
        new_data=new_data
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

def get_modification_logs(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.ModificationLog).order_by(
        models.ModificationLog.created_at.desc()
    ).offset(skip).limit(limit).all()

def get_logs_by_entity(db: Session, entity_type: str, entity_id: int):
    return db.query(models.ModificationLog).filter(
        models.ModificationLog.entity_type == entity_type,
        models.ModificationLog.entity_id == entity_id
    ).order_by(models.ModificationLog.created_at.desc()).all()