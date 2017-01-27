'use strict';

import Node from '@emmetio/node';
import StreamReader from '@emmetio/stream-reader';
import consumeValue from './lib/css-value';
import consumeArguments from './lib/arguments';
import { eatWhile, isAlphaWord } from './lib/utils';

const EXCL       = 33; // #
const DOLLAR     = 36; // $
const PLUS       = 43; // +
const AT         = 64; // @

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

        // Consume `!important` modifier at the end of expression
        if (stream.eat(EXCL)) {
            node.value.add('!');
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
 * @param  {Number}  code
 * @return {Boolean}
 */
function isIdent(code) {
    return code === AT || code === DOLLAR || code === EXCL || isAlphaWord(code);
}
