Table: Products
- id: Integer (Primary Key)
- name: String (Not Null)
- description: Text
- category: Text - Enum ('bicycle', 'ski', 'surfboard', 'rollerskate')
- base_price: Real/Float (Default: 0)

Table: Components
- id: Integer (Primary Key)
- name: String (Not Null)
- description: Text
- product_id: Integer (Foreign Key to products.id)

Table: Options
- id: Integer (Primary Key)
- name: String (Not Null)
- price: Real/Float (Not Null)
- in_stock: Boolean (Default: True)
- component_id: Integer (Foreign Key to components.id)
- stock_quantity: Integer (Default: 0)

Table: Dependencies
- id = Integer (Primary Key)
- type = Text - Enum ('requires','excludes')
- source_component_id = Integer (Foreign Key to components.id)
- source_option_id = Integer (Foreign Key to options.id)
- target_component_id = Integer (Foreign Key to components.id)
- target_option_id = Integer (Foreign Key to options.id)  # Can be null if it applies to the entire component
- product_id: Integer (Foreign Key to products.id)

Table: Price_rules
- id = Integer (Primary Key)
- component_id = Integer (Foreign Key to components.id)
- option_id = Integer (Foreign Key to options.id)
- dependent_component_id = Integer (Foreign Key to components.id)
- dependent_option_id = Integer (Foreign Key to options.id)
- price = Real/Float
- product_id = Integer (Foreign Key to products.id)

Table: Orders
- id: Integer (Primary Key)
- status: Enum ('pending', 'processing', 'shipped', 'completed', 'canceled')
- customer_name = Text
- customer_email = Text
- shipping_address = Text
- total_amount = real
- created_at = Date
- updated_at = Date
- order_details = json  # This will store product configurations, quantities, etc.
- product_categories = Text  # Comma-separated list of categories in this order 

Table: Inventory
- id: Integer (Primary Key)
- option_id: Integer (Foreign Key to options.id)
- quantity: Integer
- stock_status: Enum ('in_stock', 'out_of_stock', 'limited_stock')
- low_stock_threshold: Integer # Threshold to mark as "limited stock"