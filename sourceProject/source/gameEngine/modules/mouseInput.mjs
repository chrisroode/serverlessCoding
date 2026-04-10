import * as module_graphics2d from './graphics2d.mjs';

const defaultMouseButtonObject = {
	pressed:false,
	held:false,
	released:false,
	willRelease:false,
	click:false,
	doubleClick:false,
}



const mouseState = {
	buttons:{},
	position:{
		x:null,
		y:null,
		onScreen:null,
	},
	lastPosition:{
		x:null,
		y:null,
		onScreen:null,
	},
}

const internal = {
	preventDefaultOnMouseEvents:true,
}

function exec_preventDefault(event) {
	if (internal.preventDefaultOnMouseEvents) {
		event.preventDefault();
	}
}


export function debug__GetMouseState() {
	return mouseState;
}

export function private_flushMouse() {
	mouseState.lastPosition.x = mouseState.position.x;
	mouseState.lastPosition.y = mouseState.position.y;
	mouseState.lastPosition.onScreen = mouseState.position.onScreen;
	Object.keys(mouseState.buttons).forEach((button) => {
		const b = mouseState.buttons[button];
		const lastPressed = b.pressed;
		const lastWillRelease = b.willRelease;
		b.pressed = false;
		b.released = false;
		b.click = false;
		b.doubleClick = false;
		if (lastPressed === true && lastWillRelease === true) {
			b.pressed = false;
			b.willRelease = false;
			b.held = false;
			b.released = true;
			return;
		}
		if (lastPressed === true) {
			b.held = true;
		}
		if (lastWillRelease === true) {
			b.held = false;
			b.released = true;
			b.willRelease = false;
		}
	})
}

function click(e) {
	exec_preventDefault(e);
	if (typeof mouseState.buttons[e.which] === 'undefined') {
		mouseState.buttons[e.which] = {...defaultMouseButtonObject};
	}
	mouseState.buttons[e.which].click = true;
	
	
}
function doubleClick(e) {
	exec_preventDefault(e);
	if (typeof mouseState.buttons[e.which] === 'undefined') {
		mouseState.buttons[e.which] = {...defaultMouseButtonObject};
	}
	mouseState.buttons[e.which].doubleClick = true;
	
}
function mouseDown(e) {
	exec_preventDefault(e);
	if (typeof mouseState.buttons[e.which] === 'undefined') {
		mouseState.buttons[e.which] = {...defaultMouseButtonObject};
	}
	mouseState.buttons[e.which].pressed = true;
}
function mouseUp(e) {
	exec_preventDefault(e);
	if (typeof mouseState.buttons[e.which] === 'undefined') {
		mouseState.buttons[e.which] = {...defaultMouseButtonObject};
	}
	mouseState.buttons[e.which].willRelease = true;
}

function mouseLeave(e) {
	mouseState.position.onScreen = false;
}

function mouseMove(e) {
	const canvasRect = module_graphics2d.userObjectsAndFunctions.canvas.getBoundingClientRect();
	if (
		e.x < canvasRect.left
		|| e.x > canvasRect.right
		|| e.y < canvasRect.top
		|| e.y > canvasRect.bottom
	) {
		mouseState.position.onScreen = false;
	} else {
		mouseState.position.onScreen = true;
	}
	const canvPos = module_graphics2d.private_getCoordinateOnScreen(e.x,e.y);
	mouseState.position.x = canvPos.x;
	mouseState.position.y = canvPos.y;
}
function stopContextMenus(e) {
	exec_preventDefault(e);
}

export function privateStartMouse() {
	window.addEventListener('click',click);
	window.addEventListener('dblclick',doubleClick);
	window.addEventListener('mousedown',mouseDown);
	window.addEventListener('mouseup',mouseUp);
	window.addEventListener('mousemove',mouseMove);
	document.addEventListener('mouseenter',mouseMove);
	document.addEventListener('mouseleave',mouseLeave);
	//userObjectsAndFunctions.canvas.addEventListener('contextmenu',stopContextMenus);
	document.addEventListener('contextmenu',stopContextMenus);
}

export function privateStopMouse() {
	window.removeEventListener('click',click);
	window.removeEventListener('dblclick',doubleClick);
	window.removeEventListener('mousedown',mouseDown);
	window.removeEventListener('mouseup',mouseUp);
	window.removeEventListener('mousemove',mouseMove);
	document.removeEventListener('mouseenter',mouseMove);
	document.removeEventListener('mouseleave',mouseLeave);
	//userObjectsAndFunctions.canvas.removeEventListener('mousemove',mouseMove);
	document.removeEventListener('contextmenu',stopContextMenus);
}


export function setPreventDefaultOnMouseEvents(newVal) {
	if (typeof newVal !== 'boolean') {
		//TODO: Write a message here.
		return;
	}
	internal.preventDefaultOnMouseEvents = newVal;
}