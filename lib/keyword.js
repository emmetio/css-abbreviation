'use strict';

import {
	eatAlphaNumericWord,
	eatAlphaWord,
	eatWhile,
	isAlphaNumericWord
} from './utils';

const DOLLAR = 36; // $
const DASH   = 45; // -
const AT     = 64; // @

/**
 * Consumes a keyword: either a variable (a word that starts with $ or @) or CSS
 * keyword or shorthand
 * @param  {StreamReader} stream
 * @param  {Boolean} [short] Use short notation for consuming value.
 * The difference between “short” and “full” notation is that first one uses
 * alpha characters only and used for extracting keywords from abbreviation,
 * while “full” notation also supports numbers and dashes
 * @return {String} Consumed variable
 */
export default function(stream, short) {
    stream.start = stream.pos;

    if (stream.eat(DOLLAR) || stream.eat(AT)) {
        // SCSS or LESS variable
		eatAlphaNumericWord(stream);
    } else if (short) {
        eatAlphaWord(stream);
    } else {
		eatKeyword(stream);
	}

    return stream.start !== stream.pos ? new Keyword(stream.current()) : null;
}

export class Keyword {
	constructor(value) {
		this.type = 'keyword';
		this.value = value;
	}

	toString() {
		return this.value;
	}
}

function eatKeyword(stream) {
	return eatWhile(stream, isKeyword);
}

function isKeyword(code) {
	return isAlphaNumericWord(code) || code === DASH;
}
