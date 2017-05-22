import eslint from 'rollup-plugin-eslint';
import babel from 'rollup-plugin-babel';

export default {
	entry: 'src/index.js',

	external: ['cellx'],
	globals: { cellx: 'cellx' },

	format: 'umd',
	moduleName: 'cellxIndexedCollections',

	dest: 'dist/index.js',

	plugins: [
		eslint(),
		babel({ exclude: 'node_modules/**' })
	]
};
