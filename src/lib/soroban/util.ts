import { randomBytes } from "crypto";
import { Address, Asset, Contract, StrKey, nativeToScVal, xdr } from "stellar-sdk";
import { ExplorerService } from "../explorer";

/**
 * Converts an account address to a Smart Contract Value (ScVal).
 *
 * @param {string} account - The account address to convert to an ScVal.
 *
 * @returns {xdr.ScVal} The ScVal representation of the account address.
 */
export const accountToScVal = (account: string) =>
    new Address(account).toScVal();

/**
 * Masks an address for display, showing only the first 6 and last 3 characters.
 *
 * @param {string} address - The address to mask.
 *
 * @returns {string} The masked address.
 */
export const mask = (address: string): string => {
    if (!address) return "";
    if (address.length < 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-3)}`;
}

/**
 * Checks if a value is a valid account address, which should be a 56-character alphanumeric string.
 *
 * @param {string} val - The value to validate.
 *
 * @returns {boolean} `true` if the value is a valid account address, `false` otherwise.
 */
export const isAddress = (val: string): boolean => {
    return val.length === 56 && /^[a-zA-Z0-9]+$/.test(val);
}

/**
 * Checks if a value is a valid contract hash, which should be a 64-character alphanumeric string.
 *
 * @param {string} val - The value to validate.
 *
 * @returns {boolean} `true` if the value is a valid contract hash, `false` otherwise.
 */
export const isContractHash = (val: string): boolean => {
    return val.length === 64 && /^[a-zA-Z0-9]+$/.test(val);
}

/**
 * Requests test network funds for a given account address from a friendbot service.
 *
 * @param {string} address - The account address for which to request test network funds.
 * @param {string} [friendbot='https://friendbot.stellar.org'] - The URL of the friendbot service.
 *
 * @returns {Promise<any | null>} A promise that resolves to the response data from the friendbot, or `null` if an error occurs.
 */
export const tipAccount = async (
    address: string,
    friendbot: string = 'https://friendbot.stellar.org'
): Promise<any | null> => {
    try {
        const response = await fetch(
            `${friendbot}/?addr=${encodeURIComponent(address)}`,
        );
        const data = await response.json();
        return data;
    } catch (e) {
        return null;
    }
}

/**
 * Encodes a contract hash in hexadecimal format to a Stellar contract address.
 *
 * @param {string} contractHash - The contract hash in hexadecimal format.
 * @returns {string} The Stellar contract address.
 */
export const getContractAddress = (contractHash: string) =>
    StrKey.encodeContract(hexToByte(contractHash));

/**
 * Converts a Stellar contract ID to its corresponding contract hash in hexadecimal format.
 *
 * @param {string} contractId - The Stellar contract ID.
 * @returns {string} The contract hash in hexadecimal format.
 */
export const getContractHash = (contractId: string) => {
    try {
        const c = new Contract(contractId);
        return c.address().toScAddress().contractId().toString('hex');
    } catch (e) {
        return "";
    }
}

/**
 * Converts a hexadecimal string to a byte array.
 *
 * @param {string} hexString - The hexadecimal string to convert.
 * @returns {Buffer} A byte array representing the input hexadecimal string.
 * @throws {string} Throws an error if the input does not have an even number of hex digits.
 */
export function hexToByte(hexString: string) {
    if (hexString.length % 2 !== 0) {
        throw "Must have an even number of hex digits to convert to bytes";
    }
    var numBytes = hexString.length / 2;
    var byteArray = Buffer.alloc(numBytes);
    for (var i = 0; i < numBytes; i++) {
        byteArray[i] = parseInt(hexString.substr(i * 2, 2), 16);
    }
    return byteArray;
}

/**
 * Generates a random salt of the specified length in bytes.
 *
 * @param {number} [length=32] - The length of the salt in bytes.
 *
 * @returns {Buffer} The generated random salt as a Buffer.
 */
export const Salt = (length: number = 32): Buffer => {
    const salt = randomBytes(length);
    return salt;
}

/**
 * Retrieves asset information by its contract address.
 *
 * @async
 * @param {string} contractAddress - The contract address of the asset.
 * @returns {Promise<Asset | null>} - A promise that resolves to the asset information or null if not found.
 */
export const getAsset = async (contractAddress: string): Promise<Asset | null> => {
    try {
        const contractId = getContractHash(contractAddress);
        // TODO: Create own implementation and hopefully remove dependency on explorer
        const data = await ExplorerService.getContract(contractId);

        // Wrapped assets do not have a contract code
        if (data.asset_code && data.asset_issuer && !data.contract_code) {
            return new Asset(data.asset_code, data.asset_issuer);
        }
    } catch (e) {
        console.error(e);
    }
    return null;
}

/**
 * Checks if an array of strings represents a list of numbers.
 * @param {string[]} strings - The array of strings to check.
 * @returns {boolean} True if all strings in the array can be converted to numbers; otherwise, false.
 */
export const isListOfNumbers = (strings: string[]): boolean => {
    return strings.every(str => !isNaN(Number(str)));
}

/**
 * Convert an untyped in WASM struct to an XDR ScVal.
 * @param {xdr.ScSpecUdtStructV0} struct - The untyped struct to convert.
 * @returns {xdr.ScVal} The XDR ScVal representing the struct.
 */
export const structUnnameToXdr = (struct: xdr.ScSpecUdtStructV0): xdr.ScVal => {
    let vecs: xdr.ScVal[] = [];
    struct.fields().forEach((field) => {
        vecs.push(scValDefault(field.type().switch().name))
    });
    return xdr.ScVal.scvVec(vecs);
}

/**
 * Convert a named struct in WASM to an XDR ScVal with map entries.
 * @param {xdr.ScSpecUdtStructV0} struct - The named struct to convert.
 * @returns {xdr.ScVal} The XDR ScVal representing the struct as a map.
 */
export const structNameToXdr = (struct: xdr.ScSpecUdtStructV0): xdr.ScVal => {
    let mapEntry: xdr.ScMapEntry[] = [];
    struct.fields().forEach((field) => {
        const symbol = xdr.ScVal.scvSymbol(field.name().toString());
        const val = scValDefault(field.type().switch().name)

        mapEntry.push(new xdr.ScMapEntry({ key: symbol, val: val }))
    });

    return xdr.ScVal.scvMap(mapEntry);
}

/**
 * Get a default XDR ScVal for a given data type.
 * @param {string} type - The data type for which to retrieve the default XDR ScVal.
 * @returns {xdr.ScVal} The default XDR ScVal for the specified data type.
 */
export const scValDefault = (type: string): xdr.ScVal => {
    switch (type) {
        case xdr.ScSpecType.scSpecTypeAddress().name:
        case xdr.ScValType.scvAddress().name:
            return new Address("GDUY7J7A33TQWOSOQGDO776GGLM3UQERL4J3SPT56F6YS4ID7MLDERI4").toScVal();
        case xdr.ScSpecType.scSpecTypeBool().name:
        case xdr.ScValType.scvBool().name:
            return xdr.ScVal.scvBool(false);
        case xdr.ScSpecType.scSpecTypeBytes().name:
        case xdr.ScValType.scvBytes().name:
        case xdr.ScSpecType.scSpecTypeBytesN().name:
        case xdr.ScValType.scvBytes().name:
            return xdr.ScVal.scvBytes(Buffer.from("", "hex"));
        case xdr.ScSpecType.scSpecTypeI128().name:
        case xdr.ScValType.scvI128().name:
            return nativeToScVal(0, { type: "i128" });
        case xdr.ScSpecType.scSpecTypeI256().name:
        case xdr.ScValType.scvI256().name:
            return nativeToScVal(0, { type: "i256" });
        case xdr.ScSpecType.scSpecTypeI32().name:
        case xdr.ScValType.scvI32().name:
            return nativeToScVal(0, { type: "i32" });
        case xdr.ScSpecType.scSpecTypeI64().name:
        case xdr.ScValType.scvI64().name:
            return nativeToScVal(0, { type: "i64" });
        case xdr.ScSpecType.scSpecTypeMap().name:
        case xdr.ScValType.scvMap().name:
            return xdr.ScVal.scvMap([]);
        case xdr.ScSpecType.scSpecTypeString().name:
        case xdr.ScValType.scvString().name:
            return xdr.ScVal.scvString("");
        case xdr.ScSpecType.scSpecTypeSymbol().name:
        case xdr.ScValType.scvSymbol().name:
            return xdr.ScVal.scvSymbol("");
        case xdr.ScSpecType.scSpecTypeDuration().name:
        case xdr.ScValType.scvDuration().name:
            return xdr.ScVal.scvDuration(new xdr.Uint64(0));
        case xdr.ScSpecType.scSpecTypeTimepoint().name:
        case xdr.ScValType.scvTimepoint().name:
            return xdr.ScVal.scvTimepoint(new xdr.Uint64(0));
        case xdr.ScSpecType.scSpecTypeU128().name:
        case xdr.ScValType.scvU128().name:
            return nativeToScVal(0, { type: "u128" });
        case xdr.ScSpecType.scSpecTypeU256().name:
        case xdr.ScValType.scvU256().name:
            return nativeToScVal(0, { type: "u256" });
        case xdr.ScSpecType.scSpecTypeU32().name:
        case xdr.ScValType.scvU32().name:
            return nativeToScVal(0, { type: "u32" });
        case xdr.ScSpecType.scSpecTypeU64().name:
        case xdr.ScValType.scvU64().name:
            return nativeToScVal(0, { type: "u64" });
        case xdr.ScSpecType.scSpecTypeVec().name:
        case xdr.ScValType.scvVec().name:
            return xdr.ScVal.scvVec([]);
        case xdr.ScSpecType.scSpecTypeVoid().name:
        case xdr.ScValType.scvVoid().name:
            return xdr.ScVal.scvVoid();
        // case xdr.ScValType.scvContractInstance().name:
        //     return Address.contract(
        //         Buffer.from("GDUY7J7A33TQWOSOQGDO776GGLM3UQERL4J3SPT56F6YS4ID7MLDERI4", "hex"))
        //         .toScVal();
        default:
            return xdr.ScVal.scvString("");
    }
}