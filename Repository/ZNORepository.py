from sqlalchemy.orm import Session
from Models.entities import ZNO
from Interfaces.IZNORepository import IZNORepository
from typing import List, Optional

class ZNORepository(IZNORepository):
    def __init__(self, db: Session):
        self.db = db

    def create_zno(self, zno_data: dict) -> ZNO:
        zno = ZNO(**zno_data)
        self.db.add(zno)
        self.db.commit()
        self.db.refresh(zno)
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
        return zno

    def delete_zno(self, zno_id: int) -> bool:
        zno = self.db.query(ZNO).filter(ZNO.id == zno_id).first()
        if not zno:
            return False

        self.db.delete(zno)
        self.db.commit()
        return True

