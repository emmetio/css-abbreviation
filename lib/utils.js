'use strict';

/**
 * Consumes characters in given string while they pass `test` code test
 * @param  {StreamReader} stream
 * @param  {Function} test
 * @return {Boolean} Returns `true` stream was consumed at least once
 */
export function eatWhile(stream, test) {
    const start = stream.pos;
    while (!stream.eol() && test(stream.peekCode())) {
        stream.pos++;
    }
    return start < stream.pos;
}

/**
 * Eats alpha word in given stream
 * @param  {StreamReader} stream
 * @return {Boolean} Returns `true` if word was consumed
 */
export function eatAlphaWord(stream) {
    return eatWhile(stream, isAlphaWord);
}


/**
 * Eats alpha word in given stream
 * @param  {StreamReader} stream
 * @return {Boolean} Returns `true` if word was consumed
 */
export function eatAlphaNumericWord(stream) {
    return eatWhile(stream, isAlphaNumericWord);
}

/**
 * @param  {Number}  code
 * @return {Boolean}
 */
export function isAlphaNumericWord(code) {
    return isNumber(code) || isAlphaWord(code);
}

/**
 * @param  {Number}  code
 * @return {Boolean}
 */
export function isAlphaWord(code) {
    return code === 95 /* _ */ || isAlpha(code);
}

/**
 * Check if given code is a number
 * @param  {Number}  code
 * @return {Boolean}
 */
export function isNumber(code) {
    return code > 47 && code < 58;
}

/**
 * Check if given character code is alpha code (letter though A to Z)
 * @param  {Number}  code
 * @param  {Number}  [from]
 * @param  {Number}  [to]
 * @return {Boolean}
 */
export function isAlpha(code, from, to) {
    from = from || 65; // A
    to   = to   || 90; // Z
    code &= ~32; // quick hack to convert any char code to uppercase char code

    return code >= from && code <= to; // A-F
}
