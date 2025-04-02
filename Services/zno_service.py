from Interfaces.IZNORepository import IZNORepository
from Models.entities import ZNO
from Dtos.ZNO.CreateZNODto import CreateZNODto

class ZNOService:
    def __init__(self, zno_repository: IZNORepository):
        self.repository = zno_repository

    def create_zno(self, zno: CreateZNODto) -> ZNO:
        zno_data = zno.dict()
        db_zno = self.repository.create_zno(zno_data)
        return db_zno
