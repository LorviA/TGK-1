from fastapi import FastAPI
from Contollers.DirectoryControllers.directory_ConfOfInform_controller import router as directory_router
from Contollers.DirectoryControllers.directory_StSmet_controller import router as directory_StSmet_router
from Contollers.user_controller import router as user_router
from Contollers.zno_controller import router as zno_router
from DataBase.base import Base, engine
from Contollers.zno_upload_controller import router as zno_upload
Base.metadata.create_all(bind=engine)

app = FastAPI()
app.include_router(user_router)
app.include_router(zno_router)
app.include_router(directory_router)
app.include_router(directory_StSmet_router)
app.include_router(zno_upload, prefix="/zno", tags=["ЗНО"])

@app.get("/")
def home():
    return {"message": "MVC with FastAPI"}