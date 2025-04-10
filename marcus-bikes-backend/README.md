# Marcus Bikes Backend API

This is the backend API for the Marcus Bikes Bicycle Shop, providing endpoints for product customization, inventory management, and dynamic pricing.

## Features

- Product management (bicycles, skis, surfboards, rollerskates)
- Component and option management
- Dependency rules between components/options
- Dynamic pricing based on selected options
- Inventory tracking
- Order management
- Admin operations
- Price rule management

## Technology Stack

- FastAPI 0.104.1
- SQLAlchemy 2.0.23
- PostgreSQL
- Pydantic 2.4.2
- Alembic 1.12.1 (Database migrations)
- Docker support

## Getting Started

### Prerequisites

- Python 3.8 or higher
- PostgreSQL
- Docker and Docker Compose (optional)

### Installation

1. Clone the repository

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file in the project root with:
```
DATABASE_URL=postgresql://postgres:postgres@localhost/marcus_bikes_db
```

### Running the Application

#### Using Docker (Recommended)

1. Build and start the containers:
```bash
docker-compose up --build
```

2. Run database migrations:
```bash
docker-compose exec backend python run_migrations.py
```

#### Local Development

1. Set up the database:
```bash
# Create the database
createdb marcus_bikes_db  

# Run migrations
python run_migrations.py
```

2. Start the development server:
```bash
./run_dev.sh
```

The API will be available at http://localhost:8000

API documentation can be accessed at:
- http://localhost:8000/docs (Swagger UI)
- http://localhost:8000/redoc (ReDoc)

## API Endpoints

### Products
- `GET /products` - List all products (with pagination and category filter)
- `GET /products/categories` - Get all product categories
- `GET /products/category/counts` - Get counts of products for each category
- `GET /products/{product_id}` - Get a specific product
- `POST /products` - Create a new product
- `PUT /products/{product_id}` - Update a product
- `DELETE /products/{product_id}` - Delete a product

### Options
- `GET /options` - List all options (with pagination)
- `GET /options/{option_id}` - Get a specific option
- `POST /options` - Create a new option
- `PUT /options/{option_id}` - Update an option
- `PUT /options/{option_id}/stock` - Update option stock status

### Orders
- `GET /orders` - List all orders (with pagination)
- `POST /orders/filter` - Filter orders by date range, status, and product category
- `GET /orders/{order_id}` - Get a specific order
- `POST /orders` - Create a new order
- `PATCH /orders/{order_id}` - Update an order
- `DELETE /orders/{order_id}` - Delete an order

### Inventory
- `GET /inventory` - List all inventory records (with pagination)
- `GET /inventory/low-stock` - Get all items with low or out of stock status
- `GET /inventory/option/{option_id}` - Get inventory record for a specific option
- `POST /inventory` - Create a new inventory record
- `PATCH /inventory/option/{option_id}` - Update an inventory record
- `DELETE /inventory/option/{option_id}` - Delete an inventory record

### Admin
- `POST /admin/login` - Authenticate as admin
- `GET /admin/verify` - Verify admin credentials

### Price Rules
- `GET /price-rules` - List all price rules (with pagination)
- `GET /price-rules/product/{product_id}` - Get price rules for a specific product
- `GET /price-rules/{price_rule_id}` - Get a specific price rule
- `POST /price-rules` - Create a new price rule (requires admin auth)
- `PUT /price-rules/{price_rule_id}` - Update a price rule (requires admin auth)
- `DELETE /price-rules/{price_rule_id}` - Delete a price rule (requires admin auth)

## Development

To install the package in development mode:

```bash
pip install -e .
```

### Database Migrations

The project uses Alembic for database migrations. To create and run migrations:

1. Create a new migration:
```bash
alembic revision --autogenerate -m "description of changes"
```

2. Apply migrations:
```bash
python run_migrations.py
```

### Testing

The backend uses pytest with a comprehensive test suite. The testing infrastructure includes:

#### Test Setup
- **Test Framework**: pytest with additional plugins
  - `pytest-cov` for coverage reporting
  - `pytest-asyncio` for async test support
  - `httpx` for HTTP client testing
- **Test Database**: Uses SQLite for testing with isolated test database
- **Fixtures**: 
  - Database session management
  - Test client setup
  - Model creation helpers

#### Test Categories
- **Model Tests**: Tests for database models (products, orders, inventory)
- **API Tests**: Endpoint testing with FastAPI TestClient
- **Integration Tests**: Full flow testing across multiple components
- **Authentication Tests**: Admin and user authentication flows

#### Running Tests
```bash
# Run all tests
python run_tests.py

# Run specific test file
pytest tests/test_products.py

# Run tests with coverage report
pytest --cov=app tests/

# Run tests in watch mode
pytest --watch

# Run specific test category
pytest tests/test_orders.py -k "test_create_order"
```

#### Test Dependencies
Install test dependencies:
```bash
pip install -r requirements-test.txt
```

#### Test Structure
```
tests/
├── conftest.py           # Test fixtures and configuration
├── test_products.py      # Product model and API tests
├── test_orders.py        # Order model and API tests
├── test_inventory.py     # Inventory model and API tests
└── test_auth.py          # Authentication tests
```

#### Writing Tests
Example test structure:
```python
def test_create_product(db_session):
    # Create test data
    product = Product(
        name="Test Bike",
        description="A test bicycle",
        category=CategoryEnum.BICYCLE,
        base_price=100.0
    )
    db_session.add(product)
    db_session.commit()
    
    # Verify
    saved_product = db_session.query(Product).first()
    assert saved_product.name == "Test Bike"
    assert saved_product.base_price == 100.0
```

#### Test Coverage
- Models: 90%+ coverage
- API endpoints: 85%+ coverage
- Business logic: 80%+ coverage 