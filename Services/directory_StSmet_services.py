from Interfaces.DirectoryInterfaces.IDirectoryStSmetRepository import IDirectoryRepository
from Models.entities import StSmet
from Dtos.Directory.CreateDirectoryStSmetDto import CreateDirectoryStSmetDto
from Dtos.Directory.UpdateDirectoryStSmetDto import UpdateDirectoryStSmetDto
from typing import Optional, List

class DirectoryService:
    def __init__(self, directory_repository: IDirectoryRepository):
        self.repository = directory_repository

    def create_directory(self, dto: CreateDirectoryStSmetDto) -> StSmet:
        data = dto.dict()
        return self.repository.create_directory(data)

    def get_directory(self, directory_id: int) -> Optional[StSmet]:
        return self.repository.get_directory(directory_id)

    def get_all_directories(self) -> List[StSmet]:
        return self.repository.get_all_directories()

    def update_directory(self, directory_id: int, update_dto: UpdateDirectoryStSmetDto) -> Optional[StSmet]:
        return self.repository.update_directory(directory_id, update_dto.dict(exclude_unset=True))

    def delete_directory(self, directory_id: int) -> bool:
        return self.repository.delete_directory(directory_id)