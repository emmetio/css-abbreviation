export default {
	entry: './index.js',
	external: [
		'@emmetio/stream-reader',
		'@emmetio/stream-reader-utils',
		'@emmetio/node'
	],
	targets: [
		{format: 'cjs', dest: 'dist/css-abbreviation.cjs.js'},
		{format: 'es',  dest: 'dist/css-abbreviation.es.js'}
	]
};
