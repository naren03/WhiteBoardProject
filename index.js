const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Menu
const clearBtnUI = document.getElementById('eraser');
const paletteUI = document.getElementById('palette');
const colorsUI = document.getElementById('colors');
const strokeUI = document.getElementById('stroke');
const undoUI = document.getElementById('undo');
const clearBoardUI = document.getElementById('clearBoard');
const downloadUI = document.getElementById('download');
const shapesUI = document.getElementById('shapesList');

// Sub Menu
const currentStrokeUI = document.getElementById('strokesType');
const strokeTypeUI = document.getElementById('strokeStyle');
const strokeWidthUI = document.getElementById('strokeWidth');
const colorIndicatorUI = document.getElementById('color-indicator');
const shapesTypeUI = document.getElementById('shapesType');

//dimensions of canvas
canvas.width = 1600;
canvas.height = 1400;

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
let undoArray = [];
let index = -1;
let shapeType = 'square';

//			Whiteboard Drawing Functions

// 1. Drawing with Ink
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
// 2. Drawing With Pen
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
// 3. Drawing With Spray
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

// 4. Drawing Shapes
function drawShape(e) {
	console.log(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
	ctx.fillStyle = drawColor;

	if (shapeType === 'square')
		ctx.fillRect(
			e.clientX - canvas.offsetLeft,
			e.clientY - canvas.offsetTop,
			strokeWidth * 30,
			strokeWidth * 30,
		);
	else if (shapeType === 'circle') {
		ctx.beginPath();
		ctx.arc(
			e.clientX - canvas.offsetLeft,
			e.clientY - canvas.offsetTop,
			strokeWidth * 30,
			0,
			2 * Math.PI,
		);
		ctx.fill();
	}
}
// Random Points for Spray Painting
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Mid Points for Bezier Curves
function midPointBtw(p1, p2) {
	return {
		x: p1.x + (p2.x - p1.x) / 2,
		y: p1.y + (p2.y - p1.y) / 2,
	};
}

//				Canvas Functions (Mouse Based)

//Mouse Clicked On Canvas
canvas.addEventListener('mousedown', (e) => {
	points.push({
		x: e.clientX - canvas.offsetLeft,
		y: e.clientY - canvas.offsetTop,
	});

	isDrawing = true;

	if (drawType === 'shapes') {
		drawShape(e);
	}

	//hide palatte
	colorsUI.classList.remove('show');
	//hide strokes
	strokeWidthUI.classList.remove('show');
	//hide tools
	strokeTypeUI.classList.remove('show');
	// hide shapes
	shapesTypeUI.classList.remove('show');
});

//Mouse Clicked On Canvas and Drawing Starts
canvas.addEventListener('mousemove', (e) => {
	//if eraser is selected then erase
	if (isErasing) {
		erase(e);
	} else if (drawType === 'pen') drawPen(e);
	else if (drawType === 'ink') drawInk(e);
	else if (drawType === 'spray') drawSpray(e);
});

//Mouse Released On Canvas (Drawing Stop)
canvas.addEventListener('mouseup', () => {
	if (isDrawing) {
		isDrawing = false;
		//
		index++;
		undoArray[index] = ctx.getImageData(0, 0, canvas.width, canvas.height);
		console.log(index);
		console.log(undoArray);
		ctx.closePath();
		//

		points.length = 0;
	}
});

//Mouse Goes out of Canvas While Drawing
canvas.addEventListener('mouseout', () => {
	if (isDrawing) {
		isDrawing = false;
		//
		index++;
		undoArray[index] = ctx.getImageData(0, 0, canvas.width, canvas.height);
		console.log(index);
		console.log(undoArray);
		ctx.closePath();
		//

		points.length = 0;
	}
});

//			Navigation Bar Tools

//1.Different Tools Selection

//When Tools icon is clicked
currentStrokeUI.addEventListener('click', showStrokeTools);

function showStrokeTools() {
	strokeTypeUI.classList.toggle('show');
	strokeWidthUI.classList.remove('show');
	colorsUI.classList.remove('show');
	shapesTypeUI.classList.remove('show');
	clearBtnUI.classList.remove('clicked');
	currentStrokeUI.classList.add('clicked');
	console.log(strokeTypeUI);
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
	} else if (e.target.id === 'shapes') {
		currentStrokeUI.innerHTML = `<div class="shapes"><a><i id="shapes" class="fa-solid fa-shapes"></i></a></div>`;
		drawType = 'shapes';
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
	shapesTypeUI.classList.remove('show');
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
	shapesTypeUI.classList.remove('show');
	clearBtnUI.classList.remove('clicked');
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
	enableEraser();
});

// envoke Eraser
function enableEraser() {
	clearBtnUI.classList.toggle('clicked');
	currentStrokeUI.classList.toggle('clicked');
}

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
	undoArray = [];
	index = -1;
});

//6.Undo Functionality
undoUI.addEventListener('click', () => {
	// call Undo Function
	undoDrawing();
});

// Undo Function
function undoDrawing() {
	if (index > 0) {
		index--;
		undoArray.pop();
		ctx.putImageData(undoArray[index], 0, 0);
		console.log(index);
		console.log(undoArray);
	} else {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		undoArray = [];
		index = -1;
	}
}
//7.Download Functionality
downloadUI.addEventListener('click', () => {
	// Call Download Function
	DownloadImage();
});

