Table: Products
- id: Integer (Primary Key)
- name: String (Not Null)
- description: Text
- category: Enum ('bicycle', 'ski', 'surfboard', 'rollerskate')
- base_price: Float (Default: 0)

Table: Components
- id: Integer (Primary Key)
- name: String (Not Null)
- description: Text
- product_id: Integer (Foreign Key to products.id)

Table: Options
- id: Integer (Primary Key)
- name: String (Not Null)
- price: Float (Not Null)
- in_stock: Boolean (Default: True)
- component_id: Integer (Foreign Key to components.id)
- stock_quantity: Integer (Default: 0)

Table: Dependencies
- product_id: Integer (Foreign Key to products.id)
- option_id: Integer (Foreign Key to options.id)
- dependent_option_id: Integer (Foreign Key to options.id)
- type: Enum ('requires', 'excludes')

Table: Price_rules
- id: Integer (Primary Key)
- product_id: Integer (Foreign Key to products.id)
- rule_type: String
- value: Float

Table: Orders
- id: Integer (Primary Key)
- status: Enum ('pending', 'processing', 'shipped', 'completed', 'canceled')

Table: Inventory
- option_id: Integer (Foreign Key to options.id)
- status: Enum ('in_stock', 'out_of_stock', 'limited_stock')