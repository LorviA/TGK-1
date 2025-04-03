from abc import ABC, abstractmethod
from Models.entities import ZNO
from typing import List, Optional
class IZNORepository(ABC):
    @abstractmethod
    def create_zno(self, zno_data: dict) -> ZNO:
        pass

    @abstractmethod
    def get_zno(self, zno_id: int) -> Optional[ZNO]:
        pass

    @abstractmethod
    def get_all_zno(self) -> List[ZNO]:
        pass

    @abstractmethod
    def update_zno(self, zno_id: int, update_data: dict) -> Optional[ZNO]:
        pass

    @abstractmethod
    def delete_zno(self, zno_id: int) -> bool:
        pass