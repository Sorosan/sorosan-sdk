import BigNumber from 'bignumber.js';
import { Address, nativeToScVal, xdr } from 'stellar-sdk';

/**
 * Converts the given amount in stroops to XLM (lumens).
 *
 * @param {BigNumber} stroops - The amount in stroops to convert to XLM.
 *
 * @returns {BigNumber} The equivalent amount in XLM.
 */
export const stroopToXlm = (stroops: BigNumber): BigNumber => {
    if (stroops instanceof Number) {
        return stroops.dividedBy(1e7);
    }
    return new BigNumber(Number(stroops) / 1e7);
};

/**
 * Converts the given amount in XLM (lumens) to stroops.
 *
 * @param {BigNumber | string} lumens - The amount in XLM to convert to stroops.
 *
 * @returns {BigNumber} The equivalent amount in stroops, rounded to the nearest stroop.
 */
export const xlmToStroop = (lumens: BigNumber | string): BigNumber => {
    let lumensValue: BigNumber;

    if (lumens instanceof BigNumber) {
        lumensValue = lumens;
    } else {
        const parsedValue = new BigNumber(lumens);

        if (parsedValue.isNaN()) {
            throw new Error('Invalid input: not a valid number');
        }

        if (parsedValue.isNegative()) {
            throw new Error('Invalid input: negative values are not allowed');
        }

        lumensValue = parsedValue;
    }

    return lumensValue.times(1e7);
};

/**
 * Converts the given argument to a Smart Contract Value (ScVal) based on the specified type.
 *
 * @param {any} arg - The argument to convert to a ScVal.
 * @param {string} [type] - The type of ScVal to create (e.g., "address", "i32", "bytes").
 *
 * @throws {Error} If the argument type or specified type is unsupported.
 *
 * @returns {xdr.ScVal} The corresponding ScVal based on the argument and type.
 */
export const toScVal = (arg: any, type?: string): xdr.ScVal => {
    type = (type && type.toLowerCase()) || "";
    switch (typeof arg) {
        case "string":
            switch (type) {
                case "address":
                case "scvAddress".toLowerCase():
                case "scvContractInstance".toLowerCase():
                    return new Address(arg).toScVal();
                case "bytes":
                case "scvBytes".toLowerCase():
                case "scvBytesN".toLowerCase():
                    return xdr.ScVal.scvBytes(Buffer.from(arg, "hex"));
                case "symbol":
                    return xdr.ScVal.scvSymbol(arg);
                case "scvBool".toLowerCase():
                    return xdr.ScVal.scvBool(arg != null);
                case "i32".toLowerCase():
                case "scvI32".toLowerCase():
                    return xdr.ScVal.scvI32(Number(arg));
                case "i64".toLowerCase():
                case "scvI64".toLowerCase():
                    return nativeToScVal(arg, { type: "i64" });
                case "i128".toLowerCase():
                case "scvI128".toLowerCase():
                    return nativeToScVal(arg, { type: "i128" });
                case "i256".toLowerCase():
                case "scvI256".toLowerCase():
                    return nativeToScVal(arg, { type: "i256" });
                case "u64".toLowerCase():
                case "scvU64".toLowerCase():
                    return nativeToScVal(arg, { type: "u64" });
                case "u32".toLowerCase():
                case "scvU32".toLowerCase():
                    return xdr.ScVal.scvU32(Number(arg));
                case "u128".toLowerCase():
                case "scvU128".toLowerCase():
                    return nativeToScVal(arg, { type: "u128" });
                case "u256".toLowerCase():
                case "scvU256".toLowerCase():
                    return nativeToScVal(arg, { type: "u256" });
                case "timepoint".toLowerCase():
                case "scvTimepoint".toLowerCase():
                    var val: xdr.TimePoint = new xdr.Uint64(arg);
                    return xdr.ScVal.scvTimepoint(val);
                case "duration".toLowerCase():
                case "scvDuration".toLowerCase():
                    var val: xdr.Duration = new xdr.Uint64(arg);
                    return xdr.ScVal.scvDuration(val);
                default:
                    return xdr.ScVal.scvString(arg);
            }
        case "number":
            switch (type) {
                case "i32".toLowerCase():
                case "scvI32".toLowerCase():
                    return xdr.ScVal.scvI32(arg);
                case "i64".toLowerCase():
                case "scvI64".toLowerCase():
                    return nativeToScVal(arg, { type: "i64" });
                case "i128".toLowerCase():
                case "scvI128".toLowerCase():
                    return nativeToScVal(arg, { type: "i128" });
                case "i256".toLowerCase():
                case "scvI256".toLowerCase():
                    return nativeToScVal(arg, { type: "i256" });
                case "u32".toLowerCase():
                case "scvU32".toLowerCase():
                    return xdr.ScVal.scvU32(Number(arg));
                case "u64".toLowerCase():
                case "scvU64".toLowerCase():
                    return nativeToScVal(arg, { type: "u64" });
                case "u128".toLowerCase():
                case "scvU128".toLowerCase():
                    return nativeToScVal(arg, { type: "u128" });
                case "u256".toLowerCase():
                case "scvU256".toLowerCase():
                    return nativeToScVal(arg, { type: "u256" });
                case "timepoint".toLowerCase():
                case "scvTimepoint".toLowerCase():
                    var val: xdr.TimePoint = new xdr.Uint64(arg);
                    return xdr.ScVal.scvTimepoint(val);
                case "duration".toLowerCase():
                case "scvDuration".toLowerCase():
                    var val: xdr.Duration = new xdr.Uint64(arg);
                    return xdr.ScVal.scvDuration(val);
                default:
                    return xdr.ScVal.scvI32(arg);
            }
        case "boolean":
            return xdr.ScVal.scvBool(arg);
        case "object":
            return xdr.ScVal.scvBytes(arg);
        default:
            throw new Error("Unsupported type");
    }
}

export interface CustomScVal {
    type: string;
    value: string;
}

/**
 * Decodes a Soroban XDR-encoded transaction string and retrieves the transaction envelope's inner transaction.
 *
 * @param {string} str - The Soroban XDR-encoded transaction string.
 *
 * @returns {xdr.Transaction} The inner transaction decoded from the transaction envelope.
 */
export const decodeTxnSorobanXdr = (str: string) => xdr.TransactionEnvelope.fromXDR(str, 'base64').v1().tx()
