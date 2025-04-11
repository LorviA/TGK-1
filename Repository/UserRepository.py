from sqlalchemy.orm import Session
from typing import List
from DataBase.base import get_db
from Interfaces.IUserRepository import IUserRepository
from Models.entities import User
from typing import Optional
from typing import Tuple
from fastapi import APIRouter, Query, Depends
from typing import Optional, Dict
from sqlalchemy import asc, desc

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

    def update_user(
            self,
            user_id: int,
            update_data: dict
    ) -> Optional[User]:

            # Находим пользователя
            user = self.db.query(User).filter(User.id == user_id).first()
            if not user:
                return None

            # Обновляем только переданные поля
            for field, value in update_data.items():
                if hasattr(user, field):
                    setattr(user, field, value)

            self.db.commit()
            self.db.refresh(user)
            return user

    def get_user_by_username(self, user_name: str) -> Optional[User]:
        """
        Получает пользователя по логину

        Args:
            username: Логин пользователя

        Returns:
            User | None: Объект пользователя или None если не найден
        """
        return self.db.query(User) \
            .filter(User.user_name == user_name) \
            .first()