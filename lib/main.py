"""
Acko Consultancy — FastAPI application (shared by local uvicorn and Vercel serverless).
"""

import logging

from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel, EmailStr, Field, field_validator
import re

from . import database, download_service, excel_generator
from .config import (
    ALL_RECORDS_XLSX,
    API_BASE_URL,
    COMPANY_NAME,
    CORS_ORIGINS,
    EMAIL,
    MOBILE_NUMBER,
    REPORTS_DIR,
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)


def _init_storage() -> None:
    """Ensure writable data directories exist (required on Vercel /tmp)."""
    database.ensure_csv_exists()
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup for local uvicorn (skipped on Vercel via Mangum lifespan=off)."""
    _init_storage()
    logger.info("API ready — %s", COMPANY_NAME)
    yield


app = FastAPI(
    title=f"{COMPANY_NAME} — Lead API",
    description="Form submissions, CSV storage, Excel reports, password-protected downloads.",
    version="5.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def ensure_storage_middleware(request: Request, call_next):
    """Lazy init when lifespan is disabled (Vercel serverless)."""
    _init_storage()
    return await call_next(request)


class SubmissionCreate(BaseModel):
    fullName: str = Field(..., min_length=2, max_length=100)
    whatsappNumber: str = Field(..., min_length=10, max_length=10)
    age: int = Field(..., ge=18, le=100)
    city: str = Field(..., min_length=2, max_length=100)
    state: str = Field(..., min_length=2, max_length=100)
    qualification: str = Field(..., min_length=1, max_length=50)
    occupation: str = Field(..., min_length=1, max_length=50)
    email: EmailStr
    experience: str = Field(..., min_length=1, max_length=50)
    role: str = Field(..., min_length=1, max_length=50)

    @field_validator("fullName", "city", "state")
    @classmethod
    def strip_and_validate_text(cls, v: str) -> str:
        cleaned = v.strip()
        if not cleaned:
            raise ValueError("Field cannot be empty")
        return cleaned

    @field_validator("whatsappNumber")
    @classmethod
    def validate_whatsapp(cls, v: str) -> str:
        digits = re.sub(r"\D", "", v)
        if len(digits) != 10 or not digits.isdigit():
            raise ValueError("WhatsApp number must be exactly 10 digits")
        return digits


class PasswordValidateRequest(BaseModel):
    password: str = Field(..., min_length=1, max_length=128)


@app.get("/api/info")
def api_info() -> dict:
    """Small info endpoint (keep `/` for the frontend UI)."""
    return {
        "company": COMPANY_NAME,
        "email": EMAIL,
        "mobile": MOBILE_NUMBER,
        "api_base_url": API_BASE_URL or "same-origin",
        "report_file": "all_records.xlsx",
        "status": "running",
    }


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/api/submit")
def submit_form(submission: SubmissionCreate) -> dict:
    try:
        row = database.save_submission(submission.model_dump())
        return {
            "status": "success",
            "message": "Data Submitted Successfully",
            "submitted_time": row["Submitted Time"],
        }
    except Exception:
        logger.exception("Failed to save submission.")
        raise HTTPException(status_code=500, detail="Failed To Upload Data")


@app.post("/api/leads")
def submit_form_legacy(submission: SubmissionCreate) -> dict:
    return submit_form(submission)


@app.post("/api/reports/generate")
def generate_reports(body: PasswordValidateRequest):
    if not download_service.validate_password(body.password):
        raise HTTPException(status_code=401, detail="Invalid Password")

    try:
        excel_generator.generate_reports()
        database.ensure_csv_exists()
    except Exception:
        logger.exception("Report generation failed.")
        raise HTTPException(
            status_code=500,
            detail="Could not prepare report files. Please try again.",
        )

    if not ALL_RECORDS_XLSX.exists():
        raise HTTPException(status_code=404, detail="Report file not available")

    return FileResponse(
        path=ALL_RECORDS_XLSX,
        filename=download_service.build_excel_download_filename(),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    )
