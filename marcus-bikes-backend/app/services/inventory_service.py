from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.models import Inventory, Option, StockStatusEnum
from app.schemas import InventoryCreate, InventoryUpdate

class InventoryService:
    @staticmethod
    def get_inventories(db: Session, skip: int = 0, limit: int = 100) -> List[Inventory]:
        """Get all inventory records with pagination"""
        return db.query(Inventory).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_inventory_by_option(db: Session, option_id: int) -> Optional[Inventory]:
        """Get inventory record for a specific option"""
        return db.query(Inventory).filter(Inventory.option_id == option_id).first()
    
    @staticmethod
    def create_inventory(db: Session, inventory: InventoryCreate) -> Inventory:
        """Create a new inventory record"""
        # Set the stock status based on quantity
        stock_status = StockStatusEnum.OUT_OF_STOCK
        if inventory.quantity > 0:
            if inventory.quantity <= inventory.low_stock_threshold:
                stock_status = StockStatusEnum.LIMITED_STOCK
            else:
                stock_status = StockStatusEnum.IN_STOCK
                
        db_inventory = Inventory(
            option_id=inventory.option_id,
            quantity=inventory.quantity,
            low_stock_threshold=inventory.low_stock_threshold,
            stock_status=stock_status
        )
        
        db.add(db_inventory)
        db.commit()
        db.refresh(db_inventory)
        
        # Update the in_stock status of the option
        option = db.query(Option).filter(Option.id == inventory.option_id).first()
        if option:
            option.in_stock = (stock_status != StockStatusEnum.OUT_OF_STOCK)
            option.stock_quantity = inventory.quantity
            db.commit()
            
        return db_inventory
    
    @staticmethod
    def update_inventory(db: Session, option_id: int, inventory_data: Dict[str, Any]) -> Optional[Inventory]:
        """Update an inventory record"""
        db_inventory = InventoryService.get_inventory_by_option(db, option_id)
        
        if db_inventory:
            # Apply all updates
            for key, value in inventory_data.items():
                setattr(db_inventory, key, value)
            
            # Recalculate stock status if quantity changed
            if 'quantity' in inventory_data:
                quantity = inventory_data['quantity']
                threshold = db_inventory.low_stock_threshold
                
                if quantity <= 0:
                    db_inventory.stock_status = StockStatusEnum.OUT_OF_STOCK
                elif quantity <= threshold:
                    db_inventory.stock_status = StockStatusEnum.LIMITED_STOCK
                else:
                    db_inventory.stock_status = StockStatusEnum.IN_STOCK
            
            db.commit()
            db.refresh(db_inventory)
            
            # Update the option's in_stock status
            option = db.query(Option).filter(Option.id == option_id).first()
            if option:
                option.in_stock = (db_inventory.stock_status != StockStatusEnum.OUT_OF_STOCK)
                option.stock_quantity = db_inventory.quantity
                db.commit()
                
        return db_inventory
    
    @staticmethod
    def delete_inventory(db: Session, option_id: int) -> bool:
        """Delete an inventory record"""
        db_inventory = InventoryService.get_inventory_by_option(db, option_id)
        if db_inventory:
            db.delete(db_inventory)
            db.commit()
            
            # Set option to out of stock
            option = db.query(Option).filter(Option.id == option_id).first()
            if option:
                option.in_stock = False
                option.stock_quantity = 0
                db.commit()
                
            return True
        return False
    
    @staticmethod
    def get_low_stock_items(db: Session) -> List[Inventory]:
        """Get all items with low or out of stock status"""
        return db.query(Inventory).filter(
            or_(
                Inventory.stock_status == StockStatusEnum.LIMITED_STOCK,
                Inventory.stock_status == StockStatusEnum.OUT_OF_STOCK
            )
        ).all() 