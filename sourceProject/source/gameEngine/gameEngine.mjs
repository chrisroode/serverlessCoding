import * as private_keyboard from './modules/keyboardInput.mjs';

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

	internal.engineLoop(elapsed/1000);
	private_keyboard.flushKeys();
}


export function setInitialization(func) {
	if (process.env.TRAINING_WHEELS
		&& typeof func !== 'function'
	) {
		throw new Error(`gameEngine.setInitialization(): You did not provide the proper function argument when you called setInitialization().  Make sure to define a function and pass it through as the only argument to this function.`);
	}
	internal.engineInit = func;
}


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

export function start() {
	setMaximumFramerate(DEFAULT_MAXIMUM_FRAMERATE);
	internal.lastFrameTimestamp = Date.now();
	internal.isRunning = true;
	//Call User's init function.
	if (internal.isInitialized === false) {
		internal.engineInit();
		internal.isInitialized = true;
	}
	//Start all of the engine's components.
	private_keyboard.privateStartKeyboard();
	private_runLoop();

}


export function stop() {
	internal.isRunning = false;
	private_keyboard.privateStopKeyboard();
}








export const keyboard = {
	getKey:private_keyboard.getKey,

}

export const advanced = {
	engine:{
		setMaximumFramerate,
	},
	keyboard:{
		getKeyMap:private_keyboard.debug__GetKeyMap,
	}
}
