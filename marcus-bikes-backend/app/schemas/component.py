from pydantic import BaseModel
from typing import List, Optional

from app.schemas.option import OptionCreate, Option

class ComponentBase(BaseModel):
    name: str
    description: Optional[str] = None

class ComponentCreate(ComponentBase):
    options: List[OptionCreate]

class Component(ComponentBase):
    id: int
    product_id: str
    options: List[Option]

    class Config:
        from_attributes = True 