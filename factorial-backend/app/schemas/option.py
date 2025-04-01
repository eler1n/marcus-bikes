from pydantic import BaseModel

class OptionBase(BaseModel):
    option_id: str
    name: str
    price: float
    in_stock: bool = True

class OptionCreate(OptionBase):
    pass

class Option(OptionBase):
    id: int
    component_id: int

    class Config:
        from_attributes = True 