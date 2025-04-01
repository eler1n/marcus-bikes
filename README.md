# Factorial Bicycle Shop

A full-stack application for a customizable bicycle shop, allowing customers to configure and order custom bicycles, skis, surfboards, and rollerskates.

## Project Structure

- **factorial-frontend**: Next.js frontend application
- **factorial-backend**: FastAPI backend application

## Features

- Product catalog with categories (bicycles, skis, surfboards, rollerskates)
- Interactive product customization with real-time pricing
- Dynamic component/option dependencies
- Inventory management
- Shopping cart and checkout

## Technology Stack

### Frontend
- Next.js
- TypeScript
- TailwindCSS
- React Context API

### Backend
- FastAPI
- SQLAlchemy
- PostgreSQL
- Pydantic

## Running with Docker

The easiest way to run the entire application is using Docker Compose:

```bash
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
- API Documentation: http://localhost:8000/docs

## Manual Setup

### Backend

1. Navigate to the backend directory:
```bash
cd factorial-backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
pip install -e .
```

4. Create a `.env` file:
```
DATABASE_URL=postgresql://postgres:postgres@localhost/factorial_db
```

5. Run the backend server:
```bash
uvicorn app.main:app --reload
```

### Frontend

1. Navigate to the frontend directory:
```bash
cd factorial-frontend
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

## Development

See the individual README files in each project directory for more detailed development instructions:
- [Backend README](factorial-backend/README.md)
- [Frontend README](factorial-frontend/README.md)
