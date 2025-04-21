from sqlalchemy.orm import Session,Query
from sqlalchemy import asc, desc, cast, Numeric
from Models.entities import ZNO, Logger
from Interfaces.IZNORepository import IZNORepository
from typing import List, Optional
from datetime import date

class ZNORepository(IZNORepository):
    def __init__(self, db: Session):
        self.db = db

        self._sort_mapping = {
            'id': ZNO.id,
            'st_smet': cast(ZNO.st_smet, Numeric),
            'confidentiality_of_information': ZNO.confidentiality_of_information,
            'summ': ZNO.summ,
            'id_status': ZNO.id_status,
            'id_user': ZNO.id_user,
            'id_oko': ZNO.id_oko,

            'counterparty': ZNO.counterparty,
            'id_case': ZNO.id_case,
            'str_act': ZNO.str_act,
            'str_scf': ZNO.str_scf,
            'str_bill': ZNO.str_bill,
            'other_documents': ZNO.other_documents,
            'comment': ZNO.comment,
            'id_zno': ZNO.id_zno,
            'id_payment_order': ZNO.id_payment_order,

            'date_payment_agreement': ZNO.date_payment_agreement,
            'planned_payment_date': ZNO.planned_payment_date,
            'payment_date': ZNO.payment_date,
            'create_data': ZNO.create_data,

            'is_mal_or_sred_bis': ZNO.is_mal_or_sred_bis,
            'is_overdue': ZNO.is_overdue
        }

    def create_zno(self, zno_data: dict) -> ZNO:
        zno = ZNO(**zno_data)
        self.db.add(zno)
        self.db.commit()
        self.db.refresh(zno)

        self.newLog(zno, 1)
        return zno

    def get_zno(self, zno_id: int) -> Optional[ZNO]:
        return self.db.query(ZNO).filter(ZNO.id == zno_id).first()

    def get_all_zno(self) -> List[ZNO]:
        return self.db.query(ZNO).all()

    def update_zno(self, zno_id: int, update_data: dict) -> ZNO:
        zno = self.db.query(ZNO).filter(ZNO.id == zno_id).first()

        if not zno:
            return None

        for field, value in update_data.items():
            if hasattr(zno, field):
                setattr(zno, field, value)

        self.db.commit()
        self.db.refresh(zno)
        self.newLog(zno, 2)
        return zno

    def delete_zno(self, zno_id: int) -> bool:
        zno = self.db.query(ZNO).filter(ZNO.id == zno_id).first()
        if not zno:
            return False

        self.db.delete(zno)
        self.db.commit()
        self.newLog(zno, 3)
        return True

    def get_base_query(self) -> Query:
        return self.db.query(ZNO)

    def apply_sorting(self, query: Query, sort_by: str, sort_order: str = 'desc') -> List[ZNO]:
        if not sort_by:
            return query.order_by(ZNO.planned_payment_date.desc()).all()

        if sort_by not in self._sort_mapping:
            available = ', '.join(self._sort_mapping.keys())
            raise ValueError(f"Invalid sort field: {sort_by}. Available: {available}")

        column = self._sort_mapping[sort_by]
        order_func = asc if sort_order.lower() == 'asc' else desc
        return query.order_by(order_func(column)).all()

    def get_filtered_zno(self, filters: dict) -> List[ZNO]:
        query = self.db.query(ZNO)

        if filters.get('id'):
            query = query.filter(ZNO.id == filters['id'])

        if filters.get('st_smet'):
            query = query.filter(ZNO.st_smet == filters['st_smet'])

        if filters.get('confidentiality_of_information'):
            query = query.filter(ZNO.confidentiality_of_information == filters['confidentiality_of_information'])

        if filters.get('id_status'):
            query = query.filter(ZNO.id_status == filters['id_status'])

        if filters.get('id_user'):
            query = query.filter(ZNO.id_user == filters['id_user'])

        if filters.get('id_oko'):
            query = query.filter(ZNO.id_oko == filters['id_oko'])

        if filters.get('counterparty'):
            query = query.filter(ZNO.counterparty.ilike(f"%{filters['counterparty']}%"))

        if filters.get('id_case'):
            query = query.filter(ZNO.id_case.ilike(f"%{filters['id_case']}%"))

        if filters.get('str_act'):
            query = query.filter(ZNO.str_act.ilike(f"%{filters['str_act']}%"))

        if filters.get('str_scf'):
            query = query.filter(ZNO.str_scf.ilike(f"%{filters['str_scf']}%"))

        if filters.get('str_bill'):
            query = query.filter(ZNO.str_bill.ilike(f"%{filters['str_bill']}%"))

        if filters.get('other_documents'):
            query = query.filter(ZNO.other_documents.ilike(f"%{filters['other_documents']}%"))

        if filters.get('comment'):
            query = query.filter(ZNO.comment.ilike(f"%{filters['comment']}%"))

        if filters.get('id_zno'):
            query = query.filter(ZNO.id_zno.ilike(f"%{filters['id_zno']}%"))

        if filters.get('id_payment_order'):
            query = query.filter(ZNO.id_payment_order.ilike(f"%{filters['id_payment_order']}%"))

        if filters.get('date_payment_agreement_from'):
            query = query.filter(ZNO.date_payment_agreement >= filters['date_payment_agreement_from'])

        if filters.get('date_payment_agreement_to'):
            query = query.filter(ZNO.date_payment_agreement <= filters['date_payment_agreement_to'])

        if filters.get('planned_payment_date_from'):
            query = query.filter(ZNO.planned_payment_date >= filters['planned_payment_date_from'])

        if filters.get('planned_payment_date_to'):
            query = query.filter(ZNO.planned_payment_date <= filters['planned_payment_date_to'])

        if filters.get('payment_date_from'):
            query = query.filter(ZNO.payment_date >= filters['payment_date_from'])

        if filters.get('payment_date_to'):
            query = query.filter(ZNO.payment_date <= filters['payment_date_to'])

        if filters.get('create_data_from'):
            query = query.filter(ZNO.create_data >= filters['create_data_from'])

        if filters.get('create_data_to'):
            query = query.filter(ZNO.create_data <= filters['create_data_to'])

        if filters.get('is_mal_or_sred_bis') is not None:
            query = query.filter(ZNO.is_mal_or_sred_bis == filters['is_mal_or_sred_bis'])

        if filters.get('is_overdue') is not None:
            query = query.filter(ZNO.is_overdue == filters['is_overdue'])

        if filters.get('summ_min'):
            query = query.filter(ZNO.summ >= filters['summ_min'])

        if filters.get('summ_max'):
            query = query.filter(ZNO.summ <= filters['summ_max'])

        return query.order_by(ZNO.planned_payment_date.desc()).all()


    def newLog(self, zno: ZNO, numer: int):

        logger = Logger()
        logger.user_id = zno.id_user
        if(numer == 1):
            logger.message = "Создал ЗНО номер " + str(zno.id)
            logger.date_change = date.today()
            self.db.add(logger)
            self.db.commit()
            self.db.refresh(logger)

        if(numer == 2):
            logger.message = "Изменил ЗНО номер " + str(zno.id)
            logger.date_change = date.today()
            self.db.add(logger)
            self.db.commit()
            self.db.refresh(logger)

        if (numer == 3):
            logger.message = "Удалил ЗНО номер " + str(zno.id)
            logger.date_change = date.today()
            self.db.add(logger)
            self.db.commit()
            self.db.refresh(logger)
        return
