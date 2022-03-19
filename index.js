const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const clearBtnUI = document.getElementById('eraser');
const paletteUI = document.getElementById('palette');
const colorsUI = document.getElementById('colors');
const strokeUI = document.getElementById('stroke');
const undoUI = document.getElementById('undo');
const clearBoardUI = document.getElementById('clearBoard');
const downloadUI = document.getElementById('download');

const currentStrokeUI = document.getElementById('strokesType');
const strokeTypeUI = document.getElementById('strokeStyle');
const strokeWidthUI = document.getElementById('strokeWidth');
const colorIndicatorUI = document.getElementById('color-indicator');

//dimensions of canvas
canvas.width = 1000;
canvas.height = 1000;

//default variables
let drawColor = 'black';
let isDrawing = false;
let isErasing = false;
let strokeWidth = 3;
let points = [];
ctx.lineCap = 'round';
ctx.lineJoin = 'round';
ctx.shadowBlur = 2;
let drawType = 'pen';
let density = 80;

//whiteboard drawing functions

// for drawing with ink
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
			// first way to draw curves
			ctx.bezierCurveTo(p1.x, p1.y, midPoint.x, midPoint.y, p2.x, p2.y);
			// second way to draw curves
			// ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
			p1 = points[i];
			p2 = points[i + 1];
		}
		ctx.lineTo(p1.x, p1.y);
		ctx.stroke();
	}
}
// for drawing with pen
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
			// first way to draw curves
			ctx.bezierCurveTo(p1.x, p1.y, midPoint.x, midPoint.y, p2.x, p2.y);
			// second way to draw curves
			// ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
			p1 = points[i];
			p2 = points[i + 1];
		}
		ctx.lineTo(p1.x, p1.y);
		ctx.stroke();
	}
}
// for drawing with spray
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
// function to give random number for spray painting
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
// function to give midpoint for bezier curves
function midPointBtw(p1, p2) {
	return {
		x: p1.x + (p2.x - p1.x) / 2,
		y: p1.y + (p2.y - p1.y) / 2,
	};
}

//                     Canvas functions

//when mouse is clicked on canvas
canvas.addEventListener('mousedown', (e) => {
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

//when mouse is clicked and drawn on canvas
canvas.addEventListener('mousemove', (e) => {
	//if eraser is selected then erase
	if (isErasing) {
		erase(e);
	} else if (drawType === 'pen') drawPen(e);
	else if (drawType === 'ink') drawInk(e);
	else if (drawType === 'spray') drawSpray(e);
});

//when mouse is released on canvas
canvas.addEventListener('mouseup', () => {
	if (isDrawing) {
		isDrawing = false;
		points.length = 0;
	}
});

//when mouse goes out of canvas while drawing
canvas.addEventListener('mouseout', () => {
	if (isDrawing) {
		isDrawing = false;
		points.length = 0;
	}
});

//                    Navigation Bar Tools

//1.Different Tools Selection

//When Tools icon is clicked
currentStrokeUI.addEventListener('click', showStrokeTools);

function showStrokeTools() {
	strokeTypeUI.classList.toggle('show');
	strokeWidthUI.classList.remove('show');
	colorsUI.classList.remove('show');
	clearBtnUI.classList.remove('clicked');
	currentStrokeUI.classList.add('clicked');
}

//Selecting Different tools from the given list
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
//Closing the tools list automatically after selecting a tool
strokeTypeUI.addEventListener('click', (e) => {
	if (e.target.id !== 'strokeStyle') strokeTypeUI.classList.remove('show');
});

//2.Different Colors Selection

//When palatte icon is clicked
paletteUI.addEventListener('click', showPalatte);

function showPalatte() {
	colorsUI.classList.toggle('show');
	strokeWidthUI.classList.remove('show');
	currentStrokeUI.classList.remove('show');
	clearBtnUI.classList.remove('clicked');
}

//Selecting Different colors from the given list
colorsUI.addEventListener('click', (e) => {
	drawColor = e.target.className;
	colorIndicatorUI.style.background = drawColor;

	//Closing the tools list automatically after selecting a tool
	if (e.target.id !== 'colors') colorsUI.classList.remove('show');
});

//3.Different Width Selection

//When scale icon is clicked
strokeUI.addEventListener('click', showStroke);

function showStroke() {
	strokeWidthUI.classList.toggle('show');
	colorsUI.classList.remove('show');
	currentStrokeUI.classList.remove('show');
	clearBtnUI.classList.remove('clicked');
	console.log('sdfdsfg');
}
//Selecting Different widths from the given list
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
//Closing the widths list automatically after selecting a width size
strokeWidthUI.addEventListener('click', (e) => {
	if (e.target.id !== 'strokeWidth') strokeWidthUI.classList.remove('show');
});

//4.Eraser Selection
//This will erase a particular area

//when we click on eraser icon
clearBtnUI.addEventListener('click', () => {
	clearBtnUI.classList.toggle('clicked');
	currentStrokeUI.classList.remove('clicked');
});

//when eraser is selected and clicked on canvas
canvas.addEventListener('mousedown', () => {
	if (clearBtnUI.classList.contains('clicked')) {
		isErasing = true;
	}
});

//when eraser is selected and mouse is released on canvas
canvas.addEventListener('mouseup', () => {
	if (clearBtnUI.classList.contains('clicked')) {
		isErasing = false;
	}
});

//when eraser is selected and mouse is taken out of canvas
canvas.addEventListener('mouseout', () => {
	if (clearBtnUI.classList.contains('clicked')) {
		isErasing = false;
	}
});

//erase function
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

//5.Delete All Content on Board
clearBoardUI.addEventListener('click', () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
});

//6.Undo Functionality

//7.Download Functionality
downloadUI.addEventListener('click', () => {
	let canvasContent = document.getElementById('canvas');

	canvasContent.toBlob(function (blob) {
		saveAs(blob, `wb${new Date().getTime()}.png`);
	});
});
