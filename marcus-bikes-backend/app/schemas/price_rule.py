from pydantic import BaseModel

class PriceRuleBase(BaseModel):
    component_id: int
    option_id: int
    dependent_component_id: int
    dependent_option_id: int
    price: float

class PriceRuleCreate(PriceRuleBase):
    pass

class PriceRule(PriceRuleBase):
    id: int
    product_id: int

    class Config:
        from_attributes = True 