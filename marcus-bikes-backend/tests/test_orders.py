import pytest
from datetime import datetime
from app.models import Order, Product
from app.models.enums import OrderStatusEnum, CategoryEnum

def test_create_order(db_session):
    # Create a product first
    product = Product(
        name="Test Bike",
        description="A test bicycle",
        category=CategoryEnum.BICYCLE,
        base_price=100.0
    )
    db_session.add(product)
    db_session.commit()
    
    # Create an order
    order = Order(
        customer_name="John Doe",
        customer_email="john@example.com",
        shipping_address="123 Test St, Test City, 12345",
        total_amount=100.0,
        status=OrderStatusEnum.PENDING,
        product_categories="bicycle",
        order_details={
            "products": [
                {
                    "id": str(product.id),
                    "name": product.name,
                    "category": "bicycle",
                    "quantity": 1,
                    "price": 100.0,
                    "configuration": {}
                }
            ],
            "shipping_method": "standard",
            "payment_method": "credit_card"
        }
    )
    db_session.add(order)
    db_session.commit()
    
    # Retrieve and verify
    saved_order = db_session.query(Order).first()
    assert saved_order.customer_name == "John Doe"
    assert saved_order.customer_email == "john@example.com"
    assert saved_order.total_amount == 100.0
    assert saved_order.status == OrderStatusEnum.PENDING
    assert len(saved_order.order_details["products"]) == 1
    assert saved_order.order_details["products"][0]["name"] == "Test Bike"

def test_order_status_transitions(db_session):
    # Create an order
    order = Order(
        customer_name="Jane Smith",
        customer_email="jane@example.com",
        shipping_address="456 Test Ave, Test City, 12345",
        total_amount=150.0,
        status=OrderStatusEnum.PENDING,
        product_categories="bicycle",
        order_details={
            "products": [],
            "shipping_method": "standard",
            "payment_method": "credit_card"
        }
    )
    db_session.add(order)
    db_session.commit()
    
    # Test status transition to PROCESSING
    order.status = OrderStatusEnum.PROCESSING
    db_session.commit()
    saved_order = db_session.query(Order).first()
    assert saved_order.status == OrderStatusEnum.PROCESSING
    
    # Test status transition to SHIPPED
    order.status = OrderStatusEnum.SHIPPED
    db_session.commit()
    saved_order = db_session.query(Order).first()
    assert saved_order.status == OrderStatusEnum.SHIPPED

def test_order_api_endpoints(client):
    # Test creating an order
    order_data = {
        "customer_name": "API Test Customer",
        "customer_email": "api@example.com",
        "shipping_address": "789 API St, Test City, 12345",
        "total_amount": 200.0,
        "status": "pending",
        "product_categories": "bicycle",
        "order_details": {
            "products": [],
            "shipping_method": "standard",
            "payment_method": "credit_card"
        }
    }
    response = client.post("/orders/", json=order_data)
    assert response.status_code == 201  # Changed from 200 to 201 (HTTP_201_CREATED)
    data = response.json()
    assert data["customer_name"] == order_data["customer_name"]
    assert data["customer_email"] == order_data["customer_email"]
    
    # Test getting the order
    order_id = data["id"]
    response = client.get(f"/orders/{order_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["customer_name"] == order_data["customer_name"]
    
    # Test getting all orders
    response = client.get("/orders/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert any(o["customer_name"] == order_data["customer_name"] for o in data) 