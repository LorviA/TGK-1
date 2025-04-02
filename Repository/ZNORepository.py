from sqlalchemy.orm import Session
from Models.entities import ZNO
from Interfaces.IZNORepository import IZNORepository

class ZNORepository(IZNORepository):
    def __init__(self, db: Session):
        self.db = db

    def create_zno(self, zno_data: dict) -> ZNO:
        zno = ZNO(**zno_data)
        self.db.add(zno)
        self.db.commit()
        self.db.refresh(zno)
        return zno

    def get_zno(self, zno_id: int) -> ZNO:
        return self.db.query(ZNO).filter(ZNO.id == zno_id).first()