'use strict';

const assert = require('assert');
require('babel-register');
const parser = require('../index').default;

describe('CSS Abbreviation parser', () => {
	function stringify(tree) {
		return tree.children
		.map(node => {
			let prop = node.name;

			if (node.attributes.length) {
				prop += `(${node.attributes.map(attr => `${attr.name} => ${attr.value}`).join(', ')})`;
			}

			if (node.value.size) {
				prop += `: ${node.value}`;
			}

			return `${prop};`;
		})
		.join('');
	}

	const parse = abbr => stringify(parser(abbr));

	it('numeric units', () => {
		assert.equal(parse('p10'), 'p: 10;');
		assert.equal(parse('p-10'), 'p: -10;');
		assert.equal(parse('p-10-'), 'p: -10;');
		assert.equal(parse('p-10-20'), 'p: -10 20;');
		assert.equal(parse('p-10--20'), 'p: -10 -20;');
		assert.equal(parse('p-10-20--30'), 'p: -10 20 -30;');
		assert.equal(parse('p-10p-20--30'), 'p: -10p -20 -30;');
		assert.equal(parse('p-10%-20--30'), 'p: -10% -20 -30;');

		assert.equal(parse('p.5'), 'p: 0.5;');
		assert.equal(parse('p-.5'), 'p: -0.5;');
		assert.equal(parse('p.1.2.3'), 'p: 0.1 0.2 0.3;');
		assert.equal(parse('p.1-.2.3'), 'p: 0.1 0.2 0.3;');
		assert.equal(parse('p.1--.2.3'), 'p: 0.1 -0.2 0.3;');
	});

	it('color', () => {
		assert.equal(parse('c#'), 'c: #000000;');
		assert.equal(parse('c#1'), 'c: #111111;');
		assert.equal(parse('c#f'), 'c: #ffffff;');
		assert.equal(parse('c#a#b#c'), 'c: #aaaaaa #bbbbbb #cccccc;');
		assert.equal(parse('c#af'), 'c: #afafaf;');
		assert.equal(parse('c#fc0'), 'c: #ffcc00;');
		assert.equal(parse('c#11.5'), 'c: rgba(17, 17, 17, 0.5);');
		assert.equal(parse('c#.99'), 'c: rgba(0, 0, 0, 0.99);');
		assert.equal(parse('c#t'), 'c: transparent;');
	});

	it('keywords', () => {
		assert.equal(parse('m:a'), 'm: a;');
		assert.equal(parse('m-a'), 'm: a;');
		assert.equal(parse('m-abc'), 'm: abc;');
		assert.equal(parse('m-a0'), 'm: a 0;');
		assert.equal(parse('m-a0-a'), 'm: a 0 a;');
	});

	it('arguments', () => {
		const g = parser('lg(top, "red, black", rgb(0, 0, 0) 10%)').firstChild;
		assert.equal(g.name, 'lg');
		assert.equal(g.attributes.length, 3);

		let attr = g.attributes[0];
		assert.equal(attr.name, '0');
		assert.equal(attr.value.size, 1);
		assert.equal(attr.value.value[0].type, 'keyword');
		assert.equal(attr.value.value[0].value, 'top');

		attr = g.attributes[1];
		assert.equal(attr.name, '1');
		assert.equal(attr.value.size, 1);
		assert.equal(attr.value.value[0].type, 'string');
		assert.equal(attr.value.value[0].value, '"red, black"');

		attr = g.attributes[2];
		assert.equal(attr.name, '2');
		assert.equal(attr.value.size, 2);
		assert.equal(attr.value.value[0].type, 'function');

		const args = attr.value.value[0].args;
		assert.equal(args.length, 3);
		assert.equal(args[0].value[0].type, 'numeric');
		assert.equal(args[0].value[0].value, 0);
	});

	it('important/exclamation', () => {
		assert.equal(parse('!'), '!;');
		assert.equal(parse('p!'), 'p: !;');
		assert.equal(parse('p10!'), 'p: 10 !;');
	});

	it('mixed', () => {
		assert.equal(parse('bd1-s#fc0'), 'bd: 1 s #ffcc00;');
		assert.equal(parse('bd#fc0-1'), 'bd: #ffcc00 1;');
		assert.equal(parse('p0+m0'), 'p: 0;m: 0;')
		assert.equal(parse('p0!+m0!'), 'p: 0 !;m: 0 !;')
	});
});
