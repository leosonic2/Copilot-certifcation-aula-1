from demo import calculate_circle_area, calculate_rectangle_area, calculate_factorial


def run_tests():
    print("=== Teste das funcoes do demo.py ===")

    circle_radius = 5
    circle_area = calculate_circle_area(circle_radius)
    print(f"Area do circulo (raio={circle_radius}): {circle_area:.4f}")

    rectangle_length = 8
    rectangle_width = 3
    rectangle_area = calculate_rectangle_area(rectangle_length, rectangle_width)
    print(
        f"Area do retangulo ({rectangle_length}x{rectangle_width}): {rectangle_area:.4f}"
    )

    factorial_number = 6
    factorial_value = calculate_factorial(factorial_number)
    print(f"Fatorial de {factorial_number}: {factorial_value}")

    print("\n=== Teste de validacao (erro esperado) ===")
    try:
        calculate_factorial(-1)
        print("ERRO: era esperado lancar excecao para -1")
    except ValueError as error:
        print(f"OK: excecao capturada -> {error}")


if __name__ == "__main__":
    run_tests()
