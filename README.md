# GitHub Copilot Certification Training Project

## Overview

This is an **educational project** designed for learning and training purposes as part of the **GitHub Copilot Certification** program. The project demonstrates practical examples of how AI-assisted code generation can accelerate development while maintaining code quality and best practices.

## Project Structure

The repository contains implementations of mathematical utility functions and a CSV reading exercise in two popular programming languages:

```
Copilot-certifcation-aula-1/
├── javascript/
│   ├── demo.js                        # Math functions implementation
│   ├── demo-ui.js                     # Frontend interaction logic
│   ├── demo.html                      # Web interface for testing
│   ├── demo.css                       # Styling for the web interface
│   ├── main.js                        # Node.js test runner
│   └── reading-file-exercise/
│       ├── ReadingFile.js             # CSV loading and single-pass parser (quoted, multiline)
│       ├── customers-gui.html         # Web interface — customer data grid
│       ├── customers-gui.js           # Grid UI logic (display & add rows)
│       ├── customers-gui.css          # Grid styling
│       ├── package.json               # Project metadata
│       └── tests/
│           ├── test-runner.html       # Browser-based test runner
│           └── test_ReadingFile.js    # Unit tests for parseCsv & loadCustomers
├── python/
│   ├── demo.py                        # Math functions implementation
│   ├── gui.py                         # Tkinter GUI for math functions
│   ├── main.py                        # Test runner
│   ├── reading-file-exercise/
│   │   ├── ReadingFile.py             # CSV loading, parse_csv_text, error handling
│   │   ├── customers_gui.py           # Tkinter GUI — customer data grid
│   │   └── tests/
│   │       ├── conftest.py            # pytest path configuration
│   │       └── test_reading_file.py   # Unit tests for load_customers & parse_csv_text
│   └── string-utils/
│       ├── string_utils.py            # Text transformation utilities (process_text)
│       └── tests/
│           ├── conftest.py            # pytest path configuration
│           └── test_string_utils.py   # 19 unit tests + standalone run_all_tests() runner
└── sample-files/
    └── customers-10000.csv            # Sample CSV dataset (10,000 records)
```

## Features

### Math Functions

Both implementations provide the same set of mathematical functions:

1. **Circle Area Calculator**
   - Input: radius (number)
   - Output: area of the circle using the formula π × r²
   - 🎨 **Visual rendering**: SVG circle with the **radius highlighted** in orange

2. **Rectangle Area Calculator**
   - Input: length and width (numbers)
   - Output: area of the rectangle using the formula length × width
   - 🎨 **Visual rendering**: SVG rectangle with **length and width dimensions highlighted** with measurement lines

3. **Factorial Calculator**
   - Input: number (integer)
   - Output: factorial value
   - Includes validation for negative numbers

### Interactive Shape Visualization (Web Interface)

When you calculate the area of a circle or rectangle in the web interface, the application automatically generates a **scaled SVG diagram** of the shape directly below the result:

- **Circle**: Displays the circle filled in teal, with the radius drawn from the center to the edge and labeled `r = <value>`.
- **Rectangle**: Displays the rectangle (proportionally scaled) with dimension lines on the bottom (`length = <value>`) and on the left side (`width = <value>`).

This visual feedback helps reinforce the relationship between the input parameters and the resulting geometry.

### CSV Reading Exercise

Both Python and JavaScript versions include a **reading-file-exercise** module that:

- Loads and parses the `customers-10000.csv` file (10,000 customer records)
- Displays all records in an interactive **data grid**
- Allows **adding new rows** directly from the UI
- Includes **error handling** for missing files, permission errors, encoding issues, and invalid CSV format
- Has **unit tests** covering happy paths and edge cases

#### RFC 4180–compliant CSV Parser

The JavaScript CSV parser (`parseCsvRows`) is a **single-pass, character-level parser** that fully supports:

| Feature | Example |
|---|---|
| Quoted fields with commas | `"Avenue, 123"` → `Avenue, 123` |
| Escaped quotes | `"He said ""hello"""` → `He said "hello"` |
| Multiline quoted fields (`\n` / `\r\n`) | `"Line 1\nLine 2"` → preserved newlines |
| Mixed: multiline + commas + quotes | `"Apt ""B"",\n123"` → `Apt "B",\n123` |
| Malformed CSV detection | Unclosed quotes, unexpected characters after closing quote |

The Python version leverages the built-in `csv.DictReader` (with `newline=""`) to achieve the same capabilities natively, plus exposes a `parse_csv_text()` function for in-memory string parsing — mirroring the JavaScript `parseCsv()` API.

### String Utils

The `python/string-utils` module provides a `process_text()` function that transforms the casing of words based on their length:

- Words with **5+ characters** → UPPERCASE
- Words with **4 or fewer characters** → lowercase
- Consecutive whitespace is collapsed into a single space

```python
process_text("The quick brown fox jumps")
# → "the QUICK BROWN fox JUMPS"
```

The module is decomposed into small, testable functions:
- `_transform_word()` — single-word transformation logic
- `MIN_LENGTH_FOR_UPPERCASE` — named constant (threshold = 5)

Tests can be run via **pytest** or **standalone** (the test file includes a `run_all_tests()` method with auto-discovery).

## How to Use

