from pydantic import BaseModel
from typing import Optional

from app.schemas.enums import DependencyTypeEnum

class DependencyBase(BaseModel):
    type: DependencyTypeEnum
    source_component_id: int
    source_option_id: int
    target_component_id: int
    target_option_id: Optional[int] = None

class DependencyCreate(DependencyBase):
    pass

class Dependency(DependencyBase):
    id: int
    product_id: int

    class Config:
        from_attributes = True 