from sqlalchemy import Column, Integer, String, ForeignKey, Enum, Boolean
from sqlalchemy.orm import relationship

from app.models.base import Base
from app.models.enums import StockStatusEnum

class Inventory(Base):
    __tablename__ = "inventory"

    id = Column(Integer, primary_key=True)
    option_id = Column(Integer, ForeignKey("options.id"), nullable=False)
    quantity = Column(Integer, default=0)
    stock_status = Column(Enum(StockStatusEnum), default=StockStatusEnum.OUT_OF_STOCK)
    low_stock_threshold = Column(Integer, default=5)  # Threshold to mark as "limited stock"
    
    # Relationship with the Option
    option = relationship("Option", backref="inventory_record") 