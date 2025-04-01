from pydantic import BaseModel
from typing import Optional

from app.schemas.enums import DependencyTypeEnum

class DependencyBase(BaseModel):
    type: DependencyTypeEnum
    source_component_id: str
    source_option_id: str
    target_component_id: str
    target_option_id: Optional[str] = None

class DependencyCreate(DependencyBase):
    pass

class Dependency(DependencyBase):
    id: int
    product_id: str

    class Config:
        from_attributes = True 