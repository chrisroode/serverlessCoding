/**
 * @module keyboard
 */

/**
 * @typedef keyState
 * @description An object that contains the state of key presses on the keyboard.
 * @property {boolean} pressed The first frame when a key is pressed, this is set to true.	Afterward, if the key is held down, then it will be false.
 * @property {boolean} held After the key is pressed, if the user holds the key down, this will be true.
 * @property {boolean} released When the key is released, this will be true for one frame.
 */
const defaultKeyObject = {
	pressed:false,
	held:false,
	released:false,
	willRelease:false,
}

const keyMap = {};

const internal = {
	lastKey:null,
	consoleOpen:false,
	consoleState: {
		text: '',
		cursorPosition: 0,
		historyPosition: null,
		history: [],
	},
}
let lastKey = null;


/**
 * @function getKey()
 * @param {string} value The name of the key you wish to access.
 * @returns {keyState} The state of the key that was pressed.
 */
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

/**
 * @function getKeys()
 * @description returns an object with all of the keys and their state.	This object will start empty, but as keys are pressed while playing your game more keys will appear as they are being pressed.	If you are unsure of the code for a key, you can send getKeys() to console.log() and browse the keys you have pressed so far. 
 * @returns {object} An object with the state of all the keys that have been used so far.
 */
export function getKeys() {
	const ret = {};
	Object.keys(keyMap).forEach((key) => {
		ret[key] = getKey(key);
	});
	return ret;
}

/**
 * @function getLastKeyPress
 * @description returns the last key that was pressed on the keyboard.	Send the output of this to gameEngine.log to show the codes for keys.
 * @returns {string} The last key the user pressed.
 */
export function getLastKeyPress() {
	return internal.lastKey;
}

/* Do not document */
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

/* Do not document */
export function debug__GetKeyMap() {
	return keyMap;
}

/* Do not document */
export function test__pressKey(e) {
	pressKey(e);
}

/* Do not document */
export function test__releaseKey(e) {
	releaseKey(e);
}

/* Do not document */
function pressKey(e) {
	internal.lastKey = e.code;
	if (typeof keyMap[e.code] === 'undefined') {
		keyMap[e.code] = {...defaultKeyObject};
	}
	if (keyMap[e.code].held === false
		&& keyMap[e.code].willRelease === false
	) {
		keyMap[e.code].pressed = true;
	}
}

/* Do not document */
function releaseKey(e) {
	if (typeof keyMap[e.code] === 'undefined') {
		keyMap[e.code] = {...defaultKeyObject};
	}
	keyMap[e.code].willRelease = true;
}

/* Do not document */
export function privateStartKeyboard() {
	window.addEventListener('keydown',pressKey);
	window.addEventListener('keyup',releaseKey);
}

/* Do not document */
export function privateStopKeyboard() {
	window.removeEventListener('keydown',pressKey);
	window.removeEventListener('keyup',releaseKey);
}


