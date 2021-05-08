const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const clearBtnUI = document.getElementById('eraser');
const paletteUI = document.getElementById('palette');
const colorsUI = document.getElementById('colors');
const strokeUI = document.getElementById('stroke');
const currentStrokeUI = document.getElementById('strokesType');
const strokeTypeUI = document.getElementById('strokeStyle');
const strokeWidthUI = document.getElementById('strokeWidth');
// const undoUI = document.getElementById('undo');
const colorIndicatorUI = document.getElementById('color-indicator');
const clearBoardUI = document.getElementById('clearBoard');

//dimensions of canvas
canvas.width = 10000;
canvas.height = 10000;

//default variables
let drawColor = 'black';
let isDrawing = false;
let isErasing = false;
let strokeWidth = 3;
let points = [];
ctx.lineCap = 'round';
ctx.lineJoin = 'round';
ctx.shadowBlur = 3;
let drawType = 'pen';
let density = 80;
//whiteboard functions
//when mouse is clicked
canvas.addEventListener('mousedown', (e) => {
	// ctx.beginPath();
	points.push({
		x: e.clientX - canvas.offsetLeft,
		y: e.clientY - canvas.offsetTop,
	});

	isDrawing = true;

	//hide palatte
	colorsUI.classList.remove('show');
	//hide strokes
	strokeWidthUI.classList.remove('show');
	//hide tools
	strokeTypeUI.classList.remove('show');
});

//when mouse is clicked an drawn
canvas.addEventListener('mousemove', (e) => {
	if (isErasing) {
		erase(e);
	} else if (drawType === 'pen') drawPen(e);
	else if (drawType === 'ink') drawInk(e);
	else if (drawType === 'spray') drawSpray(e);
});

function drawInk(e) {
	if (isDrawing) {
		points.push({
			x: e.clientX - canvas.offsetLeft,
			y: e.clientY - canvas.offsetTop,
		});

		let p1 = points[0];
		let p2 = points[1];
		ctx.beginPath();
		ctx.moveTo(p1.x, p1.y);

		for (let i = 1; i < points.length; i++) {
			ctx.strokeStyle = drawColor;
			ctx.shadowColor = drawColor;
			ctx.lineWidth = strokeWidth;
			let midPoint = midPointBtw(p1, p2);
			ctx.bezierCurveTo(p1.x, p1.y, midPoint.x, midPoint.y, p2.x, p2.y);
			// ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
			p1 = points[i];
			p2 = points[i + 1];
		}
		ctx.lineTo(p1.x, p1.y);
		ctx.stroke();
	}
}

function drawPen(e) {
	if (isDrawing) {
		points.push({
			x: e.clientX - canvas.offsetLeft,
			y: e.clientY - canvas.offsetTop,
		});

		let p1 = points[0];
		let p2 = points[1];
		ctx.beginPath();
		ctx.moveTo(p1.x, p1.y);

		for (let i = 1; i < points.length; i++) {
			ctx.strokeStyle = drawColor;
			ctx.shadowColor = 'white';
			ctx.lineWidth = 1;
			let midPoint = midPointBtw(p1, p2);
			ctx.bezierCurveTo(p1.x, p1.y, midPoint.x, midPoint.y, p2.x, p2.y);
			// ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
			p1 = points[i];
			p2 = points[i + 1];
		}
		ctx.lineTo(p1.x, p1.y);
		ctx.stroke();
	}
}
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
function drawSpray(e) {
	ctx.lineWidth = 10;
	ctx.fillStyle = drawColor;
	ctx.shadowColor = 'white';
	if (isDrawing) {
		for (let i = density; i--; ) {
			let radius = strokeWidth * 5;
			let offsetX = getRandomInt(-radius, radius);
			let offsetY = getRandomInt(-radius, radius);
			ctx.fillRect(
				e.clientX - canvas.offsetLeft + offsetX,
				e.clientY - canvas.offsetTop + offsetY,
				1,
				1,
			);
		}
	}
}

