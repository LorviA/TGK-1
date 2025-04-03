from pydantic import BaseModel

class User(BaseModel):
    id: int
    user_name: str
    password: str
    email: str
    rights: int

