from pydantic import BaseModel
from typing import Optional

from app.schemas.enums import StockStatusEnum

class InventoryBase(BaseModel):
    option_id: int
    quantity: int
    low_stock_threshold: int = 5  # Default threshold

class InventoryCreate(InventoryBase):
    pass

class InventoryUpdate(BaseModel):
    quantity: Optional[int] = None
    low_stock_threshold: Optional[int] = None
    stock_status: Optional[StockStatusEnum] = None

class Inventory(InventoryBase):
    id: int
    stock_status: StockStatusEnum

    class Config:
        from_attributes = True

# Enhanced option schema with inventory details
class OptionWithInventory(BaseModel):
    id: int
    option_id: str
    name: str
    price: float
    in_stock: bool
    stock_quantity: int
    stock_status: StockStatusEnum
    low_stock_threshold: int

    class Config:
        from_attributes = True 