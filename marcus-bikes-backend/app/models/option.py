from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from app.models.base import Base

class Option(Base):
    __tablename__ = "options"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    in_stock = Column(Boolean, default=True)
    component_id = Column(Integer, ForeignKey("components.id"), nullable=False)
    stock_quantity = Column(Integer, default=0)  # New field for tracking stock

    component = relationship("Component", back_populates="options")
    # inventory_record relationship is defined in the Inventory model 