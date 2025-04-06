from typing import List, Dict, Any, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.services.inventory_service import InventoryService
from app.schemas import Inventory, InventoryCreate, InventoryUpdate

class InventoryController:
    @staticmethod
    def get_inventories(db: Session, skip: int = 0, limit: int = 100) -> List[Inventory]:
        """Get all inventory records with pagination"""
        return InventoryService.get_inventories(db, skip=skip, limit=limit)

    @staticmethod
    def get_inventory_by_option(db: Session, option_id: int) -> Inventory:
        """Get inventory record for a specific option"""
        db_inventory = InventoryService.get_inventory_by_option(db, option_id=option_id)
        if db_inventory is None:
            raise HTTPException(status_code=404, detail="Inventory record not found for this option")
        return db_inventory

    @staticmethod
    def create_inventory(db: Session, inventory: InventoryCreate) -> Inventory:
        """Create a new inventory record"""
        # Check if inventory for this option already exists
        existing = InventoryService.get_inventory_by_option(db, option_id=inventory.option_id)
        if existing:
            raise HTTPException(
                status_code=400, 
                detail="Inventory record already exists for this option. Use update instead."
            )
        return InventoryService.create_inventory(db=db, inventory=inventory)

    @staticmethod
    def update_inventory(db: Session, option_id: int, inventory: InventoryUpdate) -> Inventory:
        """Update an inventory record"""
        inventory_data = inventory.dict(exclude_unset=True)
        db_inventory = InventoryService.update_inventory(db, option_id=option_id, inventory_data=inventory_data)
        if db_inventory is None:
            raise HTTPException(status_code=404, detail="Inventory record not found for this option")
        return db_inventory

    @staticmethod
    def delete_inventory(db: Session, option_id: int) -> None:
        """Delete an inventory record"""
        success = InventoryService.delete_inventory(db, option_id=option_id)
        if not success:
            raise HTTPException(status_code=404, detail="Inventory record not found for this option")
            
    @staticmethod
    def get_low_stock_items(db: Session) -> List[Inventory]:
        """Get all items with low or out of stock status"""
        return InventoryService.get_low_stock_items(db) 