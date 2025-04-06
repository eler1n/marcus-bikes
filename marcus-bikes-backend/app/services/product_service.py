from sqlalchemy.orm import Session
from typing import List, Optional, Dict

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
    def get_product(db: Session, product_id: int) -> Optional[Product]:
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
    def count_products_by_category(db: Session) -> Dict[str, int]:
        """Count products for each category"""
        from sqlalchemy import func
        from app.models.enums import CategoryEnum
        
        # Get counts for all defined categories
        counts = {}
        for category in CategoryEnum:
            count = db.query(Product).filter(Product.category == category.value).count()
            counts[category.value] = count
        
        return counts

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
        
        # Dictionary to store component and option objects for dependencies and price rules
        component_objects = {}
        option_objects = {}
        
        # Create components
        for component in product.components:
            db_component = Component(
                name=component.name,
                description=component.description,
                product_id=db_product.id
            )
            db.add(db_component)
            db.flush()  # Flush to get the component ID
            
            # Store component for later reference
            component_objects[component.name] = db_component
            
            # Create options for this component
            for option in component.options:
                db_option = Option(
                    name=option.name,
                    price=option.price,
                    in_stock=option.in_stock,
                    component_id=db_component.id
                )
                db.add(db_option)
                db.flush()  # Flush to get the option ID
                
                # Store option for later reference
                option_key = f"{component.name}-{option.name}"
                option_objects[option_key] = db_option
        
        # Create dependencies - match by name for now if we're using string IDs in the input
        for dependency in product.dependencies:
            source_component_id = dependency.source_component_id
            source_option_id = dependency.source_option_id
            target_component_id = dependency.target_component_id
            target_option_id = dependency.target_option_id
            
            # If IDs are strings (names), convert to integer IDs
            if isinstance(source_component_id, str) and source_component_id in component_objects:
                source_component_id = component_objects[source_component_id].id
                
                # Get option ID by component name + option name
                source_option_key = f"{dependency.source_component_id}-{dependency.source_option_id}"
                if source_option_key in option_objects:
                    source_option_id = option_objects[source_option_key].id
            
            if isinstance(target_component_id, str) and target_component_id in component_objects:
                target_component_id = component_objects[target_component_id].id
                
                # Get option ID by component name + option name if target_option_id exists
                if target_option_id:
                    target_option_key = f"{dependency.target_component_id}-{dependency.target_option_id}"
                    if target_option_key in option_objects:
                        target_option_id = option_objects[target_option_key].id
            
            db_dependency = Dependency(
                type=dependency.type,
                source_component_id=source_component_id,
                source_option_id=source_option_id,
                target_component_id=target_component_id,
                target_option_id=target_option_id,
                product_id=db_product.id
            )
            db.add(db_dependency)
        
        # Create price rules - match by name for now if we're using string IDs in the input
        for price_rule in product.price_rules:
            component_id = price_rule.component_id
            option_id = price_rule.option_id
            dependent_component_id = price_rule.dependent_component_id
            dependent_option_id = price_rule.dependent_option_id
            
            # If IDs are strings (names), convert to integer IDs
            if isinstance(component_id, str) and component_id in component_objects:
                component_id = component_objects[component_id].id
                
                # Get option ID by component name + option name
                option_key = f"{price_rule.component_id}-{price_rule.option_id}"
                if option_key in option_objects:
                    option_id = option_objects[option_key].id
            
            if isinstance(dependent_component_id, str) and dependent_component_id in component_objects:
                dependent_component_id = component_objects[dependent_component_id].id
                
                # Get dependent option ID by component name + option name
                dependent_option_key = f"{price_rule.dependent_component_id}-{price_rule.dependent_option_id}"
                if dependent_option_key in option_objects:
                    dependent_option_id = option_objects[dependent_option_key].id
            
            db_price_rule = PriceRule(
                component_id=component_id,
                option_id=option_id,
                dependent_component_id=dependent_component_id,
                dependent_option_id=dependent_option_id,
                price=price_rule.price,
                product_id=db_product.id
            )
            db.add(db_price_rule)
        
        db.commit()
        db.refresh(db_product)
        return db_product

    @staticmethod
    def update_product(db: Session, product_id: int, product_data: dict) -> Optional[Product]:
        """Update a product's basic information"""
        db_product = ProductService.get_product(db, product_id=product_id)
        if db_product:
            for key, value in product_data.items():
                setattr(db_product, key, value)
            db.commit()
            db.refresh(db_product)
        return db_product

    @staticmethod
    def delete_product(db: Session, product_id: int) -> bool:
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
                    id=option.id,
                    name=option.name,
                    price=option.price,
                    inStock=option.in_stock
                )
                for option in component.options
            ]
            
            frontend_component = FrontendComponent(
                id=component.id,
                name=component.name,
                description=component.description or "",
                options=frontend_options
            )
            frontend_components.append(frontend_component)
        
        # Convert dependencies using relationships
        frontend_dependencies = []
        for dependency in product.dependencies:
            frontend_dependency = FrontendDependency(
                type=dependency.type.value,
                sourceComponentId=dependency.source_component_id,
                sourceOptionId=dependency.source_option_id,
                targetComponentId=dependency.target_component_id,
                targetOptionId=dependency.target_option_id
            )
            frontend_dependencies.append(frontend_dependency)
        
        # Convert price rules using relationships
        frontend_price_rules = []
        for rule in product.price_rules:
            frontend_price_rule = FrontendPriceRule(
                componentId=rule.component_id,
                optionId=rule.option_id,
                dependentComponentId=rule.dependent_component_id,
                dependentOptionId=rule.dependent_option_id,
                price=rule.price
            )
            frontend_price_rules.append(frontend_price_rule)
        
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