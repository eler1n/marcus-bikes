from typing import List, Dict, Any, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.services.order_service import OrderService
from app.schemas import Order, OrderCreate, OrderUpdate, OrderFilter

class OrderController:
    @staticmethod
    def get_orders(db: Session, skip: int = 0, limit: int = 100) -> List[Order]:
        """Get all orders with pagination"""
        return OrderService.get_orders(db, skip=skip, limit=limit)

    @staticmethod
    def get_order(db: Session, order_id: int) -> Order:
        """Get a specific order by ID"""
        db_order = OrderService.get_order(db, order_id=order_id)
        if db_order is None:
            raise HTTPException(status_code=404, detail="Order not found")
        return db_order

    @staticmethod
    def create_order(db: Session, order: OrderCreate) -> Order:
        """Create a new order"""
        return OrderService.create_order(db=db, order=order)

    @staticmethod
    def update_order(db: Session, order_id: int, order: OrderUpdate) -> Order:
        """Update an order's information"""
        order_data = order.dict(exclude_unset=True)
        db_order = OrderService.update_order(db, order_id=order_id, order_data=order_data)
        if db_order is None:
            raise HTTPException(status_code=404, detail="Order not found")
        return db_order

    @staticmethod
    def delete_order(db: Session, order_id: int) -> None:
        """Delete an order"""
        success = OrderService.delete_order(db, order_id=order_id)
        if not success:
            raise HTTPException(status_code=404, detail="Order not found")
            
    @staticmethod
    def filter_orders(
        db: Session, 
        filters: OrderFilter,
        skip: int = 0, 
        limit: int = 100
    ) -> List[Order]:
        """Filter orders by date range, status, and product category"""
        return OrderService.filter_orders(db, filters=filters, skip=skip, limit=limit) 