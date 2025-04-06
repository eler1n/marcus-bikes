# Marcus Bikes Bicycle Shop

A full-stack application for a customizable bicycle shop, allowing customers to configure and order custom bicycles, skis, surfboards, and rollerskates.

## Project Overview

Marcus Bikes is a modular e-commerce platform that enables customers to create custom products through an intuitive interface. The application handles complex product configuration logic, real-time pricing, inventory management, and order processing.

## Project Structure

- **marcus-bikes-frontend**: Next.js frontend application with TypeScript and TailwindCSS
- **marcus-bikes-backend**: FastAPI backend application with SQLAlchemy ORM
- **docker-compose.yml**: Docker configuration for running the complete stack

## Core Model

The marcus-bikes Bicycle Shop is built around a flexible product customization system:

#### Database Schema

The application uses PostgreSQL with the following main tables:
- `products`: Base products and categories (bicycles, skis, surfboards, rollerskates)
- `components`: Customizable parts for each product (frames, wheels, handlebars, etc.)
- `options`: Available choices for each component (materials, colors, sizes)
- `inventory`: Stock tracking for options (quantity, availability)
- `configurations`: Saved product configurations (customer selections)
- `orders`: Customer orders (status, payment info, shipping)
- `users`: Customer accounts and profiles (authentication, preferences)

#### API Endpoints

- `/api/products`: List available products and categories
- `/api/products/{id}/components`: Get customizable components for a product
- `/api/components/{id}/options`: Get available options for a component
- `/api/configurations`: Create/read/update customized products
- `/api/orders`: Manage customer orders and checkout process
- `/api/users`: User account management
- `/api/inventory`: Inventory status and updates

## Features

- Product catalog with categories (bicycles, skis, surfboards, rollerskates)
- Interactive product customization with real-time pricing
- Dynamic component/option dependencies (compatibility rules)
- Inventory management with stock tracking
- Shopping cart and secure checkout process
- User accounts and saved configurations
- Admin dashboard for product and inventory management

## Technology Stack

### Frontend
- **Next.js**: React framework for server-side rendering and routing
- **TypeScript**: Type-safe JavaScript
- **TailwindCSS**: Utility-first CSS framework
- **React Context API**: State management
- **Fetch API**: Data fetching from backend

### Backend
- **FastAPI**: High-performance Python web framework
- **SQLAlchemy**: SQL toolkit and ORM
- **PostgreSQL**: Relational database
- **Pydantic**: Data validation and settings management
- **Alembic**: Database migration tool

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
# Or use the provided script to seed the database with dummy data:
# ./run_dev.sh
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

2. **Frontend Development**:
   - Components are located in `marcus-bikes-frontend/src/app/components/`
   - API integration is centralized in `marcus-bikes-frontend/src/app/lib/api.ts`
   - Page components are in their respective route directories
   - Styles are managed with TailwindCSS

3. **Database Changes**:
   - Use Alembic to create and apply migrations
   - Update models in the backend code
   - Run migrations with `python run_migrations.py`

## Testing

- Backend tests can be run with pytest
- Frontend tests use Jest and React Testing Library

## More Information

See the individual README files in each project directory for more detailed development instructions:
- [Backend README](marcus-bikes-backend/README.md)
- [Frontend README](marcus-bikes-frontend/README.md)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
