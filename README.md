# GitHub Copilot Certification Training Project

## Overview

This is an **educational project** designed for learning and training purposes as part of the **GitHub Copilot Certification** program. The project demonstrates practical examples of how AI-assisted code generation can accelerate development while maintaining code quality and best practices.

## Project Structure

The repository contains implementations of mathematical utility functions in two popular programming languages:

```
aula 1/
├── javascript/
│   ├── demo.js           # Math functions implementation
│   ├── demo-ui.js        # Frontend interaction logic
│   ├── demo.html         # Web interface for testing
│   ├── demo.css          # Styling for the web interface
│   └── main.js           # Node.js test runner
└── python/
    ├── demo.py           # Math functions implementation
    ├── gui.py            # GUI interface (if applicable)
    ├── main.py           # Test runner
    └── __pycache__/      # Python cache files
```

## Features

### Available Functions

Both implementations provide the same set of mathematical functions:

1. **Circle Area Calculator**
   - Input: radius (number)
   - Output: area of the circle using the formula π × r²

2. **Rectangle Area Calculator**
   - Input: length and width (numbers)
   - Output: area of the rectangle using the formula length × width

3. **Factorial Calculator**
   - Input: number (integer)
   - Output: factorial value
   - Includes validation for negative numbers

## How to Use

### JavaScript

#### Web Interface
1. Open `javascript/demo.html` in your web browser
2. Use the interactive interface to calculate:
   - Circle area
   - Rectangle area
   - Factorial values
3. View the available functions in the DemoMath object

#### Command Line (Node.js)
```bash
cd javascript
node main.js
```

This will run automated tests for all mathematical functions.

### Python

#### Command Line
```bash
cd python
python main.py
```

This will execute tests for all mathematical functions and display the results.

## Learning Objectives

This project is intended to help you:

- ✅ Understand how GitHub Copilot assists with code generation and development
- ✅ Learn practical patterns for AI-assisted coding
- ✅ Compare implementations across different programming languages
- ✅ Practice working with test cases and validation
- ✅ Gain experience with both web-based (JavaScript) and CLI-based (Python) applications

## Technologies Used

- **JavaScript/Node.js**: ES6+ features, module system, DOM manipulation
- **Python 3**: Standard library (math module), functional programming
- **HTML5/CSS3**: Web interface for interactive testing
- **GitHub Copilot**: AI-assisted code generation and completion

## Test Coverage

Both implementations include:
- ✅ Basic functionality tests for all operations
- ✅ Input validation (e.g., checking for negative factorial inputs)
- ✅ Error handling with try-catch blocks
- ✅ Expected exception handling demonstrations

## Example Output

When running the test scripts, you should see output similar to:

```
=== Testing DemoMath Functions ===
Circle area (radius=5): 78.5398
Rectangle area (8x3): 24.0000
Factorial of 6: 720

=== Validation Tests (Expected Errors) ===
OK: exception caught -> Input validation error
```

## Notes for GitHub Copilot Training

This project demonstrates several key scenarios for GitHub Copilot:

1. **Cross-language implementation** - Same logic, different syntax
2. **Function documentation** - Clear docstrings and comments for AI assistance
3. **Error handling** - Proper validation and exception handling
4. **Test-driven examples** - Test cases that verify implementation correctness
5. **UI/Web integration** - Frontend and backend interaction patterns

## Getting Started

1. Clone or download this repository
2. Choose your preferred language (JavaScript or Python)
3. Follow the "How to Use" section above
4. Experiment with modifying the functions and observe how Copilot suggests improvements

## Requirements

- **For JavaScript**: Node.js 12+ (for running tests), modern web browser (for web interface)
- **For Python**: Python 3.6+

## Author

**Leandro Martins**  
[LinkedIn Profile](https://www.linkedin.com/in/leandro-martins-2a073736/)

Created for educational purposes as part of the GitHub Copilot Certification Training Program.

## License

This project is provided as-is for educational and training purposes.

---

**Happy Learning! 🚀**


