import os
import sys
from sqlalchemy.orm import Session
from sqlalchemy import text, inspect
from app.database.session import engine, SessionLocal
from app import models
from app.models.base import Base
from app.schemas import ProductCreate, ComponentCreate, OptionCreate, DependencyCreate, PriceRuleCreate, CategoryEnum, DependencyTypeEnum
from app.models.enums import StockStatusEnum, OrderStatusEnum
import datetime

# Function to check if a column exists in a table
def column_exists(table_name, column_name):
    inspector = inspect(engine)
    columns = [c["name"] for c in inspector.get_columns(table_name)]
    return column_name in columns

# Function to add a column if it doesn't exist
def add_column_if_not_exists(table_name, column_name, column_type):
    if not column_exists(table_name, column_name):
        print(f"Adding {column_name} column to {table_name} table...")
        with engine.begin() as conn:
            conn.execute(text(f"ALTER TABLE {table_name} ADD COLUMN {column_name} {column_type} DEFAULT 0 NOT NULL"))

# Function to check if a table exists in the database
def table_exists(table_name):
    return inspect(engine).has_table(table_name)

# Create core product tables if they don't exist
def create_core_tables():
    if not table_exists("products"):
        print("Creating products table...")
        with engine.begin() as conn:
            conn.execute(text("""
                CREATE TABLE products (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    description TEXT,
                    category VARCHAR(50) NOT NULL,
                    base_price FLOAT DEFAULT 0
                )
            """))

    if not table_exists("components"):
        print("Creating components table...")
        with engine.begin() as conn:
            conn.execute(text("""
                CREATE TABLE components (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    description TEXT,
                    product_id INTEGER NOT NULL,
                    FOREIGN KEY (product_id) REFERENCES products (id)
                )
            """))

    if not table_exists("options"):
        print("Creating options table...")
        with engine.begin() as conn:
            conn.execute(text("""
                CREATE TABLE options (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    price FLOAT NOT NULL,
                    in_stock BOOLEAN DEFAULT true,
                    component_id INTEGER NOT NULL,
                    stock_quantity INTEGER DEFAULT 0 NOT NULL,
                    FOREIGN KEY (component_id) REFERENCES components (id)
                )
            """))

    if not table_exists("dependencies"):
        print("Creating dependencies table...")
        with engine.begin() as conn:
            conn.execute(text("""
                CREATE TABLE dependencies (
                    id SERIAL PRIMARY KEY,
                    type VARCHAR(50) NOT NULL,
                    source_component_id INTEGER NOT NULL,
                    source_option_id INTEGER NOT NULL,
                    target_component_id INTEGER NOT NULL,
                    target_option_id INTEGER,
                    product_id INTEGER NOT NULL,
                    FOREIGN KEY (product_id) REFERENCES products (id),
                    FOREIGN KEY (source_component_id) REFERENCES components (id),
                    FOREIGN KEY (source_option_id) REFERENCES options (id),
                    FOREIGN KEY (target_component_id) REFERENCES components (id),
                    FOREIGN KEY (target_option_id) REFERENCES options (id)
                )
            """))

    if not table_exists("price_rules"):
        print("Creating price_rules table...")
        with engine.begin() as conn:
            conn.execute(text("""
                CREATE TABLE price_rules (
                    id SERIAL PRIMARY KEY,
                    component_id INTEGER NOT NULL,
                    option_id INTEGER NOT NULL,
                    dependent_component_id INTEGER NOT NULL,
                    dependent_option_id INTEGER NOT NULL,
                    price FLOAT NOT NULL,
                    product_id INTEGER NOT NULL,
                    FOREIGN KEY (product_id) REFERENCES products (id),
                    FOREIGN KEY (component_id) REFERENCES components (id),
                    FOREIGN KEY (option_id) REFERENCES options (id),
                    FOREIGN KEY (dependent_component_id) REFERENCES components (id),
                    FOREIGN KEY (dependent_option_id) REFERENCES options (id)
                )
            """))