// Download Function
function DownloadImage() {
	const PopupUI = document.querySelector('.download-popup');

	// display download popup
	PopupUI.classList.add('show');
	let filename = PopupUI.children[0];

	const dwnldBtn = PopupUI.children[1];

	dwnldBtn.addEventListener('click', () => {
		if (filename.value != '') {
			let canvasContent = document.getElementById('canvas');

			canvasContent.toBlob(function (blob) {
				saveAs(blob, `${filename.value}.png`);
			});

			// disappear download popup
			PopupUI.classList.remove('show');
			setTimeout(() => {
				filename.value = '';
			}, 2000);
		}
	});
}
//8. Add KeyBoard Shorcuts

//Array to store no of keys entered
let keyArray = [];
// 0-Pen 1-Spray 2-Ink
let toolType = 0;
// 0-Small 1-Medium 2-Large
let toolWidth = 0;

document.addEventListener('keydown', (e) => {
	keyArray.push(e.key);
	// console.log(e.key);

	if (keyArray.length == 1) {
		if (checkDownKey()) {
		} else {
			keyArray = [];
		}
	}
	// if valid keys are pressed
	else if (keyArray.length == 2) {
		// For Tool Change T
		if (checkDownKey() && checkTKey()) {
			console.log('Change Tool');

			// Existing - Pen =>>>> Change to Spray
			if (toolType == 0) {
				currentStrokeUI.innerHTML = `<div class="spray"><a><i id="spray" class="fas fa-spray-can"></i></a></div>`;
				drawType = 'spray';

				toolType++;
			}
			// Existing - Spray =>>>> Change to Ink
			else if (toolType == 1) {
				currentStrokeUI.innerHTML = `<div class="ink"><a><i id="ink" class="fas fa-paint-brush"></i></a></div>`;
				drawType = 'ink';

				toolType++;
			}
			// Existing - Ink =>>>> Change to Shapes
			else if (toolType == 2) {
				currentStrokeUI.innerHTML = `<div class="shapes"><a><i id="shapes" class="fa-solid fa-shapes"></i></a></div>`;
				drawType = 'shapes';

				toolType++;
			}
			// Existing - Shapes =>>>> Change to Pen
			else if (toolType == 3) {
				currentStrokeUI.innerHTML = `<div class="pen"><a><i id="pen" class="fas fa-pen"></i></a></div>`;
				drawType = 'pen';

				toolType = 0;
			} else {
				toolType = 0;
			}

			keyArray = [];
		}
		// For Width Change
		else if (checkDownKey() && checkWKey()) {
			console.log('Change Width');

			if (toolWidth == 0) {
				strokeWidth = 3;

				toolWidth++;
			} else if (toolWidth == 1) {
				strokeWidth = 6;

				toolWidth++;
			} else if (toolWidth == 2) {
				strokeWidth = 10;

				toolWidth = 0;
			} else {
				toolWidth = 0;
			}

			keyArray = [];
		}
		// Clear the Board
		else if (checkDownKey() && checkRKey()) {
			console.log('Clear Board');

			ctx.clearRect(0, 0, canvas.width, canvas.height);

			keyArray = [];
		}
		// Download
		else if (checkDownKey() && checkDKey()) {
			console.log('Download');

			//Call Download Function
			DownloadImage();

			keyArray = [];
		}
		// Eraser
		else if (checkDownKey() && checkEKey()) {
			console.log('Eraser');

			//Call Download Function
			enableEraser();

			keyArray = [];
		}
		// For Undo Action
		else if (checkDownKey() && checkUKey()) {
			console.log('Undo');

			// Call Undo Function
			undoDrawing();

			keyArray = [];
		} else {
			keyArray = [];
		}
	} else {
		keyArray = [];
	}
});

// Check Down Arrow
function checkDownKey() {
	if (keyArray[0] === 'ArrowDown') return 1;
	else return 0;
}

// Check T key
function checkTKey() {
	if (keyArray[1] === 't' || keyArray[1] === 'T') return 1;
	else return 0;
}

// Check W key
function checkWKey() {
	if (keyArray[1] === 'w' || keyArray[1] === 'W') return 1;
	else return 0;
}

// Check R key
function checkRKey() {
	if (keyArray[1] === 'r' || keyArray[1] === 'R') return 1;
	else return 0;
}

// Check D key
function checkDKey() {
	if (keyArray[1] === 'd' || keyArray[1] === 'D') return 1;
	else return 0;
}
// Check E key
function checkEKey() {
	if (keyArray[1] === 'e' || keyArray[1] === 'E') return 1;
	else return 0;
}

// Check U key
function checkUKey() {
	if (keyArray[1] === 'u' || keyArray[1] === 'U') return 1;
	else return 0;
}

// 9. Selecting Shapes
shapesUI.addEventListener('click', showShapes);

function showShapes() {
	shapesTypeUI.classList.toggle('show');
	colorsUI.classList.remove('show');
	strokeTypeUI.classList.remove('show');
	strokeWidthUI.classList.remove('show');
	currentStrokeUI.classList.remove('show');
	clearBtnUI.classList.remove('clicked');
}
// Selecting Different Shapes from the given list
shapesTypeUI.addEventListener('click', (e) => {
	if (e.target.classList.contains('fa-square')) {
		console.log('Square');
		shapeType = 'square';
	} else if (e.target.classList.contains('fa-circle')) {
		console.log('Circle');
		shapeType = 'circle';
	}
});
