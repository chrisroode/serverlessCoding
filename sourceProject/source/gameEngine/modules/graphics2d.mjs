import * as blockEight from "./fonts/blockEight.mjs";

/**
 * @module graphics2d
 */

const DEFAULT_WIDTH = 430;
const DEFAULT_HEIGHT = 230;

export const userObjectsAndFunctions = {
	canvas:null,
	context:null,
	//See bottom of the file for all other functions that get exposed to user access.
}


/*
const _par = { //pixel aspet ratios.
	snes:7/6, //256x224 resolution on a 4:3 display.  Pixels are 7/6 ratio.
	apple2:36/32, //280x192 resolution on a 4:3 display.
	cPet:43/45,
	atari:22/13,
	c64:3/4,
	ibm80:24/25, //320x200 resolution on a 4:3 display. pixels are 24/25
	square:1,
};*/

//Crop modes

const displayModeParams = {
	default: {
		width:DEFAULT_WIDTH,
		height:DEFAULT_HEIGHT,
		pixelAspect:1,
		cropMode:'fit',
	},
	stretch: {
		width:DEFAULT_WIDTH,
		height:DEFAULT_HEIGHT,
		pixelAspect:1,
		cropMode:'stretch',
	},
	snes: {
		width:256,
		height:224,
		pixelAspect:7/6,
		cropMode:'fit',
	},
}


const internal = {
	...displayModeParams.default,
	canvasID:'canvas',
	contextTransforms:[],
	imageRendering:'pixelated',
}

export function private_getCoordinateOnScreen(x,y) {
	if (!userObjectsAndFunctions.canvas) {
		return {
			x:null,
			y:null,
		}
	}
	const canvasRect = userObjectsAndFunctions.canvas.getBoundingClientRect();
	return {
		x:(x-canvasRect.left)*internal.width/canvasRect.width,
		y:(y-canvasRect.top)*internal.height/canvasRect.height,
	}
}


export function setCropMode(newVal) {
	const validModes = [
		'fit',//: the content is shrunk so nothing is lost.
		'stretch',//: who cares about pixel aspect ratio.
		'scaleX',//: the width of the screen is adjusted to match the viewport aspect ratio.
		'scaleY',//: the height of the screen is adjusted to match the viewport aspect ratio.
	];
	if (typeof newVal !== 'string') {
		if (process.env.TRAINING_WHEELS) {
			console.warn(`setCropMode(): received an invalid input type that it will ignore. the input type was ${typeof newVal}`);
		}
		return;
	}
	if (validModes.includes(newVal) === false) {
		if (process.env.TRAINING_WHEELS) {
			console.warn(`setCropMode(): you must provide a valid crop mode to set.  You provided '${newVal}'.  Valid values are'${validModes.join(`', '`)}'.`);
		}
		return;
	}
	internal.cropMode = newVal;
}

export function private_loadCanvasAndContextQuietly() {
	const _canvas = document.getElementById(internal.canvasID);
	if (!_canvas) {
		return false;
	}
	try {
		const _context = _canvas.getContext('2d');
		userObjectsAndFunctions.canvas = _canvas;
		userObjectsAndFunctions.context = _context;
		return true;
	} catch {
		return false;
	}
}



