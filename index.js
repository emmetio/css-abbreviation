'use strict';

const HASH   = 35; // #
const DOLLAR = 36; // $
const DASH   = 45; // -
const DOT    = 46; // .

/**
 * Prepares given Emmet abbreviation for CSS ouput:
 * finds embedded values in node names, extracts them and saves as CSS node value
 * @param {Node} tree Parsed Emmet abbreviation tree
 * @param {Object} [options] Additional options
 * @return {Node}
 */
export default function(tree, options) {
    tree.walk(resolve);
    return tree;
}

/**
 * Extracts embedded value from given abbreviation node and saves it as node value
 * @param  {Node} node
 */
function resolve(node) {
    if (node.name) {
        const parts = split(node.name);
    }
}

/**
 * Splits given name at embedded value position. If no embedded value found,
 * returns `null`
 * @param  {String} name
 * @return {Object}
 */
function split(name) {
    let i = 0, code;
    while (i < name.length) {
        code = name.charCodeAt(i);
        if (isNumeric(code) || code === HASH || code === DOLLAR
            || (code === DASH && isNumeric(name.charCodeAt(i + 1))) ) {
            return {
                name: name.slice(0, i),
                value: name.slice(i)
            }
        }
        i++;
    }

    return null;
}

/**
 * Check if given character code is a numeric value
 * @param  {Number}  code
 * @return {Boolean}
 */
function isNumeric(code) {
    return code === DOT || (code > 47 && code < 58);
}
