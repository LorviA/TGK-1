from abc import ABC, abstractmethod
from Models.entities import ConfidentialityOfInformation
from typing import List, Optional
from datetime import date
class IDirectoryRepository(ABC):
    @abstractmethod
    def create_directory(self, directory_data: dict) -> ConfidentialityOfInformation:
        pass

    @abstractmethod
    def get_directory(self, directory_id: int) -> Optional[ConfidentialityOfInformation]:
        pass

    @abstractmethod
    def get_all_directories(self) -> List[ConfidentialityOfInformation]:
        pass

    @abstractmethod
    def update_directory(self, directory_id: int, update_data: dict) -> Optional[ConfidentialityOfInformation]:
        pass

    @abstractmethod
    def delete_directory(self, directory_id: int) -> bool:
        pass

    @abstractmethod
    def set_expiration_for_all(self, expiration_date: date) -> int:
        pass

    @abstractmethod
    def archive_expired(self) -> int:
        pass