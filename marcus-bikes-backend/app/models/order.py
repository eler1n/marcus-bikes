from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum, JSON
from sqlalchemy.orm import relationship
import datetime

from app.models.base import Base
from app.models.enums import OrderStatusEnum

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True)
    customer_name = Column(String, nullable=False)
    customer_email = Column(String, nullable=False)
    shipping_address = Column(String, nullable=False)
    total_amount = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    status = Column(Enum(OrderStatusEnum), default=OrderStatusEnum.PENDING, nullable=False)
    
    # Store the order details as JSON
    order_details = Column(JSON, nullable=False)  # This will store product configurations, quantities, etc.
    
    # For analytics and filtering
    product_categories = Column(String, nullable=True)  # Comma-separated list of categories in this order 