'use strict';

const LBRACE       = 40; // (
const RBRACE       = 41; // )
const SINGLE_QUOTE = 39; // '
const DOUBLE_QUOTE = 34; // "
const COMMA        = 44; // ,

/**
 * Consumes arguments from given string.
 * Arguments are comma-separated list of tokens inside round braces, e.g.
 * `(1, a2, 'a3')`. Nested lists and quoted strings are supported
 * @param  {StreamReader} stream
 * @return {Array}        Array of arguments, `null` if arguments cannot be consumed
 */
export default function(stream) {
    if (!stream.eat(LBRACE)) {
        // not an argument list
        return null;
    }

    let level = 1, code;
    const args = [];
    stream.start = stream.pos;

    while (!stream.eol()) {
        code = stream.nextCode();

        if (code === LBRACE) {
            // nested group/arguments list
            level++;
        } else if (code === RBRACE) {
            level--;
            if (!level) {
                // end of arguments list
                args.push(currentArg(stream));
                return args;
            }
        } else if (code === COMMA && level === 1) {
            // arguments separator. do not consume arguments in nested groups
            args.push(currentArg(stream));
            stream.start = stream.pos;
        } else if (code === SINGLE_QUOTE || code === DOUBLE_QUOTE) {
            // quoted value
            stream.eatQuoted(code);
        }
    }

    // if we reached so far then we were unable to properly parse arguments list
    throw stream.error('Unexpected end-of-arguments list');
}

function currentArg(stream) {
    return stream.string.slice(stream.start, stream.pos - 1).trim();
}
