from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from Models.ZNO import ZNO as ZNOResponse
from Dtos.ZNO.CreateZNODto import CreateZNODto
from Repository.ZNORepository import ZNORepository
from Services.zno_service import ZNOService
from DataBase.base import get_db

router = APIRouter(prefix="/zno", tags=["zno"])

@router.post("/", response_model=ZNOResponse)
def create_zno(
    zno: CreateZNODto,
    db: Session = Depends(get_db)
):
    zno_repository = ZNORepository(db)
    zno_service = ZNOService(zno_repository)
    return zno_service.create_zno(zno)