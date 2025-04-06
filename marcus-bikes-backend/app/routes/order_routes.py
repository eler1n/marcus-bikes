from typing import List, Optional
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.controllers.order_controller import OrderController
from app.schemas import Order, OrderCreate, OrderUpdate, OrderFilter

router = APIRouter(prefix="/orders", tags=["orders"])

@router.get("/", response_model=List[Order])
def read_orders(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    """
    Get all orders with pagination.
    """
    return OrderController.get_orders(db, skip=skip, limit=limit)

@router.post("/filter", response_model=List[Order])
def filter_orders(
    filters: OrderFilter,
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    """
    Filter orders by date range, status, and product category.
    """
    return OrderController.filter_orders(db, filters=filters, skip=skip, limit=limit)

@router.get("/{order_id}", response_model=Order)
def read_order(order_id: int, db: Session = Depends(get_db)):
    """
    Get a specific order by ID.
    """
    return OrderController.get_order(db, order_id=order_id)

@router.post("/", response_model=Order, status_code=status.HTTP_201_CREATED)
def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    """
    Create a new order.
    """
    return OrderController.create_order(db=db, order=order)

@router.patch("/{order_id}", response_model=Order)
def update_order(order_id: int, order: OrderUpdate, db: Session = Depends(get_db)):
    """
    Update an order's information.
    """
    return OrderController.update_order(db, order_id=order_id, order=order)

@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_order(order_id: int, db: Session = Depends(get_db)):
    """
    Delete an order.
    """
    OrderController.delete_order(db, order_id=order_id)
    return None 