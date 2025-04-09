from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from app.database.session import get_db
from app.controllers.option_controller import OptionController
from app.schemas import Option

router = APIRouter(prefix="/options", tags=["options"])

@router.get("/", response_model=List[Option])
def read_options(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    """
    Get all options with pagination.
    """
    return OptionController.get_options(db, skip=skip, limit=limit)

@router.put("/{option_id}/stock", response_model=Option)
def update_option_stock(option_id: int, in_stock: bool, db: Session = Depends(get_db)):
    """
    Update the stock status of an option.
    """
    return OptionController.update_option_stock(db, option_id=option_id, in_stock=in_stock) 