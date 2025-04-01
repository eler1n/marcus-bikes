from pydantic import BaseModel

class PriceRuleBase(BaseModel):
    component_id: str
    option_id: str
    dependent_component_id: str
    dependent_option_id: str
    price: float

class PriceRuleCreate(PriceRuleBase):
    pass

class PriceRule(PriceRuleBase):
    id: int
    product_id: str

    class Config:
        from_attributes = True 