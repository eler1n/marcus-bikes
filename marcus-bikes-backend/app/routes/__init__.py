from app.routes.product_routes import router as product_router
from app.routes.option_routes import router as option_router
from app.routes.order_routes import router as order_router
from app.routes.inventory_routes import router as inventory_router
from app.routes.admin_routes import router as admin_router
from app.routes.price_rule_routes import router as price_rule_router

__all__ = ["product_router", "option_router", "order_router", "inventory_router", "admin_router", "price_rule_router"] 