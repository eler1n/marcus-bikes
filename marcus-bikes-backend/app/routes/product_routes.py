from typing import List, Optional
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.controllers.product_controller import ProductController
from app.schemas import ProductCreate, FrontendProduct, ProductBase, CategoryProductCount

router = APIRouter(prefix="/products", tags=["products"])

@router.get("/", response_model=List[FrontendProduct])
def read_products(
    category: Optional[str] = None,
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    """
    Get all products with pagination.
    Optionally filter by category.
    """
    return ProductController.get_products(db, category=category, skip=skip, limit=limit)

@router.get("/categories", response_model=List[dict])
def read_categories(db: Session = Depends(get_db)):
    """
    Get all product categories.
    """
    return ProductController.get_categories(db)

# @router.get("/custom-bike", response_model=FrontendProduct)
# def read_custom_bike(db: Session = Depends(get_db)):
#     """
#     Get the custom bike product.
#     """
#     return ProductController.get_product(db, product_id="custom-bike")

@router.get("/{product_id}", response_model=FrontendProduct)
def read_product(product_id: int, db: Session = Depends(get_db)):
    """
    Get a specific product by ID.
    """
    return ProductController.get_product(db, product_id=product_id)

@router.post("/", response_model=FrontendProduct, status_code=status.HTTP_201_CREATED)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    """
    Create a new product.
    """
    return ProductController.create_product(db=db, product=product)

@router.put("/{product_id}", response_model=FrontendProduct)
def update_product(product_id: int, product: ProductBase, db: Session = Depends(get_db)):
    """
    Update a product's basic information.
    """
    return ProductController.update_product(db, product_id=product_id, product=product)

@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    """
    Delete a product.
    """
    ProductController.delete_product(db, product_id=product_id)
    return None

@router.get("/category/counts", response_model=List[CategoryProductCount])
def get_category_counts(db: Session = Depends(get_db)):
    """
    Get counts of products for each category.
    """
    return ProductController.get_category_counts(db) 