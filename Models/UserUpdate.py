from pydantic import BaseModel
from typing import Optional


class UserUpdate(BaseModel):
    user_name: Optional[str] = None
    password: Optional[str] = None
    email: Optional[str] = None
    rights: Optional[int] = None

    class Config:
        extra = "forbid"  # Запрещает передачу неизвестных полей