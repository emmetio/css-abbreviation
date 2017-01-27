'use strict';

import consumeColor from './color';
import consumeNumericValue from './numeric-value';
import consumeKeyword from './keyword';

const DASH   = 45; // -

/**
 * Consumes embedded value from Emmet CSS abbreviation stream
 * @param  {StreamReader} stream
 * @return {CSSValue}
 */
export default function(stream) {
    const values = new CSSValue();
    let value;

    while (!stream.eol()) {
        if (value = consumeNumericValue(stream) || consumeColor(stream)) {
            // edge case: a dash after unit-less numeric value or color should
            // be treated as value separator, not negative sign
            if (!value.unit) {
                stream.eat(DASH);
            }
        } else {
            stream.eat(DASH);
            value = consumeKeyword(stream);
        }

        if (value) {
            values.add(value);
        } else {
            break;
        }
    }

    return values;
}

/**
 * A wrapper for holding CSS value
 */
class CSSValue {
    constructor() {
        this.type = 'css-value';
        this.value = [];
    }

    get size() {
        return this.value.length;
    }

    add(value) {
        this.value.push(value);
    }

    has(value) {
        return this.value.indexOf(value) !== -1;
    }

    toString() {
        return this.value.join(' ');
    }
}
