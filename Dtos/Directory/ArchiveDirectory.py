from pydantic import BaseModel

class ArchiveDirectoryDto(BaseModel):
    is_archived: bool