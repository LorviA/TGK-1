from Interfaces.IZNORepository import IZNORepository
from sqlalchemy.orm import Query
from Models.entities import ZNO
from sqlalchemy.orm import Session
from Dtos.ZNO.CreateZNODto import CreateZNODto
from Dtos.ZNO.FilterZNODto import FilterZNODto
from typing import Optional, List
import pandas as pd

class ZNOService:
    def __init__(self, zno_repository: IZNORepository):
        self.repository = zno_repository

    def get_base_query(self) -> Query:
        return self.repository.get_base_query()

    def create_zno(self, zno: CreateZNODto) -> ZNO:
        zno_data = zno.dict()
        return self.repository.create_zno(zno_data)

    def get_zno(self, zno_id: int) -> Optional[ZNO]:
        return self.repository.get_zno(zno_id)

    def get_all_zno(self) -> List[ZNO]:
        return self.repository.get_all_zno()

    def update_zno(self, zno_id: int, update_data: dict) -> ZNO:
        return self.repository.update_zno(zno_id, update_data)

    def delete_zno(self, zno_id: int) -> bool:
        return self.repository.delete_zno(zno_id)

    def apply_sorting(self, query: Query, sort_by: str, sort_order: str = 'desc') -> List[ZNO]:
        return self.repository.apply_sorting(query, sort_by, sort_order)

    def get_filtered_zno(self, filters: dict) -> List[ZNO]:
        return self.repository.get_filtered_zno(filters)

def update_zno_payments_from_excel(file, db: Session) -> dict:

    df = pd.read_excel(file)
    updated = []

    for _, row in df.iterrows():
        id_zno = str(row.get("N Заявки")).strip()
        payment_date = row.get("Дата документа П/П(ПУР)")
        payment_number = row.get("Номер П/П (ПУР)")
        status_code = row.get("Статус")

        if not id_zno or pd.isna(payment_date) or pd.isna(payment_number):
            continue

        zno = db.query(ZNO).filter(ZNO.id_zno == id_zno).first()
        if zno:
            zno.payment_date = pd.to_datetime(payment_date).date()
            zno.id_payment_order = str(payment_number)
            if not pd.isna(status_code):
                zno.id_status = int(status_code)
            updated.append(id_zno)

    db.commit()
    return {
        "message": f"Обновлено заявок: {len(updated)}",
        "заявки": updated
    }


def update_smsps_from_excel(file, db: Session) -> dict:
    df = pd.read_excel(file)
    updated = []
    for _, row in df.iterrows():
        id_case = str(row.get("ИД. случая")).strip()
        smsp_flag = str(row.get("Отнесение контрагента к СМСП")).strip().lower()

        if not id_case or smsp_flag not in ["да", "нет"]:
            continue

        zno = db.query(ZNO).filter(ZNO.id_case == id_case).first()
        if zno:
            zno.is_mal_or_sred_bis = smsp_flag == "да"
            updated.append(id_case)
    db.commit()
    return {"message": f"Обновлено СМСП статусов: {len(updated)}", "случаи": updated}