# Admin Panel for Marcus Bikes Bicycle Shop

This admin panel provides a comprehensive management system for Marcus (the shop owner) to manage products, inventory, and orders within the bicycle shop e-commerce application.

## Features

### 1. Product Management
- View a list of all products with filtering and search capabilities
- Add new products with configurable components and options
- Edit existing products, their details, components, and options
- Remove products from the catalog

### 2. Inventory Management
- View inventory levels for all product options
- Filter inventory by category and stock status
- Update stock quantities and stock status
- Set low-stock thresholds for automated inventory management

### 3. Order Management
- View all customer orders with comprehensive filtering options
- Update order statuses (pending, processing, shipped, completed, canceled)
- View detailed order information including customer data and purchased items

### 4. Dashboard
- Overview of key metrics such as total products, low stock items, and pending orders
- Quick access to critical management tasks

## Authentication

The admin panel is secured using JWT-based authentication. Only Marcus should have access to this section of the application.

### Login Credentials
- Username: marcus
- Password: bike-shop-owner

These credentials are currently stored in environment variables on the backend server.

## Getting Started

1. Access the admin panel via the "Admin" link in the main navigation
2. Log in using the provided credentials
3. Navigate through the dashboard, products, inventory, and orders sections
4. Make changes as needed to manage the bicycle shop

## Technical Implementation

The admin panel is built using:
- Next.js for the frontend framework
- FastAPI for the backend API
- JWT for authentication
- Tailwind CSS for styling

## API Endpoints

The admin panel communicates with the backend through the following API endpoints:

### Authentication
- POST `/admin/login` - Authenticate and receive JWT token
- GET `/admin/verify` - Verify token validity

### Products
- GET `/products` - Get all products
- GET `/products/{id}` - Get a specific product
- POST `/products` - Create a new product
- PUT `/products/{id}` - Update a product
- DELETE `/products/{id}` - Delete a product

### Inventory
- GET `/inventory` - Get all inventory items
- GET `/inventory/low-stock` - Get items with low or out of stock status
- GET `/inventory/option/{option_id}` - Get inventory for a specific option
- POST `/inventory` - Create a new inventory record
- PATCH `/inventory/option/{option_id}` - Update an inventory record
- DELETE `/inventory/option/{option_id}` - Delete an inventory record

### Orders
- GET `/orders` - Get all orders
- GET `/orders/{id}` - Get a specific order
- POST `/orders/filter` - Filter orders by criteria
- PATCH `/orders/{id}` - Update an order (e.g., change status)
- DELETE `/orders/{id}` - Delete an order 