from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List
from datetime import timedelta

import models, schemas, crud, auth
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Inventory & Order Management API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/register", response_model=schemas.UserResponse)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    hashed_password = auth.get_password_hash(user.password)
    new_user = models.User(username=user.username, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/token", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# Products
@app.post("/products", response_model=schemas.Product)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return crud.create_product(db=db, product=product, user_id=current_user.id)

@app.get("/products", response_model=List[schemas.Product])
def read_products(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return crud.get_products(db, user_id=current_user.id, skip=skip, limit=limit)

@app.get("/products/{id}", response_model=schemas.Product)
def read_product(id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_product = crud.get_product(db, product_id=id, user_id=current_user.id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@app.put("/products/{id}", response_model=schemas.Product)
def update_product(id: int, product: schemas.ProductUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_product = crud.update_product(db, product_id=id, product_update=product, user_id=current_user.id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@app.delete("/products/{id}")
def delete_product(id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_product = crud.delete_product(db, product_id=id, user_id=current_user.id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}

# Customers
@app.post("/customers", response_model=schemas.Customer)
def create_customer(customer: schemas.CustomerCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return crud.create_customer(db=db, customer=customer, user_id=current_user.id)

@app.get("/customers", response_model=List[schemas.Customer])
def read_customers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return crud.get_customers(db, user_id=current_user.id, skip=skip, limit=limit)

@app.get("/customers/{id}", response_model=schemas.Customer)
def read_customer(id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_customer = crud.get_customer(db, customer_id=id, user_id=current_user.id)
    if db_customer is None:
        raise HTTPException(status_code=404, detail="Customer not found")
    return db_customer

@app.delete("/customers/{id}")
def delete_customer(id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_customer = crud.delete_customer(db, customer_id=id, user_id=current_user.id)
    if db_customer is None:
        raise HTTPException(status_code=404, detail="Customer not found")
    return {"message": "Customer deleted successfully"}

# Orders
@app.post("/orders", response_model=schemas.Order)
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return crud.create_order(db=db, order=order, user_id=current_user.id)

@app.get("/orders", response_model=List[schemas.Order])
def read_orders(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return crud.get_orders(db, user_id=current_user.id, skip=skip, limit=limit)

@app.get("/orders/{id}", response_model=schemas.Order)
def read_order(id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_order = crud.get_order(db, order_id=id, user_id=current_user.id)
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return db_order

@app.delete("/orders/{id}")
def delete_order(id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_order = crud.delete_order(db, order_id=id, user_id=current_user.id)
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"message": "Order canceled successfully"}
