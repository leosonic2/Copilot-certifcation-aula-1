import tkinter as tk
from tkinter import ttk

from demo import calculate_circle_area, calculate_rectangle_area, calculate_factorial


class DemoMathApp:
    def __init__(self, root):
        self.root = root
        self.root.title("DemoMath - Teste de Funcoes")
        self.root.geometry("760x520")
        self.root.minsize(700, 480)

        self._setup_style()
        self._build_ui()

    def _setup_style(self):
        style = ttk.Style()
        style.theme_use("clam")

        style.configure("Main.TFrame", background="#f7f5ef")
        style.configure("Card.TFrame", background="#fffdf8", relief="solid", borderwidth=1)
        style.configure("Title.TLabel", font=("Segoe UI", 16, "bold"), background="#f7f5ef")
        style.configure("CardTitle.TLabel", font=("Segoe UI", 11, "bold"), background="#fffdf8")
        style.configure("Body.TLabel", font=("Segoe UI", 10), background="#fffdf8")
        style.configure("Result.TLabel", font=("Consolas", 10, "bold"), background="#fffdf8")
        style.configure("Info.TLabel", font=("Consolas", 9), background="#fffdf8")

    def _build_ui(self):
        container = ttk.Frame(self.root, style="Main.TFrame", padding=16)
        container.pack(fill="both", expand=True)

        ttk.Label(
            container,
            text="Painel de Testes - Funcoes DemoMath",
            style="Title.TLabel",
        ).pack(anchor="w", pady=(0, 12))

        grid = ttk.Frame(container, style="Main.TFrame")
        grid.pack(fill="both", expand=True)

        grid.columnconfigure(0, weight=1)
        grid.columnconfigure(1, weight=1)
        grid.rowconfigure(0, weight=1)
        grid.rowconfigure(1, weight=1)

        self._build_circle_card(grid)
        self._build_rectangle_card(grid)
        self._build_factorial_card(grid)
        self._build_object_card(grid)

    def _make_card(self, parent, row, column, title):
        card = ttk.Frame(parent, style="Card.TFrame", padding=12)
        card.grid(row=row, column=column, sticky="nsew", padx=6, pady=6)
        ttk.Label(card, text=title, style="CardTitle.TLabel").pack(anchor="w", pady=(0, 8))
        return card

    def _build_circle_card(self, parent):
        card = self._make_card(parent, 0, 0, "Area do Circulo")

        ttk.Label(card, text="Raio", style="Body.TLabel").pack(anchor="w")
        self.circle_radius = ttk.Entry(card)
        self.circle_radius.insert(0, "5")
        self.circle_radius.pack(fill="x", pady=(2, 8))

        ttk.Button(card, text="Calcular", command=self._on_circle).pack(anchor="w")

        self.circle_result = ttk.Label(card, text="", style="Result.TLabel", foreground="#0f5132")
        self.circle_result.pack(anchor="w", pady=(10, 0))

    def _build_rectangle_card(self, parent):
        card = self._make_card(parent, 0, 1, "Area do Retangulo")

        ttk.Label(card, text="Comprimento", style="Body.TLabel").pack(anchor="w")
        self.rect_length = ttk.Entry(card)
        self.rect_length.insert(0, "8")
        self.rect_length.pack(fill="x", pady=(2, 8))

        ttk.Label(card, text="Largura", style="Body.TLabel").pack(anchor="w")
        self.rect_width = ttk.Entry(card)
        self.rect_width.insert(0, "3")
        self.rect_width.pack(fill="x", pady=(2, 8))

        ttk.Button(card, text="Calcular", command=self._on_rectangle).pack(anchor="w")

        self.rectangle_result = ttk.Label(card, text="", style="Result.TLabel", foreground="#0f5132")
        self.rectangle_result.pack(anchor="w", pady=(10, 0))

    def _build_factorial_card(self, parent):
        card = self._make_card(parent, 1, 0, "Fatorial")

        ttk.Label(card, text="Numero inteiro", style="Body.TLabel").pack(anchor="w")
        self.factorial_number = ttk.Entry(card)
        self.factorial_number.insert(0, "6")
        self.factorial_number.pack(fill="x", pady=(2, 8))

        ttk.Button(card, text="Calcular", command=self._on_factorial).pack(anchor="w")

        self.factorial_result = ttk.Label(card, text="", style="Result.TLabel", foreground="#0f5132")
        self.factorial_result.pack(anchor="w", pady=(10, 0))

    def _build_object_card(self, parent):
        card = self._make_card(parent, 1, 1, "Visualizacao do Objeto")

        functions = {
            "calculate_circle_area": calculate_circle_area,
            "calculate_rectangle_area": calculate_rectangle_area,
            "calculate_factorial": calculate_factorial,
        }

        keys_text = "Funcoes disponiveis:\n" + "\n".join(f"- {name}" for name in functions.keys())
        ttk.Label(card, text=keys_text, style="Info.TLabel").pack(anchor="w")

        types_text = "\nTipos:\n" + "\n".join(
            f"- {name}: {type(func).__name__}" for name, func in functions.items()
        )
        ttk.Label(card, text=types_text, style="Info.TLabel").pack(anchor="w", pady=(8, 0))

    def _set_result(self, label, text, is_error=False):
        color = "#842029" if is_error else "#0f5132"
        label.configure(text=text, foreground=color)

    def _on_circle(self):
        try:
            radius = float(self.circle_radius.get())
            area = calculate_circle_area(radius)
            self._set_result(self.circle_result, f"Area: {area:.4f}")
        except ValueError:
            self._set_result(self.circle_result, "Erro: informe um numero valido.", True)

    def _on_rectangle(self):
        try:
            length = float(self.rect_length.get())
            width = float(self.rect_width.get())
            area = calculate_rectangle_area(length, width)
            self._set_result(self.rectangle_result, f"Area: {area:.4f}")
        except ValueError:
            self._set_result(self.rectangle_result, "Erro: informe numeros validos.", True)

    def _on_factorial(self):
        try:
            number = int(self.factorial_number.get())
            value = calculate_factorial(number)
            self._set_result(self.factorial_result, f"Fatorial: {value}")
        except ValueError as error:
            self._set_result(self.factorial_result, f"Erro: {error}", True)


def main():
    root = tk.Tk()
    DemoMathApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()
