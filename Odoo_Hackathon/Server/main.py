from fastapi import FastAPI
from app.database import Base, engine
from app.routes import auth, issues

Base.metadata.create_all(bind=engine)
app = FastAPI()
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or restrict to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



app.include_router(auth.router, prefix="/api", tags=["Auth"])
app.include_router(issues.router, prefix="/api", tags=["Issues"])