export function private_prepareToRender() {
	const _canvas = document.getElementById(internal.canvasID);
	if (!_canvas) {
		if (process.env.TRAINING_WHEELS) {
			throw new Error(`prepareToRender(): The canvas element in the HTML document was not found when searching for id: '${internal.canvasID}'.  Make sure that you have a canvas HTML element:\n\t<canvas id="${internal.canvasID}"></canvas>\nIn your HTML file so your drawing can be rendered.`)
		} else {
			throw new Error(`document element ${internal.canvasID} not found.`)
		}
	}
	try {
		const _context = _canvas.getContext('2d');
		const windownDimensions = {
			width:window.innerWidth,
			height:window.innerHeight,
			aspectRatio:window.innerWidth/window.innerHeight,
		};
		const canvasAspectRatio = (internal.width/internal.height)*internal.pixelAspect;
		_canvas.style.imageRendering = internal.imageRendering;
		_canvas.width = internal.width;
		_canvas.height = internal.height;
		switch (internal.cropMode) {
			case 'fit': {
				if (canvasAspectRatio > windownDimensions.aspectRatio) {
					//go one way.
					_canvas.style.width='100vw';
					_canvas.style.height='auto';
					_canvas.style.aspectRatio=`${canvasAspectRatio}`;
				} else {
					//go the other'
					_canvas.style.height='100vh';
					_canvas.style.width='auto';
					_canvas.style.aspectRatio=`${canvasAspectRatio}`;
				}
				break;
			}
			case 'stretch': {
				_canvas.style.width='100vw';
				_canvas.style.height='100vh';
				_canvas.style.aspectRatio='unset';
				break;
			}
			case 'scaleX': {

				break;
			}
			case 'scaleY': {

				break;
			}
		}

		_context.save();
		_context.font = blockEight.fontStyle;
		internal.contextTransforms.forEach((t) => {
			switch (t.type) {
				case 'transform': {
					_context.transform(t.a,t.b,t.c,t.c,t.e,t.f);
					break;
				}
				case 'translate': {
					_context.translate(t.x,t.y);
					break;
				}
				case 'scale': {
					_context.scale(t.x,t.y);
					break;
				}
				case 'rotate': {
					_context.rotate(t.angle);
					break;
				}
			}
		});

		userObjectsAndFunctions.canvas = _canvas;
		userObjectsAndFunctions.context = _context;
		
	} catch (err) {
		throw new Error(err);
	}
}

export function private_finishRendering() {
	userObjectsAndFunctions.context.restore();
}





/**
 * @function setScreenWidth
 * @param {integer} x A range from 1-1920 to set the screen width. To set only width, use setScreenWidth.
 * @param {integer} y A range from 1-1920 to set the screen height.  To set only height, use setScreenHeight
 */
export function setScreenWidth(x=internal.screenWidth) {
	if (typeof x === 'number' 
		&& Math.floor(x) > 0
		&& x < 1920
	) {
		internal.screenWidth = x;
	}}
export function setScreenHeight(y=internal.screenHeight) {
	if (typeof y === 'number'
		&& Math.floor(y) > 0
		&& y < 1920
	) {
		internal.screenHeight = y;
	}
}

/**
 * @function setScreenDimensions
 * @param {integer} x A range from 1-1920 to set the screen width. To set only width, use setScreenWidth.
 * @param {integer} y A range from 1-1920 to set the screen height.  To set only height, use setScreenHeight
 */

export function setScreenDimensions(x=internal.screenWidth,y=internal.screenHeight) {
	setScreenWidth(x);
	setScreenHeight(y);
}


userObjectsAndFunctions.setScreenDimensions = setScreenDimensions;
userObjectsAndFunctions.setScreenWidth = setScreenWidth;
userObjectsAndFunctions.setScreenHeight = setScreenHeight;
userObjectsAndFunctions.setCropMode = setCropMode;


export function printLogToScreen(arr) {
	const font = blockEight
	const maxLines = Math.floor(internal.height/font.lineHeight)-1;
	while (arr.length > maxLines) {
		arr.shift();
	}
	userObjectsAndFunctions.context.save();
	userObjectsAndFunctions.context.fillStyle = '#00000080';
	userObjectsAndFunctions.context.fillRect(0,0,internal.width,arr.length*font.lineHeight+4);
	userObjectsAndFunctions.context.font = font.fontStyle;
	userObjectsAndFunctions.context.fillStyle = '#ffffffa0';
	arr.forEach((e,i) => {
		userObjectsAndFunctions.context.fillText(e,4,i*font.lineHeight+font.lineHeight);
	});
	userObjectsAndFunctions.context.restore();
}