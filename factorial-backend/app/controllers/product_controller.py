from typing import List, Dict, Any, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.services.product_service import ProductService
from app.schemas import ProductCreate, FrontendProduct, ProductBase

class ProductController:
    @staticmethod
    def get_products(db: Session, category: Optional[str] = None, skip: int = 0, limit: int = 100) -> List[FrontendProduct]:
        """Get all products or products by category"""
        if category:
            db_products = ProductService.get_products_by_category(db, category, skip=skip, limit=limit)
        else:
            db_products = ProductService.get_products(db, skip=skip, limit=limit)
        
        return [ProductService.product_to_frontend(product) for product in db_products]

    @staticmethod
    def get_product(db: Session, product_id: str) -> FrontendProduct:
        """Get a specific product by ID"""
        db_product = ProductService.get_product(db, product_id=product_id)
        if db_product is None:
            raise HTTPException(status_code=404, detail="Product not found")
        return ProductService.product_to_frontend(db_product)

    @staticmethod
    def create_product(db: Session, product: ProductCreate) -> FrontendProduct:
        """Create a new product"""
        # Check if product with this ID already exists
        db_product = ProductService.get_product(db, product_id=product.id)
        if db_product:
            raise HTTPException(status_code=400, detail="Product ID already exists")
        
        created_product = ProductService.create_product(db=db, product=product)
        return ProductService.product_to_frontend(created_product)

    @staticmethod
    def update_product(db: Session, product_id: str, product: ProductBase) -> FrontendProduct:
        """Update a product's basic information"""
        product_data = product.dict(exclude_unset=True)
        db_product = ProductService.update_product(db, product_id=product_id, product_data=product_data)
        if db_product is None:
            raise HTTPException(status_code=404, detail="Product not found")
        return ProductService.product_to_frontend(db_product)

    @staticmethod
    def delete_product(db: Session, product_id: str) -> None:
        """Delete a product"""
        success = ProductService.delete_product(db, product_id=product_id)
        if not success:
            raise HTTPException(status_code=404, detail="Product not found") 