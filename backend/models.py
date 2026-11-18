# backend/models.py
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    full_name = Column(String(100))
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relations
    modification_logs = relationship("ModificationLog", back_populates="user")

class Department(Base):
    __tablename__ = "departments"
    
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(10), unique=True, index=True, nullable=False)
    name = Column(String(200), nullable=False)
    description = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relations
    laboratories = relationship("Laboratory", back_populates="department")

class Laboratory(Base):
    __tablename__ = "laboratories"
    
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(10), index=True)
    name = Column(String(200), nullable=False)
    title = Column(String(300))
    description = Column(Text)
    location = Column(String(200))
    capacity = Column(Integer)
    image_url = Column(String(500))
    
    # Chef de laboratoire
    chief_name = Column(String(100))
    chief_title = Column(String(100))
    chief_photo = Column(String(500))
    chief_phone = Column(String(20))
    chief_email = Column(String(100))
    
    # Clé étrangère
    department_id = Column(Integer, ForeignKey("departments.id"))
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relations
    department = relationship("Department", back_populates="laboratories")
    equipments = relationship("Equipment", back_populates="laboratory", cascade="all, delete-orphan")
    tps = relationship("TP", back_populates="laboratory", cascade="all, delete-orphan")
    images = relationship("LaboratoryImage", back_populates="laboratory", cascade="all, delete-orphan")

class Equipment(Base):
    __tablename__ = "equipments"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text)
    image_url = Column(String(500))
    specifications = Column(JSON)
    technical_sheet_url = Column(String(500))
    acquisition_date = Column(DateTime(timezone=True))
    status = Column(String(50), default="operational")
    
    # Clé étrangère
    laboratory_id = Column(Integer, ForeignKey("laboratories.id"), nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relations
    laboratory = relationship("Laboratory", back_populates="equipments")

class TP(Base):
    __tablename__ = "tps"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(300), nullable=False)
    description = Column(Text)
    video_url = Column(String(500))
    video_type = Column(String(20), default="youtube")
    duration = Column(String(20))
    realization_date = Column(DateTime(timezone=True))
    
    # Clé étrangère
    laboratory_id = Column(Integer, ForeignKey("laboratories.id"), nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relations
    laboratory = relationship("Laboratory", back_populates="tps")

class LaboratoryImage(Base):
    __tablename__ = "laboratory_images"
    
    id = Column(Integer, primary_key=True, index=True)
    image_url = Column(String(500), nullable=False)
    caption = Column(String(200))
    order = Column(Integer, default=0)
    
    # Clé étrangère
    laboratory_id = Column(Integer, ForeignKey("laboratories.id"), nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relations
    laboratory = relationship("Laboratory", back_populates="images")

class ModificationLog(Base):
    __tablename__ = "modification_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    entity_type = Column(String(50), nullable=False)
    entity_id = Column(Integer, nullable=False)
    action = Column(String(20), nullable=False)
    old_data = Column(JSON)
    new_data = Column(JSON)
    
    # Clé étrangère
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relations
    user = relationship("User", back_populates="modification_logs")