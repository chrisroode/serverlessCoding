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
	{
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
	{
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
				'process.env.TRAINING_WHEELS':JSON.stringify(true),
				'process.env.IS_WEBPACK':JSON.stringify(true),
			})
		]
	}
];