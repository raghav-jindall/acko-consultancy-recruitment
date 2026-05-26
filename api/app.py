"""
Vercel serverless entry — FastAPI via Mangum ASGI adapter.
Only export `handler` (not `app`). Exporting `app` from api/app.py made Vercel
treat FastAPI as the site-wide handler, so GET / returned {"detail":"Not Found"}.
"""
import sys
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))
from mangum import Mangum  # noqa: E402
from lib.main import app as fastapi_app  # noqa: E402
handler = Mangum(fastapi_app, lifespan="off")
app = fastapi_app