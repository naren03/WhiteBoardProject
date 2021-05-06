const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const clearBtn = document.getElementById('eraser');
const palette = document.getElementById('palette');
const colors = document.getElementById('colors');
const stroke = document.getElementById('stroke');
const currentStroke = document.getElementById('strokesType');
const strokeType = document.getElementById('strokeStyle');
const strokes = document.getElementById('strokeWidth');
const undo = document.getElementById('undo');

//dimensions of canvas
canvas.width = 10000;
canvas.height = 10000;

//default variables
let drawColor = 'black';
let isDrawing = false;
let strokeWidth = 3;
let points = [];
ctx.lineCap = 'round';
ctx.lineJoin = 'round';
ctx.shadowBlur = 3;
let drawType = 'pen';
let density = 60;
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
	colors.classList.remove('show');
	//hide strokes
	strokes.classList.remove('show');
	//hide tools
	strokeType.classList.remove('show');
});

//when mouse is clicked an drawn
canvas.addEventListener('mousemove', (e) => {
	if (drawType === 'pen') drawPen(e);
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
			let radius = 20;
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
clearBtn.addEventListener('click', () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
});

//show and hide palette
palette.addEventListener('click', showPalatte);

function showPalatte() {
	colors.classList.toggle('show');
	strokes.classList.remove('show');
	currentStroke.classList.remove('show');
}

colors.addEventListener('click', (e) => {
	drawColor = e.target.className;
	palette.style.color = drawColor;
	if (e.target.id !== 'colors') colors.classList.remove('show');
});

//show and hide strokes
stroke.addEventListener('click', showStroke);

function showStroke() {
	strokes.classList.toggle('show');
	colors.classList.remove('show');
	currentStroke.classList.remove('show');
}

strokes.addEventListener('click', (e) => {
	if (e.target.className === 'small') {
		strokeWidth = 3;
	} else if (e.target.className === 'medium') {
		strokeWidth = 6;
	} else if (e.target.className === 'large') {
		strokeWidth = 10;
	}

	if (e.target.id !== 'strokeWidth') strokes.classList.remove('show');
});

//show and hide strokes styles
currentStroke.addEventListener('click', showStrokeTools);

function showStrokeTools() {
	strokeType.classList.toggle('show');
	strokes.classList.remove('show');
	colors.classList.remove('show');
}
strokeType.addEventListener('click', (e) => {
	if (e.target.id === 'spray') {
		currentStroke.innerHTML = `<div class="spray"><a><i id="spray" class="fas fa-spray-can"></i></a></div>`;
		drawType = 'spray';
	} else if (e.target.id === 'pen') {
		currentStroke.innerHTML = `<div class="pen"><a><i id="pen" class="fas fa-pen"></i></a></div>`;
		drawType = 'pen';
	} else if (e.target.id === 'ink') {
		currentStroke.innerHTML = `<div class="ink"><a><i id="ink" class="fas fa-paint-brush"></i></a></div>`;
		drawType = 'ink';
	}
});

strokeType.addEventListener('click', (e) => {
	if (e.target.id !== 'strokeStyle') strokeType.classList.remove('show');
});

//MIDPOINT CALCULATE
function midPointBtw(p1, p2) {
	return {
		x: p1.x + (p2.x - p1.x) / 2,
		y: p1.y + (p2.y - p1.y) / 2,
	};
}