# Ensure tables have correct schema before adding data
def update_schema():
    # Create core tables manually first
    create_core_tables()
    
    # Then try to create any remaining tables with SQLAlchemy
    try:
        Base.metadata.create_all(bind=engine)
        print("Additional tables created via SQLAlchemy")
    except Exception as e:
        print(f"SQLAlchemy create_all had some issues: {e}")
        print("Some tables may need manual creation")
    
    # Add stock_quantity column to options table if it doesn't exist
    if table_exists("options"):
        add_column_if_not_exists("options", "stock_quantity", "INTEGER")
    
    # Create inventory table if it doesn't exist and add necessary columns
    if not table_exists("inventory"):
        print("Creating inventory table...")
        with engine.begin() as conn:
            conn.execute(text("""
                CREATE TABLE inventory (
                    id SERIAL PRIMARY KEY,
                    option_id INTEGER NOT NULL,
                    quantity INTEGER NOT NULL DEFAULT 0,
                    stock_status VARCHAR(20) NOT NULL,
                    low_stock_threshold INTEGER NOT NULL DEFAULT 5,
                    FOREIGN KEY (option_id) REFERENCES options (id)
                )
            """))
    
    # Check if orders table exists, if not create it with all required columns
    if not table_exists("orders"):
        print("Creating orders table...")
        with engine.begin() as conn:
            conn.execute(text("""
                CREATE TABLE orders (
                    id SERIAL PRIMARY KEY,
                    customer_name VARCHAR(255) NOT NULL,
                    customer_email VARCHAR(255) NOT NULL,
                    shipping_address TEXT NOT NULL,
                    total_amount FLOAT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    status VARCHAR(20) NOT NULL DEFAULT 'pending',
                    order_details JSONB NOT NULL DEFAULT '{}',
                    product_categories VARCHAR(255)
                )
            """))
            
    # Verify tables exist
    required_tables = ["products", "components", "options", "dependencies", "price_rules"]
    for table in required_tables:
        if not table_exists(table):
            print(f"ERROR: Required table {table} does not exist!")
            raise Exception(f"Required table {table} was not created properly")

# Update schema before seeding data
print("Updating database schema...")
update_schema()

# Create a session
db = SessionLocal()

# Check if products exist to avoid duplicates
try:
    # First make sure the products table exists
    if table_exists("products"):
        existing_products = db.query(models.Product).count()
        if existing_products > 0:
            print(f"Database already contains {existing_products} products. Skipping seed.")
            sys.exit(0)
    else:
        print("Products table doesn't exist yet. Will proceed with seeding.")
except Exception as e:
    print(f"Error checking existing products: {e}")
    print("Continuing with seed regardless...")

