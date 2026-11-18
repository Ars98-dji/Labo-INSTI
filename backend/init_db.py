# backend/init_db.py
"""
Script d'initialisation de la base de données avec les données de démonstration
"""
from datetime import datetime
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from database import engine, SessionLocal, Base
import models

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def init_database():
    """Initialise la base de données avec les données de base"""
    
    # Créer toutes les tables
    print("Création des tables...")
    Base.metadata.create_all(bind=engine)
    
    # Créer une session
    db = SessionLocal()
    
    try:
        # Créer un utilisateur admin par défaut
        print("Création de l'utilisateur admin...")
        admin_user = db.query(models.User).filter(models.User.username == "admin").first()
        if not admin_user:
            admin_user = models.User(
                username="admin",
                email="admin@insti.edu",
                full_name="Administrateur INSTI",
                hashed_password=pwd_context.hash("admin123"),
                is_superuser=True,
                is_active=True
            )
            db.add(admin_user)
            db.commit()
            print("✓ Utilisateur admin créé (username: admin, password: admin123)")
        else:
            print("✓ Utilisateur admin existe déjà")
        
        # Créer les départements
        print("\nCréation des départements...")
        departments_data = [
            {"code": "GC", "name": "Génie Civil", "description": "Département de Génie Civil"},
            {"code": "GEI", "name": "Génie Électrique et Informatique", "description": "Département de Génie Électrique et Informatique"},
            {"code": "GE", "name": "Génie Énergétique", "description": "Département de Génie Énergétique"},
            {"code": "GMP", "name": "Génie Mécanique et Productique", "description": "Département de Génie Mécanique et Productique"},
            {"code": "MS", "name": "Maintenance des Systèmes", "description": "Département de Maintenance des Systèmes"}
        ]
        
        for dept_data in departments_data:
            dept = db.query(models.Department).filter(models.Department.code == dept_data["code"]).first()
            if not dept:
                dept = models.Department(**dept_data)
                db.add(dept)
                print(f"✓ Département {dept_data['code']} créé")
            else:
                print(f"✓ Département {dept_data['code']} existe déjà")
        
        db.commit()
        
        # Créer les laboratoires
        print("\nCréation des laboratoires...")
        laboratories_data = [
            {
                "code": "GC",
                "name": "Génie Civil",
                "title": "Laboratoire de Génie Civil – INSTI",
                "description": "Le laboratoire de génie civil de l'INSTI est un espace dédié aux essais sur les matériaux de construction, aux études géotechniques et au contrôle qualité, afin de garantir la fiabilité des ouvrages et soutenir la recherche en infrastructures durables.",
                "image_url": "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&h=400&fit=crop",
                "chief_name": "M. YESSOUFOU Joslin",
                "chief_title": "Responsable du Département",
                "chief_photo": "https://i.pravatar.cc/150?img=12",
                "chief_phone": "+229 01XXXXXXXX",
                "chief_email": "patriko75@gmail.com",
                "department_id": 1
            },
            {
                "code": "GEI",
                "name": "Génie Électrique et Informatique",
                "title": "Laboratoire de Génie Électrique et Informatique – INSTI",
                "description": "Le laboratoire de Génie Électrique et Informatique est dédié aux études sur les systèmes électriques, l'automatisation, l'électronique et l'informatique appliquée, favorisant l'innovation dans les réseaux intelligents et les technologies numériques.",
                "image_url": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop",
                "chief_name": "Mme DEGUENON Justine",
                "chief_title": "Responsable du Département",
                "chief_photo": "https://i.pravatar.cc/150?img=32",
                "chief_phone": "+229 02XXXXXXXX",
                "chief_email": "clarisse.ahissou@insti.edu",
                "department_id": 2
            },
            {
                "code": "GE",
                "name": "Génie Énergétique",
                "title": "Laboratoire de Génie Énergétique – INSTI",
                "description": "Le laboratoire de Génie Énergétique est consacré aux études sur la conversion, le stockage et l'efficacité énergétique, incluant les énergies renouvelables et les systèmes thermiques.",
                "image_url": "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600&h=400&fit=crop",
                "chief_name": "M. DJOSSOU Armand",
                "chief_title": "Responsable du Département",
                "chief_photo": "https://i.pravatar.cc/150?img=45",
                "chief_phone": "+229 03XXXXXXXX",
                "chief_email": "rodrigue.hountondji@insti.edu",
                "department_id": 3
            },
            {
                "code": "GMP",
                "name": "Génie Mécanique et Productique",
                "title": "Laboratoire de Génie Mécanique et Productique – INSTI",
                "description": "Étude des matériaux, conception mécanique, usinage et fabrication assistée par ordinateur.",
                "image_url": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop",
                "chief_name": "M. HINVI AMOUSSOU Laurent",
                "chief_title": "Responsable du Département",
                "chief_photo": "https://i.pravatar.cc/150?img=56",
                "chief_phone": "+229 04XXXXXXXX",
                "chief_email": "firmin.dossou@insti.edu",
                "department_id": 4
            },
            {
                "code": "MS",
                "name": "Maintenance des Systèmes",
                "title": "Laboratoire de Maintenance des Systèmes – INSTI",
                "description": "Diagnostic, entretien et fiabilité des systèmes industriels et informatiques.",
                "image_url": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop",
                "chief_name": "M. ADAMOU David",
                "chief_title": "Responsable du Département",
                "chief_photo": "https://i.pravatar.cc/150?img=67",
                "chief_phone": "+229 05XXXXXXXX",
                "chief_email": "mireille.tchibozo@insti.edu",
                "department_id": 5
            }
        ]
        
        for lab_data in laboratories_data:
            lab = db.query(models.Laboratory).filter(models.Laboratory.code == lab_data["code"]).first()
            if not lab:
                lab = models.Laboratory(**lab_data)
                db.add(lab)
                db.commit()
                db.refresh(lab)
                print(f"✓ Laboratoire {lab_data['code']} créé")
                
                # Ajouter les images du laboratoire
                images_data = [
                    {"laboratory_id": lab.id, "image_url": lab_data["image_url"], "order": 0}
                ]
                
                if lab_data["code"] == "GC":
                    images_data.append({
                        "laboratory_id": lab.id,
                        "image_url": "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&h=400&fit=crop",
                        "order": 1
                    })
                
                for img_data in images_data:
                    img = models.LaboratoryImage(**img_data)
                    db.add(img)
                
                db.commit()
            else:
                print(f"✓ Laboratoire {lab_data['code']} existe déjà")
        
        # Ajouter quelques équipements pour le labo GC
        print("\nCréation des équipements de démonstration...")
        gc_lab = db.query(models.Laboratory).filter(models.Laboratory.code == "GC").first()
        if gc_lab:
            equipments_data = [
                {
                    "name": "Presse hydraulique",
                    "description": "Capacité 3000 kN pour essais sur béton et matériaux de construction",
                    "image_url": "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=400&fit=crop",
                    "laboratory_id": gc_lab.id,
                    "specifications": {
                        "marque": "Controls Group",
                        "modele": "Automax 5",
                        "capacite": "3000 kN",
                        "precision": "± 0.5%",
                        "anneeMiseEnService": "2019"
                    }
                },
                {
                    "name": "Los Angeles",
                    "description": "Machine d'essai d'usure par frottement des granulats",
                    "image_url": "https://images.unsplash.com/photo-1581092160607-ee67e8e0e8f1?w=400&h=400&fit=crop",
                    "laboratory_id": gc_lab.id,
                    "specifications": {
                        "marque": "Matest",
                        "modele": "C.097",
                        "vitesse": "30-33 tr/min",
                        "anneeMiseEnService": "2020"
                    }
                }
            ]
            
            for eq_data in equipments_data:
                eq = db.query(models.Equipment).filter(
                    models.Equipment.name == eq_data["name"],
                    models.Equipment.laboratory_id == gc_lab.id
                ).first()
                if not eq:
                    eq = models.Equipment(**eq_data)
                    db.add(eq)
                    print(f"✓ Équipement '{eq_data['name']}' créé")
            
            db.commit()
        
        # Ajouter quelques TPs pour le labo GC
        print("\nCréation des TPs de démonstration...")
        if gc_lab:
            tps_data = [
                {
                    "title": "Essai de compression sur béton",
                    "description": "Détermination de la résistance à la compression des éprouvettes de béton selon les normes en vigueur",
                    "video_url": "https://www.youtube.com/embed/0MdbFcplyWA",
                    "duration": "5:23",
                    "laboratory_id": gc_lab.id
                },
                {
                    "title": "Analyse granulométrique",
                    "description": "Détermination de la courbe granulométrique des granulats par tamisage",
                    "video_url": "https://www.youtube.com/embed/p8QOW65lXYg",
                    "duration": "4:15",
                    "laboratory_id": gc_lab.id
                }
            ]
            
            for tp_data in tps_data:
                tp = db.query(models.TP).filter(
                    models.TP.title == tp_data["title"],
                    models.TP.laboratory_id == gc_lab.id
                ).first()
                if not tp:
                    tp = models.TP(**tp_data)
                    db.add(tp)
                    print(f"✓ TP '{tp_data['title']}' créé")
            
            db.commit()
        
        print("\n" + "="*60)
        print("✅ Base de données initialisée avec succès!")
        print("="*60)
        print("\nInformations de connexion:")
        print("  Username: admin")
        print("  Password: admin123")
        print("\nL'API est prête à être utilisée!")
        
    except Exception as e:
        print(f"\n❌ Erreur lors de l'initialisation: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    init_database()