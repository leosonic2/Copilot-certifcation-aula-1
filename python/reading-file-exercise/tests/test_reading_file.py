import csv
from pathlib import Path

import pytest

from ReadingFile import get_csv_path, load_customers


def test_get_csv_path_points_to_existing_customers_file():
    csv_path = get_csv_path()

    assert csv_path.name == "customers-10000.csv"
    assert csv_path.exists()


def test_load_customers_reads_sample_csv_successfully():
    customers = load_customers(get_csv_path())

    assert isinstance(customers, list)
    assert len(customers) > 0
    assert isinstance(customers[0], dict)
    assert len(customers[0]) > 0


def test_load_customers_raises_file_not_found_for_missing_path(tmp_path: Path):
    missing_path = tmp_path / "missing.csv"

    with pytest.raises(FileNotFoundError):
        load_customers(missing_path)


def test_load_customers_raises_value_error_for_empty_csv(tmp_path: Path):
    empty_path = tmp_path / "empty.csv"
    empty_path.write_text("", encoding="utf-8")

    with pytest.raises(ValueError, match="CSV vazio ou sem cabecalho"):
        load_customers(empty_path)


def test_load_customers_raises_unicode_decode_error_for_invalid_encoding(tmp_path: Path):
    invalid_encoding_path = tmp_path / "invalid-encoding.csv"
    invalid_encoding_path.write_bytes(b"\x80\x81\x82")

    with pytest.raises(UnicodeDecodeError):
        load_customers(invalid_encoding_path)


def test_load_customers_raises_permission_error_when_open_fails(tmp_path: Path, monkeypatch):
    protected_path = tmp_path / "protected.csv"
    protected_path.write_text("name\nAlice\n", encoding="utf-8")

    def raise_permission_error(*args, **kwargs):
        raise PermissionError("access denied")

    monkeypatch.setattr(Path, "open", raise_permission_error)

    with pytest.raises(PermissionError, match="Sem permissao para ler o arquivo"):
        load_customers(protected_path)


def test_load_customers_raises_value_error_when_csv_reader_fails(tmp_path: Path, monkeypatch):
    valid_path = tmp_path / "valid.csv"
    valid_path.write_text("name\nAlice\n", encoding="utf-8")

    def raise_csv_error(*args, **kwargs):
        raise csv.Error("bad csv")

    monkeypatch.setattr(csv, "DictReader", raise_csv_error)

    with pytest.raises(ValueError, match="Falha ao processar CSV"):
        load_customers(valid_path)