# Define bicycle product
custom_bike = ProductCreate(
    id=1,  # Use integer ID
    name="Custom Mountain Bike",
    description="Build your dream bike with our customization options",
    category=CategoryEnum.BICYCLE,
    base_price=0,
    components=[
        ComponentCreate(
            name="Frame Type",
            description="Choose your frame type based on your riding style",
            options=[
                OptionCreate(
                    name="Full-suspension",
                    price=130,
                    in_stock=True
                ),
                OptionCreate(
                    name="Diamond",
                    price=100,
                    in_stock=True
                ),
                OptionCreate(
                    name="Step-through",
                    price=110,
                    in_stock=True
                ),
                OptionCreate(
                    name="Carbon Fiber",
                    price=250,
                    in_stock=False
                )
            ]
        ),
        ComponentCreate(
            name="Frame Finish",
            description="Choose the finish for your frame",
            options=[
                OptionCreate(
                    name="Matte",
                    price=35,
                    in_stock=True
                ),
                OptionCreate(
                    name="Shiny",
                    price=30,
                    in_stock=True
                )
            ]
        ),
        ComponentCreate(
            name="Wheels",
            description="Choose wheels based on your riding terrain",
            options=[
                OptionCreate(
                    name="Road Wheels",
                    price=80,
                    in_stock=True
                ),
                OptionCreate(
                    name="Mountain Wheels",
                    price=95,
                    in_stock=True
                ),
                OptionCreate(
                    name="Fat Bike Wheels",
                    price=110,
                    in_stock=True
                ),
                OptionCreate(
                    name="Carbon Racing Wheels",
                    price=180,
                    in_stock=False
                )
            ]
        ),
        ComponentCreate(
            name="Rim Color",
            description="Choose the color of your wheel rims",
            options=[
                OptionCreate(
                    name="Red",
                    price=25,
                    in_stock=True
                ),
                OptionCreate(
                    name="Black",
                    price=15,
                    in_stock=True
                ),
                OptionCreate(
                    name="Blue",
                    price=20,
                    in_stock=True
                )
            ]
        ),
        ComponentCreate(
            name="Chain",
            description="Choose your chain type",
            options=[
                OptionCreate(   
                    name="Single-speed Chain",
                    price=43,
                    in_stock=True
                ),
                OptionCreate(
                    name="8-speed Chain",
                    price=55,
                    in_stock=False
                ),
                OptionCreate(
                    name="12-speed Chain",
                    price=75,
                    in_stock=True
                )
            ]
        ),
        ComponentCreate(
            name="Saddle",
            description="Choose your preferred saddle type",
            options=[
                OptionCreate(
                    name="Comfort Saddle",
                    price=50,
                    in_stock=True
                ),
                OptionCreate(
                    name="Sport Saddle",
                    price=65,
                    in_stock=True
                ),
                OptionCreate(
                    name="Professional Racing Saddle",
                    price=120,
                    in_stock=False
                )
            ]
        )
    ],
    dependencies=[],  # We'll create these manually after components/options
    price_rules=[]    # We'll create these manually as well
)

# Create the product in the database
print("Creating bicycle product...")

