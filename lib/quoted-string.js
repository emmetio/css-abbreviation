'use strict';

const SINGLE_QUOTE = 39; // '
const DOUBLE_QUOTE = 34; // "

/**
 * Consumes 'single' or "double"-quoted string from given string, if possible
 * @param  {StreamReader} stream
 * @return {String}
 */
export default function(stream) {
	const code = stream.peekCode();

	if (code === SINGLE_QUOTE || code === DOUBLE_QUOTE) {
		stream.start = stream.pos++;
		stream.eatQuoted(code);
		return new QuotedString(stream.current());
	}
}

class QuotedString {
	constructor(value) {
		this.type = 'string';
		this.value = value;
	}

	toString() {
		return this.value;
	}
}
