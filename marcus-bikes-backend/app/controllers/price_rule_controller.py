from sqlalchemy.orm import Session

from app.models.price_rule import PriceRule
from app.schemas.price_rule import PriceRuleCreate, PriceRule as PriceRuleSchema

class PriceRuleController:

    @staticmethod
    def get_price_rules(db: Session, skip: int = 0, limit: int = 100):
        return db.query(PriceRule).offset(skip).limit(limit).all()

    @staticmethod
    def get_price_rules_by_product(db: Session, product_id: str):
        return db.query(PriceRule).filter(PriceRule.product_id == product_id).all()

    @staticmethod
    def get_price_rule(db: Session, price_rule_id: int):
        return db.query(PriceRule).filter(PriceRule.id == price_rule_id).first()

    @staticmethod
    def create_price_rule(db: Session, price_rule: PriceRuleCreate, product_id: str):
        db_price_rule = PriceRule(
            component_id=price_rule.component_id,
            option_id=price_rule.option_id,
            dependent_component_id=price_rule.dependent_component_id,
            dependent_option_id=price_rule.dependent_option_id,
            price=price_rule.price,
            product_id=product_id
        )
        db.add(db_price_rule)
        db.commit()
        db.refresh(db_price_rule)
        return db_price_rule

    @staticmethod
    def update_price_rule(db: Session, price_rule_id: int, price_rule: PriceRuleCreate):
        db_price_rule = PriceRuleController.get_price_rule(db, price_rule_id)
        if db_price_rule:
            for key, value in price_rule.dict().items():
                setattr(db_price_rule, key, value)
            db.commit()
            db.refresh(db_price_rule)
        return db_price_rule

    @staticmethod
    def delete_price_rule(db: Session, price_rule_id: int):
        db_price_rule = PriceRuleController.get_price_rule(db, price_rule_id)
        if db_price_rule:
            db.delete(db_price_rule)
            db.commit()
            return True
        return False 