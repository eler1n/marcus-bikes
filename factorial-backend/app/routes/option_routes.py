from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.controllers.option_controller import OptionController
from app.schemas import Option

router = APIRouter(prefix="/options", tags=["options"])

@router.put("/{option_id}/stock", response_model=Option)
def update_option_stock(option_id: int, in_stock: bool, db: Session = Depends(get_db)):
    """
    Update the stock status of an option.
    """
    return OptionController.update_option_stock(db, option_id=option_id, in_stock=in_stock) 