# Factorial Backend API

This is the backend API for the Factorial Bicycle Shop, providing endpoints for product customization, inventory management, and dynamic pricing.

## Features

- Product management (bicycles, skis, surfboards, rollerskates)
- Component and option management
- Dependency rules between components/options
- Dynamic pricing based on selected options
- Inventory tracking

## Technology Stack

- FastAPI
- SQLAlchemy
- PostgreSQL
- Pydantic

## Getting Started

### Prerequisites

- Python 3.8 or higher
- PostgreSQL

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
DATABASE_URL=postgresql://postgres:postgres@localhost/factorial_db
```

5. Set up the database:
```bash
# Create the database
createdb factorial_db  

# The tables will be automatically created when you run the application
```

### Running the Application

Start the development server:

```bash
python run.py
```

The API will be available at http://localhost:8000

API documentation can be accessed at:
- http://localhost:8000/docs (Swagger UI)
- http://localhost:8000/redoc (ReDoc)

## API Endpoints

### Products

- `GET /products` - List all products
- `GET /products/{product_id}` - Get a specific product
- `POST /products` - Create a new product
- `PUT /products/{product_id}` - Update a product
- `DELETE /products/{product_id}` - Delete a product

### Options

- `PUT /options/{option_id}/stock` - Update option stock status

## Development

To install the package in development mode:

```bash
pip install -e .
``` 