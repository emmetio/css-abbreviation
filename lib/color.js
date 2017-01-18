'use strict';

export default class Color {
    constructor(value, alpha) {
        this.raw = value;
        this.alpha = Number(alpha != null && alpha !== '' ? alpha : 1);
        value = value.slice(1); // remove #

        let r = 0, g = 0, b = 0;

        if (value === 't') {
            this.alpha = 0;
        } else {
            switch (value.length) {
                case 0:
                    break;

                case 1:
                    r = g = b = value + value;
                    break;

                case 2:
                    r = g = b = value;
                    break;

                case 3:
                    r = value[0] + value[0];
                    g = value[1] + value[1];
                    b = value[2] + value[2];
                    break;

                default:
                    value += value;
                    r = value.slice(0, 2);
                    g = value.slice(2, 4);
                    b = value.slice(4, 6);
            }
        }

        this.r = parseInt(r, 16);
        this.g = parseInt(g, 16);
        this.b = parseInt(b, 16);
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
            values.push(this.alpha.toFixed(8).replace(/\.?0+$/, ''));
        }

        return `${values.length === 3 ? 'rgb' : 'rgba'}(${values.join(', ')})`;
    }

    toString(short) {
        if (!this.r && !this.g && !this.b && !this.alpha) {
            return 'transparent';
        }
        return this.alpha === 1 ? this.toHex(short) : this.toRGB();
    }
}

function isShortHex(hex) {
    return !(hex % 17);
}

function toShortHex(num) {
    return (num >> 4).toString(16);
}

function toHex(num) {
    return pad(num.toString(16), 2);
}

function pad(value, len) {
    while (value.length < len) {
        value = '0' + value;
    }
    return value;
}

function repeat(str, count) {
    let out = '';
    while (count--) {
        out += str;
    }
    return str;
}
