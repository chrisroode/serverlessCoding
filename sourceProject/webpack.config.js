import path from 'node:path';
import { fileURLToPath } from 'node:url';
import webpack from 'webpack';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseConfig = {
	entry: {
		game_engine:'./source/buildGameEngine.js',

	},
	output: {
		path:path.resolve(__dirname,'build'),
		filename:'[name].js',
	},
}

export default [
	{ //minified in build folder.
		...baseConfig,

		output: {
			...baseConfig.output,
			filename:'[name].minified.js',
		},
		mode:'production',
		optimization: {
			minimize:true,
		},
		plugins:[
			new webpack.DefinePlugin({
				'process.env.TRAINING_WHEELS':JSON.stringify(false),
				'process.env.IS_WEBPACK':JSON.stringify(true),
			})
		]
	},
	{ //normal in build folder.
		...baseConfig,

		output: {
			...baseConfig.output,
			filename:'[name].js',
		},
		mode:'production',
		optimization: {
			minimize:false,
		},
		plugins:[
			new webpack.DefinePlugin({
				'process.env.TRAINING_WHEELS':JSON.stringify(false),
				'process.env.IS_WEBPACK':JSON.stringify(true),
			})
		]
	},
	{ //minified build for tests.
		...baseConfig,

		output: {
			...baseConfig.output,
			path:path.resolve(__dirname,'source/tests'),
			filename:'[name].js',
		},
		mode:'production',
		optimization: {
			minimize:true,
		},
		plugins:[
			new webpack.DefinePlugin({
				'process.env.TRAINING_WHEELS':JSON.stringify(true),
				'process.env.IS_WEBPACK':JSON.stringify(true),
			})
		]
	},
	{ //minified build for demos.
		...baseConfig,

		output: {
			...baseConfig.output,
			path:path.resolve(__dirname,'demos'),
			filename:'[name].js',
		},
		mode:'production',
		optimization: {
			minimize:true,
		},
		plugins:[
			new webpack.DefinePlugin({
				'process.env.TRAINING_WHEELS':JSON.stringify(true),
				'process.env.IS_WEBPACK':JSON.stringify(true),
			})
		]
	},
	{ //minified build for boilerplates.
		...baseConfig,

		output: {
			...baseConfig.output,
			path:path.resolve(__dirname,'source/boilerplates'),
			filename:'[name].js',
		},
		mode:'production',
		optimization: {
			minimize:true,
		},
		plugins:[
			new webpack.DefinePlugin({
				'process.env.TRAINING_WHEELS':JSON.stringify(true),
				'process.env.IS_WEBPACK':JSON.stringify(true),
			})
		]
	},
];