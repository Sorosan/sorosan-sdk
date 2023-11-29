import { xdr } from 'stellar-sdk';
import { NetworkDetails } from '../lib/network';
import {
    accountToScVal,
    getContractAddress,
    getContractHash,
    isAddress,
    mask
} from '../lib/soroban';
import { Soroban } from './soroban';

export class UtilSDK extends Soroban {
    constructor(selectedNetwork: NetworkDetails, activePublicKey?: string) {
        super(selectedNetwork, activePublicKey);
    }

    /**
     * Converts a string address to a Soroban ScVal type Address.
     *
     * @param {string} address - The string address to convert to a ScVal.
     *
     * @returns {xdr.ScVal} Soroban ScVal representing the address.
     *
     * @example
     * const str = "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN";
     * const address: xdr.ScVal = sdk.util.addressScVal(str);
     * console.log(address);
     */
    addressScVal(address: string): xdr.ScVal {
        return accountToScVal(address);
    }

    /**
     * Converts a contract address to its contract hash.
     *
     * @param {string} hash - The contract address to convert to its contract hash.
     *
     * @returns {string} The contract hash as a string.
     *
     * @example
     * const str = "CDAT37IEQWT2K4V22PSUM5WPTHLCK5JV2OHF6JIQQ3S3LSFQD5FSGYN6";
     * const id: string = sdk.util.contractAddress(str);
     * console.log(id); // c13dfd0485a7a572bad3e54676cf99d6257535d38e5f251086e5b5c8b01f4b23
     */
    toContractHash(hash: string): string {
        return getContractHash(hash);
    }

    /**
     * Converts a contract hash to its contract address.
     *
     * @param {string} id - The contract hash to convert to its contract address.
     *
     * @returns {string} The contract address as a string.
     *
     * @example
     * const str = "c13dfd0485a7a572bad3e54676cf99d6257535d38e5f251086e5b5c8b01f4b23";
     * const hash: string = sdk.util.contractHash(str);
     * console.log(hash); // CDAT37IEQWT2K4V22PSUM5WPTHLCK5JV2OHF6JIQQ3S3LSFQD5FSGYN6
     */
    toContractAddress(id: string): string {
        return getContractAddress(id);
    }

    /**
     * Shortens an address or hash to a fixed length for display.
     *
     * @param {string} str - The address or hash to shorten.
     *
     * @returns {string} The shortened string if its length is greater than 10 characters; otherwise, the original string.
     *
     * @example
     * const str = "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN";
     * const short: string = sdk.util.mask(str);
     * console.log(short); // GA5Z...K4KZVN
     *
     * @example
     * const str = "ABC";
     * const short: string = sdk.util.mask(str);
     * console.log(short); // ABC
     */
    mask(str: string): string {
        return mask(str);
    }

    /**
     * Checks if a string is a valid Soroban address.
     *
     * @param {string} str - The string to check for Soroban address validity.
     *
     * @returns {boolean} `true` if the string is a valid 56-character alphanumeric Soroban address, otherwise `false`.
     *
     * @example
     * const str = "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN";
     * const isAddress: boolean = sdk.util.isAddress(str);
     * console.log(isAddress); // true
     *
     * @example
     * const str = "CCV3ODCHRVCUQTWJZ7F7SLKHGT3JLYWUVHAWMKIYQVSCKMGSOCOJ3AUO";
     * const isAddress: boolean = sdk.util.isAddress(str);
     * console.log(isAddress); // false
     */
    isAddress(val: string): boolean {
        return isAddress(val);
    }

    /**
     * Checks if a string is a valid Soroban contract address.
     *
     * @param {string} val - The string to check for Soroban contract address validity.
     *
     * @returns {boolean} `true` if the string is a valid Soroban contract address, otherwise `false`.
     *
     * @example
     * const str = "CCV3ODCHRVCUQTWJZ7F7SLKHGT3JLYWUVHAWMKIYQVSCKMGSOCOJ3AUO";
     * const isContractAddress: boolean = sdk.util.isContractAddress(str);
     * console.log(isContractAddress); // true
     *
     * @example
     * const str = "CCV3ODCHRVCUQTWJZ7F7SL";
     * const isContractAddress: boolean = sdk.util.isContractAddress(str);
     * console.log(isContractAddress); // false
     */
    isContractAddress(val: string): boolean {
        return val[0] === 'C' && isAddress(val);
    }
}

