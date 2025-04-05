from sqlalchemy.orm import Session
from typing import List
from Interfaces.IDirectoryRepository import IDirectoryRepository
from Models.entities import DirectoryDB
from typing import Optional


class DirectoryRepository(IDirectoryRepository):
    def __init__(self, db: Session):
        self.db = db

    def create_directory(self, directory_data: dict) -> DirectoryDB:
        new_directory = DirectoryDB(**directory_data)
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
        if  not directory:
            return None
        for field, value in update_data.items():
            if hasattr(directory, field):
                setattr(directory, field, value)

        self.db.commit()
        self.db.refresh(directory)
        return directory

    def delete_directory(self, directory_id: int) -> bool:
        directory = self.db.query(DirectoryDB).filter(DirectoryDB.id == directory_id).first()
        if directory:
            self.db.delete(directory)
            self.db.commit()
            return True
        return False