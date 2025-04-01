from sqlalchemy.orm import Session
from typing import Optional

from app.models.option import Option

class OptionService:
    @staticmethod
    def get_option(db: Session, option_id: int) -> Optional[Option]:
        """Get an option by ID"""
        return db.query(Option).filter(Option.id == option_id).first()

    @staticmethod
    def update_option_stock(db: Session, option_id: int, in_stock: bool) -> Optional[Option]:
        """Update the stock status of an option"""
        db_option = OptionService.get_option(db, option_id=option_id)
        if db_option:
            db_option.in_stock = in_stock
            db.commit()
            db.refresh(db_option)
        return db_option 