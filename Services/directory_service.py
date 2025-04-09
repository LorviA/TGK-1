from Interfaces.DirectoryInterfaces.IDirectoryConfidentialityOfInformationRepository import IDirectoryRepository
from Models.entities import ConfidentialityOfInformation
from Dtos.Directory.CreateDirectoryConfidentialityOfInformationDto import CreateDirectoryConfidentialityOfInformationDto
from Dtos.Directory.UpdateDirectoryConfidentialityOfInformationDto import UpdateDirectoryConfidentialityOfInformationDto
from typing import Optional, List

class DirectoryService:
    def __init__(self, directory_repository: IDirectoryRepository):
        self.repository = directory_repository

    def create_directory(self, dto: CreateDirectoryConfidentialityOfInformationDto) -> ConfidentialityOfInformation:
        data = dto.dict()
        return self.repository.create_directory(data)

    def get_directory(self, directory_id: int) -> Optional[ConfidentialityOfInformation]:
        return self.repository.get_directory(directory_id)

    def get_all_directories(self) -> List[ConfidentialityOfInformation]:
        return self.repository.get_all_directories()

    def update_directory(self, directory_id: int, update_dto: UpdateDirectoryConfidentialityOfInformationDto) -> Optional[ConfidentialityOfInformation]:
        return self.repository.update_directory(directory_id, update_dto.dict(exclude_unset=True))

    def delete_directory(self, directory_id: int) -> bool:
        return self.repository.delete_directory(directory_id)