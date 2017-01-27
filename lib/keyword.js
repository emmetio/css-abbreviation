'use strict';

import { eatAlphaNumericWord, eatAlphaWord } from './utils';

const DOLLAR = 36; // $
const PLUS   = 43; // +
const AT     = 64; // @

/**
 * Consumes a keyword: either a variable (a word that starts with $ or @) or CSS
 * keyword or shorthand
 * @param  {StreamReader} stream
 * @return {String} Consumed variable
 */
export default function(stream) {
    stream.start = stream.pos;

    if (stream.eat(DOLLAR) || stream.eat(AT)) {
        // SCSS or LESS variable
		eatAlphaNumericWord(stream);
    } else {
        eatAlphaWord(stream);
    }

    return stream.current();
}
