import {
    Asset,
    hash,
    xdr
} from "stellar-sdk";
import { createHash } from "crypto";
import { Network } from "lib/network";

export const getAssetContractId = (
    asset: Asset,
    networkPassphrase: string
) => {
    // A hex-encoded SHA-256 hash of this transaction’s XDR-encoded form.
    const networkId = createHash('sha256').update(networkPassphrase).digest('hex');
    const networkIdBuffer = Buffer.from(networkId, 'hex');

    const contractIdPreimage = xdr.ContractIdPreimage
        .contractIdPreimageFromAsset(asset.toXDRObject());
    const hashIDPreimage = new xdr.HashIdPreimageContractId({
        networkId: networkIdBuffer,
        contractIdPreimage: contractIdPreimage
    });
    const preimage = xdr.HashIdPreimage
        .envelopeTypeContractId(hashIDPreimage);

    const contractId = hash(preimage.toXDR()).toString('hex');
    return contractId;
}

/**
 * Get the Wasm ID of a Soroban token for the specified network.
 *
 * @param {string} network - The network name (e.g., 'testnet', 'mainnet').
 * @returns {string} The WebAssembly (Wasm) ID for the specified network.
 */
export const getTokenWasmId = (network: string) => {
    switch (network) {
        case Network.testnet:
            return "724294469caad5151b578d0ba07a6dab96703e01c865b593b3cff52761c43e26";
        case Network.mainnet:
        default:
            return "724294469caad5151b578d0ba07a6dab96703e01c865b593b3cff52761c43e26";
    }
}