from enum import Enum

class CategoryEnum(str, Enum):
    BICYCLE = "bicycle"
    SKI = "ski"
    SURFBOARD = "surfboard"
    ROLLERSKATE = "rollerskate"

class DependencyTypeEnum(str, Enum):
    REQUIRES = "requires"
    EXCLUDES = "excludes"
    
class OrderStatusEnum(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    COMPLETED = "completed"
    CANCELED = "canceled"

class StockStatusEnum(str, Enum):
    IN_STOCK = "in_stock"
    OUT_OF_STOCK = "out_of_stock"
    LIMITED_STOCK = "limited_stock" 