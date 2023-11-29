import {
    Address,
    Asset,
    Contract,
    Operation,
    SorobanRpc,
    TimeoutInfinite,
    Transaction,
    TransactionBuilder,
    hash,
    xdr
} from "stellar-sdk";

import { simulateTx } from "./transaction";
import { createHash } from "crypto";
import { Network } from "../network";

export const getTokenSymbol = async (
    contractAddress: string,
    txBuilder: TransactionBuilder,
    server: SorobanRpc.Server,
) => {
    const contract = new Contract(contractAddress);
    let tx: Transaction = txBuilder
        .addOperation(contract.call("symbol"))
        .setTimeout(TimeoutInfinite)
        .build();

    const result: string = await simulateTx<string>(tx, server);
    return result;
};

export const getTokenName = async (
    contractAddress: string,
    txBuilder: TransactionBuilder,
    server: SorobanRpc.Server,
) => {
    const contract = new Contract(contractAddress);
    const tx = txBuilder
        .addOperation(contract.call("name"))
        .setTimeout(TimeoutInfinite)
        .build();

    const result = await simulateTx<string>(tx, server);
    return result;
};

export const getTokenDecimals = async (
    contractAddress: string,
    txBuilder: TransactionBuilder,
    server: SorobanRpc.Server,
) => {
    const contract = new Contract(contractAddress);
    const tx = txBuilder
        .addOperation(contract.call("decimals"))
        .setTimeout(TimeoutInfinite)
        .build();

    const result = await simulateTx<number>(tx, server);
    return result;
};

export const getTokenBalance = async (
    contractAddress: string,
    address: string,
    txBuilder: TransactionBuilder,
    server: SorobanRpc.Server,
) => {
    const params = [new Address(address).toScVal()];
    const contract = new Contract(contractAddress);
    const tx = txBuilder
        .addOperation(contract.call("balance", ...params))
        .setTimeout(TimeoutInfinite)
        .build();

    const result = await simulateTx<BigInt>(tx, server);
    return result;
};

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

export const changeTrust = async (
    txBuilder: TransactionBuilder,
    asset: Asset,
    limit: string,
) => {
    const op = Operation.changeTrust({
        asset: asset,
        limit: limit,
    });
    let tx: Transaction = txBuilder
        .addOperation(op)
        .setTimeout(TimeoutInfinite)
        .build();

    return tx;
}

export const assetPayment = async (
    txBuilder: TransactionBuilder,
    destination: string,
    asset: Asset,
    amount: string = "1",
) => {
    const op = Operation.payment({
        destination,
        asset,
        amount,
    });
    let tx: Transaction = txBuilder
        .addOperation(op)
        .setTimeout(TimeoutInfinite)
        .build();

    return tx;
}

/**
 * WebAssembly (Wasm) IDs for tokens on different networks.
 * Note: This implementation is in case the Wasm ID becomes different in different networks.
 */
export const TOKEN_WASM_ID = {
    TESTNET: "07ec9b8333159ac477239ff1a54c6fc45c5817e03cf0f45b6c9e51727c0e3dc7",
}

/**
 * Get the WebAssembly (Wasm) ID for a specific network.
 *
 * @param {string} network - The network name (e.g., 'testnet', 'mainnet').
 * @returns {string} The WebAssembly (Wasm) ID for the specified network.
 */
export const getTokenWasmId = (network: string) => {
    switch (network) {
        case Network.testnet:
            return TOKEN_WASM_ID.TESTNET;
        case Network.mainnet:
        default:
            return TOKEN_WASM_ID.TESTNET;
    }
}