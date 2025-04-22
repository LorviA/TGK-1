from pydantic import BaseModel
from typing import Optional
from datetime import date

class CreateUserDto(BaseModel):
    user_name: str
    password: str
    email: str
    rights: int
