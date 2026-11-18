# backend/schemas.py
from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime

# ============================================================
# AUTHENTIFICATION
# ============================================================

class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


# ============================================================
# UTILISATEURS
# ============================================================

class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None


class UserResponse(UserBase):
    id: int
    is_active: bool
    is_superuser: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ============================================================
# DEPARTEMENTS
# ============================================================

class DepartmentBase(BaseModel):
    code: str
    name: str
    description: Optional[str] = None


class DepartmentCreate(DepartmentBase):
    pass


class DepartmentUpdate(BaseModel):
    code: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None


class DepartmentResponse(DepartmentBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ============================================================
# LABORATORY IMAGES
# ============================================================

class LaboratoryImageBase(BaseModel):
    image_url: str
    caption: Optional[str] = None
    order: int = 0


class LaboratoryImageCreate(LaboratoryImageBase):
    laboratory_id: int


class LaboratoryImageResponse(LaboratoryImageBase):
    id: int
    laboratory_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ============================================================
# LABORATOIRES
# ============================================================

class LaboratoryBase(BaseModel):
    code: Optional[str] = None
    name: str
    title: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    capacity: Optional[int] = None
    image_url: Optional[str] = None
    department_id: Optional[int] = None


class LaboratoryCreate(LaboratoryBase):
    chief_name: Optional[str] = None
    chief_title: Optional[str] = None
    chief_photo: Optional[str] = None
    chief_phone: Optional[str] = None
    chief_email: Optional[str] = None


class LaboratoryUpdate(BaseModel):
    code: Optional[str] = None
    name: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    capacity: Optional[int] = None
    image_url: Optional[str] = None
    department_id: Optional[int] = None
    chief_name: Optional[str] = None
    chief_title: Optional[str] = None
    chief_photo: Optional[str] = None
    chief_phone: Optional[str] = None
    chief_email: Optional[str] = None


class LaboratoryResponse(LaboratoryBase):
    id: int
    chief_name: Optional[str] = None
    chief_title: Optional[str] = None
    chief_photo: Optional[str] = None
    chief_phone: Optional[str] = None
    chief_email: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    images: List[LaboratoryImageResponse] = []

    class Config:
        from_attributes = True


# ============================================================
# EQUIPEMENTS
# ============================================================

class EquipmentBase(BaseModel):
    name: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    specifications: Optional[Dict[str, Any]] = None
    technical_sheet_url: Optional[str] = None
    acquisition_date: Optional[datetime] = None
    status: Optional[str] = "operational"


class EquipmentCreate(EquipmentBase):
    laboratory_id: int


class EquipmentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    specifications: Optional[Dict[str, Any]] = None
    technical_sheet_url: Optional[str] = None
    acquisition_date: Optional[datetime] = None
    status: Optional[str] = None
    laboratory_id: Optional[int] = None


class EquipmentResponse(EquipmentBase):
    id: int
    laboratory_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ============================================================
# TPS
# ============================================================

class TPBase(BaseModel):
    title: str
    description: Optional[str] = None
    video_url: Optional[str] = None
    video_type: Optional[str] = "youtube"
    duration: Optional[str] = None
    realization_date: Optional[datetime] = None


class TPCreate(TPBase):
    laboratory_id: int


class TPUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    video_url: Optional[str] = None
    video_type: Optional[str] = None
    duration: Optional[str] = None
    realization_date: Optional[datetime] = None
    laboratory_id: Optional[int] = None


class TPResponse(TPBase):
    id: int
    laboratory_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ============================================================
# LOGS DE MODIFICATION
# ============================================================

class ModificationLogBase(BaseModel):
    entity_type: str
    entity_id: int
    action: str
    old_data: Optional[Dict[str, Any]] = None
    new_data: Optional[Dict[str, Any]] = None


class ModificationLogCreate(ModificationLogBase):
    user_id: int


class ModificationLogResponse(ModificationLogBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True
