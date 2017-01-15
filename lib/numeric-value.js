'use strict';

/**
 * A numeric CSS value with optional unit
 */
export default class NumericValue {
    constructor(value, unit) {
        this.value = Number(value);
        this.unit = unit || '';
    }
}
