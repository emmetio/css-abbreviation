'use strict';

import { isNumber, eatAlphaWord } from './utils';

const PERCENT = 37; // %
const DOT     = 46; // .
const DASH    = 45; // -

/**
 * Consumes numeric CSS value (number with optional unit) from current stream,
 * if possible
 * @param  {StreamReader} stream
 * @return {NumericValue}
 */
export default function(stream) {
    stream.start = stream.pos;
    if (eatNumber(stream)) {
        const num = stream.current();
        stream.start = stream.pos;

        // eat unit, which can be a % or alpha word
        stream.eat(PERCENT) || eatAlphaWord(stream);
        return new NumericValue(num, stream.current());
    }
}

/**
 * A numeric CSS value with optional unit
 */
class NumericValue {
    constructor(value, unit) {
        this.type = 'numeric';
        this.value = Number(value);
        this.unit = unit || '';
    }

    toString() {
        return `${this.value}${this.unit}`;
    }
}

/**
 * Eats number value from given stream
 * @param  {StreamReader} stream
 * @return {Boolean} Returns `true` if number was consumed
 */
function eatNumber(stream) {
	const start = stream.pos;
    const negative = stream.eat(DASH);
	let hadDot = false, code;

	while (!stream.eol()) {
		code = stream.peekCode();

        // either a second dot or not a number: stop parsing
		if (code === DOT ? hadDot : !isNumber(code)) {
			break;
		}

        if (code === DOT) {
            hadDot = true;
        }

        stream.pos++;
	}

    if (negative && stream.pos - start === 1) {
        // edge case: consumed dash only, bail out
        stream.pos = start;
    }

    return start < stream.pos;
}
