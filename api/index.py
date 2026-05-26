"""Vercel serverless entry — Mangum wraps the FastAPI app in lib.main (export handler only)."""

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from mangum import Mangum  # noqa: E402

from lib.main import app as fastapi_app  # noqa: E402

handler = Mangum(fastapi_app, lifespan="off")
