# Read data from a csv file:

import csv
from pathlib import Path


def get_csv_path() -> Path:
    base_dir = Path(__file__).resolve().parents[2]
    return base_dir / "sample-files" / "customers-10000.csv"


def load_customers(csv_path: Path | None = None) -> list[dict[str, str]]:
    target_path = csv_path or get_csv_path()

    if not target_path.exists():
        raise FileNotFoundError(f"File not found: {target_path}")

    try:
        with target_path.open(mode="r", encoding="utf-8-sig", newline="") as file:
            reader = csv.DictReader(file)
            if not reader.fieldnames:
                raise ValueError(f"Empty CSV or missing header: {target_path}")
            return list(reader)
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
    try:
        customers = load_customers()
        print(f"Total records loaded: {len(customers)}")
        print("First record:")
        print(customers[0] if customers else "No records found.")
    except (FileNotFoundError, PermissionError, UnicodeDecodeError, ValueError) as error:
        print(f"Error loading file: {error}")


if __name__ == "__main__":
    run_preview()
