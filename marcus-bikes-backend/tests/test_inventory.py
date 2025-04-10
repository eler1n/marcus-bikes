import pytest
from app.models import Inventory, Product, Component, Option
from app.models.enums import StockStatusEnum, CategoryEnum

def test_create_inventory(db_session):
    # Create a product and component first
    product = Product(
        name="Test Bike",
        description="A test bicycle",
        category=CategoryEnum.BICYCLE,
        base_price=100.0
    )
    db_session.add(product)
    db_session.flush()
    
    component = Component(
        name="Frame",
        description="Bike frame",
        product_id=product.id
    )
    db_session.add(component)
    db_session.flush()
    
    option = Option(
        name="Carbon",
        price=200.0,
        in_stock=True,
        component_id=component.id,
        stock_quantity=5
    )
    db_session.add(option)
    db_session.flush()
    
    # Create inventory record
    inventory = Inventory(
        option_id=option.id,
        quantity=5,
        stock_status=StockStatusEnum.IN_STOCK,
        low_stock_threshold=3
    )
    db_session.add(inventory)
    db_session.commit()
    
    # Retrieve and verify
    saved_inventory = db_session.query(Inventory).first()
    assert saved_inventory.quantity == 5
    assert saved_inventory.stock_status == StockStatusEnum.IN_STOCK
    assert saved_inventory.low_stock_threshold == 3

def test_inventory_status_updates(db_session):
    # Create test data
    product = Product(
        name="Test Bike",
        description="A test bicycle",
        category=CategoryEnum.BICYCLE,
        base_price=100.0
    )
    db_session.add(product)
    db_session.flush()
    
    component = Component(
        name="Frame",
        description="Bike frame",
        product_id=product.id
    )
    db_session.add(component)
    db_session.flush()
    
    option = Option(
        name="Carbon",
        price=200.0,
        in_stock=True,
        component_id=component.id,
        stock_quantity=5
    )
    db_session.add(option)
    db_session.flush()
    
    inventory = Inventory(
        option_id=option.id,
        quantity=5,
        stock_status=StockStatusEnum.IN_STOCK,
        low_stock_threshold=3
    )
    db_session.add(inventory)
    db_session.commit()
    
    # Test status update to LIMITED_STOCK
    inventory.quantity = 2
    inventory.stock_status = StockStatusEnum.LIMITED_STOCK
    db_session.commit()
    
    saved_inventory = db_session.query(Inventory).first()
    assert saved_inventory.quantity == 2
    assert saved_inventory.stock_status == StockStatusEnum.LIMITED_STOCK
    
    # Test status update to OUT_OF_STOCK
    inventory.quantity = 0
    inventory.stock_status = StockStatusEnum.OUT_OF_STOCK
    db_session.commit()
    
    saved_inventory = db_session.query(Inventory).first()
    assert saved_inventory.quantity == 0
    assert saved_inventory.stock_status == StockStatusEnum.OUT_OF_STOCK

def test_inventory_api_endpoints(client):
    # Test creating inventory record
    inventory_data = {
        "option_id": 1,  # This would need to be a valid option ID
        "quantity": 10,
        "stock_status": "in_stock",
        "low_stock_threshold": 5
    }
    response = client.post("/inventory/", json=inventory_data)
    assert response.status_code == 201  # Changed from 200 to 201 (HTTP_201_CREATED)
    data = response.json()
    assert data["quantity"] == inventory_data["quantity"]
    assert data["stock_status"] == inventory_data["stock_status"]
    
    # Test getting inventory record by option ID
    option_id = inventory_data["option_id"]
    response = client.get(f"/inventory/option/{option_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["quantity"] == inventory_data["quantity"]
    
    # Test getting all inventory records
    response = client.get("/inventory/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0 