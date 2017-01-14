'use strict';

const shorthands = {
    a:  'auto',
    al: 'all',
    i:  'inherit',
    s:  'solid',
    da: 'dashed',
    do: 'dotted',
    t:  'transparent'
};

/**
 * Keywords resolver for CSS
 */
export function shorthand(name) {
    return shorthands[name];
}
