import os
import sys
from sqlalchemy.orm import Session
from app.database.session import engine, SessionLocal
from app import models
from app.schemas import ProductCreate, ComponentCreate, OptionCreate, DependencyCreate, PriceRuleCreate, CategoryEnum, DependencyTypeEnum

# Create tables if they don't exist
models.Base.metadata.create_all(bind=engine)

# Create a session
db = SessionLocal()

# Check if products exist to avoid duplicates
existing_products = db.query(models.Product).count()
if existing_products > 0:
    print(f"Database already contains {existing_products} products. Skipping seed.")
    sys.exit(0)

# Define bicycle product
custom_bike = ProductCreate(
    id="custom-bike",
    name="Custom Mountain Bike",
    description="Build your dream bike with our customization options",
    category=CategoryEnum.BICYCLE,
    base_price=0,
    components=[
        ComponentCreate(
            component_id="frame",
            name="Frame Type",
            description="Choose your frame type based on your riding style",
            options=[
                OptionCreate(
                    option_id="full-suspension",
                    name="Full-suspension",
                    price=130,
                    in_stock=True
                ),
                OptionCreate(
                    option_id="diamond",
                    name="Diamond",
                    price=100,
                    in_stock=True
                ),
                OptionCreate(
                    option_id="step-through",
                    name="Step-through",
                    price=110,
                    in_stock=True
                ),
                OptionCreate(
                    option_id="carbon-fiber",
                    name="Carbon Fiber",
                    price=250,
                    in_stock=False
                )
            ]
        ),
        ComponentCreate(
            component_id="frame-finish",
            name="Frame Finish",
            description="Choose the finish for your frame",
            options=[
                OptionCreate(
                    option_id="matte",
                    name="Matte",
                    price=35,
                    in_stock=True
                ),
                OptionCreate(
                    option_id="shiny",
                    name="Shiny",
                    price=30,
                    in_stock=True
                )
            ]
        ),
        ComponentCreate(
            component_id="wheels",
            name="Wheels",
            description="Choose wheels based on your riding terrain",
            options=[
                OptionCreate(
                    option_id="road",
                    name="Road Wheels",
                    price=80,
                    in_stock=True
                ),
                OptionCreate(
                    option_id="mountain",
                    name="Mountain Wheels",
                    price=95,
                    in_stock=True
                ),
                OptionCreate(
                    option_id="fat-bike",
                    name="Fat Bike Wheels",
                    price=110,
                    in_stock=True
                ),
                OptionCreate(
                    option_id="carbon-racing",
                    name="Carbon Racing Wheels",
                    price=180,
                    in_stock=False
                )
            ]
        ),
        ComponentCreate(
            component_id="rim-color",
            name="Rim Color",
            description="Choose the color of your wheel rims",
            options=[
                OptionCreate(
                    option_id="red",
                    name="Red",
                    price=25,
                    in_stock=True
                ),
                OptionCreate(
                    option_id="black",
                    name="Black",
                    price=15,
                    in_stock=True
                ),
                OptionCreate(
                    option_id="blue",
                    name="Blue",
                    price=20,
                    in_stock=True
                )
            ]
        ),
        ComponentCreate(
            component_id="chain",
            name="Chain",
            description="Choose your chain type",
            options=[
                OptionCreate(
                    option_id="single-speed",
                    name="Single-speed Chain",
                    price=43,
                    in_stock=True
                ),
                OptionCreate(
                    option_id="eight-speed",
                    name="8-speed Chain",
                    price=55,
                    in_stock=False
                ),
                OptionCreate(
                    option_id="twelve-speed",
                    name="12-speed Chain",
                    price=75,
                    in_stock=True
                )
            ]
        ),
        ComponentCreate(
            component_id="saddle",
            name="Saddle",
            description="Choose your preferred saddle type",
            options=[
                OptionCreate(
                    option_id="comfort",
                    name="Comfort Saddle",
                    price=50,
                    in_stock=True
                ),
                OptionCreate(
                    option_id="sport",
                    name="Sport Saddle",
                    price=65,
                    in_stock=True
                ),
                OptionCreate(
                    option_id="professional",
                    name="Professional Racing Saddle",
                    price=120,
                    in_stock=False
                )
            ]
        )
    ],
    dependencies=[
        DependencyCreate(
            type=DependencyTypeEnum.REQUIRES,
            source_component_id="wheels",
            source_option_id="mountain",
            target_component_id="frame",
            target_option_id="full-suspension"
        ),
        DependencyCreate(
            type=DependencyTypeEnum.EXCLUDES,
            source_component_id="wheels",
            source_option_id="fat-bike",
            target_component_id="rim-color",
            target_option_id="red"
        )
    ],
    price_rules=[
        PriceRuleCreate(
            component_id="frame-finish",
            option_id="matte",
            dependent_component_id="frame",
            dependent_option_id="full-suspension",
            price=50
        ),
        PriceRuleCreate(
            component_id="frame-finish",
            option_id="matte",
            dependent_component_id="frame",
            dependent_option_id="diamond",
            price=35
        ),
        PriceRuleCreate(
            component_id="frame-finish",
            option_id="matte",
            dependent_component_id="frame",
            dependent_option_id="step-through",
            price=40
        )
    ]
)

# Create the product in the database
print("Creating bicycle product...")

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

# Add components
for component in custom_bike.components:
    db_component = models.Component(
        component_id=component.component_id,
        name=component.name,
        description=component.description,
        product_id=db_product.id
    )
    db.add(db_component)
    db.flush()
    
    # Add options for this component
    for option in component.options:
        db_option = models.Option(
            option_id=option.option_id,
            name=option.name,
            price=option.price,
            in_stock=option.in_stock,
            component_id=db_component.id
        )
        db.add(db_option)

# Add dependencies
for dependency in custom_bike.dependencies:
    db_dependency = models.Dependency(
        type=dependency.type,
        source_component_id=dependency.source_component_id,
        source_option_id=dependency.source_option_id,
        target_component_id=dependency.target_component_id,
        target_option_id=dependency.target_option_id,
        product_id=db_product.id
    )
    db.add(db_dependency)

# Add price rules
for price_rule in custom_bike.price_rules:
    db_price_rule = models.PriceRule(
        component_id=price_rule.component_id,
        option_id=price_rule.option_id,
        dependent_component_id=price_rule.dependent_component_id,
        dependent_option_id=price_rule.dependent_option_id,
        price=price_rule.price,
        product_id=db_product.id
    )
    db.add(db_price_rule)

# Commit all changes
db.commit()

print("Seed data added successfully!")
db.close() 