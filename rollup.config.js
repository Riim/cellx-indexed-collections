import eslint from 'rollup-plugin-eslint';
import babel from 'rollup-plugin-babel';

export default {
	input: 'src/index.js',

	external: [
		'@riim/map-set-polyfill',
		'@riim/mixin',
		'@riim/next-uid',
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
			'@riim/map-set-polyfill': 'mapSetPolyfill',
			'@riim/mixin': 'mixin',
			'@riim/next-uid': 'nextUID',
			cellx: 'cellx'
		}
	}
};
