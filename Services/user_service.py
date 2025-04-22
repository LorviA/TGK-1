from Interfaces.IUserRepository import IUserRepository
from Models.User import User
from Dtos.User.CreateUserDto import CreateUserDto
from Repository.UserRepository import UserRepository

class UserService:
    def __init__(self, user_repository: IUserRepository):
        self.repository = user_repository

    def create_user(self, user: CreateUserDto) -> User:
        user_data = user.dict()
        print(user_data)
        db_user = self.repository.create_user(user_data)
        return User(
            id=db_user.id,
            user_name=db_user.user_name,
            password=db_user.password,
            email=db_user.email,
            rights=db_user.rights,
            expiration_date=db_user.expiration_date
        )

    def get_user(self, user_id: int) -> User:
        db_user = self.repository.get_user(user_id)
        return User(**db_user.__dict__) if db_user else None
