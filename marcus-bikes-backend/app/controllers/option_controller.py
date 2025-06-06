from fastapi import HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.services.option_service import OptionService
from app.schemas import Option

class OptionController:
    @staticmethod
    def get_options(db: Session, skip: int = 0, limit: int = 100) -> List[Option]:
        """Get all options with pagination"""
        return OptionService.get_options(db, skip=skip, limit=limit)
        
    @staticmethod
    def update_option_stock(db: Session, option_id: int, in_stock: bool) -> Option:
        """Update the stock status of an option"""
        db_option = OptionService.update_option_stock(db, option_id=option_id, in_stock=in_stock)
        if db_option is None:
            raise HTTPException(status_code=404, detail="Option not found")
        return db_option 