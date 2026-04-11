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
 * @description Sets the width of the screen to the specified value.
 * @param {integer} x A range from 1-1920 to set the screen width. To set only width, use setScreenWidth.
 */
export function setScreenWidth(x=internal.width) {
	console.log(x, internal);
	if (typeof x === 'number' 
		&& Math.floor(x) > 0
		&& x < 1920
	) {
		internal.width = x;
	}}


/**
 * @function setScreenHeight
 * @description Sets the height of the screen to the specified value.
 * @param {integer} y A range from 1-1920 to set the screen height.  To set only height, use setScreenHeight
 */
export function setScreenHeight(y=internal.height) {
	if (typeof y === 'number'
		&& Math.floor(y) > 0
		&& y < 1920
	) {
		internal.height = y;
	}
}

/**
 * @function setScreenDimensions
 * @description Sets the dimensions of the screen to the specified value.
 * @param {integer} x A range from 1-1920 to set the screen width. To set only width, use setScreenWidth.
 * @param {integer} y A range from 1-1920 to set the screen height.  To set only height, use setScreenHeight
 */

export function setScreenDimensions(x=internal.width,y=internal.height) {
	setScreenWidth(x);
	setScreenHeight(y);
}


/**
 * @function setPixelAspectRatio
 * @description Sets the squareness of the pixel.  This is not the size of the pixel, but the ratio of the width to the height of each pixel.
 * @param {integer} width the width ratio for the pixel.
 * @param {integer} height the height ratio for the pixel.
 */
export function setPixelAspectRatio(width,height=1) {
	internal.pixelAspect = width/height;
}


/**
 * @function loadRetroScreen
 * @description sets the screen resolution and pixel aspect ratio to preset values to simulate retro computer systems.
 * @param {enum_retroScreens} screen 
 */
export function loadRetroScreen(scr) {

	/**
	 * @constant enum_retroScreens
	 * @property {string} snes Sets screen resolution to 256x227 with a 4:3 screen aspect ratio.
	 * @property {string} apple2 Sets screen resolution to 280x192.
	 * @property {string} cPet Sets screen resolution to 200x12.
	 * @property {string} atari Sets screen resolution to 160x12.
	 * @property {string} c64 Sets screen resolution to 320x200.
	 * @property {string} ibm Sets screen resolution to 20x200.
	 */
	const _par = { //pixel aspet ratios.
		snes:{
			pixelRatio:7/6,
			width:256,
			height:224,
		},
		apple2:{
			pixelRatio:36/32,
			width:280,
			height:192,
		},
		cPet:{
			pixelRatio:43/45,
			width:200,
			height:192,
		},
		atari:{
			pixelRatio:22/13,
			width:160,
			height:192,
		},
		c64:{
			pixelRatio:3/4,
			width:320,
			height:200,
		},
		ibm:{
			pixelRatio:24/25,
			width:320,
			height:200,
		},
	};
	if (typeof _par[scr] === 'undefined') {
		if (process.env.TRAINING_WHEELS) {
			console.error(`loadRetroScreen() was unable to load the screen '${scr}.'  The retro screens you may use are '${Object.keys(_par).join(`', '`)}.'`)
		}
		return;
	}
	internal.width = _par[scr].width;
	internal.height = _par[scr].height;
	internal.pixelAspect = _par[scr].pixelAspect;
}



export function private_printLogToScreen(arr) {
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


userObjectsAndFunctions.setScreenDimensions = setScreenDimensions;
userObjectsAndFunctions.setScreenWidth = setScreenWidth;
userObjectsAndFunctions.setScreenHeight = setScreenHeight;
userObjectsAndFunctions.setCropMode = setCropMode;
userObjectsAndFunctions.setPixelAspectRatio = setPixelAspectRatio;
userObjectsAndFunctions.loadRetroScreen = loadRetroScreen;