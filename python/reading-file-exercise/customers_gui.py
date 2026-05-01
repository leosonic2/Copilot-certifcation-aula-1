import tkinter as tk
from tkinter import messagebox, ttk

from ReadingFile import load_customers


class CustomersGridApp:
    def __init__(self, root: tk.Tk) -> None:
        self.root = root
        self.root.title("Customers - CSV Grid")
        self.root.geometry("1200x700")
        self.root.minsize(1000, 600)

        self.rows = load_customers()
        self.columns = list(self.rows[0].keys()) if self.rows else []
        self.entry_vars: dict[str, tk.StringVar] = {}

        self._build_ui()
        self._populate_grid()

    def _build_ui(self) -> None:
        container = ttk.Frame(self.root, padding=12)
        container.pack(fill="both", expand=True)

        title = ttk.Label(container, text="Customer Data", font=("Segoe UI", 14, "bold"))
        title.pack(anchor="w", pady=(0, 8))

        grid_frame = ttk.Frame(container)
        grid_frame.pack(fill="both", expand=True)

        self.tree = ttk.Treeview(grid_frame, columns=self.columns, show="headings")
        self.tree.pack(side="left", fill="both", expand=True)

        y_scroll = ttk.Scrollbar(grid_frame, orient="vertical", command=self.tree.yview)
        y_scroll.pack(side="right", fill="y")

        x_scroll = ttk.Scrollbar(container, orient="horizontal", command=self.tree.xview)
        x_scroll.pack(fill="x")

        self.tree.configure(yscrollcommand=y_scroll.set, xscrollcommand=x_scroll.set)

        for column in self.columns:
            self.tree.heading(column, text=column)
            self.tree.column(column, width=160, minwidth=120, stretch=True)

        self.status_label = ttk.Label(container, text="")
        self.status_label.pack(anchor="w", pady=(8, 6))

        self._build_form(container)

    def _build_form(self, parent: ttk.Frame) -> None:
        form_frame = ttk.LabelFrame(parent, text="Add new customer", padding=10)
        form_frame.pack(fill="x", pady=(6, 0))

        if not self.columns:
            ttk.Label(form_frame, text="No columns available to insert data.").pack(anchor="w")
            return

        fields_frame = ttk.Frame(form_frame)
        fields_frame.pack(fill="x")

        max_columns = 4
        for idx, column in enumerate(self.columns):
            row = (idx // max_columns) * 2
            col = idx % max_columns

            var = tk.StringVar()
            self.entry_vars[column] = var

            label = ttk.Label(fields_frame, text=column)
            label.grid(row=row, column=col, sticky="w", padx=6, pady=(4, 2))

            entry = ttk.Entry(fields_frame, textvariable=var)
            entry.grid(row=row + 1, column=col, sticky="ew", padx=6, pady=(0, 6))

        for i in range(max_columns):
            fields_frame.columnconfigure(i, weight=1)

        button_row = ttk.Frame(form_frame)
        button_row.pack(fill="x", pady=(6, 0))

        add_button = ttk.Button(button_row, text="Add to grid", command=self._add_row)
        add_button.pack(side="left")

    def _populate_grid(self) -> None:
        for row in self.rows:
            values = [row.get(column, "") for column in self.columns]
            self.tree.insert("", "end", values=values)

        self._update_status()

    def _add_row(self) -> None:
        if not self.columns:
            messagebox.showerror("Error", "No columns available to insert data.")
            return

        new_row = {column: self.entry_vars[column].get().strip() for column in self.columns}

        if not any(new_row.values()):
            messagebox.showwarning("Warning", "Fill in at least one field to add a row.")
            return

        self.rows.append(new_row)
        self.tree.insert("", "end", values=[new_row[column] for column in self.columns])

        for var in self.entry_vars.values():
            var.set("")

        self._update_status()

    def _update_status(self) -> None:
        self.status_label.configure(text=f"Total records in grid: {len(self.rows)}")


def main() -> None:
    root = tk.Tk()
    try:
        CustomersGridApp(root)
    except Exception as error:
        messagebox.showerror("Error loading data", str(error))
        root.destroy()
        return
    root.mainloop()


if __name__ == "__main__":
    main()

