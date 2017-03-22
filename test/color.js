'use strict';

const assert = require('assert');
const StreamReader = require('@emmetio/stream-reader');
require('babel-register');
const parseColor = require('../lib/color').default;
const color = abbr => parseColor(new StreamReader(abbr));

describe('Color value', () => {
	it('create', () => {
		assert.equal(color('#0'), '#000000');
		assert.equal(color('#123'), '#112233');
		assert.equal(color('#ffcc00'), '#ffcc00');
		assert.equal(color('#fc0.5'), 'rgba(255, 204, 0, 0.5)');
	});

	it('convert to hex', () => {
		assert.equal(color('#123').toHex(), '#112233');
		assert.equal(color('#123').toHex(true), '#123');
		assert.equal(color('#0').toHex(true), '#000');
		assert.equal(color('#ffcc00').toHex(true), '#fc0');
	});

	it('convert to RGB', () => {
		assert.equal(color('#123').toRGB(), 'rgb(17, 34, 51)');
		assert.equal(color('#123.3').toRGB(), 'rgba(17, 34, 51, 0.3)');
	});
});
