from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship

from app.models.base import Base

class PriceRule(Base):
    __tablename__ = "price_rules"

    id = Column(Integer, primary_key=True)
    component_id = Column(Integer, ForeignKey("components.id"), nullable=False)
    option_id = Column(Integer, ForeignKey("options.id"), nullable=False)
    dependent_component_id = Column(Integer, ForeignKey("components.id"), nullable=False)
    dependent_option_id = Column(Integer, ForeignKey("options.id"), nullable=False)
    price = Column(Float, nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)

    product = relationship("Product", back_populates="price_rules")
    component = relationship("Component", foreign_keys=[component_id])
    option = relationship("Option", foreign_keys=[option_id])
    dependent_component = relationship("Component", foreign_keys=[dependent_component_id])
    dependent_option = relationship("Option", foreign_keys=[dependent_option_id]) 