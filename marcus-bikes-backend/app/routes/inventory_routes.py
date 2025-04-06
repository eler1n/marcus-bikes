from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.controllers.inventory_controller import InventoryController
from app.schemas import Inventory, InventoryCreate, InventoryUpdate

router = APIRouter(prefix="/inventory", tags=["inventory"])

@router.get("/", response_model=List[Inventory])
def read_inventories(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    """
    Get all inventory records with pagination.
    """
    return InventoryController.get_inventories(db, skip=skip, limit=limit)

@router.get("/low-stock", response_model=List[Inventory])
def read_low_stock_items(db: Session = Depends(get_db)):
    """
    Get all items with low or out of stock status.
    """
    return InventoryController.get_low_stock_items(db)

@router.get("/option/{option_id}", response_model=Inventory)
def read_inventory_by_option(option_id: int, db: Session = Depends(get_db)):
    """
    Get inventory record for a specific option.
    """
    return InventoryController.get_inventory_by_option(db, option_id=option_id)

@router.post("/", response_model=Inventory, status_code=status.HTTP_201_CREATED)
def create_inventory(inventory: InventoryCreate, db: Session = Depends(get_db)):
    """
    Create a new inventory record.
    """
    return InventoryController.create_inventory(db=db, inventory=inventory)

@router.patch("/option/{option_id}", response_model=Inventory)
def update_inventory(option_id: int, inventory: InventoryUpdate, db: Session = Depends(get_db)):
    """
    Update an inventory record.
    """
    return InventoryController.update_inventory(db, option_id=option_id, inventory=inventory)

@router.delete("/option/{option_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_inventory(option_id: int, db: Session = Depends(get_db)):
    """
    Delete an inventory record.
    """
    InventoryController.delete_inventory(db, option_id=option_id)
    return None 