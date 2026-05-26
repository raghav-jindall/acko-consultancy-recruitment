"""
Centralized backend configuration.
Change values here — settings apply across API, reports, and downloads.
"""

import os
from pathlib import Path

# ---------------------------------------------------------------------------
# Company / contact (mirrors public/config.js)
# ---------------------------------------------------------------------------
COMPANY_NAME = "Acko Consultancy"
EMAIL = "a.jinda@gmail.com"
MOBILE_NUMBER = "+91 7017930241"

# ---------------------------------------------------------------------------
# API / CORS
# ---------------------------------------------------------------------------
API_HOST = "0.0.0.0"
API_PORT = int(os.getenv("PORT", "8000"))
API_BASE_URL = os.getenv("API_BASE_URL", "")

# Comma-separated origins in env, or * for development
_cors_env = os.getenv("CORS_ORIGINS", "*")
CORS_ORIGINS = [o.strip() for o in _cors_env.split(",") if o.strip()] or ["*"]

# ---------------------------------------------------------------------------
# Storage paths (Vercel serverless: writable data under /tmp)
# ---------------------------------------------------------------------------
LIB_DIR = Path(__file__).resolve().parent
IS_VERCEL = os.getenv("VERCEL") == "1"
DATA_DIR = Path(os.getenv("DATA_DIR", "/tmp/acko-data" if IS_VERCEL else str(LIB_DIR)))
DATA_DIR.mkdir(parents=True, exist_ok=True)

SUBMISSIONS_CSV = DATA_DIR / "submissions.csv"
REPORTS_DIR = DATA_DIR / "reports"
ALL_RECORDS_XLSX = REPORTS_DIR / "all_records.xlsx"

# ---------------------------------------------------------------------------
# Secure report downloads (footer "Download Reports")
# ---------------------------------------------------------------------------
DOWNLOAD_PASSWORD = os.getenv("DOWNLOAD_PASSWORD", "1164")
DOWNLOAD_FILE_PREFIX = "acko-web"

# ---------------------------------------------------------------------------
# CSV storage
# ---------------------------------------------------------------------------
CSV_HEADERS = [
    "Full Name",
    "WhatsApp Number",
    "Age",
    "City",
    "State",
    "Qualification",
    "Occupation",
    "Email",
    "Experience in Sales",
    "Interested Role",
    "Submitted Time",
]

FIELD_TO_CSV = {
    "fullName": "Full Name",
    "whatsappNumber": "WhatsApp Number",
    "age": "Age",
    "city": "City",
    "state": "State",
    "qualification": "Qualification",
    "occupation": "Occupation",
    "email": "Email",
    "experience": "Experience in Sales",
    "role": "Interested Role",
}
