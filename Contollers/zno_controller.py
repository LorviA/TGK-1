from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from Models.ZNO import ZNO as ZNOResponse
from Dtos.ZNO.CreateZNODto import CreateZNODto
from Repository.ZNORepository import ZNORepository
from Services.zno_service import ZNOService
from DataBase.base import get_db
from typing import List,Optional
from Models.entities import ZNO
from Dtos.ZNO.UpdateZNODto import UpdateZNODto
from datetime import date

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


def get_zno_service(db: Session = Depends(get_db)) -> ZNOService:
    return ZNOService(ZNORepository(db))

@router.get("/sorting/",response_model=List[ZNOResponse])
def apply_sorting(
    sort_by: Optional[str] = None,
    sort_order: Optional[str] = 'desc',
    service: ZNOService = Depends(get_zno_service)
):
    try:
        query = service.get_base_query()
        return service.apply_sorting(query, sort_by, sort_order)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.get("/filter/", response_model=List[ZNOResponse])
def get_filtered_zno(
    id: Optional[int] = None,
    st_smet: Optional[float] = None,
    counterparty: Optional[str] = None,
    is_mal_or_sred_bis: Optional[bool] = None,
    confidentiality_of_information: Optional[int] = None,
    id_case: Optional[str] = None,
    date_payment_agreement_from: Optional[date] = None,
    date_payment_agreement_to: Optional[date] = None,
    planned_payment_date_from: Optional[date] = None,
    planned_payment_date_to: Optional[date] = None,
    is_overdue: Optional[bool] = None,
    summ_min: Optional[float] = None,
    summ_max: Optional[float] = None,
    str_act: Optional[str] = None,
    str_scf: Optional[str] = None,
    str_bill: Optional[str] = None,
    other_documents: Optional[str] = None,
    comment: Optional[str] = None,
    id_status: Optional[int] = None,
    id_zno: Optional[str] = None,
    payment_date_from: Optional[date] = None,
    payment_date_to: Optional[date] = None,
    id_payment_order: Optional[str] = None,
    id_user: Optional[int] = None,
    create_data_from: Optional[date] = None,
    create_data_to: Optional[date] = None,
    id_oko: Optional[int] = None,
    service: ZNOService = Depends(get_zno_service)
):
    filters = {
        'id': id,
        'st_smet': st_smet,
        'counterparty': counterparty,
        'is_mal_or_sred_bis': is_mal_or_sred_bis,
        'confidentiality_of_information': confidentiality_of_information,
        'id_case': id_case,
        'date_payment_agreement_from': date_payment_agreement_from,
        'date_payment_agreement_to': date_payment_agreement_to,
        'planned_payment_date_from': planned_payment_date_from,
        'planned_payment_date_to': planned_payment_date_to,
        'is_overdue': is_overdue,
        'summ_min': summ_min,
        'summ_max': summ_max,
        'str_act': str_act,
        'str_scf': str_scf,
        'str_bill': str_bill,
        'other_documents': other_documents,
        'comment': comment,
        'id_status': id_status,
        'id_zno': id_zno,
        'payment_date_from': payment_date_from,
        'payment_date_to': payment_date_to,
        'id_payment_order': id_payment_order,
        'id_user': id_user,
        'create_data_from': create_data_from,
        'create_data_to': create_data_to,
        'id_oko': id_oko
    }
    return service.get_filtered_zno(filters)