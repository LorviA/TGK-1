from pydantic import BaseModel
from datetime import date
from typing import Optional
class ZNO(BaseModel):
    id: int
    st_smet: float
    counterparty: str
    is_mal_or_sred_bis: bool
    confidentiality_of_information: int
    id_case: str
    date_payment_agreement: date
    planned_payment_date: date
    is_overdue: bool
    summ: float
    str_act: str
    str_scf: str
    str_bill: str
    other_documents: str
    comment: str
    id_status: int
    id_zno: str
    payment_date: Optional[date]
    id_payment_order: Optional[str]
    id_user: int
    create_data: date
    id_oko: int

    class Config:
        from_attributes = True
