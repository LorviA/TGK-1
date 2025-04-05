from pydantic import BaseModel

class UpdateDirectoryDto(BaseModel):
    name: str
    value: str