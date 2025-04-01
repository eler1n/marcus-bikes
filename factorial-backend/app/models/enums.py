import enum

class CategoryEnum(str, enum.Enum):
    BICYCLE = "bicycle"
    SKI = "ski"
    SURFBOARD = "surfboard"
    ROLLERSKATE = "rollerskate"

class DependencyTypeEnum(str, enum.Enum):
    REQUIRES = "requires"
    EXCLUDES = "excludes" 