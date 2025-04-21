from pydantic import BaseModel
from typing import Optional
from datetime import date
class User(BaseModel):
    id: int
    user_name: str
    password: str
    email: str
    rights: int
    expiration_date: Optional[date] = None
