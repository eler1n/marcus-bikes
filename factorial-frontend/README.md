# Factorial Frontend

The frontend application for the Factorial Bicycle Shop, built with Next.js and TypeScript.

## Features

- Interactive product customization
- Real-time pricing calculations
- Component dependency validation
- Responsive design with Tailwind CSS
- Shopping cart functionality

## Technology Stack

- Next.js
- TypeScript
- TailwindCSS
- React Context API

## Running with Docker

The easiest way to run the frontend is using Docker Compose:

```bash
# In the factorial-frontend directory
docker-compose up -d
```

This will start the frontend application on http://localhost:3000

## Manual Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

3. Run the development server:
```bash
npm run dev
```

## Development

The frontend uses a modular architecture:

- `src/app/components`: Reusable UI components
- `src/app/lib`: Utility functions and data handling
- `src/app/lib/context`: React context providers
- `src/app/lib/data`: Data models and mock data
- `src/app/{page-routes}`: Next.js page components

## Building for Production

```bash
npm run build
npm start
```

## API Integration

The frontend integrates with the backend API using fetch calls in the `src/app/lib/api.ts` file. All API calls are centralized there for easier maintenance.
