"""
CSV persistence layer for form submissions.
Creates submissions.csv with headers automatically when missing.
"""

import csv
from datetime import datetime, timezone
from typing import Any, Dict

from .config import CSV_HEADERS, FIELD_TO_CSV, SUBMISSIONS_CSV


def ensure_csv_exists() -> None:
    """Create submissions.csv with header row if the file does not exist."""
    SUBMISSIONS_CSV.parent.mkdir(parents=True, exist_ok=True)
    if not SUBMISSIONS_CSV.exists():
        with SUBMISSIONS_CSV.open("w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=CSV_HEADERS)
            writer.writeheader()


def save_submission(data: Dict[str, Any]) -> Dict[str, str]:
    """
    Append one validated submission row to submissions.csv.
    Returns the row written (including Submitted Time).
    """
    ensure_csv_exists()

    submitted_at = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")

    row = {header: "" for header in CSV_HEADERS}
    for json_key, csv_key in FIELD_TO_CSV.items():
        value = data.get(json_key, "")
        row[csv_key] = str(value) if value is not None else ""

    row["Submitted Time"] = submitted_at

    with SUBMISSIONS_CSV.open("a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_HEADERS)
        writer.writerow(row)

    return row
