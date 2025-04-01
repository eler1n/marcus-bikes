from sqlalchemy.orm import Session
from typing import List, Optional

from app.models.product import Product
from app.models.component import Component
from app.models.option import Option
from app.models.dependency import Dependency
from app.models.price_rule import PriceRule
from app.schemas import (
    ProductCreate, 
    Product as ProductSchema,
    FrontendProduct,
    FrontendComponent,
    FrontendOption,
    FrontendDependency,
    FrontendPriceRule
)

class ProductService:
    @staticmethod
    def get_product(db: Session, product_id: str) -> Optional[Product]:
        """Get a product by ID"""
        return db.query(Product).filter(Product.id == product_id).first()

    @staticmethod
    def get_products(db: Session, skip: int = 0, limit: int = 100) -> List[Product]:
        """Get all products with pagination"""
        return db.query(Product).offset(skip).limit(limit).all()

    @staticmethod
    def get_products_by_category(db: Session, category: str, skip: int = 0, limit: int = 100) -> List[Product]:
        """Get products by category with pagination"""
        return db.query(Product).filter(Product.category == category).offset(skip).limit(limit).all()

    @staticmethod
    def create_product(db: Session, product: ProductCreate) -> Product:
        """Create a new product with its components, options, dependencies, and price rules"""
        db_product = Product(
            id=product.id,
            name=product.name,
            description=product.description,
            category=product.category,
            base_price=product.base_price
        )
        db.add(db_product)
        db.flush()  # Flush to get the product ID
        
        # Create components
        for component in product.components:
            db_component = Component(
                component_id=component.component_id,
                name=component.name,
                description=component.description,
                product_id=db_product.id
            )
            db.add(db_component)
            db.flush()  # Flush to get the component ID
            
            # Create options for this component
            for option in component.options:
                db_option = Option(
                    option_id=option.option_id,
                    name=option.name,
                    price=option.price,
                    in_stock=option.in_stock,
                    component_id=db_component.id
                )
                db.add(db_option)
        
        # Create dependencies
        for dependency in product.dependencies:
            db_dependency = Dependency(
                type=dependency.type,
                source_component_id=dependency.source_component_id,
                source_option_id=dependency.source_option_id,
                target_component_id=dependency.target_component_id,
                target_option_id=dependency.target_option_id,
                product_id=db_product.id
            )
            db.add(db_dependency)
        
        # Create price rules
        for price_rule in product.price_rules:
            db_price_rule = PriceRule(
                component_id=price_rule.component_id,
                option_id=price_rule.option_id,
                dependent_component_id=price_rule.dependent_component_id,
                dependent_option_id=price_rule.dependent_option_id,
                price=price_rule.price,
                product_id=db_product.id
            )
            db.add(db_price_rule)
        
        db.commit()
        db.refresh(db_product)
        return db_product

    @staticmethod
    def update_product(db: Session, product_id: str, product_data: dict) -> Optional[Product]:
        """Update a product's basic information"""
        db_product = ProductService.get_product(db, product_id=product_id)
        if db_product:
            for key, value in product_data.items():
                setattr(db_product, key, value)
            db.commit()
            db.refresh(db_product)
        return db_product

    @staticmethod
    def delete_product(db: Session, product_id: str) -> bool:
        """Delete a product and all related data"""
        db_product = ProductService.get_product(db, product_id=product_id)
        if db_product:
            db.delete(db_product)
            db.commit()
            return True
        return False

    @staticmethod
    def product_to_frontend(product: Product) -> FrontendProduct:
        """Convert a database product model to a frontend-compatible format"""
        # Convert components
        frontend_components = []
        for component in product.components:
            frontend_options = [
                FrontendOption(
                    id=option.option_id,
                    name=option.name,
                    price=option.price,
                    inStock=option.in_stock
                )
                for option in component.options
            ]
            
            frontend_component = FrontendComponent(
                id=component.component_id,
                name=component.name,
                description=component.description or "",
                options=frontend_options
            )
            frontend_components.append(frontend_component)
        
        # Convert dependencies
        frontend_dependencies = [
            FrontendDependency(
                type=dependency.type.value,
                sourceComponentId=dependency.source_component_id,
                sourceOptionId=dependency.source_option_id,
                targetComponentId=dependency.target_component_id,
                targetOptionId=dependency.target_option_id
            )
            for dependency in product.dependencies
        ]
        
        # Convert price rules
        frontend_price_rules = [
            FrontendPriceRule(
                componentId=rule.component_id,
                optionId=rule.option_id,
                dependentComponentId=rule.dependent_component_id,
                dependentOptionId=rule.dependent_option_id,
                price=rule.price
            )
            for rule in product.price_rules
        ]
        
        return FrontendProduct(
            id=product.id,
            name=product.name,
            description=product.description or "",
            category=product.category.value,
            components=frontend_components,
            dependencies=frontend_dependencies,
            priceRules=frontend_price_rules,
            basePrice=product.base_price
        ) 