try:
    # Add product to database
    db_product = models.Product(
        id=custom_bike.id,
        name=custom_bike.name,
        description=custom_bike.description,
        category=custom_bike.category,
        base_price=custom_bike.base_price
    )
    db.add(db_product)
    db.flush()
    print(f"Created product with ID: {db_product.id}")

    # Dictionary to store component and option objects for dependencies and price rules
    component_objects = {}
    option_objects = {}

    # Add components
    for component in custom_bike.components:
        db_component = models.Component(
            name=component.name,
            description=component.description,
            product_id=db_product.id
        )
        db.add(db_component)
        db.flush()
        print(f"Created component: {component.name}")
        
        # Store component for later reference
        component_objects[component.name] = db_component
        
        # Add options for this component
        for option in component.options:
            # Stock quantity defaults based on in_stock status
            stock_quantity = 0 if not option.in_stock else 25
            
            if component.name == "Frame Type" and option.name == "Full-suspension":
                stock_quantity = 15  # Limited stock for premium frames
            elif component.name == "Saddle" and option.name == "Professional Racing Saddle":
                stock_quantity = 0   # Out of stock for professional saddles
            elif option.name == "Carbon Fiber" or option.name == "Carbon Racing Wheels":
                stock_quantity = 5   # Low stock for premium carbon items
                
            db_option = models.Option(
                name=option.name,
                price=option.price,
                in_stock=option.in_stock,
                component_id=db_component.id,
                stock_quantity=stock_quantity
            )
            db.add(db_option)
            db.flush()
            print(f"Created option: {option.name}")
            
            # Store option for later reference
            option_key = f"{component.name}-{option.name}"
            option_objects[option_key] = db_option

    # Now add the dependencies using the stored objects
    print("Creating dependencies...")
    
    # Wheels/Mountain -> Frame/Full-suspension dependency
    wheels_component = component_objects["Wheels"]
    mountain_option = option_objects["Wheels-Mountain Wheels"]
    frame_component = component_objects["Frame Type"]
    suspension_option = option_objects["Frame Type-Full-suspension"]
    
    dependency1 = models.Dependency(
        type=DependencyTypeEnum.REQUIRES,
        source_component_id=wheels_component.id,
        source_option_id=mountain_option.id,
        target_component_id=frame_component.id,
        target_option_id=suspension_option.id,
        product_id=db_product.id
    )
    db.add(dependency1)
    print(f"Created dependency: REQUIRES Wheels/Mountain Wheels -> Frame Type/Full-suspension")
    
    # Wheels/Fat Bike -> Rim Color/Red exclusion
    fat_bike_option = option_objects["Wheels-Fat Bike Wheels"]
    rim_component = component_objects["Rim Color"]
    red_option = option_objects["Rim Color-Red"]
    
    dependency2 = models.Dependency(
        type=DependencyTypeEnum.EXCLUDES,
        source_component_id=wheels_component.id,
        source_option_id=fat_bike_option.id,
        target_component_id=rim_component.id,
        target_option_id=red_option.id,
        product_id=db_product.id
    )
    db.add(dependency2)
    print(f"Created dependency: EXCLUDES Wheels/Fat Bike Wheels -> Rim Color/Red")

    # Now add price rules
    print("Creating price rules...")
    
    # Frame Finish/Matte + Frame Type/Full-suspension -> 50
    frame_finish_component = component_objects["Frame Finish"]
    matte_option = option_objects["Frame Finish-Matte"]
    
    rule1 = models.PriceRule(
        component_id=frame_finish_component.id,
        option_id=matte_option.id,
        dependent_component_id=frame_component.id,
        dependent_option_id=suspension_option.id,
        price=50,
        product_id=db_product.id
    )
    db.add(rule1)
    print(f"Created price rule: Frame Finish/Matte + Frame Type/Full-suspension -> 50")
    
    # Frame Finish/Matte + Frame Type/Diamond -> 35
    diamond_option = option_objects["Frame Type-Diamond"]
    
    rule2 = models.PriceRule(
        component_id=frame_finish_component.id,
        option_id=matte_option.id,
        dependent_component_id=frame_component.id,
        dependent_option_id=diamond_option.id,
        price=35,
        product_id=db_product.id
    )
    db.add(rule2)
    print(f"Created price rule: Frame Finish/Matte + Frame Type/Diamond -> 35")
    
    # Frame Finish/Matte + Frame Type/Step-through -> 40
    step_through_option = option_objects["Frame Type-Step-through"]
    
    rule3 = models.PriceRule(
        component_id=frame_finish_component.id,
        option_id=matte_option.id,
        dependent_component_id=frame_component.id,
        dependent_option_id=step_through_option.id,
        price=40,
        product_id=db_product.id
    )
    db.add(rule3)
    print(f"Created price rule: Frame Finish/Matte + Frame Type/Step-through -> 40")

    # Create inventory records for each option
    print("Creating inventory records...")
    for option_key, option in option_objects.items():
        # Determine stock status based on quantity
        stock_status = StockStatusEnum.OUT_OF_STOCK
        if option.stock_quantity > 10:
            stock_status = StockStatusEnum.IN_STOCK
        elif option.stock_quantity > 0:
            stock_status = StockStatusEnum.LIMITED_STOCK
        
        # Set low stock threshold based on component type
        low_stock_threshold = 5  # Default
        component_type = option_key.split('-')[0]
        if component_type in ["Frame Type", "Wheels"]:
            low_stock_threshold = 3  # Premium components have lower threshold
        elif component_type in ["Rim Color", "Chain"]:
            low_stock_threshold = 7  # Common components have higher threshold
        
        db_inventory = models.Inventory(
            option_id=option.id,
            quantity=option.stock_quantity,
            stock_status=stock_status,
            low_stock_threshold=low_stock_threshold
        )
        db.add(db_inventory)
        print(f"Created inventory record for: {option_key}")

    # Create a sample order for testing the admin panel
    print("Creating sample order...")
    sample_order = models.Order(
        customer_name="Jane Smith",
        customer_email="jane.smith@example.com",
        shipping_address="123 Mountain Bike Lane\nTrail City, CA 94123",
        total_amount=680.00,
        created_at=datetime.datetime.utcnow() - datetime.timedelta(days=2),
        updated_at=datetime.datetime.utcnow() - datetime.timedelta(days=1),
        status=OrderStatusEnum.PROCESSING,
        product_categories="bicycle",
        order_details={
            "products": [
                {
                    "id": "custom-bike",
                    "name": "Custom Mountain Bike",
                    "category": "bicycle",
                    "quantity": 1,
                    "price": 680.00,
                    "configuration": {
                        "Frame Type": "Full-suspension",
                        "Frame Finish": "Matte",
                        "Wheels": "Mountain Wheels",
                        "Rim Color": "Black",
                        "Chain": "Twelve-speed Chain",
                        "Saddle": "Sport Saddle"
                    }
                }
            ],
            "shipping_method": "standard",
            "payment_method": "credit_card"
        }
    )
    db.add(sample_order)
    print("Created sample order 1")

    # Create a second sample order with a different status
    print("Creating additional sample orders...")
    sample_order2 = models.Order(
        customer_name="Michael Johnson",
        customer_email="mike.j@example.com",
        shipping_address="456 Valley Road\nBiker's Paradise, OR 97001",
        total_amount=520.00,
        created_at=datetime.datetime.utcnow() - datetime.timedelta(days=5),
        updated_at=datetime.datetime.utcnow() - datetime.timedelta(days=4),
        status=OrderStatusEnum.SHIPPED,
        product_categories="bicycle",
        order_details={
            "products": [
                {
                    "id": "custom-bike",
                    "name": "Custom Mountain Bike",
                    "category": "bicycle",
                    "quantity": 1,
                    "price": 520.00,
                    "configuration": {
                        "Frame Type": "Diamond",
                        "Frame Finish": "Shiny",
                        "Wheels": "Road Wheels",
                        "Rim Color": "Blue",
                        "Chain": "Single-speed Chain",
                        "Saddle": "Comfort Saddle"
                    }
                }
            ],
            "shipping_method": "express",
            "payment_method": "paypal"
        }
    )
    db.add(sample_order2)
    print("Created sample order 2")

    # Create a third sample order with pending status
    sample_order3 = models.Order(
        customer_name="Sarah Thompson",
        customer_email="sarah.t@example.com",
        shipping_address="789 Hillside Avenue\nMountain View, CA 94040",
        total_amount=610.00,
        created_at=datetime.datetime.utcnow() - datetime.timedelta(hours=6),
        updated_at=datetime.datetime.utcnow() - datetime.timedelta(hours=6),
        status=OrderStatusEnum.PENDING,
        product_categories="bicycle",
        order_details={
            "products": [
                {
                    "id": "custom-bike",
                    "name": "Custom Mountain Bike",
                    "category": "bicycle",
                    "quantity": 1,
                    "price": 610.00,
                    "configuration": {
                        "Frame Type": "Step-through",
                        "Frame Finish": "Matte",
                        "Wheels": "Fat Bike Wheels",
                        "Rim Color": "Black",
                        "Chain": "Twelve-speed Chain",
                        "Saddle": "Comfort Saddle"
                    }
                }
            ],
            "shipping_method": "standard",
            "payment_method": "credit_card"
        }
    )
    db.add(sample_order3)
    print("Created sample order 3")

    # Commit all changes
    db.commit()
    print("All data committed successfully!")

except Exception as e:
    db.rollback()
    print(f"Error during seed process: {e}")
    sys.exit(1)

print("Seed data added successfully!")
db.close() 