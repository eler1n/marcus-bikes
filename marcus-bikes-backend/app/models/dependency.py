from sqlalchemy import Column, Integer, String, ForeignKey, Enum
from sqlalchemy.orm import relationship

from app.models.base import Base
from app.models.enums import DependencyTypeEnum

class Dependency(Base):
    __tablename__ = "dependencies"

    id = Column(Integer, primary_key=True)
    type = Column(Enum(DependencyTypeEnum), nullable=False)
    source_component_id = Column(Integer, ForeignKey("components.id"), nullable=False)
    source_option_id = Column(Integer, ForeignKey("options.id"), nullable=False)
    target_component_id = Column(Integer, ForeignKey("components.id"), nullable=False)
    target_option_id = Column(Integer, ForeignKey("options.id"), nullable=True)  # Can be null if it applies to the entire component
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)

    product = relationship("Product", back_populates="dependencies")
    source_component = relationship("Component", foreign_keys=[source_component_id])
    source_option = relationship("Option", foreign_keys=[source_option_id])
    target_component = relationship("Component", foreign_keys=[target_component_id])
    target_option = relationship("Option", foreign_keys=[target_option_id]) 