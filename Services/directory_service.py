from Interfaces.IDirectoryRepository import IDirectoryRepository
from Models.entities import DirectoryDB
from Dtos.Directory.CreateDirectoryDto import CreateDirectoryDto
from Dtos.Directory.UpdateDirectoryDto import UpdateDirectoryDto

class DirectoryService:
    def __init__(self, directory_repository: IDirectoryRepository):
        self.repository = directory_repository

    def create_directory(self, directory: CreateDirectoryDto) -> DirectoryDB:
        directory_data = directory.dict()
        print(f"Creating directory with data: {directory_data}")
        db_directory = self.repository.create_directory(directory_data)
        return DirectoryDB(**db_directory.__dict__)

    def get_directory(self, directory_id: int) -> DirectoryDB:
        db_directory = self.repository.get_directory(directory_id)
        return DirectoryDB(**db_directory.__dict__) if db_directory else None

    def get_all_directories(self) -> list[DirectoryDB]:
        db_directories = self.repository.get_all_directories()
        return [DirectoryDB(**d.__dict__) for d in db_directories]

    def update_directory(self, directory_id: int, update_data: UpdateDirectoryDto) -> DirectoryDB:
        update_dict = update_data.dict(exclude_unset=True)
        print(f"Updating directory {directory_id} with data: {update_dict}")
        db_directory = self.repository.update_directory(directory_id, update_dict)
        return DirectoryDB(**db_directory.__dict__) if db_directory else None

    def delete_directory(self, directory_id: int) -> bool:
        return self.repository.delete_directory(directory_id)