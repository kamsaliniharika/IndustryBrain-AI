from fastapi import APIRouter, UploadFile, File, HTTPException
from pathlib import Path

from app.services.pdf_processor import extract_text_from_pdf


router = APIRouter(prefix="/upload", tags=["Upload"])

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@router.post("/")
async def upload_document(file: UploadFile = File(...)):

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No file selected"
        )

    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported currently"
        )

    file_path = UPLOAD_DIR / file.filename

    content = await file.read()

    with open(file_path, "wb") as buffer:
        buffer.write(content)

    try:
        text = extract_text_from_pdf(str(file_path))

        return {
            "message": "PDF uploaded and processed successfully",
            "filename": file.filename,
            "file_type": file.content_type,
            "characters_extracted": len(text),
            "text_preview": text[:500]
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"PDF processing failed: {str(error)}"
        )