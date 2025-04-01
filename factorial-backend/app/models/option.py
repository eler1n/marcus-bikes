from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from app.models.base import Base

class Option(Base):
    __tablename__ = "options"

    id = Column(Integer, primary_key=True)
    option_id = Column(String, nullable=False)  # User-facing ID like 'full-suspension', 'diamond'
    name = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    in_stock = Column(Boolean, default=True)
    component_id = Column(Integer, ForeignKey("components.id"), nullable=False)

    component = relationship("Component", back_populates="options") 