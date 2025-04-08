For Regular Customers:

Browse Products
- View all available products (bikes, skis...)
- Filter products by category
- View detailed product information
- Check product availability and stock status

Shopping and Orders
- Add products to cart
- Create new orders
- View their order history
- Track order status
- Select product options (like size, color, etc.)

Inventory Interaction
- View product availability in real-time
- See which items are in stock
- Get notifications about low stock items

For Administrators (Shop Owner):

Authentication
- Login to admin dashboard using credentials
- Secure access with JWT token authentication
- Session management (tokens expire after 8 hours)

Product Management
- Add new products
- Update existing products
- Manage product categories
- Set up price rules and special offers

Inventory Management
- Track inventory levels
- Update stock status
- Monitor low stock items
- Manage product options and variants

Order Processing
- View all orders
- Process pending orders
- Filter orders by date range, status, and product category
- Update order status
- Delete orders if necessary

Dashboard Features
- View pending orders count
- Quick access to add new products
- Update inventory levels
- Process pending orders
- Monitor sales statistics



New product creation: What information is required to create a new product? How does the database change?

Required Information for Product Creation:
Basic Product Information:
- id: Integer (Primary Key)
- name: String (Required)
- description: Text (Optional)
- category: Enum ('bicycle', 'ski', 'surfboard', 'rollerskate')
- base_price: Float (Default: 0)
Note: The product could be created using just this info but the frontend requires adding at least 1 component to it

Components (List):
Each component requires:
- name: String (Required)
- description: Text (Optional)
- List of Options, where each option has:
- name: String (Required)
- price: Float (Required)
- in_stock: Boolean (Default: true)
- stock_quantity: Integer (Default: 0)

Dependencies (List):
Relationships between options, each containing:
- component_id: Reference to component
- option_id: Reference to option
- dependent_component_id: Reference to dependent component
- dependent_option_id: Reference to dependent option
- type: Enum ('requires', 'excludes')

Price Rules (List):
Rules for price adjustments, each containing:
- component_id: Reference to component
- option_id: Reference to option
- dependent_component_id: Reference to dependent component
- dependent_option_id: Reference to dependent option
- price: Float (price adjustment value)

Database Changes:
When a new product is created, the following database changes occur:

Products Table:
INSERT INTO products (
    id,
    name,
    description,
    category,
    base_price
)

Components Table:
INSERT INTO components (
    name,
    description,
    product_id
)

Options Table (if any):
INSERT INTO options (
    name,
    price,
    in_stock,
    component_id,
    stock_quantity
)

Dependencies Table (if any):
INSERT INTO dependencies (
    product_id,
    option_id,
    dependent_option_id,
    type
)

Price Rules Table (if any):
INSERT INTO price_rules (
    component_id,
    option_id,
    dependent_component_id,
    dependent_option_id,
    price,
    product_id
)

The creation process follows these steps:
- Creates the main product record
- Creates all components associated with the product
- Creates all options for each component (if any)
- Establishes dependencies between options (if any)
- Sets up price rules for option combinations (if any)


Adding a new part choice: How can Marcus introduce a new rim color? Describe the UI and how the database changes.

Through the Admin UI:
- Navigate to the Product Edit Page
- Find the "Components & Options" section
- Locate the "Rim Color" component (or create it if it doesn't exist)
- Click "Add Option" button
- Fill in the new color details:
    - Name: The new color name
    - Price: The additional cost for this color option
    - In Stock: Status will be set to true by default

Database Changes:
When the new rim color is added, the following database changes occur:
Options Table:
INSERT INTO options (
    name,          -- The new color name
    price,         -- The price premium for this color
    in_stock,      -- Initially set to true
    component_id,  -- References the "Rim Color" component
    stock_quantity -- Default initial quantity

Inventory Table:
INSERT INTO inventory (
    option_id,           -- References the newly created option
    quantity,            -- Initial stock quantity
    stock_status,        -- Initially set to 'in_stock'
    low_stock_threshold  -- Typically set to 7 for rim colors
)

Example from the seed data shows how rim colo

Setting prices: How can Marcus change the price of a specific part or specify particular pricing for combinations of choices? How does the UI and database handle this?