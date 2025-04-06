import json
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from Interfaces.IDirectoryRepository import IDirectoryRepository
from Models.entities import DirectoryDB


class DirectoryRepository(IDirectoryRepository):
    def __init__(self, db: Session):
        self.db = db

    def create_directory(self, directory_data: dict) -> DirectoryDB:
        if 'value' in directory_data and isinstance(directory_data['value'], (dict, list)):
            directory_data['value'] = json.dumps(directory_data['value'])

        new_directory = DirectoryDB(**directory_data)
        self.db.add(new_directory)
        self.db.commit()
        self.db.refresh(new_directory)
        return new_directory

    def get_directory(self, directory_id: int) -> Optional[DirectoryDB]:
        directory = self.db.query(DirectoryDB).filter(DirectoryDB.id == directory_id).first()
        if directory and directory.value:
            directory.value = self._safe_json_loads(directory.value)
        return directory

    def get_all_directories(self) -> List[DirectoryDB]:
        directories = self.db.query(DirectoryDB).all()
        for directory in directories:
            if directory.value:
                directory.value = self._safe_json_loads(directory.value)
        return directories

    def update_directory(self, directory_id: int, update_data: dict) -> Optional[DirectoryDB]:
        directory = self.db.query(DirectoryDB).filter(DirectoryDB.id == directory_id).first()
        if not directory:
            return None

        if 'value' in update_data:
            value = update_data['value']
            if value is None:
                update_data['value'] = None
            else:
                if not isinstance(value, list):
                    value = [str(value)]
                update_data['value'] = json.dumps(value, ensure_ascii=False)

        for field, value in update_data.items():
            if hasattr(directory, field) and field != 'id':
                setattr(directory, field, value)

        self.db.commit()
        self.db.refresh(directory)

        if directory.value:
            try:
                directory.value = json.loads(directory.value)
            except json.JSONDecodeError:
                directory.value = [directory.value]  # На случай если не JSON

        return directory

    def delete_directory(self, directory_id: int) -> bool:
        directory = self.db.query(DirectoryDB).filter(DirectoryDB.id == directory_id).first()
        if directory:
            self.db.delete(directory)
            self.db.commit()
            return True
        return False

    def _safe_json_loads(self, value: str) -> Any:
        try:
            return json.loads(value)
        except (json.JSONDecodeError, TypeError):
            return value  # Возвращаем оригинальное значение если не JSON