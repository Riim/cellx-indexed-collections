import eslint from 'rollup-plugin-eslint';
import babel from 'rollup-plugin-babel';

export default {
	input: 'src/index.js',

	external: [
		'cellx'
	],

	plugins: [
		eslint(),
		babel({
			exclude: 'node_modules/**'
		})
	],

	output: {
		file: 'dist/index.js',
		format: 'umd',
		name: 'cellxIndexedCollections',

		globals: {
			cellx: 'cellx'
		}
	}
};
