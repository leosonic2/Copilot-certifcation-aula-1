# ReadingFile.py — Loads and parses the CSV file customers-10000.csv

import csv
import io
from pathlib import Path


DEFAULT_CSV_FILENAME = "customers-10000.csv"


def get_csv_path() -> Path:
    """Resolves the absolute path to the default customers CSV file."""
    base_dir = Path(__file__).resolve().parents[2]
    return base_dir / "sample-files" / DEFAULT_CSV_FILENAME


def _validate_file_exists(path: Path) -> None:
    """Raises FileNotFoundError when the target path does not exist."""
    if not path.exists():
        raise FileNotFoundError(f"File not found: {path}")


def _read_csv_rows(file_obj) -> tuple[list[str], list[dict[str, str]]]:
    """
    Reads a file-like object with csv.DictReader.
    Returns (columns, rows).
    Supports quoted fields with commas, escaped quotes, and embedded newlines
    (handled natively by Python's csv module with newline="").
    """
    reader = csv.DictReader(file_obj)

    if not reader.fieldnames:
        raise ValueError("Empty CSV or missing header")

    columns = list(reader.fieldnames)
    rows = [_build_row(columns, record) for record in reader]
    return columns, rows


def _build_row(columns: list[str], record: dict[str, str]) -> dict[str, str]:
    """Normalises a single CSV record, ensuring every column key is present."""
    return {col: (record.get(col) or "") for col in columns}


def parse_csv_text(text: str) -> dict:
    """
    Parses a CSV string into a structured dict with 'columns' and 'rows'.
    Mirrors the JavaScript parseCsv() function.

    Supports:
      - Quoted fields containing commas
      - Escaped quotes ("")
      - Embedded newlines inside quoted fields

    Returns:
        { "columns": list[str], "rows": list[dict[str, str]] }
    """
    if not text.strip():
        raise ValueError("Empty CSV or missing header")

    file_obj = io.StringIO(text, newline="")
    columns, rows = _read_csv_rows(file_obj)
    return {"columns": columns, "rows": rows}


def load_customers(csv_path: Path | None = None) -> list[dict[str, str]]:
    """
    Loads and parses a CSV file, returning a list of row dicts.
    Handles FileNotFoundError, PermissionError, UnicodeDecodeError, and csv.Error.
    """
    target_path = csv_path or get_csv_path()
    _validate_file_exists(target_path)

    try:
        with target_path.open(mode="r", encoding="utf-8-sig", newline="") as file:
            _columns, rows = _read_csv_rows(file)
            return rows
    except PermissionError as exc:
        raise PermissionError(f"Permission denied reading file: {target_path}") from exc
    except UnicodeDecodeError as exc:
        raise UnicodeDecodeError(
            exc.encoding,
            exc.object,
            exc.start,
            exc.end,
            f"Failed to decode file '{target_path}': {exc.reason}",
        ) from exc
    except csv.Error as exc:
        raise ValueError(f"Failed to process CSV '{target_path}': {exc}") from exc


def run_preview() -> None:
    """Loads customers and prints a quick summary."""
    try:
        customers = load_customers()
        print(f"Total records loaded: {len(customers)}")
        print("First record:")
        print(customers[0] if customers else "No records found.")
    except (FileNotFoundError, PermissionError, UnicodeDecodeError, ValueError) as error:
        print(f"Error loading file: {error}")


if __name__ == "__main__":
    run_preview()
