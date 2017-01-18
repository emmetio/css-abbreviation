'use strict';

import Node from '@emmetio/node';
import StreamReader from '@emmetio/stream-reader';
import CSSValue from './css-value';
import Color from './color';
import NumericValue from './numeric-value';
import consumeArguments from './arguments';

const HASH       = 35; // #
const DOLLAR     = 36; // $
const PERCENT    = 37; // %
const PLUS       = 43; // +
const DASH       = 45; // -
const DOT        = 46; // .
const AT         = 64; // @
const UNDERSCORE = 95; // _

/**
 * Parses given Emmet CSS abbreviation and returns it as parsed Node tree
 * @param {String} abbr
 * @return {Node}
 */
export default function(abbr) {
    const root = new Node();
    const stream = new StreamReader(abbr);
    let node;

    while (!stream.eol()) {
        let node = new Node(consumeIdent(stream));
        node.value = consumeValue(stream);

        const args = consumeArguments(stream);
        if (args) {
            // technically, arguments in CSS are anonymous Emmet Node attributes,
            // but since Emmet can support only one anonymous, `null`-name
            // attribute (for good reasons), we’ll use argument index as name
            for (let i = 0; i < args.length; i++) {
                node.setAttribute(String(i), args[i].trim());
            }
        }

        root.appendChild(node);

        // CSS abbreviations cannot be nested, only listed
        if (!stream.eat(PLUS)) {
            break;
        }
    }

    if (!stream.eol()) {
        throw stream.error('Unexpected character');
    }

    return root;
}

/**
 * Consumes CSS property identifier from given stream
 * @param  {StreamReader} stream
 * @return {String}
 */
function consumeIdent(stream) {
    stream.start = stream.pos;
    return eatWhile(stream, isIdent) ? stream.current() : null;
}

/**
 * Consumes embedded value from Emmet CSS abbreviation stream
 * @param  {StreamReader} stream
 * @return {CSSValue}
 */
function consumeValue(stream) {
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
 * Consumes numeric CSS value (number with optional unit) from current stream
 * @param  {StreamReader} stream
 * @return {NumericValue}
 */
function consumeNumericValue(stream) {
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
 * Consumes a keyword: either a variable (a word that starts with $ or @) or CSS
 * keyword or shorthand
 * @param  {StreamReader} stream
 * @return {String} Consumed variable
 */
function consumeKeyword(stream) {
    stream.start = stream.pos;

    if (stream.eat(DOLLAR) || stream.eat(AT)) {
        // SCSS or LESS variable
        eatWhile(stream, isAlphaNumericWord);
    } else {
        eatAlphaWord(stream);
    }

    return stream.current();
}

/**
 * Consumes a color token
 * @param  {StreamReader} stream
 * @return {Boolean} Returns `true` if color was consumed
 */
function consumeColor(stream) {
    // supported color variations:
    // #abc   → #aabbccc
    // #0     → #000000
    // #fff.5 → rgba(255, 255, 255, 0.5)
    // #t     → transparent
    if (stream.peekCode() === HASH) {
        stream.start = stream.pos++;
        stream.eat(116) /* t */ || eatWhile(stream, isHex);
        const base = stream.current();

        // a hex color can be followed by `.num` alpha value
        stream.start = stream.pos;
        if (stream.eat(DOT) && !eatWhile(stream, isNumber)) {
            throw stream.error('Unexpected character for alpha value of color');
        }

        return new Color(base, stream.current());
    }
}

/**
 *
 * @param  {[type]} stream [description]
 * @return {[type]}        [description]
 */
function consumeAttributes(stream) {

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

/**
 * Eats alpha word in given stream
 * @param  {StreamReader} stream
 * @return {Boolean} Returns `true` if word was consumed
 */
function eatAlphaWord(stream) {
    return eatWhile(stream, isAlphaWord);
}

/**
 * Consumes characters in given string while they pass `test` code test
 * @param  {StreamReader} stream
 * @param  {Function} test
 * @return {Boolean} Returns `true` stream was consumed at least once
 */
function eatWhile(stream, test) {
    const start = stream.pos;
    while (!stream.eol() && test(stream.peekCode())) {
        stream.pos++;
    }
    return start < stream.pos;
}

/**
 * @param  {Number}  code
 * @return {Boolean}
 */
function isIdent(code) {
    return code === AT || code === DOLLAR || isAlphaWord(code);
}

/**
 * @param  {Number}  code
 * @return {Boolean}
 */
function isAlphaWord(code) {
    return code === UNDERSCORE || isAlpha(code);
}

/**
 * @param  {Number}  code
 * @return {Boolean}
 */
function isAlphaNumericWord(code) {
    return isNumber(code) || isAlphaWord(code);
}

/**
 * Check if given code is a hex value (/0-9a-f/)
 * @param  {Number}  code
 * @return {Boolean}
 */
function isHex(code) {
    return isNumber(code) || isAlpha(code, 65, 70); // A-F
}

/**
 * Check if given code is a number
 * @param  {Number}  code
 * @return {Boolean}
 */
function isNumber(code) {
    return code > 47 && code < 58;
}

/**
 * Check if given character code is alpha code (letter though A to Z)
 * @param  {Number}  code
 * @param  {Number}  [from]
 * @param  {Number}  [to]
 * @return {Boolean}
 */
function isAlpha(code, from, to) {
    from = from || 65; // A
    to   = to   || 90; // Z
    code &= ~32; // quick hack to convert any char code to uppercase char code

    return code >= from && code <= to; // A-F
}
