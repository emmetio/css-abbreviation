'use strict';

const assert = require('assert');
require('babel-register');
const parser = require('../lib/parser').default;

describe('CSS Abbreviation parser', () => {
    const stringify = tree =>
        tree.children.map(node => `${node.name}: ${node.value};`).join('');
    const parse = abbr => stringify(parser(abbr));

    it('parse numeric units', () => {
        assert.equal(parse('p10'), 'p: 10;');
        assert.equal(parse('p-10'), 'p: -10;');
        assert.equal(parse('p-10-'), 'p: -10;');
        assert.equal(parse('p-10-20'), 'p: -10 20;');
        assert.equal(parse('p-10--20'), 'p: -10 -20;');
        assert.equal(parse('p-10-20--30'), 'p: -10 20 -30;');
        assert.equal(parse('p-10p-20--30'), 'p: -10p -20 -30;')
        assert.equal(parse('p-10%-20--30'), 'p: -10% -20 -30;')
    });

    it('parse color', () => {
        assert.equal(parse('c#'), 'c: #000000;');
        assert.equal(parse('c#1'), 'c: #111111;');
        assert.equal(parse('c#f'), 'c: #ffffff;');
        assert.equal(parse('c#af'), 'c: #afafaf;');
        assert.equal(parse('c#fc0'), 'c: #ffcc00;');
        assert.equal(parse('c#11.5'), 'c: rgba(17, 17, 17, 0.5);');
        assert.equal(parse('c#.99'), 'c: rgba(0, 0, 0, 0.99);');
    });

    it('parse keywords', () => {
        assert.equal(parse('m-a'), 'm: a;');
        assert.equal(parse('m-abc'), 'm: abc;');
        assert.equal(parse('m-a0'), 'm: a 0;');
        assert.equal(parse('m-a0-a'), 'm: a 0 a;');
    });

    it('parse mixed', () => {
        assert.equal(parse('bd1-s#fc0'), 'bd: 1 s #ffcc00;');
        assert.equal(parse('p0+m0'), 'p: 0;m: 0;')
    });
});
