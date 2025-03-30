from pydantic import BaseModel

class CreateUserDto(BaseModel):
    user_name: str
    password: str
    email: str
    rights: int