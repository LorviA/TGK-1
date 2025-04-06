from fastapi import FastAPI
from Contollers.directory_controller import router as directory_router
from Contollers.user_controller import router as user_router
from Contollers.zno_controller import router as zno_router
from DataBase.base import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI()
app.include_router(user_router)
app.include_router(zno_router)
app.include_router(directory_router)

@app.get("/")
def home():
    return {"message": "MVC with FastAPI"}