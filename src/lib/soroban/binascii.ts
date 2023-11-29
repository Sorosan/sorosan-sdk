/**
 * binascii - A JavaScript utility for hexadecimal encoding and decoding.
 *
 * This module provides functions for encoding and decoding data in hexadecimal format.
 * It is a copy from the npm package "binascii" (https://www.npmjs.com/package/binascii).
 *
 * Usage:
 * Import this module as a commonjs module and use the following functions:
 *
 * - `b2a_hex(str: string)`: Encodes a given string into hexadecimal format.
 * - `hexlify(str: string)`: Alias for `b2a_hex`.
 * - `a2b_hex(str: string)`: Decodes a hexadecimal string back into its original data.
 * - `unhexlify(str: string)`: Alias for `a2b_hex`.
 *
 * Example:
 * ```
 * const ba = require('binascii');
 * const encoded = ba.b2a_hex('Hello, world!'); // Encodes the string into hexadecimal
 * const decoded = ba.a2b_hex(encoded); // Decodes the hexadecimal string
 * console.log(encoded); // Prints the hexadecimal representation
 * console.log(decoded); // Prints the original string
 * ```
 *
 * @module binascii
 * @see https://www.npmjs.com/package/binascii
 */
const ba = (function () {
    var hexlify = function (str: string) {
        var result = '';
        var padding = '00';
        for (var i = 0, l = str.length; i < l; i++) {
            var digit = str.charCodeAt(i).toString(16);
            var padded = (padding + digit).slice(-2);
            result += padded;
        }
        return result;
    };

    var unhexlify = function (str: string) {
        var result = '';
        for (var i = 0, l = str.length; i < l; i += 2) {
            result += String.fromCharCode(parseInt(str.substr(i, 2), 16));
        }
        return result;
    };

    return {
        b2a_hex: hexlify,
        hexlify: hexlify,

        a2b_hex: unhexlify,
        unhexlify: unhexlify
    };
})();

export default ba;
