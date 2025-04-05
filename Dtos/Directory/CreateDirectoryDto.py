from pydantic import BaseModel

class CreateDirectoryDto(BaseModel):
    name: str
    value: str