from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from Interfaces.DirectoryInterfaces.IDirectoryStSmetRepository import IDirectoryRepository
from Models.entities import StSmet, Logger
from datetime import date


class DirectoryRepository(IDirectoryRepository):
    def __init__(self, db: Session):
        self.db = db
        self.model = StSmet

    def create_directory(self, directory_data: dict) -> StSmet:
        user = directory_data.get("user_id")
        directory_data.pop("user_id")
        new_directory = StSmet(**directory_data)
        self.db.add(new_directory)
        self.db.commit()

        self.newLog(new_directory,user, 1)
        return new_directory

    def get_directory(self, directory_id: int) -> Optional[StSmet]:
        return self.db.query(StSmet).filter(StSmet.id == directory_id).first()

    def get_all_directories(self, include_archived: bool = False) -> List[StSmet]:
        query = self.db.query(StSmet)  # Указываем конкретную модель
        if not include_archived:
            query = query.filter_by(is_archived=False)
        return query.all()

    def update_directory(self, directory_id: int, update_data: dict) -> Optional[StSmet]:
        user = update_data.get("user_id")
        update_data.pop("user_id")
        directory = self.get_directory(directory_id)
        if not directory:
            return None

        for key, value in update_data.items():
            if hasattr(directory, key):
                setattr(directory, key, value)

        self.db.commit()
        self.db.refresh(directory)

        self.newLog(directory, user, 2)
        return directory

    def delete_directory(self, directory_id: int) -> bool:
        directory = self.get_directory(directory_id)
        if not directory:
            return False

        self.db.delete(directory)
        self.db.commit()
        return True

    def newLog(self, st: StSmet, user_id:int, numer: int):

        logger = Logger()
        logger.user_id = user_id
        if(numer == 1):
            logger.message = "Создал смету номер " + str(st.id)
            logger.date_change = date.today()
            self.db.add(logger)
            self.db.commit()
            self.db.refresh(logger)

        if(numer == 2):
            logger.message = "Изменил смету номер " + str(st.id)
            logger.date_change = date.today()
            self.db.add(logger)
            self.db.commit()
            self.db.refresh(logger)

        if (numer == 3):
            logger.message = "Удалил смету номер " + str(st.id)
            logger.date_change = date.today()
            self.db.add(logger)
            self.db.commit()
            self.db.refresh(logger)
        return

    def archive_directory(self, directory_id: int, is_archived: bool) -> Optional[StSmet]:
        directory = self.get_directory(directory_id)
        if not directory:
            return None

        directory.is_archived = is_archived
        self.db.commit()
        self.db.refresh(directory)
        return directory

    def set_expiration_for_all(self, expiration_date: date):
        directories = self.db.query(self.model).all()
        for directory in directories:
            directory.expiration_date = expiration_date
        self.db.commit()
        return len(directories)

    def archive_expired(self) -> int:
        today = date.today()
        # Ищем неархивированные записи с прошедшей датой
        directories = self.db.query(self.model).filter(
            self.model.expiration_date <= today,
            self.model.is_archived == False
        ).all()

        for directory in directories:
            directory.is_archived = True

        self.db.commit()
        return len(directories)

    def get_archived_directories(self):
        return self.db.query(self.model).filter(
            self.model.is_archived == True
        ).all()