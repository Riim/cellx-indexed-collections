import eslint from 'rollup-plugin-eslint';
import babel from 'rollup-plugin-babel';

export default {
	entry: 'src/cellx-indexed-collections.js',

	external: ['cellx'],
	globals: { cellx: 'cellx' },

	format: 'umd',
	moduleName: 'cellxIndexedCollections',

	dest: 'dist/cellx-indexed-collections.js',

	plugins: [
		eslint(),
		babel({ exclude: 'node_modules/**' })
	]
};
