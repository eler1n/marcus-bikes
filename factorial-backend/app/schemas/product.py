from pydantic import BaseModel
from typing import List, Optional

from app.schemas.enums import CategoryEnum
from app.schemas.component import Component, ComponentCreate
from app.schemas.dependency import Dependency, DependencyCreate
from app.schemas.price_rule import PriceRule, PriceRuleCreate

class ProductBase(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    category: CategoryEnum
    base_price: float = 0

class ProductCreate(ProductBase):
    components: List[ComponentCreate]
    dependencies: List[DependencyCreate]
    price_rules: List[PriceRuleCreate]

class Product(ProductBase):
    components: List[Component]
    dependencies: List[Dependency]
    price_rules: List[PriceRule]

    class Config:
        from_attributes = True 