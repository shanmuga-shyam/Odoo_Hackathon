from fastapi import FastAPI
from app.database import Base, engine
from app.routes import auth, issues

Base.metadata.create_all(bind=engine)

app = FastAPI()
app.include_router(auth.router, prefix="/api", tags=["Auth"])
app.include_router(issues.router, prefix="/api", tags=["Issues"])
