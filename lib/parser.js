'use strict';

import Node from '@emmetio/node';
import StreamReader from '@emmetio/stream-reader';
import Color from './color';

const HASH       = 35; // #
const DOLLAR     = 36; // $
const DASH       = 45; // -
const DOT        = 46; // .
const AT         = 64; // @
const UNDERSCORE = 95; // _

const keywordShorthands = {
    a:  'auto',
    al: 'all',
    i:  'inherit',
    s:  'solid',
    da: 'dashed',
    do: 'dotted',
    t:  'transparent'
};

/**
 * Parses given Emmet CSS abbreviation and returns it as parsed Node
 */
export default function(abbr) {
    const tokens = split(abbr);
    if (!tokens.length) {
        throw new Error(`Invalid CSS abbreviation: ${abbr}`);
    }

    const valuePos = findValuePos(tokens);
    const node = new Node(tokens.slice(0, valuePos).join(''));
    node.value = tokens.slice(valuePos);

    return node;
}

/**
 * Splits given name abbreviation by tokens
 * @param  {StreamReader|String} abbr
 * @return {Token[]}
 */
export function split(abbr) {
    const parts = [];
    const stream = typeof abbr === 'string' ? new StreamReader(abbr) : abbr;
    let token;
    while (token = getToken(stream)) {
        parts.push(token);
    }

    return parts;
}

class Token {
    constructor(value, separator) {
        this.value = value;
        this.separator = separator || '';
    }

    valueOf() {
        return this.separator + this.value;
    }
}

/**
 * Extracts a single CSS abbreviation token from given stream and returns it
 * @param  {StreamReader} stream
 * @param  {String} [_separator]
 * @return {Token}
 */
function getToken(stream, _separator) {
    stream.start = stream.pos;
    let value;

    if (consumeNumber(stream)) {
        value = parseFloat(stream.current());
    } else if (consumeColor(stream)) {
        value = new Color(stream.current());
    } else if (consumeVariable(stream) || consumeAlphaWord(stream)) {
        value = stream.current();
    }

    if (value != null) {
        return new Token(value, _separator);
    }

    if (!stream.eol()) {
        // found unknown character, use it as a separator for next token
        return getToken(stream, (_separator || '') + stream.next());
    }
}

/**
 * Finds position of property value in given list of parsed tokens.
 * CSS properties allow `-` in names, which is used for value separation in
 * Emmet CSS. So we either have to find a token with explicit `:` separator
 * and use it as value start or validate words in values
 * @param  {Token[]} tokens
 * @return {Number}
 */
function findValuePos(tokens) {
    let explicit = 0, implicit = 0;

    for (let i = 1, token; i < tokens.length; i++) {
        token = tokens[i];
        if (!explicit && token.separator === ':') {
            explicit = i;
        } else if (!implicit && (typeof token.value !== 'string' || token.value in keywordShorthands)) {
            implicit = i;
        }

        if (implicit && explicit) {
            break;
        }
    }

    return explicit || implicit || 1;
}

/**
 * Consumes number from given stream
 * @param  {StreamReader} stream
 * @return {Boolean} Returns `true` if number was consumed
 */
function consumeNumber(stream) {
	const start = stream.pos;
    const negative = stream.eat(DASH);
	let dot = false, code;

	while (!stream.eol()) {
		code = stream.peekCode();

		if ((code === DOT && hadDot) || !isNumber(code)) {
			break;
		}

        if (code === DOT) {
            hadDot = true;
        }

        stream.pos++;
	}

    if (negative && stream.pos - start === 1) {
        // edge case: consumed dash only.
        stream.pos = start;
    }

    return start < stream.pos;
}

/**
 * Consume a variable: a word that starts with $ or @ and may contain number
 * or word character
 * @param  {StreamReader} stream
 * @return {Boolean} Returns `true` if variable was consumed
 */
function consumeVariable(stream) {
    if (stream.eat(DOLLAR) || stream.eat(AT)) {
        eatWhile(stream, isAlphaNumericWord);
        return true;
    }
}

/**
 * Consumes a color token
 * @param  {StreamReader} stream
 * @return {Boolean} Returns `true` if color was consumed
 */
function consumeColor(stream) {
    if (stream.eat(HASH)) {
        eatWhile(stream, isHex);
        return true;
    }
}

/**
 * Consumes alpha word
 * @param  {StreamReader} stream
 * @return {Boolean} Returns `true` if word was consumed
 */
function consumeAlphaWord(stream) {
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
    code &= ~32; // quick and dirty hack to convert char code to uppercase code

    return code >= from && code <= to; // A-F
}
