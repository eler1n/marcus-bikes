from pydantic import BaseModel
from typing import Dict, List, Optional, Any
from datetime import datetime

from app.schemas.enums import OrderStatusEnum

class OrderBase(BaseModel):
    customer_name: str
    customer_email: str
    shipping_address: str
    total_amount: float
    order_details: Dict[str, Any]  # JSON of product configurations
    product_categories: Optional[str] = None

class OrderCreate(OrderBase):
    pass

class OrderUpdate(BaseModel):
    customer_name: Optional[str] = None
    customer_email: Optional[str] = None
    shipping_address: Optional[str] = None
    status: Optional[OrderStatusEnum] = None

class Order(OrderBase):
    id: int
    created_at: datetime
    updated_at: datetime
    status: OrderStatusEnum

    class Config:
        from_attributes = True

class OrderFilter(BaseModel):
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    status: Optional[OrderStatusEnum] = None
    product_category: Optional[str] = None 