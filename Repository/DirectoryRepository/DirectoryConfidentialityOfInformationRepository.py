from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from Interfaces.DirectoryInterfaces.IDirectoryConfidentialityOfInformationRepository import IDirectoryRepository
from Models.entities import ConfidentialityOfInformation


class DirectoryRepository(IDirectoryRepository):
    def __init__(self, db: Session):
        self.db = db

    def create_directory(self, directory_data: dict) -> ConfidentialityOfInformation:
        new_directory = ConfidentialityOfInformation(**directory_data)
        self.db.add(new_directory)
        self.db.commit()
        return new_directory

    def get_directory(self, directory_id: int) -> Optional[ConfidentialityOfInformation]:
        return self.db.query(ConfidentialityOfInformation).filter(ConfidentialityOfInformation.id == directory_id).first()

    def get_all_directories(self) -> List[ConfidentialityOfInformation]:
        return self.db.query(ConfidentialityOfInformation).all()

    def get_directories_by_type(self, directory_type: str) -> List[ConfidentialityOfInformation]:
        return self.db.query(ConfidentialityOfInformation) .filter(ConfidentialityOfInformation.directory_type == directory_type) .all()

    def update_directory(self, directory_id: int, update_data: dict) -> Optional[ConfidentialityOfInformation]:
        directory = self.get_directory(directory_id)
        if not directory:
            return None

        for key, value in update_data.items():
            if hasattr(directory, key):
                setattr(directory, key, value)

        self.db.commit()
        self.db.refresh(directory)
        return directory

    def delete_directory(self, directory_id: int) -> bool:
        directory = self.get_directory(directory_id)
        if not directory:
            return False

        self.db.delete(directory)
        self.db.commit()
        return True