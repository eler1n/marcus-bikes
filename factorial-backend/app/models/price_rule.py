from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship

from app.models.base import Base

class PriceRule(Base):
    __tablename__ = "price_rules"

    id = Column(Integer, primary_key=True)
    component_id = Column(String, nullable=False)
    option_id = Column(String, nullable=False)
    dependent_component_id = Column(String, nullable=False)
    dependent_option_id = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    product_id = Column(String, ForeignKey("products.id"), nullable=False)

    product = relationship("Product", back_populates="price_rules") 