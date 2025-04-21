from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from Interfaces.DirectoryInterfaces.IDirectoryStSmetRepository import IDirectoryRepository
from Models.entities import StSmet, Logger
from datetime import date


class DirectoryRepository(IDirectoryRepository):
    def __init__(self, db: Session):
        self.db = db

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

    def get_all_directories(self) -> List[StSmet]:
        return self.db.query(StSmet).all()

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