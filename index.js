const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const clearBtn = document.getElementById('eraser');
const palette = document.getElementById('palette');
const colors = document.getElementById('colors');
const stroke = document.getElementById('stroke');
const strokes = document.getElementById('strokeWidth');
const undo = document.getElementById('undo');

//dimensions of canvas
canvas.width = 10000;
canvas.height = 10000;

//default variables
let drawColor = 'black';
let isDrawing = false;
let strokeWidth = 3;
let undoArray = [];
let index = -1;

//whiteboard functions
//when mouse is clicked
canvas.addEventListener('mousedown', (e) => {
	isDrawing = true;
	ctx.beginPath();
	ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);

	//hide palatte
	colors.classList.remove('show');
	//hide strokes
	strokes.classList.remove('show');
});

//when mouse is clicked an drawn
canvas.addEventListener('mousemove', (e) => {
	if (isDrawing) {
		ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
		ctx.strokeStyle = drawColor;
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
		ctx.lineWidth = strokeWidth;
		ctx.stroke();
	}
});

//when mouse is released
canvas.addEventListener('mouseup', () => {
	if (isDrawing) {
		isDrawing = false;
		index++;
		undoArray[index] = ctx.getImageData(0, 0, canvas.width, canvas.height);

		ctx.closePath();
	}
});

//when mouse goes out of window while drawing
canvas.addEventListener('mouseout', () => {
	if (isDrawing) {
		isDrawing = false;
		index++;
		undoArray[index] = ctx.getImageData(0, 0, canvas.width, canvas.height);

		ctx.closePath();
	}
});

//clear the full board
clearBtn.addEventListener('click', () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	undoArray = [];
	index = -1;
});

//show and hide palette
palette.addEventListener('click', showPalatte);

function showPalatte() {
	colors.classList.toggle('show');
	strokes.classList.remove('show');
}

colors.addEventListener('click', (e) => {
	drawColor = e.target.className;
	if (e.target.id !== 'colors') colors.classList.remove('show');
});

//show and hide strokes
stroke.addEventListener('click', showStroke);

function showStroke() {
	strokes.classList.toggle('show');
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

//undo action
undo.addEventListener('click', () => {
	if (index > 0) {
		index--;
		undoArray.pop();
		ctx.putImageData(undoArray[index], 0, 0);
	} else {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		undoArray = [];
		index = -1;
	}
});
