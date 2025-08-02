from sqlalchemy import Column, Integer, String, Float, Enum, ForeignKey, DateTime
from app.database import Base
from datetime import datetime
import enum

class IssueStatus(str, enum.Enum):
    open = "Open"
    in_progress = "In Progress"
    resolved = "Resolved"

class Issue(Base):
    __tablename__ = "issues"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    category = Column(String)
    image_url = Column(String)
    status = Column(Enum(IssueStatus), default=IssueStatus.open)
    latitude = Column(Float)
    longitude = Column(Float)
    address = Column(String)
    reported_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
