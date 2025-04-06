from pydantic import BaseModel
from typing import List

class CreateDirectoryDto(BaseModel):
    name: str
    value: List[str]