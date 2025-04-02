from abc import ABC, abstractmethod
from Models.entities import ZNO

class IZNORepository(ABC):
    @abstractmethod
    def create_zno(self, zno_data: dict) -> ZNO:
        pass

    