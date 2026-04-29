// Function to calculate the area of a circle
function calculateCircleArea(radius) {
	return Math.PI * radius * radius;
}

// Function to calculate the area of a rectangle
function calculateRectangleArea(length, width) {
	return length * width;
}

// Function to calculate the factorial of a number
function calculateFactorial(number) {
	if (!Number.isInteger(number) || number < 0) {
		throw new Error("number must be a non-negative integer");
	}

	if (number === 0 || number === 1) {
		return 1;
	}

	let result = 1;
	for (let value = 2; value <= number; value += 1) {
		result *= value;
	}

	return result;
}

const DemoMath = {
	calculateCircleArea,
	calculateRectangleArea,
	calculateFactorial,
};

if (typeof module !== "undefined" && module.exports) {
	module.exports = DemoMath;
}

if (typeof window !== "undefined") {
	window.DemoMath = DemoMath;
}
