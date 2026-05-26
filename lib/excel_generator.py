"""
Generate complete Excel (.xlsx) report from submissions.csv.
"""

import logging
from pathlib import Path
from typing import Dict, Optional

import pandas as pd

from .config import ALL_RECORDS_XLSX, CSV_HEADERS, REPORTS_DIR, SUBMISSIONS_CSV

logger = logging.getLogger(__name__)


def _ensure_reports_dir() -> None:
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)


def load_submissions_dataframe() -> pd.DataFrame:
    """Load CSV into a DataFrame; return empty frame with headers if missing."""
    if not SUBMISSIONS_CSV.exists() or SUBMISSIONS_CSV.stat().st_size == 0:
        return pd.DataFrame(columns=CSV_HEADERS)

    df = pd.read_csv(SUBMISSIONS_CSV, dtype=str)
    for col in CSV_HEADERS:
        if col not in df.columns:
            df[col] = ""
    return df[CSV_HEADERS]


def _write_excel(df: pd.DataFrame, path: Path) -> Path:
    """Write full submission history to a styled .xlsx file."""
    _ensure_reports_dir()
    with pd.ExcelWriter(path, engine="openpyxl") as writer:
        df.to_excel(writer, index=False, sheet_name="All Leads")
        sheet = writer.sheets["All Leads"]
        for col_cells in sheet.columns:
            max_len = max((len(str(c.value or "")) for c in col_cells), default=10)
            letter = col_cells[0].column_letter
            sheet.column_dimensions[letter].width = min(max_len + 2, 40)
    logger.info("Excel report written: %s (%s rows)", path, len(df))
    return path


def generate_reports() -> Dict[str, Optional[Path]]:
    """Build all_records.xlsx (complete lead history) under reports/."""
    _ensure_reports_dir()
    df = load_submissions_dataframe()
    report_path = _write_excel(df, ALL_RECORDS_XLSX)
    return {"report": report_path}


generate_daily_reports = generate_reports
