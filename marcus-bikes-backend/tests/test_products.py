import pytest
from app.models import Product, Component, Option
from app.schemas import ProductCreate, ComponentCreate, OptionCreate
from app.models.enums import CategoryEnum

def test_create_product(db_session):
    # Create a test product
    product = Product(
        name="Test Bike",
        description="A test bicycle",
        category=CategoryEnum.BICYCLE,
        base_price=100.0
    )
    db_session.add(product)
    db_session.commit()
    
    # Retrieve the product
    saved_product = db_session.query(Product).first()
    assert saved_product.name == "Test Bike"
    assert saved_product.description == "A test bicycle"
    assert saved_product.category == CategoryEnum.BICYCLE
    assert saved_product.base_price == 100.0

def test_product_with_components(db_session):
    # Create a product
    product = Product(
        name="Test Bike",
        description="A test bicycle",
        category=CategoryEnum.BICYCLE,
        base_price=100.0
    )
    db_session.add(product)
    db_session.flush()
    
    # Create a component
    component = Component(
        name="Frame",
        description="Bike frame",
        product_id=product.id
    )
    db_session.add(component)
    db_session.flush()
    
    # Create an option
    option = Option(
        name="Carbon",
        price=200.0,
        in_stock=True,
        component_id=component.id,
        stock_quantity=5
    )
    db_session.add(option)
    db_session.commit()
    
    # Retrieve and verify
    saved_product = db_session.query(Product).first()
    assert len(saved_product.components) == 1
    assert saved_product.components[0].name == "Frame"
    assert len(saved_product.components[0].options) == 1
    assert saved_product.components[0].options[0].name == "Carbon"
    assert saved_product.components[0].options[0].price == 200.0

def test_product_api_endpoints(client):
    # Test creating a product
    product_data = {
        "id": 1,  # Adding required id field
        "name": "API Test Bike",
        "description": "A test bicycle via API",
        "category": "bicycle",
        "base_price": 150.0,
        "components": [],  # Adding required empty lists
        "dependencies": [],
        "price_rules": []
    }
    response = client.post("/products/", json=product_data)
    assert response.status_code == 201  # Changed from 200 to 201 (HTTP_201_CREATED)
    data = response.json()
    assert data["name"] == product_data["name"]
    assert data["description"] == product_data["description"]
    
    # Test getting the product
    product_id = data["id"]
    response = client.get(f"/products/{product_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == product_data["name"]
    
    # Test getting all products
    response = client.get("/products/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert any(p["name"] == product_data["name"] for p in data) 