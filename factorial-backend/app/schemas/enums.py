from enum import Enum

class CategoryEnum(str, Enum):
    BICYCLE = "bicycle"
    SKI = "ski"
    SURFBOARD = "surfboard"
    ROLLERSKATE = "rollerskate"

class DependencyTypeEnum(str, Enum):
    REQUIRES = "requires"
    EXCLUDES = "excludes" 