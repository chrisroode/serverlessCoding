
const defaultKeyObject = {
	pressed:false,
	held:false,
	released:false,
	willRelease:false,
}

const keyMap = {};
const willRelease = {};


export function getKey(value) {
	if (typeof keyMap[value] === 'undefined') {
		return {
			pressed:false,
			held:false,
			released:false,
		};
	}
	const k = keyMap[value];
	return {
		pressed:k.pressed,
		held:k.held,
		released:k.released,
	}
}

export function flushKeys() {
	Object.keys(keyMap).forEach((key) => {
		const k = keyMap[key];
		const lastPressed = k.pressed;
		const lastWillRelease = k.willRelease;
		k.pressed = false;
		k.released = false;
		if (lastPressed === true && lastWillRelease === true) {
			k.pressed = false;
			k.willRelease = false;
			k.held = false;
			k.released = true;
			return;
		}
		if (lastPressed === true) {
			k.held = true;
		}
		if (lastWillRelease === true) {
			k.held = false;
			k.released = true;
			k.willRelease = false;
		}
	});
}

export function debug__GetKeyMap() {
	return keyMap;
}

function pressKey(e) {
	if (typeof keyMap[e.code] === 'undefined') {
		keyMap[e.code] = {...defaultKeyObject};
	}
	if (keyMap[e.code].held === false
		&& keyMap[e.code].willRelease === false
	) {
		keyMap[e.code].pressed = true;
	}
}

function releaseKey(e) {
	if (typeof keyMap[e.code] === 'undefined') {
		keyMap[e.code] = {...defaultKeyObject};
	}
	keyMap[e.code].willRelease = true;
}

export function privateStartKeyboard() {
	window.addEventListener('keydown',pressKey);
	window.addEventListener('keyup',releaseKey);
}

export function privateStopKeyboard() {
	window.removeEventListener('keydown',pressKey);
	window.removeEventListener('keyup',releaseKey);
}