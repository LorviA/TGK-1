from pydantic import BaseModel
from typing import Optional
from datetime import date

class UpdateZNODto(BaseModel):
    st_smet: Optional[float] = None
    counterparty: Optional[str] = None
    is_mal_or_sred_bis: Optional[bool] = None
    confidentiality_of_information: Optional[int] = None
    id_case: Optional[str] = None
    date_payment_agreement: Optional[date] = None
    planned_payment_date: Optional[date] = None
    is_overdue: Optional[bool] = None
    summ: Optional[float] = None
    str_act: Optional[str] = None
    str_scf: Optional[str] = None
    str_bill: Optional[str] = None
    other_documents: Optional[str] = None
    comment: Optional[str] = None
    id_status: Optional[int] = None
    id_zno: Optional[str] = None
    payment_date: Optional[date] = None
    id_payment_order: Optional[str] = None
    id_user: Optional[int] = None
    create_data: Optional[date] = None
    id_oko: Optional[int] = None
