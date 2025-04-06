from Interfaces.IDirectoryRepository import IDirectoryRepository
from Models.entities import DirectoryDB
from Dtos.Directory.CreateDirectoryDto import CreateDirectoryDto
from typing import Optional, List

class DirectoryService:
    def __init__(self, directory_repository: IDirectoryRepository):
        self.repository = directory_repository

    def create_directory(self, directory_data: CreateDirectoryDto) ->DirectoryDB:
        dict_data = directory_data.dict()
        return self.repository.create_directory(dict_data)

    def get_directory(self, directory_id: int) -> Optional[DirectoryDB]:
        return self.repository.get_directory(directory_id)

    def get_all_directories(self) -> List[DirectoryDB]:
        return self.repository.get_all_directories()

    def update_directory(self, directory_id: int, update_data: dict) -> Optional[DirectoryDB]:
        return self.repository.update_directory(directory_id, update_data)

    def delete_directory(self, directory_id: int) -> bool:
        return self.repository.delete_directory(directory_id)