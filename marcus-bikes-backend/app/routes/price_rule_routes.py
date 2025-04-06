from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database.session import get_db
from app.schemas.price_rule import PriceRule, PriceRuleCreate
from app.controllers.price_rule_controller import PriceRuleController
from app.routes.admin_routes import admin_auth


router = APIRouter(
    prefix="/price-rules",
    tags=["price-rules"],
    responses={404: {"description": "Not found"}},
)


@router.get("/", response_model=List[PriceRule])
def read_price_rules(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    price_rules = PriceRuleController.get_price_rules(db, skip=skip, limit=limit)
    return price_rules


@router.get("/product/{product_id}", response_model=List[PriceRule])
def read_price_rules_by_product(product_id: str, db: Session = Depends(get_db)):
    price_rules = PriceRuleController.get_price_rules_by_product(db, product_id=product_id)
    return price_rules


@router.get("/{price_rule_id}", response_model=PriceRule)
def read_price_rule(price_rule_id: int, db: Session = Depends(get_db)):
    price_rule = PriceRuleController.get_price_rule(db, price_rule_id=price_rule_id)
    if price_rule is None:
        raise HTTPException(status_code=404, detail="Price rule not found")
    return price_rule


@router.post("/", response_model=PriceRule, dependencies=[Depends(admin_auth)])
def create_price_rule_endpoint(price_rule: PriceRuleCreate, product_id: str, db: Session = Depends(get_db)):
    return PriceRuleController.create_price_rule(db=db, price_rule=price_rule, product_id=product_id)


@router.put("/{price_rule_id}", response_model=PriceRule, dependencies=[Depends(admin_auth)])
def update_price_rule_endpoint(price_rule_id: int, price_rule: PriceRuleCreate, db: Session = Depends(get_db)):
    db_price_rule = PriceRuleController.update_price_rule(db, price_rule_id=price_rule_id, price_rule=price_rule)
    if db_price_rule is None:
        raise HTTPException(status_code=404, detail="Price rule not found")
    return db_price_rule


@router.delete("/{price_rule_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(admin_auth)])
def delete_price_rule_endpoint(price_rule_id: int, db: Session = Depends(get_db)):
    success = PriceRuleController.delete_price_rule(db, price_rule_id=price_rule_id)
    if not success:
        raise HTTPException(status_code=404, detail="Price rule not found")
    return {"success": True} 