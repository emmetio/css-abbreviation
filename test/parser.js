'use strict';

const assert = require('assert');
require('babel-register');
const parse = require('../lib/parser').default;

describe('CSS Abbreviation parser', () => {
    it('parse', () => {
        console.log(parse('p10-20--30'));
    });
});
