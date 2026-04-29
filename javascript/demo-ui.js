function renderResult(element, text, isError) {
	element.textContent = text;
	element.className = "result " + (isError ? "err" : "ok");
}

function clearShape(element) {
	element.innerHTML = "";
}

function drawCircleShape(container, radius) {
	clearShape(container);
	if (!isFinite(radius) || radius <= 0) return;

	const size = 220;
	const padding = 30;
	const cx = size / 2;
	const cy = size / 2;
	const drawR = (size / 2) - padding;

	const svg = `
		<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Circulo com raio ${radius}">
			<circle class="fill" cx="${cx}" cy="${cy}" r="${drawR}" />
			<line class="dim-line" x1="${cx}" y1="${cy}" x2="${cx + drawR}" y2="${cy}" />
			<circle class="center-dot" cx="${cx}" cy="${cy}" r="3" />
			<line class="dim-tick" x1="${cx + drawR}" y1="${cy - 5}" x2="${cx + drawR}" y2="${cy + 5}" />
			<text class="dim-label" x="${cx + drawR / 2}" y="${cy - 8}" text-anchor="middle">r = ${radius}</text>
		</svg>
	`;
	container.innerHTML = svg;
}

function drawRectangleShape(container, length, width) {
	clearShape(container);
	if (!isFinite(length) || !isFinite(width) || length <= 0 || width <= 0) return;

	const viewW = 260;
	const viewH = 200;
	const padding = 40;
	const maxW = viewW - padding * 2;
	const maxH = viewH - padding * 2;

	// Scale rectangle to fit available area while preserving proportion
	const scale = Math.min(maxW / length, maxH / width);
	const rectW = length * scale;
	const rectH = width * scale;
	const x = (viewW - rectW) / 2;
	const y = (viewH - rectH) / 2;

	const svg = `
		<svg viewBox="0 0 ${viewW} ${viewH}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Retangulo ${length} por ${width}">
			<rect class="fill" x="${x}" y="${y}" width="${rectW}" height="${rectH}" />

			<!-- Length (bottom) -->
			<line class="dim-line" x1="${x}" y1="${y + rectH + 15}" x2="${x + rectW}" y2="${y + rectH + 15}" />
			<line class="dim-tick" x1="${x}" y1="${y + rectH + 10}" x2="${x}" y2="${y + rectH + 20}" />
			<line class="dim-tick" x1="${x + rectW}" y1="${y + rectH + 10}" x2="${x + rectW}" y2="${y + rectH + 20}" />
			<text class="dim-label" x="${x + rectW / 2}" y="${y + rectH + 32}" text-anchor="middle">comprimento = ${length}</text>

			<!-- Width (left) -->
			<line class="dim-line" x1="${x - 15}" y1="${y}" x2="${x - 15}" y2="${y + rectH}" />
			<line class="dim-tick" x1="${x - 20}" y1="${y}" x2="${x - 10}" y2="${y}" />
			<line class="dim-tick" x1="${x - 20}" y1="${y + rectH}" x2="${x - 10}" y2="${y + rectH}" />
			<text class="dim-label" x="${x - 22}" y="${y + rectH / 2}" text-anchor="middle" transform="rotate(-90 ${x - 22} ${y + rectH / 2})">largura = ${width}</text>
		</svg>
	`;
	container.innerHTML = svg;
}

document.getElementById("btnCircle").addEventListener("click", function () {
	const radius = Number(document.getElementById("circleRadius").value);
	const resultEl = document.getElementById("resultCircle");
	const shapeEl = document.getElementById("shapeCircle");

	if (!isFinite(radius) || radius < 0) {
		renderResult(resultEl, "Erro: raio invalido", true);
		clearShape(shapeEl);
		return;
	}

	const area = DemoMath.calculateCircleArea(radius);
	renderResult(resultEl, "Area: " + area.toFixed(4), false);
	drawCircleShape(shapeEl, radius);
});

document.getElementById("btnRectangle").addEventListener("click", function () {
	const length = Number(document.getElementById("rectLength").value);
	const width = Number(document.getElementById("rectWidth").value);
	const resultEl = document.getElementById("resultRectangle");
	const shapeEl = document.getElementById("shapeRectangle");

	if (!isFinite(length) || !isFinite(width) || length < 0 || width < 0) {
		renderResult(resultEl, "Erro: dimensoes invalidas", true);
		clearShape(shapeEl);
		return;
	}

	const area = DemoMath.calculateRectangleArea(length, width);
	renderResult(resultEl, "Area: " + area.toFixed(4), false);
	drawRectangleShape(shapeEl, length, width);
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
