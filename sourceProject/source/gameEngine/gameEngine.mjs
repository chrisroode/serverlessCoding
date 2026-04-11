/**
 * @module gameEngine
 */

import * as module_keyboard from './modules/keyboardInput.mjs';
import * as module_graphics2d from './modules/graphics2d.mjs';
import * as module_mouse from './modules/mouseInput.mjs';

const DEFAULT_MAXIMUM_FRAMERATE = 30;

const sampleSetupCode = `

// load the game engine.
const myGameEngine = load_game_engine();

function myInitializationFunction() {
	// write code set up your game here.
}

function myGameLoopFunction(deltaTime) {
	// write code that runs every frame here.
}

myGameEngine.setInitialization(myInitializationFunction);
myGameEngine.setGameLoop(myGameLoopFunction);

myGameEngine.start();`;

const internal = {
	isRunning:false,
	isInitialized:false,
	lastFrameTimestamp:0,
	canvasID:'canvas',
	canvasContextType:'2d',
	engineInit:process.env.TRAINING_WHEELS
		?() => {
			throw new Error(`No initialization function has been defined for the game engine.  You need to define a function to run when the game engine starts.  Below is an example solution:${sampleSetupCode}`)
		}
		:()=>{},
	engineLoop:process.env.TRAINING_WHEELS
		?() => {
			throw new Error(`No game loop function has been defined for the game engine.  You need to define a function to run for every frame of your game.  Below is an example solution:${sampleSetupCode}`);
		}
		:()=>{},
	log:[],
};

function setMaximumFramerate(framesPerSecond) {
	if (typeof framesPerSecond !== 'number') {
		if (process.env.TRAINING_WHEELS) {
			throw new Error(`gameEngine.setMaximumFramerate(): argument must be a number.  Received '${typeof fps}'.  Check the argument that you entered when calling gameEngine.setMaximumFramerate(/* this thing here */)`);
		}
		return;
	}
	if (framesPerSecond < 10) {
		framesPerSecond = 10;
	}
	if (framesPerSecond > 60) {
		framesPerSecond = 60;
	}
	internal.maximumIntervalMilliseconds = Math.floor(1000/framesPerSecond);
}


function private_runLoop() {
	if (internal.isRunning === false) {
		return;
	}
	requestAnimationFrame(private_runLoop);
	const now = Date.now();
	const elapsed = now - internal.lastFrameTimestamp;
	if (elapsed < internal.maximumIntervalMilliseconds) {
		return;
	}
	internal.lastFrameTimestamp = now;
	module_graphics2d.private_prepareToRender();

	internal.engineLoop(elapsed/1000);
	module_graphics2d.private_printLogToScreen(internal.log);
	module_graphics2d.private_finishRendering();
	module_keyboard.flushKeys();
	module_mouse.private_flushMouse();
}

/**
 * @function setInitialization
 * @description Sets an initialization function for the game engine.  This function will only be called once.  If you stop and then start the game engine, it will not call the initialization function again.
 * @param {function} func A function that you write to set up everything for your game to run.  This function only runs once, so it can do more time consuming calculations.
 */
export function setInitialization(func) {
	if (process.env.TRAINING_WHEELS
		&& typeof func !== 'function'
	) {
		throw new Error(`gameEngine.setInitialization(): You did not provide the proper function argument when you called setInitialization().  Make sure to define a function and pass it through as the only argument to this function.`);
	}
	internal.engineInit = func;
}

/**
 * @function setGameLoop
 * @description Sets a new function to be executed on every frame of the game.
 * @param {function} func A function that you write to update the state of the game, calculate physics, and then draw a new frame for the user.  You have to do this fast.  If it takes too long to run this function, your game will get choppy, and the tab might even freeze.
 */
export function setGameLoop(func) {
	if (process.env.TRAINING_WHEELS
		&& typeof func !== 'function'
	) {
		throw new Error(`gameEngine.setGameLoop(): You did not provide the proper function argument when you called setGameLoop().  Make sure to define a function and pass it through as the only argument to this function.`);
	}
	if (process.env.TRAINING_WHEELS
		&& func.length < 1
	) {
		console.warn(`It appears you did not add the argument 'deltaTime' to your game loop function.  Your game will not behave well if you do not account for different framerates while playing, and many of the library functions require you to pass deltaTime into them to yield proper results.`)
	}
	internal.engineLoop = func;
}

/**
 * @function start
 * @description Tells the game engine to call the function you set in 'gameEngine.setInitialization()' and then starts calling the game loop you set in 'gameEngine.setGameLoop()' over and over again.  This will continue to happen until you call 'gameEngine.stop().
 */
export function start() {
	setMaximumFramerate(DEFAULT_MAXIMUM_FRAMERATE);
	module_graphics2d.private_loadCanvasAndContextQuietly();
	internal.lastFrameTimestamp = Date.now();
	internal.isRunning = true;
	//Call User's init function.
	if (internal.isInitialized === false) {
		internal.engineInit();
		internal.isInitialized = true;
	}
	//Start all of the engine's components.
	module_keyboard.privateStartKeyboard();
	module_mouse.privateStartMouse();
	private_runLoop();

}

/**
 * @function stop
 * @description Turns off the game engine so it will stop running.  You should not need to use this function, but in case you want to stop everything, you can call it.  The game loop will not be called again until gameEngine.start() is called.
 */
export function stop() {
	internal.isRunning = false;
	module_keyboard.privateStopKeyboard();
	module_mouse.privateStopMouse();
}



/**
 * @function log
 * @description Logs a variable to the game engine screen.  This will be drawn at the end of the game loop and cover up any content on the screen.  If the log gets too full, old information will be removed.  Remember to use clearLog() to empty it out.
 * @param  {...any} args arguments
 */
export function log(...args) {
	const processedArgs = [];
	args.forEach((arg) => {
		processedArgs.push(`${arg}`);
	});
	internal.log.push(processedArgs.join(' '));
}

/**
 * @function clearLog
 * @description removes everything from the gameEngine log.
 */
export function clearLog() {
	internal.log = [];
}



/**
 * @property {module:keyboard} keyboard Access to the keyboard.
 */
export const keyboard = {
	getKey:module_keyboard.getKey,
}

/**
 * @property {module:graphics2d} graphics Access to the graphics.
 */
export const graphics = module_graphics2d.userObjectsAndFunctions;




/* These functions are NOT documented.  You will have to read the source to figure them out. */
export const advanced = {
	engine:{
		setMaximumFramerate,
	},
	graphics:{
		...module_graphics2d.userObjectsAndFunctions,
	},
	keyboard:{
		getKeyMap:module_keyboard.debug__GetKeyMap,
	},
	mouse:{
		getMouseState:module_mouse.debug__GetMouseState,
		setPreventDefaultOnMouseEvents:module_mouse.setPreventDefaultOnMouseEvents,
	}
}


