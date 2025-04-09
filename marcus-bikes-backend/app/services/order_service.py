from typing import List, Optional, Dict, Any
from datetime import datetime
from sqlalchemy.orm import Session

from app.models import Order
from app.schemas import OrderCreate, OrderUpdate, OrderFilter

class OrderService:
    @staticmethod
    def get_orders(db: Session, skip: int = 0, limit: int = 100) -> List[Order]:
        """Get all orders with pagination"""
        return db.query(Order).order_by(Order.created_at.desc()).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_order(db: Session, order_id: int) -> Optional[Order]:
        """Get a specific order by ID"""
        return db.query(Order).filter(Order.id == order_id).first()
    
    @staticmethod
    def create_order(db: Session, order: OrderCreate) -> Order:
        """Create a new order"""
        db_order = Order(**order.dict())
        db.add(db_order)
        db.commit()
        db.refresh(db_order)
        return db_order
    
    @staticmethod
    def update_order(db: Session, order_id: int, order_data: Dict[str, Any]) -> Optional[Order]:
        """Update an order's information"""
        db_order = OrderService.get_order(db, order_id)
        if db_order:
            for key, value in order_data.items():
                setattr(db_order, key, value)
            db_order.updated_at = datetime.utcnow()
            db.commit()
            db.refresh(db_order)
        return db_order
    
    @staticmethod
    def delete_order(db: Session, order_id: int) -> bool:
        """Delete an order"""
        db_order = OrderService.get_order(db, order_id)
        if db_order:
            db.delete(db_order)
            db.commit()
            return True
        return False
    
    @staticmethod
    def filter_orders(db: Session, filters: OrderFilter, skip: int = 0, limit: int = 100) -> List[Order]:
        """Filter orders by date range, status, and product category"""
        query = db.query(Order)
        
        if filters.start_date:
            query = query.filter(Order.created_at >= filters.start_date)
        
        if filters.end_date:
            query = query.filter(Order.created_at <= filters.end_date)
        
        if filters.status:
            query = query.filter(Order.status == filters.status)
        
        if filters.product_category:
            # Use LIKE query for the comma-separated product_categories field
            query = query.filter(Order.product_categories.like(f"%{filters.product_category}%"))
        
        return query.order_by(Order.created_at.desc()).offset(skip).limit(limit).all() 