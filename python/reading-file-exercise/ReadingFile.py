# Read data from a csv file:

import csv
from pathlib import Path


def get_csv_path() -> Path:
    base_dir = Path(__file__).resolve().parents[2]
    return base_dir / "sample-files" / "customers-10000.csv"


def load_customers(csv_path: Path | None = None) -> list[dict[str, str]]:
    target_path = csv_path or get_csv_path()

    if not target_path.exists():
        raise FileNotFoundError(f"Arquivo nao encontrado: {target_path}")

    try:
        with target_path.open(mode="r", encoding="utf-8-sig", newline="") as file:
            reader = csv.DictReader(file)
            if not reader.fieldnames:
                raise ValueError(f"CSV vazio ou sem cabecalho: {target_path}")
            return list(reader)
    except PermissionError as exc:
        raise PermissionError(f"Sem permissao para ler o arquivo: {target_path}") from exc
    except UnicodeDecodeError as exc:
        raise UnicodeDecodeError(
            exc.encoding,
            exc.object,
            exc.start,
            exc.end,
            f"Falha ao decodificar o arquivo '{target_path}': {exc.reason}",
        ) from exc
    except csv.Error as exc:
        raise ValueError(f"Falha ao processar CSV '{target_path}': {exc}") from exc


def run_preview() -> None:
    try:
        customers = load_customers()
        print(f"Total de registros carregados: {len(customers)}")
        print("Primeiro registro:")
        print(customers[0] if customers else "Nenhum registro encontrado.")
    except (FileNotFoundError, PermissionError, UnicodeDecodeError, ValueError) as error:
        print(f"Erro ao carregar arquivo: {error}")


if __name__ == "__main__":
    run_preview()
