'use strict';

const assert = require('assert');
require('babel-register');
const parser = require('../lib/parser').default;

describe('CSS Abbreviation parser', () => {
    const parse = abbr => parser(abbr).children[0];


    it('parse', () => {
        // p10 -> [p, 10]
        // p-10 -> [p, -10]
        // p-10-20 -> [p, -10, 20]
        // p-10--20 -> [p, -10, -20]
        console.log(parse('p-10p-20--30'));
    });
});
