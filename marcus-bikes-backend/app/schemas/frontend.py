from pydantic import BaseModel
from typing import List, Optional

class FrontendOption(BaseModel):
    id: int
    name: str
    price: float
    inStock: bool

class FrontendComponent(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    options: List[FrontendOption]

class FrontendDependency(BaseModel):
    type: str
    sourceComponentId: int
    sourceOptionId: int
    targetComponentId: int
    targetOptionId: Optional[int] = None

class FrontendPriceRule(BaseModel):
    type: str = "override" # To match frontend expectation
    componentId: int
    optionId: int
    dependentComponentId: int
    dependentOptionId: int
    price: float

class FrontendProduct(BaseModel):
    id: int
    name: str
    description: str
    category: str
    components: List[FrontendComponent]
    dependencies: List[FrontendDependency]
    priceRules: List[FrontendPriceRule]
    basePrice: float

class CategoryProductCount(BaseModel):
    category: str
    count: int 