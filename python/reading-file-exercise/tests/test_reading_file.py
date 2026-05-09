import csv
from pathlib import Path

import pytest

from ReadingFile import get_csv_path, load_customers, parse_csv_text


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

    with pytest.raises(ValueError, match="Empty CSV or missing header"):
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

    with pytest.raises(PermissionError, match="Permission denied reading file"):
        load_customers(protected_path)


def test_load_customers_raises_value_error_when_csv_reader_fails(tmp_path: Path, monkeypatch):
    valid_path = tmp_path / "valid.csv"
    valid_path.write_text("name\nAlice\n", encoding="utf-8")

    def raise_csv_error(*args, **kwargs):
        raise csv.Error("bad csv")

    monkeypatch.setattr(csv, "DictReader", raise_csv_error)

    with pytest.raises(ValueError, match="Failed to process CSV"):
        load_customers(valid_path)


# ================================================================
# TESTS — parse_csv_text
# ================================================================


def test_parse_csv_text_returns_columns_and_rows_from_valid_csv():
    data = parse_csv_text("Name,Age,City\nAlice,30,Sao Paulo\nBob,25,Rio")

    assert data["columns"] == ["Name", "Age", "City"]
    assert len(data["rows"]) == 2
    assert data["rows"][0]["Name"] == "Alice"
    assert data["rows"][1]["City"] == "Rio"


def test_parse_csv_text_raises_value_error_for_empty_string():
    with pytest.raises(ValueError, match="Empty CSV or missing header"):
        parse_csv_text("")


def test_parse_csv_text_raises_value_error_for_whitespace_only():
    with pytest.raises(ValueError, match="Empty CSV or missing header"):
        parse_csv_text("   \n  ")


def test_parse_csv_text_returns_zero_rows_for_header_only_csv():
    data = parse_csv_text("Name,Age,City")

    assert data["columns"] == ["Name", "Age", "City"]
    assert len(data["rows"]) == 0


def test_parse_csv_text_parses_quoted_fields_with_commas():
    data = parse_csv_text('Name,Address\n"Alice","Avenue, 123"')

    assert len(data["rows"]) == 1
    assert data["rows"][0]["Address"] == "Avenue, 123"


def test_parse_csv_text_parses_escaped_quotes_inside_quoted_field():
    data = parse_csv_text('Name,Note\n"Bob","He said ""hello"""')

    assert data["rows"][0]["Note"] == 'He said "hello"'


def test_parse_csv_text_parses_multiline_quoted_field():
    data = parse_csv_text('Name,Bio\n"Alice","Line 1\nLine 2\nLine 3"\n"Bob","Simple"')

    assert len(data["rows"]) == 2
    assert data["rows"][0]["Bio"] == "Line 1\nLine 2\nLine 3"
    assert data["rows"][1]["Name"] == "Bob"


def test_parse_csv_text_parses_multiline_quoted_field_with_crlf():
    data = parse_csv_text('A,B\r\n"hello\r\nworld",2\r\nx,y')

    assert len(data["rows"]) == 2
    assert data["rows"][0]["A"] == "hello\r\nworld"
    assert data["rows"][0]["B"] == "2"


def test_parse_csv_text_parses_multiline_with_commas_and_quotes():
    data = parse_csv_text('Name,Address\n"Alice","Avenue, 123\nApt ""B"""')

    assert len(data["rows"]) == 1
    assert data["rows"][0]["Address"] == 'Avenue, 123\nApt "B"'

