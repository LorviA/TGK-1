from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session
from DataBase.base import get_db
from Services.zno_service import update_zno_payments_from_excel, update_smsps_from_excel

router = APIRouter()

@router.post("/upload-zno-payment/")
async def upload_zno_payment(file: UploadFile = File(...), db: Session = Depends(get_db)):
    updated = update_zno_payments_from_excel(file.file, db)
    return {"message": f"Обновлено заявок: {updated}"}

@router.post("/upload-smsps/")
async def upload_smsps(file: UploadFile = File(...), db: Session = Depends(get_db)):
    updated = update_smsps_from_excel(file.file, db)
    return {"message": f"Обновлено записей СМСП: {updated}"}