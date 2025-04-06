from sqlalchemy import Column, String, Float, Enum, Text, Integer
from sqlalchemy.orm import relationship

from app.models.base import Base
from app.models.enums import CategoryEnum

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    category = Column(Enum(CategoryEnum), nullable=False)
    base_price = Column(Float, default=0)

    components = relationship("Component", back_populates="product", cascade="all, delete-orphan")
    dependencies = relationship("Dependency", back_populates="product", cascade="all, delete-orphan")
    price_rules = relationship("PriceRule", back_populates="product", cascade="all, delete-orphan") 