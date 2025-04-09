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

Run tests using pytest:
```bash
pytest
``` 