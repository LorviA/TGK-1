from fastapi import FastAPI
from Contollers.user_controller import router as user_router
from DataBase.base import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI()
app.include_router(user_router)

@app.get("/")
def home():
    return {"message": "MVC with FastAPI"}