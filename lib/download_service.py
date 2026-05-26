"""
Password validation and download filename helpers.
"""

import logging
import secrets
from datetime import datetime
from typing import Optional

from .config import DOWNLOAD_FILE_PREFIX, DOWNLOAD_PASSWORD

logger = logging.getLogger(__name__)


def validate_password(password: str) -> bool:
    """Constant-time password comparison against config."""
    if not password:
        return False
    return secrets.compare_digest(password.strip(), DOWNLOAD_PASSWORD)


def make_download_stamp() -> str:
    """Timestamp suffix: YYYYMMDD-HHMMSS."""
    return datetime.now().strftime("%Y%m%d-%H%M%S")


def build_excel_download_filename(stamp: Optional[str] = None) -> str:
    """Client filename: acko-web-YYYYMMDD-HHMMSS.xlsx"""
    stamp = stamp or make_download_stamp()
    return f"{DOWNLOAD_FILE_PREFIX}-{stamp}.xlsx"
