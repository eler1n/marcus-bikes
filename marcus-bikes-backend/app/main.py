from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.product_routes import router as product_router
from app.routes.option_routes import router as option_router
from app.routes.order_routes import router as order_router
from app.routes.inventory_routes import router as inventory_router
from app.routes.admin_routes import router as admin_router
from app.routes.price_rule_routes import router as price_rule_router
from app.database.session import engine
from app.models.base import Base

# Create the database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Marcus Bikes Backend API", version="0.1.0")

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development - should be restricted in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(product_router)
app.include_router(option_router)
app.include_router(order_router)
app.include_router(inventory_router)
app.include_router(admin_router)
app.include_router(price_rule_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Marcus Bikes Backend API"}

@app.get("/health")
def health_check():
    return {"status": "ok"} 