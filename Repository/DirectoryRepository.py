from sqlalchemy.orm import Session
from Interfaces.IDirectoryRepository import IDirectoryRepository
from Models.entities import DirectoryDB
from typing import Optional
from typing import List


class DirectoryRepository(IDirectoryRepository):
    def __init__(self, db: Session):
        self.db = db

    def create_directory(self, directory_data: dict) -> DirectoryDB:
        new_directory = DirectoryDB(
            name=directory_data["name"],
            value=directory_data["value"]
        )
        self.db.add(new_directory)
        self.db.commit()
        self.db.refresh(new_directory)
        return new_directory

    def get_directory(self, directory_id: int) -> Optional[DirectoryDB]:
        return self.db.query(DirectoryDB).filter(DirectoryDB.id == directory_id).first()

    def get_all_directories(self) -> List[DirectoryDB]:
        return self.db.query(DirectoryDB).all()

    def update_directory(self, directory_id: int, update_data: dict) -> Optional[DirectoryDB]:
        directory = self.db.query(DirectoryDB).filter(DirectoryDB.id == directory_id).first()
        if directory:
            if "name" in update_data:
                directory.name = update_data["name"]
            if "value" in update_data:
                directory.value = update_data["value"]
            self.db.commit()
            self.db.refresh(directory)
        return directory

    def delete_directory(self, directory_id: int) -> bool:
        directory = self.db.query(DirectoryDB).filter(DirectoryDB.id == directory_id).first()
        if directory:
            self.db.delete(directory)
            self.db.commit()
            return True
