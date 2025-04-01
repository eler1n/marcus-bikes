from pydantic import BaseModel
from typing import List, Optional

class FrontendOption(BaseModel):
    id: str
    name: str
    price: float
    inStock: bool

class FrontendComponent(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    options: List[FrontendOption]

class FrontendDependency(BaseModel):
    type: str
    sourceComponentId: str
    sourceOptionId: str
    targetComponentId: str
    targetOptionId: Optional[str] = None

class FrontendPriceRule(BaseModel):
    type: str = "override" # To match frontend expectation
    componentId: str
    optionId: str
    dependentComponentId: str
    dependentOptionId: str
    price: float

class FrontendProduct(BaseModel):
    id: str
    name: str
    description: str
    category: str
    components: List[FrontendComponent]
    dependencies: List[FrontendDependency]
    priceRules: List[FrontendPriceRule]
    basePrice: float 