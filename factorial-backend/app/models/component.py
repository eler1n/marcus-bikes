from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship

from app.models.base import Base

class Component(Base):
    __tablename__ = "components"

    id = Column(Integer, primary_key=True)
    component_id = Column(String, nullable=False)  # User-facing ID like 'frame', 'wheels'
    name = Column(String, nullable=False)
    description = Column(Text)
    product_id = Column(String, ForeignKey("products.id"), nullable=False)

    product = relationship("Product", back_populates="components")
    options = relationship("Option", back_populates="component", cascade="all, delete-orphan") 