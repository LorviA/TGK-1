from sqlalchemy.orm import Session
from typing import List
from DataBase.base import get_db
from Interfaces.IUserRepository import IUserRepository
from Models.entities import User
from typing import Optional
from typing import Tuple

class UserRepository(IUserRepository):
    def __init__(self, db: Session):
        self.db = db

    def get_user(self, user_id: int) -> User:
        return self.db.query(User).filter(User.id == user_id).first()

    def create_user(self, user_data: dict) -> User:
        user = User(**user_data)
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def get_all_users(self) -> List[User]:
        """Получить всех пользователей из БД"""
        return self.db.query(User).all()  # SQL: SELECT * FROM users;