/* Thank you Mr. GPT for the help.  TODO: Run Code review...the humans must understand what the machines do. */
function handleConsoleEntry(e, state, { onEnter }) {
	const state = internal.consoleState;
	const { key, ctrlKey, metaKey } = e;

	// Prevent browser behavior for controlled keys
	const controlKeys = [
		"ArrowLeft","ArrowRight","ArrowUp","ArrowDown",
		"Backspace","Delete","Home","End","Enter"
	];
	if (controlKeys.includes(key)) e.preventDefault();

	const isCtrl = ctrlKey || metaKey;

	const moveCursor = (pos) => {
		state.cursorPosition = Math.max(0, Math.min(pos, state.text.length));
	};

	const insertText = (str) => {
		const left = state.text.slice(0, state.cursorPosition);
		const right = state.text.slice(state.cursorPosition);
		state.text = left + str + right;
		moveCursor(state.cursorPosition + str.length);
	};

	const deleteLeft = () => {
		if (state.cursorPosition === 0) return;
		const left = state.text.slice(0, state.cursorPosition - 1);
		const right = state.text.slice(state.cursorPosition);
		state.text = left + right;
		moveCursor(state.cursorPosition - 1);
	};

	const deleteRight = () => {
		if (state.cursorPosition >= state.text.length) return;
		const left = state.text.slice(0, state.cursorPosition);
		const right = state.text.slice(state.cursorPosition + 1);
		state.text = left + right;
	};

	const moveWordLeft = () => {
		let pos = state.cursorPosition;
		while (pos > 0 && state.text[pos - 1] === ' ') pos--;
		while (pos > 0 && state.text[pos - 1] !== ' ') pos--;
		moveCursor(pos);
	};

	const moveWordRight = () => {
		let pos = state.cursorPosition;
		while (pos < state.text.length && state.text[pos] === ' ') pos++;
		while (pos < state.text.length && state.text[pos] !== ' ') pos++;
		moveCursor(pos);
	};

	const historyUp = () => {
		if (state.history.length === 0) return;

		if (state.historyPosition === null) {
			state.historyPosition = state.history.length - 1;
		} else if (state.historyPosition > 0) {
			state.historyPosition--;
		}

		state.text = state.history[state.historyPosition];
		moveCursor(state.text.length);
	};

	const historyDown = () => {
		if (state.history.length === 0 || state.historyPosition === null) return;

		if (state.historyPosition < state.history.length - 1) {
			state.historyPosition++;
			state.text = state.history[state.historyPosition];
		} else {
			state.historyPosition = null;
			state.text = '';
		}

		moveCursor(state.text.length);
	};

	switch (key) {
		case "ArrowLeft":
			isCtrl ? moveWordLeft() : moveCursor(state.cursorPosition - 1);
			break;

		case "ArrowRight":
			isCtrl ? moveWordRight() : moveCursor(state.cursorPosition + 1);
			break;

		case "Home":
			moveCursor(0);
			break;

		case "End":
			moveCursor(state.text.length);
			break;

		case "Backspace":
			isCtrl ? moveWordLeft() && deleteLeft() : deleteLeft();
			break;

		case "Delete":
			deleteRight();
			break;

		case "ArrowUp":
			historyUp();
			break;

		case "ArrowDown":
			historyDown();
			break;

		case "Enter":
			if (state.text.trim() !== '') {
				state.history.push(state.text);
			}
			state.historyPosition = null;

			if (onEnter) onEnter(state.text);

			state.text = '';
			moveCursor(0);
			break;

		default:
			// Printable characters only
			if (key.length === 1 && !isCtrl) {
				insertText(key);
			}
	}
}


/*
//List of key codes from mdn's website.	Boil this down to good ones for gaming.



"Escape",
"Digit1",
"Digit2",
"Digit3",
"Digit4",
"Digit5",
"Digit6",
"Digit7",
"Digit8",
"Digit9",
"Digit0",
"Minus",
"Equal",
"Backspace",
"Tab",
"KeyQ",
"KeyW",
"KeyE",
"KeyR",
"KeyT",
"KeyY",
"KeyU",
"KeyI",
"KeyO",
"KeyP",
"BracketLeft",
"BracketRight",
"Enter",
"ControlLeft",
"KeyA",
"KeyS",
"KeyD",
"KeyF",
"KeyG",
"KeyH",
"KeyJ",
"KeyK",
"KeyL",
"Semicolon",
"Quote",
"Backquote",
"ShiftLeft",
"Backslash",
"KeyZ",
"KeyX",
"KeyC",
"KeyV",
"KeyB",
"KeyN",
"KeyM",
"Comma",
"Period",
"Slash",
"ShiftRight",
"NumpadMultiply",
"AltLeft",
"Space",
"CapsLock",
"F1",
"F2",
"F3",
"F4",
"F5",
"F6",
"F7",
"F8",
"F9",
"F10",
"Pause",
"ScrollLock",
"Numpad7",
"Numpad8",
"Numpad9",
"NumpadSubtract",
"Numpad4",
"Numpad5",
"Numpad6",
"NumpadAdd",
"Numpad1",
"Numpad2",
"Numpad3",
"Numpad0",
"NumpadDecimal",
"IntlBackslash",
"F11",
"F12",
"NumpadEqual",
"F13",
"F14",
"F15",
"F16",
"F17",
"F18",
"F19",
"F20",
"F21",
"F22",
"F23",
"KanaMode",
"Lang2",
"Lang1",
"IntlRo",
"F24",
"Convert",
"NonConvert",
"IntlYen",
"NumpadComma",
"MediaTrackPrevious",
"MediaTrackNext",
"NumpadEnter",
"ControlRight",
"AudioVolumeMute",
"LaunchApp2",
"MediaPlayPause",
"MediaStop",
"BrowserHome",
"NumpadDivide",
"Unidentified",
"PrintScreen",
"NumLock",
"Pause",
"Home",
"ArrowUp",
"PageUp",
"Unidentified",
"ArrowLeft",
"Unidentified",
"ArrowRight",
"Unidentified",
"End",
"ArrowDown",
"PageDown",
"Insert",
"Delete",
"MetaLeft",
"MetaRight",
"ContextMenu",
"Power",
"BrowserSearch",
"BrowserFavorites",
"BrowserRefresh",
"BrowserStop",
"BrowserForward",
"BrowserBack",
"LaunchApp1",
"LaunchMail",
"MediaSelect",
*/