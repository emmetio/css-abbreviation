'use strict';

import StreamReader from '@emmetio/stream-reader';

const HASH   = 35; // #
const DOLLAR = 36; // $
const DASH   = 45; // -
const DOT    = 46; // .

/**
 * Prepares given Emmet abbreviation for CSS ouput:
 * finds embedded values in node names, extracts them and saves as CSS node value
 * @param {Node} tree Parsed Emmet abbreviation tree
 * @param {Object} [options] Additional options
 * @return {Node}
 */
export default function(tree, options) {
    tree.walk(resolve);
    return tree;
}

/**
 * Extracts embedded value from given abbreviation node and saves it as node value
 * @param  {Node} node
 */
function resolve(node) {
    if (node.name) {
        const parts = split(node.name);
    }
}

/**
 * Splits given name at embedded value position. If no embedded value found,
 * returns `null`
 * @param  {String} name
 * @return {Object}
 */
function split(name) {
    const parts = [];
    const stream = new StreamReader(name);

    return null;
}

/**
 * Consumes a single CSS abbreviation word from given string and returns it
 * @param  {StreamReader} stream
 * @return {String}
 */
function consumeWord(stream) {
    stream.start = stream.pos;
	while (!stream.eol()) {
		if (stream.eat(DASH)) {
			// a dash '-' could be a word separator or negative sign for numbers
			if (isNumeric(stream.peekCode())) {

			}
		}
	}
}

/**
 * Consumes number from given string at current stream position
 * @param  {StreamReader} stream
 * @return {Boolean} Returns `true` if number was consumed
 */
function consumeNumber(stream) {
	const start = stream.pos;
	let hadDot = false, code;
	while (!stream.eol()) {
		code = stream.peekCode();
		if ((code === DOT && hadDot) || !isNumeric(code)) {
			break;
		}


		if (code === DOT) {
			if (hadDot) {
				break;
			}
			hadDot = true;
			stream.pos++;
		}
		isNumeric()



	}
}

/**
 * Check if given character code is a numeric value
 * @param  {Number}  code
 * @return {Boolean}
 */
function isNumeric(code) {
    return code && (code > 47 && code < 58);
}
