from pydantic import BaseModel
from typing import Optional

class IssueCreate(BaseModel):
    title: str
    description: str
    category: str
    latitude: float
    longitude: float
    address: str
    image_url: Optional[str] = None
