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

The frontend integrates with the backend API using fetch calls in the `src/app/lib/api.ts` file. All API calls should be centralized there for easier maintenance, but the current version of the project has a hybrid approach due to time constraints. The API integration includes:

- Product management
- Order processing
- Inventory tracking
- Price rule configuration
- Admin authentication
- Category management

## Testing

The frontend uses Jest and React Testing Library for comprehensive testing. The testing infrastructure includes:

### Test Setup
- **Jest Configuration**: Configured in `jest.config.js` with Next.js integration
- **Test Environment**: Uses `jest-environment-jsdom` for DOM testing
- **Testing Utilities**: 
  - `@testing-library/react` for component testing
  - `@testing-library/jest-dom` for DOM assertions
  - `@testing-library/user-event` for user interaction simulation

### Mock Setup
The test environment includes mocks for:
- Next.js router and image components
- Browser APIs (localStorage, matchMedia, ResizeObserver)
- Context providers and custom hooks
- API calls and responses

### Test Structure
```
src/
├── app/
│   ├── __tests__/           # Test files
│   │   ├── components/      # Component tests
│   │   ├── context/         # Context tests
│   │   └── utils/          # Utility tests
│   ├── components/          # Components being tested
│   └── lib/                # Library code being tested
```

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run specific test file
npm test -- src/app/__tests__/components/Header.test.tsx

# Run tests matching a pattern
npm test -- -t "Header"
```

### Writing Tests
Example test structure:
```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import Header from '../components/Header'

describe('Header', () => {
  it('renders navigation links', () => {
    render(<Header />)
    expect(screen.getByText('Products')).toBeInTheDocument()
    expect(screen.getByText('Cart')).toBeInTheDocument()
  })

  it('handles theme toggle', () => {
    render(<Header />)
    const themeButton = screen.getByRole('button', { name: /toggle theme/i })
    fireEvent.click(themeButton)
    expect(document.documentElement).toHaveClass('dark')
  })
})
```

### Test Coverage
- Components: 85%+ coverage
- Context providers: 90%+ coverage
- Utility functions: 80%+ coverage
- Integration tests: Critical user flows

### Continuous Integration
Tests are automatically run on:
- Pull request creation
- Push to main branch
- Scheduled runs for dependency updates
