from sqlalchemy import Column, Integer, String, ForeignKey, Enum
from sqlalchemy.orm import relationship

from app.models.base import Base
from app.models.enums import DependencyTypeEnum

class Dependency(Base):
    __tablename__ = "dependencies"

    id = Column(Integer, primary_key=True)
    type = Column(Enum(DependencyTypeEnum), nullable=False)
    source_component_id = Column(String, nullable=False)
    source_option_id = Column(String, nullable=False)
    target_component_id = Column(String, nullable=False)
    target_option_id = Column(String, nullable=True)  # Can be null if it applies to the entire component
    product_id = Column(String, ForeignKey("products.id"), nullable=False)

    product = relationship("Product", back_populates="dependencies") 