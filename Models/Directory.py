from pydantic import BaseModel

class Directory(BaseModel):
    id: int
    name: str
    value: str

    class Config:
        from_attributes = True