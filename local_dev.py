"""
Local development server — frontend (public/) + API (lib/) on one port.

Usage:
  uvicorn local_dev:app --reload --host 0.0.0.0 --port 3000
"""

from pathlib import Path

from fastapi.staticfiles import StaticFiles

from lib.main import app

PUBLIC_DIR = Path(__file__).resolve().parent / "public"

# Static site at / (API routes /api/* are registered first on `app`)
app.mount("/", StaticFiles(directory=str(PUBLIC_DIR), html=True), name="frontend")
