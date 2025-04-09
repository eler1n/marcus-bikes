# Marcus Bikes Frontend

The frontend application for the Marcus Bikes Bicycle Shop, built with Next.js and TypeScript.

## Features

- Interactive product customization
- Real-time pricing calculations
- Component dependency validation
- Responsive design with Tailwind CSS
- Shopping cart functionality
- Admin dashboard for inventory management
- Product category management
- Order management system
- Price rule configuration
- Toast notifications for user feedback

## Technology Stack

- Next.js 14.0.4
- React 18.2.0
- TypeScript 5
- TailwindCSS 3.3.6
- React Context API
- Hero Icons
- React Hot Toast
- Date-fns

## Project Structure

```
src/
├── app/
│   ├── admin/           # Admin dashboard pages
│   ├── about/           # About page
│   ├── cart/            # Shopping cart pages
│   ├── categories/      # Product category pages
│   ├── products/        # Product pages
│   ├── components/      # Reusable UI components
│   ├── lib/            # Core functionality
│   │   ├── api.ts      # API integration
│   │   ├── context/    # React context providers
│   │   ├── data/       # Data models
│   │   └── utils.ts    # Utility functions
│   ├── styles/         # Global styles
│   └── layout.tsx      # Root layout
```

## Running with Docker

The easiest way to run the frontend is using Docker Compose:

```bash
# In the marcus-bikes-frontend directory
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

The frontend uses a modular architecture with the following key components:

- `src/app/components`: Reusable UI components
- `src/app/lib/api.ts`: Centralized API integration
- `src/app/lib/context`: React context providers for state management
- `src/app/lib/data`: Data models and types
- `src/app/lib/utils.ts`: Utility functions
- `src/app/{page-routes}`: Next.js page components
- `src/app/admin`: Admin dashboard functionality

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

## Building for Production

```bash
npm run build
npm start
```

## API Integration

The frontend integrates with the backend API using fetch calls in the `src/app/lib/api.ts` file. All API calls are centralized there for easier maintenance. The API integration includes:

- Product management
- Order processing
- Inventory tracking
- Price rule configuration
- Admin authentication
- Category management
