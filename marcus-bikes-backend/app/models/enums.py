import enum

class CategoryEnum(str, enum.Enum):
    BICYCLE = "bicycle"
    SKI = "ski"
    SURFBOARD = "surfboard"
    ROLLERSKATE = "rollerskate"

class DependencyTypeEnum(str, enum.Enum):
    REQUIRES = "requires"
    EXCLUDES = "excludes"
    
class OrderStatusEnum(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    COMPLETED = "completed"
    CANCELED = "canceled"

class StockStatusEnum(str, enum.Enum):
    IN_STOCK = "in_stock"
    OUT_OF_STOCK = "out_of_stock"
    LIMITED_STOCK = "limited_stock" 