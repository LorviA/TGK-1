from Models import User
from Dtos.User import CreateUserDto

class User_mapper:
    @staticmethod
    def ToCreateUserRequestDto(createUser) -> User:
        newUser = CreateUserDto()
        newUser.user_name = createUser.user_name
        newUser.password = createUser.password
        newUser.email = createUser.email
        newUser.rights = createUser.rights
        return newUser
