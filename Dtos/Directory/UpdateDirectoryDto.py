from pydantic import BaseModel
from typing import Optional

class UpdateDirectoryDto(BaseModel):
    name: Optional[str] = None
    value: Optional[str] = None