from Interfaces.IZNORepository import IZNORepository
from Models.entities import ZNO
from Dtos.ZNO.CreateZNODto import CreateZNODto
from typing import Optional, List

class ZNOService:
    def __init__(self, zno_repository: IZNORepository):
        self.repository = zno_repository

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
