from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from Models.ZNO import ZNO as ZNOResponse
from Dtos.ZNO.CreateZNODto import CreateZNODto
from Repository.ZNORepository import ZNORepository
from Services.zno_service import ZNOService
from DataBase.base import get_db
from typing import List
from Models.entities import ZNO
from Dtos.ZNO.UpdateZNODto import UpdateZNODto

router = APIRouter(prefix="/zno", tags=["zno"])

@router.post("/", response_model=ZNOResponse)
def create_zno(
    zno: CreateZNODto,
    db: Session = Depends(get_db)
):
    zno_repository = ZNORepository(db)
    zno_service = ZNOService(zno_repository)
    return zno_service.create_zno(zno)

@router.get("/{zno_id}", response_model=ZNOResponse)
def read_zno(
    zno_id: int,
    db: Session = Depends(get_db)
):
    zno_repository = ZNORepository(db)
    zno_service = ZNOService(zno_repository)
    db_zno = zno_service.get_zno(zno_id)
    if not db_zno:
        raise HTTPException(status_code=404, detail="ZNO not found")
    return db_zno

@router.get("/", response_model=List[ZNOResponse])
def get_all_zno(
    db: Session = Depends(get_db)
):
    zno_repository = ZNORepository(db)
    zno_service = ZNOService(zno_repository)
    return zno_service.get_all_zno()

@router.patch("/{zno_id}", response_model=ZNOResponse)
def update_zno(
    zno_id: int,
    update_data: UpdateZNODto,
    db: Session = Depends(get_db)
):
    zno_repository = ZNORepository(db)
    zno_service = ZNOService(zno_repository)
    updated_zno = zno_service.update_zno(zno_id, update_data.dict(exclude_unset=True))

    if not updated_zno:
        raise HTTPException(status_code=404, detail="ZNO not found")

    return updated_zno

@router.delete("/{zno_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_zno(
    zno_id: int,
    db: Session = Depends(get_db)
):
    zno_repository = ZNORepository(db)
    zno_service = ZNOService(zno_repository)
    success = zno_service.delete_zno(zno_id)
    if not success:
        raise HTTPException(status_code=404, detail="ZNO not found")
    return None  # 204 No Content
