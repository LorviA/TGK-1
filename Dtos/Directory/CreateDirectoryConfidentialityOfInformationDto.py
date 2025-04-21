from pydantic import BaseModel
from typing import Optional

class CreateDirectoryConfidentialityOfInformationDto(BaseModel):
    name: Optional[str] = None
    user_id: Optional[int] = None