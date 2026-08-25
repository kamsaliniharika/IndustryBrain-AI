from fastapi import FastAPI
from app.routers.upload import router as upload_router

app = FastAPI(
    title="IndustryBrain AI",
    description="AI-Powered Multi-Format Document Intelligence",
    version="1.0.0",
)


@app.get("/")
def root():
    return {
        "message": "IndustryBrain AI backend is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


app.include_router(upload_router)