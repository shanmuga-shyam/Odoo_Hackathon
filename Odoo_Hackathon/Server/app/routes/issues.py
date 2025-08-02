from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from app.schemas.issue import IssueCreate
from app.models.issue import Issue
from app.database import get_db
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from app.utils.s3_upload import upload_image_to_s3
from app.config import settings

router = APIRouter()

def get_user_id(token: str):
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=["HS256"])
        return int(payload.get("sub"))
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.post("/upload-image")
def upload_image(file: UploadFile = File(...)):
    url = upload_image_to_s3(file)
    print(url)
    return {"image_url": url}

@router.post("/issues")
def report_issue(issue: IssueCreate, db: Session = Depends(get_db), token: str = ""):
    user_id = get_user_id(token)
    new_issue = Issue(**issue.dict(), reported_by=user_id)
    db.add(new_issue)
    db.commit()
    return {"msg": "Issue reported"}

@router.get("/issues/list")
def list_issues(db: Session = Depends(get_db)):
    return db.query(Issue).all()
