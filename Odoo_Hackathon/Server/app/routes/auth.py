from fastapi import APIRouter, Depends, HTTPException
from app.schemas.user import UserCreate, UserLogin
from app.models.user import User
from app.database import get_db
from sqlalchemy.orm import Session
from passlib.hash import bcrypt
from jose import jwt
from app.config import settings

router = APIRouter()

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed = bcrypt.hash(user.password)
    db_user = User(name=user.name, email=user.email, phone=user.phone, password=hashed)
    db.add(db_user)
    db.commit()
    return {"msg": "Registered"}

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not bcrypt.verify(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = jwt.encode({"sub": str(db_user.id)}, settings.JWT_SECRET_KEY, algorithm="HS256")
    print(token)
    return {"access_token": token}