//when mouse is released
canvas.addEventListener('mouseup', () => {
	if (isDrawing) {
		isDrawing = false;
		points.length = 0;
	}
});

//when mouse goes out of window while drawing
canvas.addEventListener('mouseout', () => {
	if (isDrawing) {
		isDrawing = false;
		points.length = 0;
	}
});

//clear the full board
clearBoardUI.addEventListener('click', () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
});
//clear particular area
clearBtnUI.addEventListener('click', (e) => {
	// ctx.clearRect(0, 0, canvas.width, canvas.height);
	clearBtnUI.classList.toggle('clicked');
});
canvas.addEventListener('mousedown', () => {
	if (clearBtnUI.classList.contains('clicked')) {
		isErasing = true;
	}
});
canvas.addEventListener('mouseup', () => {
	if (clearBtnUI.classList.contains('clicked')) {
		isErasing = false;
	}
});
canvas.addEventListener('mouseout', () => {
	if (clearBtnUI.classList.contains('clicked')) {
		isErasing = false;
	}
});
//erase
function erase(e) {
	ctx.lineWidth = 10;
	ctx.fillStyle = 'white';
	ctx.shadowColor = 'white';
	if (isErasing) {
		ctx.fillRect(
			e.clientX - canvas.offsetLeft - 25,
			e.clientY - canvas.offsetTop - 25,
			50,
			50,
		);
	}
}

//show and hide palette
paletteUI.addEventListener('click', showPalatte);

function showPalatte() {
	colorsUI.classList.toggle('show');
	strokeWidthUI.classList.remove('show');
	currentStrokeUI.classList.remove('show');
	clearBtnUI.classList.remove('clicked');
}

colorsUI.addEventListener('click', (e) => {
	drawColor = e.target.className;
	colorIndicatorUI.style.background = drawColor;
	if (e.target.id !== 'colors') colorsUI.classList.remove('show');
});

//show and hide strokes
strokeUI.addEventListener('click', showStroke);

function showStroke() {
	strokeWidthUI.classList.toggle('show');
	colorsUI.classList.remove('show');
	currentStrokeUI.classList.remove('show');
	clearBtnUI.classList.remove('clicked');
	console.log('sdfdsfg');
}

strokeWidthUI.addEventListener('click', (e) => {
	if (e.target.className === 'small') {
		strokeWidth = 3;
	} else if (e.target.className === 'medium') {
		strokeWidth = 6;
	} else if (e.target.className === 'large') {
		strokeWidth = 10;
	}

	if (e.target.id !== 'strokeWidth') strokeWidthUI.classList.remove('show');
});

//show and hide strokes styles
currentStrokeUI.addEventListener('click', showStrokeTools);

function showStrokeTools() {
	strokeTypeUI.classList.toggle('show');
	strokeWidthUI.classList.remove('show');
	colorsUI.classList.remove('show');
	clearBtnUI.classList.remove('clicked');
}
strokeTypeUI.addEventListener('click', (e) => {
	if (e.target.id === 'spray') {
		currentStrokeUI.innerHTML = `<div class="spray"><a><i id="spray" class="fas fa-spray-can"></i></a></div>`;
		drawType = 'spray';
	} else if (e.target.id === 'pen') {
		currentStrokeUI.innerHTML = `<div class="pen"><a><i id="pen" class="fas fa-pen"></i></a></div>`;
		drawType = 'pen';
	} else if (e.target.id === 'ink') {
		currentStrokeUI.innerHTML = `<div class="ink"><a><i id="ink" class="fas fa-paint-brush"></i></a></div>`;
		drawType = 'ink';
	}
});

strokeTypeUI.addEventListener('click', (e) => {
	if (e.target.id !== 'strokeStyle') strokeTypeUI.classList.remove('show');
});

//MIDPOINT CALCULATE
function midPointBtw(p1, p2) {
	return {
		x: p1.x + (p2.x - p1.x) / 2,
		y: p1.y + (p2.y - p1.y) / 2,
	};
}
