# Marcus Bikes Bicycle Shop

A full-stack application for a customizable bicycle shop, allowing customers to configure and order custom bicycles, skis, surfboards, and rollerskates.

## Project Overview

Marcus Bikes is a modular e-commerce platform that enables customers to create custom products through an intuitive interface. The application handles complex product configuration logic, real-time pricing, inventory management, and order processing.

## Project Structure

- **marcus-bikes-frontend**: Next.js frontend application with TypeScript and TailwindCSS
- **marcus-bikes-backend**: FastAPI backend application with SQLAlchemy ORM
- **docker-compose.yml**: Docker configuration for running the complete stack

## Core Features

### Product Management
- Product catalog with categories (bicycles, skis, surfboards, rollerskates)
- Interactive product customization with real-time pricing
- Component and option management
- Dynamic pricing based on selected options

### Order Management
- Shopping cart functionality
- Order processing and tracking
- Order filtering by date range, status, and product category

### Inventory Management
- Stock tracking for options
- Low stock alerts
- Inventory updates through admin interface

### Admin Features
- Admin authentication and authorization
- Price rule configuration
- Inventory management
- Order management
- Product and category management

## Technology Stack

### Frontend
- **Next.js 14.0.4**: React framework for server-side rendering and routing
- **React 18.2.0**: UI library
- **TypeScript 5**: Type-safe JavaScript
- **TailwindCSS 3.3.6**: Utility-first CSS framework
- **React Context API**: State management
- **Hero Icons**: Icon library
- **React Hot Toast**: Toast notifications
- **Date-fns**: Date manipulation library

### Backend
- **FastAPI 0.104.1**: High-performance Python web framework
- **SQLAlchemy 2.0.23**: SQL toolkit and ORM
- **PostgreSQL**: Relational database
- **Pydantic 2.4.2**: Data validation and settings management
- **Alembic 1.12.1**: Database migration tool
- **PyJWT 2.8.0**: JWT authentication

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

## Prerequisites

- Docker and Docker Compose (for containerized setup)
- Node.js 18+ and npm (for frontend development)
- Python 3.8+ (for backend development)
- PostgreSQL 15+ (for local database)
- Git

## Running with Docker

The easiest way to run the entire application is using Docker Compose:

```bash
# Clone the repository
git clone https://github.com/your-org/marcus-bikes.git
cd marcus-bikes

# Start all services (frontend, backend, and database)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

The first time you run docker and the services are created, run the following to populate the DB:

```bash
python seed.py  # Populate with initial data (optional)
```

The applications will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs (Swagger UI)
- API Alternative Docs: http://localhost:8000/redoc (ReDoc)

## Manual Setup

### Backend

1. Navigate to the backend directory:
```bash
cd marcus-bikes-backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
pip install -e .  # Install in development mode
```

4. Create a `.env` file:
```
DATABASE_URL=postgresql://postgres:postgres@localhost/marcus_bikes_db
```

5. Initialize the database:
```bash
python run_migrations.py  # Apply database migrations
python seed.py  # Populate with initial data (optional)
```

6. Run the backend server:
```bash
uvicorn app.main:app --reload
# Or use the provided script:
./run_dev.sh
```

### Frontend

1. Navigate to the frontend directory:
```bash
cd marcus-bikes-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

4. Run the development server:
```bash
npm run dev
```

## Development Workflow

1. **Backend Development**:
   - Models are defined in `marcus-bikes-backend/app/models/`
   - API endpoints are located in `marcus-bikes-backend/app/routes/`
   - Business logic is in `marcus-bikes-backend/app/services/`
   - Data validation schemas are in `marcus-bikes-backend/app/schemas/`
   - Database migrations are managed with Alembic

2. **Frontend Development**:
   - Components are located in `marcus-bikes-frontend/src/app/components/`
   - API integration is centralized in `marcus-bikes-frontend/src/app/lib/api.ts`
   - Page components are in their respective route directories
   - Admin functionality is in `marcus-bikes-frontend/src/app/admin/`
   - Styles are managed with TailwindCSS

3. **Database Changes**:
   - Use Alembic to create and apply migrations
   - Update models in the backend code
   - Run migrations with `python run_migrations.py`

## Testing

### Frontend Testing
The frontend uses Jest and React Testing Library for testing. The setup includes:

- **Jest Configuration**: Configured in `jest.config.js` with Next.js integration
- **Test Environment**: Uses `jest-environment-jsdom` for DOM testing
- **Testing Utilities**: 
  - `@testing-library/react` for component testing
  - `@testing-library/jest-dom` for DOM assertions
  - `@testing-library/user-event` for user interaction simulation
- **Mock Setup**: 
  - Next.js router and image components
  - Browser APIs (localStorage, matchMedia, ResizeObserver)
  - Context providers and custom hooks

Run frontend tests with:
```bash
cd marcus-bikes-frontend
npm test           # Run all tests
npm run test:watch # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

### Backend Testing
The backend uses pytest with a comprehensive test suite:

- **Test Framework**: pytest with additional plugins
  - `pytest-cov` for coverage reporting
  - `pytest-asyncio` for async test support
  - `httpx` for HTTP client testing
- **Test Database**: Uses SQLite for testing with isolated test database
- **Fixtures**: 
  - Database session management
  - Test client setup
  - Model creation helpers
- **Test Categories**:
  - Model tests (products, orders, inventory)
  - API endpoint tests
  - Integration tests
  - Authentication tests

Run backend tests with:
```bash
cd marcus-bikes-backend
python run_tests.py  # Run all tests
pytest tests/        # Run specific test directory
pytest --cov=app tests/  # Run tests with coverage
```

### Test Coverage
Both frontend and backend maintain test coverage requirements:
- Frontend: Components, hooks, and utilities
- Backend: Models, routes, and services
- Integration tests for critical user flows

### Continuous Integration
Tests are automatically run on:
- Pull request creation
- Push to main branch
- Scheduled runs for dependency updates

## More Information

See the individual README files in each project directory for more detailed development instructions:
- [Backend README](marcus-bikes-backend/README.md)
- [Frontend README](marcus-bikes-frontend/README.md)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
