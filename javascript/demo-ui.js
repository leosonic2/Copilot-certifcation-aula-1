function renderResult(element, text, isError) {
	element.textContent = text;
	element.className = "result " + (isError ? "err" : "ok");
}

document.getElementById("btnCircle").addEventListener("click", function () {
	const radius = Number(document.getElementById("circleRadius").value);
	const resultEl = document.getElementById("resultCircle");
	const area = DemoMath.calculateCircleArea(radius);
	renderResult(resultEl, "Area: " + area.toFixed(4), false);
});

document.getElementById("btnRectangle").addEventListener("click", function () {
	const length = Number(document.getElementById("rectLength").value);
	const width = Number(document.getElementById("rectWidth").value);
	const resultEl = document.getElementById("resultRectangle");
	const area = DemoMath.calculateRectangleArea(length, width);
	renderResult(resultEl, "Area: " + area.toFixed(4), false);
});

document.getElementById("btnFactorial").addEventListener("click", function () {
	const number = Number(document.getElementById("factorialNumber").value);
	const resultEl = document.getElementById("resultFactorial");

	try {
		const value = DemoMath.calculateFactorial(number);
		renderResult(resultEl, "Fatorial: " + value, false);
	} catch (error) {
		renderResult(resultEl, "Erro: " + error.message, true);
	}
});

const objectView = {
	keys: Object.keys(DemoMath),
	types: Object.fromEntries(
		Object.entries(DemoMath).map(function (entry) {
			return [entry[0], typeof entry[1]];
		})
	),
};
document.getElementById("objectView").textContent = JSON.stringify(objectView, null, 2);
