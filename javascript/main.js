const DemoMath = require("./demo");

function runTests() {
	console.log("=== Teste das funcoes DemoMath ===");

	const circleRadius = 5;
	const circleArea = DemoMath.calculateCircleArea(circleRadius);
	console.log(`Area do circulo (raio=${circleRadius}): ${circleArea.toFixed(4)}`);

	const rectangleLength = 8;
	const rectangleWidth = 3;
	const rectangleArea = DemoMath.calculateRectangleArea(rectangleLength, rectangleWidth);
	console.log(
		`Area do retangulo (${rectangleLength}x${rectangleWidth}): ${rectangleArea.toFixed(4)}`
	);

	const factorialNumber = 6;
	const factorialValue = DemoMath.calculateFactorial(factorialNumber);
	console.log(`Fatorial de ${factorialNumber}: ${factorialValue}`);

	console.log("\n=== Teste de validacao (erro esperado) ===");
	try {
		DemoMath.calculateFactorial(-1);
		console.log("ERRO: era esperado lancar excecao para -1");
	} catch (error) {
		console.log(`OK: excecao capturada -> ${error.message}`);
	}
}

runTests();
