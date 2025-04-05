from abc import ABC, abstractmethod
from typing import List, Optional
from Models.entities import DirectoryDB

class IDirectoryRepository(ABC):
    @abstractmethod
    def create_directory(self, directory_data: dict) -> DirectoryDB:
        pass

    @abstractmethod
    def get_directory(self, directory_id: int) -> Optional[DirectoryDB]:
        pass

    @abstractmethod
    def get_all_directories(self) -> List[DirectoryDB]:
        pass

    @abstractmethod
    def update_directory(self, directory_id: int, update_data: dict) -> Optional[DirectoryDB]:
        pass

    @abstractmethod
    def delete_directory(self, directory_id: int) -> bool:
        pass