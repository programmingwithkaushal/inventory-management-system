from pydantic import BaseModel, ConfigDict
from typing import Optional, List

# Product Schemas
class ProductBase(BaseModel):
    name: str
    sku: str
    price: float
    quantity: int

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    sku: Optional[str] = None
    price: Optional[float] = None
    quantity: Optional[int] = None

class Product(ProductBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

# Customer Schemas
class CustomerBase(BaseModel):
    full_name: str
    email: str
    phone_number: str

class CustomerCreate(CustomerBase):
    pass

class Customer(CustomerBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

# Order Schemas
class OrderBase(BaseModel):
    customer_id: int
    product_id: int
    quantity: int

class OrderCreate(OrderBase):
    pass

class Order(OrderBase):
    id: int
    total_amount: float
    model_config = ConfigDict(from_attributes=True)
