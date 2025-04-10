from Interfaces.IZNORepository import IZNORepository
from sqlalchemy.orm import Query
from Models.entities import ZNO
from Dtos.ZNO.CreateZNODto import CreateZNODto
from Dtos.ZNO.FilterZNODto import FilterZNODto
from typing import Optional, List

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