### JavaScript

#### Web Interface — Math Functions
1. Open `javascript/demo.html` in your web browser
2. Use the interactive interface to calculate:
   - Circle area (with visual circle rendering and radius highlighted)
   - Rectangle area (with visual rectangle rendering and dimensions highlighted)
   - Factorial values
3. View the available functions in the DemoMath object
4. Inspect the dynamically generated SVG shapes below each result

#### Web Interface — Customer Grid
1. Start a local server from the project root:
   ```powershell
   py -3 -m http.server 8000 --directory "."
   ```
2. Open in your browser:
   ```
   http://localhost:8000/javascript/reading-file-exercise/customers-gui.html
   ```

#### Running JavaScript Tests
With the local server running, open:
```
http://localhost:8000/javascript/reading-file-exercise/tests/test-runner.html
```

#### Command Line (Node.js)
```bash
cd javascript
node main.js
```

### Python

#### Command Line — Math Functions
```bash
cd python
python main.py
```

#### GUI — Customer Grid
```powershell
py -3 python/reading-file-exercise/customers_gui.py
```

#### Running Python Tests
```powershell
py -3 -m pip install --user pytest

# CSV reading exercise
py -3 -m pytest python/reading-file-exercise/tests/test_reading_file.py -v

# String utils (via pytest)
py -3 -m pytest python/string-utils/tests/test_string_utils.py -v

# String utils (standalone — no pytest required)
python python/string-utils/tests/test_string_utils.py
```

## Learning Objectives

This project is intended to help you:

- ✅ Understand how GitHub Copilot assists with code generation and development
- ✅ Learn practical patterns for AI-assisted coding
- ✅ Compare implementations across different programming languages
- ✅ Practice working with test cases and validation
- ✅ Gain experience with both web-based (JavaScript) and CLI-based (Python) applications
- ✅ Work with file I/O, CSV parsing, and error handling
- ✅ Build interactive data grid interfaces

## Technologies Used

- **JavaScript/Node.js**: ES6+ features, module system, DOM manipulation
- **Python 3**: Standard library (math, csv, pathlib, tkinter)
- **HTML5/CSS3**: Web interface for interactive testing
- **SVG**: Dynamic, scalable shape visualizations rendered in the browser
- **pytest**: Python unit testing framework
- **GitHub Copilot**: AI-assisted code generation and completion

## Test Coverage

Both implementations include:
- ✅ Basic functionality tests for all operations
- ✅ Input validation (e.g., checking for negative factorial inputs)
- ✅ Error handling with try-catch / try-except blocks
- ✅ Expected exception handling demonstrations
- ✅ CSV loading — happy path and edge cases (empty file, invalid encoding, permission denied, malformed CSV)
- ✅ CSV parsing from string — quoted fields, escaped quotes, multiline fields, CRLF handling
- ✅ Malformed CSV detection — unclosed quotes, unexpected characters
- ✅ String transformation — boundary lengths, whitespace handling, special characters, mixed case

**Python** — 35 tests (pytest): 7 `load_customers` + 9 `parse_csv_text` + 19 `process_text`
**JavaScript** — 14 tests (browser runner): 11 `parseCsv` + 3 `loadCustomers`

## Example Output

When running the math test scripts, you should see output similar to:

```
=== Testing DemoMath Functions ===
Circle area (radius=5): 78.5398
Rectangle area (8x3): 24.0000
Factorial of 6: 720

=== Validation Tests (Expected Errors) ===
OK: exception caught -> Input validation error
```

When running the CSV reading script:

```
Total records loaded: 10000
First record:
{'Index': '1', 'Customer Id': 'DD37Cf93aecA6Dc', ...}
```

## Notes for GitHub Copilot Training

This project demonstrates several key scenarios for GitHub Copilot:

1. **Cross-language implementation** — Same logic, different syntax
2. **Function documentation** — Clear docstrings and comments for AI assistance
3. **Error handling** — Proper validation and exception handling
4. **Test-driven examples** — Test cases that verify implementation correctness
5. **UI/Web integration** — Frontend and backend interaction patterns
6. **Dynamic SVG generation** — Programmatically rendering geometric shapes with annotated dimensions
7. **File I/O and CSV parsing** — Reading, loading, and displaying structured data with full RFC 4180 support (quoted fields, escaped quotes, multiline)
8. **Unit testing** — Comprehensive tests with pytest (Python) and browser-based runner (JavaScript)
9. **Code refactoring** — Extracting small, testable helper functions from monolithic code
10. **Standalone test runners** — Running tests without external frameworks via auto-discovery

## Getting Started

1. Clone or download this repository
2. Choose your preferred language (JavaScript or Python)
3. Follow the "How to Use" section above
4. Experiment with modifying the functions and observe how Copilot suggests improvements

## Requirements

- **For JavaScript**: Modern web browser (for web interface), Node.js 12+ (optional, for CLI tests)
- **For Python**: Python 3.10+, pytest (for running unit tests)

## Author

**Leandro Martins**
[LinkedIn Profile](https://www.linkedin.com/in/leandro-martins-2a073736/)

Created for educational purposes as part of the GitHub Copilot Certification Training Program.

## License

This project is provided as-is for educational and training purposes.

---

**Happy Learning! 🚀**
