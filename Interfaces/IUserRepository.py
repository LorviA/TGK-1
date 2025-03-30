from abc import ABC, abstractmethod
from Models.User import User

class IUserRepository(ABC):
    @abstractmethod
    def get_user(self, user_id: int) -> User:
        pass

    @abstractmethod
    def create_user(self, user_data: dict) -> User:
        pass