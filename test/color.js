'use strict';

const assert = require('assert');
require('babel-register');
const Color = require('../lib/color').default;
const color = (hex, alpha) => new Color(hex, alpha);

describe('Color value', () => {
    it('create', () => {
        assert.equal(color('#0'), '#000000');
        assert.equal(color('#123'), '#112233');
        assert.equal(color('#ffcc00'), '#ffcc00');
        assert.equal(color('#ffcc00', 0.5), 'rgba(255, 204, 0, 0.5)');
    });

    it('convert to hex', () => {
        assert.equal(color('#123').toHex(), '#112233');
        assert.equal(color('#123').toHex(true), '#123');
        assert.equal(color('#0').toHex(true), '#000');
        assert.equal(color('#ffcc00').toHex(true), '#fc0');
    });

    it('convert to RGB', () => {
        assert.equal(color('#123').toRGB(), 'rgb(17, 34, 51)');
        assert.equal(color('#123', 0.3).toRGB(), 'rgba(17, 34, 51, 0.3)');
    });
});
