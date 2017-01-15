'use strict';

export default class Color {
    constructor(value, alpha) {
        this.raw = value;
        this.alpha = Number(alpha != null ? alpha : 1);

        value = value.slice(1); // remove #
        if (value === 't') {
            this.alpha = 0
        } else if (value.length === 1) {
            value += value;
        }

        let r = 0, g = 0, b = 0;
        if (value.length === 2) {
            r = g = b = parseInt(value, 16);
        } else if (value.length === 3) {
            r = parseInt(value[0] + value[0], 16);
            g = parseInt(value[1] + value[1], 16);
            b = parseInt(value[2] + value[2], 16);
        } else {
            value += value;
            r = parseInt(value.slice(0, 2), 16);
            g = parseInt(value.slice(2, 4), 16);
            b = parseInt(value.slice(4, 6), 16);
        }

        this.r = r;
        this.g = g;
        this.b = b;
    }

    /**
     * Output current color as hex value
     * @param {Boolean} shor Produce short value (e.g. #fff instead of #ffffff), if possible
     * @return {String}
     */
    toHex(short) {
        const fn = (short && isShortHex(this.r) && isShortHex(this.g) && isShortHex(this.b))
            ? toShortHex : toHex;

        return '#' + fn(this.r)  + fn(this.g) + fn(this.b);
    }

    /**
     * Output current color as `rgba?(...)` CSS color
     * @return {String}
     */
    toRGB() {
        const values = [this.r, this.g, this.b];
        if (this.alpha !== 1) {
            values.push(this.alpha.toFixed(8).replace(/0+$/, ''));
        }

        return `${values.length === 3 ? 'rgb' : 'rgba'}(${values.join(', ')})`;
    }

    toString() {
        return this.toRGB();
    }
}

function isShortHex(hex) {
    return !(hex % 17);
}

function toShortHex(num) {
    return toHext(num >> 4);
}

function toHex(num) {
    return num.toString(16);
}

function repeat(str, count) {
    let out = '';
    while (count--) {
        out += str;
    }
    return str;
}
