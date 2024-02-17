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
    xdr,
    Account,
    Memo,
    MuxedAccount,
    SorobanDataBuilder,
} from "stellar-sdk";
import { simulateTx, submitTx } from "./transaction";
import { createHash } from "crypto";
import { Network } from "../network";

const { Server } = SorobanRpc;

import { NetworkDetails, RPC, getRPC } from "../network";
import { Salt } from "./util";
import ba from './binascii';
import { SorosanTransactionBuilder } from "../../sdk/classes/sorosan-transaction-builder";

//#region token.ts
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
//#endregion

//#region Transaction Pure Build and Prepare
export const prepareContractCall = async (
    txBuilder: TransactionBuilder,
    server: SorobanRpc.Server,
    contractAddress: string,
    method: string,
    args: xdr.ScVal[]
) => {
    const contract = new Contract(contractAddress);
    let tx: Transaction = txBuilder
        .addOperation(contract.call(method, ...args))
        .setTimeout(TimeoutInfinite)
        .build();

    tx = await server.prepareTransaction(tx) as Transaction;

    return tx;
}

export const uploadContractWasmOp = async (
    value: Buffer,
    txBuilder: TransactionBuilder,
    server: SorobanRpc.Server,
) => {
    let hf: xdr.HostFunction = xdr.HostFunction.hostFunctionTypeUploadContractWasm(value);
    let op: any = Operation.invokeHostFunction({
        func: hf,
        auth: [],
    });

    let tx: Transaction = txBuilder
        .addOperation(op)
        .setTimeout(TimeoutInfinite)
        .build();

    const prepared = await server.prepareTransaction(tx) as Transaction;
    return prepared;
};

export const createContractOp = async (
    wasmId: string,
    source: Account,
    txBuilder: TransactionBuilder,
    server: SorobanRpc.Server,
) => {
    wasmId = ba.unhexlify(wasmId);
    const wasmIdBuffer = Buffer.from(wasmId, "ascii");
    const salt = Salt(32);
    const buff = Buffer.from(salt);
    const addr = new Address(source.accountId());
    // const contractIdPreimage = xdr.ContractIdPreimage
    // .contractIdPreimageFromAsset(xdr.Asset.assetTypeNative());

    const createContract = new xdr.CreateContractArgs({
        contractIdPreimage: xdr.ContractIdPreimage
            .contractIdPreimageFromAddress(new xdr.ContractIdPreimageFromAddress({
                address: addr.toScAddress(),
                salt: buff,
            })),
        executable: xdr.ContractExecutable.contractExecutableWasm(wasmIdBuffer),
    });

    let hf: xdr.HostFunction = xdr.HostFunction
        .hostFunctionTypeCreateContract(createContract);
    let op: any = Operation.invokeHostFunction({
        func: hf,
        auth: [],
    });

    let tx: Transaction = txBuilder
        .addOperation(op)
        .setTimeout(TimeoutInfinite)
        .build();

    tx = await server.prepareTransaction(tx) as Transaction;

    return tx;
}

export const createWrapTokenOp = async (
    txBuilder: TransactionBuilder,
    server: SorobanRpc.Server,
    asset: Asset,
    contractId: string,
) => {
    const addr = new Address(contractId);

    const ledgerKey = new xdr.LedgerKeyContractData({
        contract: addr.toScAddress(),
        key: xdr.ScVal.scvLedgerKeyContractInstance(),
        durability: xdr.ContractDataDurability.persistent(),
        // bodyType: xdr.ContractEntryBodyType.dataEntry()
    });

    xdr.LedgerKey.contractData(ledgerKey);

    const contractIdPreimageFromAddress = xdr.ContractIdPreimage
        .contractIdPreimageFromAsset(asset.toXDRObject());
    const contractArgs = new xdr.CreateContractArgs({
        contractIdPreimage: contractIdPreimageFromAddress,
        executable: xdr.ContractExecutable.contractExecutableStellarAsset(),
    });

    const hf = xdr.HostFunction.hostFunctionTypeCreateContract(contractArgs);
    let op: any = Operation.invokeHostFunction({
        func: hf,
        auth: [],
    });

    let tx: Transaction = txBuilder
        .addOperation(op)
        .setTimeout(TimeoutInfinite)
        .build();

    tx = await server.prepareTransaction(tx) as Transaction;
    return tx;
}
//#endregion

//#region contract.ts
export const decodeContractSpecBuffer = async (buffer: ArrayBuffer) => {
    const bufferData = new Uint8Array(buffer);
    const decodedEntries = [];

    let offset = 0;

    while (offset < bufferData.length) {
        const { partialDecodedData, length } = tryDecodeEntry(bufferData, offset);

        if (partialDecodedData) {
            decodedEntries.push(partialDecodedData);
            offset += length;
        } else {
            console.log('Failed to decode further. Stopping.');
            break;
        }
    }

    return decodedEntries;
};

const tryDecodeEntry = (bufferData: Uint8Array, offset: number) => {
    for (let length = 1; length <= bufferData.length - offset; length++) {
        const subArray = bufferData.subarray(offset, offset + length);

        try {
            const partialDecodedData = xdr.ScSpecEntry.fromXDR(Buffer.from(subArray));
            return { partialDecodedData, length };
        } catch (error) {
            // If an error occurs during decoding, continue with the next length
        }
    }

    return { partialDecodedData: null, length: 0 };
};

/**
 * More Info: https://soroban-snippet.vercel.app/?title=943f3f9207e07751443699f1480500be3bb3636984aa19200452d49a7886cdc5
 * @param txBuilder 
 * @param server 
 * @param contractAddress 
 * @returns 
 */
export async function restoreContract(
    txBuilder: TransactionBuilder,
    server: SorobanRpc.Server,
    contractAddress: string,
): Promise<Transaction> {
    // Read Write
    const network = (await server.getNetwork()).passphrase;
    const ledgerKey = xdr.LedgerKey.contractData(
        new xdr.LedgerKeyContractData({
            contract: new Contract(contractAddress).address().toScAddress(),
            key: xdr.ScVal.scvLedgerKeyContractInstance(),
            durability: xdr.ContractDataDurability.persistent()
        })
    );

    const ledgerEntries = await server.getLedgerEntries(ledgerKey);
    const ledgerEntry = ledgerEntries.entries[0] as SorobanRpc.Api.LedgerEntryResult;
    const hash = ledgerEntry.val.contractData().val().instance().executable().wasmHash();
    const sorobanData = new SorobanDataBuilder()
        .setReadWrite([
            xdr.LedgerKey.contractCode(
                new xdr.LedgerKeyContractCode({ hash })
            ),
            ledgerKey
        ])
        .build()

    let tx: Transaction = txBuilder
        // .addOperation(Operation.bumpFootprintExpiration({ ledgersToExpire: 101 }))
        .addOperation(Operation.restoreFootprint({}))
        .setNetworkPassphrase(network)
        .setSorobanData(sorobanData)
        .setTimeout(0)
        .build()

    tx = await server.prepareTransaction(tx) as Transaction;
    return tx;
}
//#endregion

//#region transaction.ts
export const submitTxAndGetContractId = async (
    signed: { status: string, tx: string },
    server: SorobanRpc.Server,
    selectedNetwork: NetworkDetails,
): Promise<string> => {
    // If there is an error, the user likely canceled the transaction.
    if (signed.status) {
        return "";
    }

    try {
        // Submit transaction
        const gtr = await submitTx(signed.tx, server, selectedNetwork);
        if (gtr.status == SorobanRpc.Api.GetTransactionStatus.SUCCESS && gtr.resultMetaXdr) {
            // const buff = Buffer.from(gtr.resultMetaXdr, "base64");
            const buff = Buffer.from(gtr.resultMetaXdr.toXDR("base64"), "base64");
            const txMeta = xdr.TransactionMeta.fromXDR(buff);
            return txMeta.v3().sorobanMeta()?.returnValue().address().contractId().toString("hex") || "";
        }
    } catch (e) {
        console.error(e);
    }

    return "";
}

export const submitTxAndGetWasmId = async (
    signed: { status: string, tx: string },
    server: SorobanRpc.Server,
    selectedNetwork: NetworkDetails,
): Promise<string> => {
    // If there is an error, the user likely canceled the transaction.
    if (signed.status) {
        console.log(signed.status);
        return "";
    }

    let wasmId: string = "";
    try {
        // Submit transaction
        const gtr = await submitTx(signed.tx, server, selectedNetwork);

        // Get the wasmId
        if (gtr.status == SorobanRpc.Api.GetTransactionStatus.SUCCESS && gtr.resultMetaXdr) {
            const buff = Buffer.from(gtr.resultMetaXdr.toXDR("base64"), "base64");
            const txMeta = xdr.TransactionMeta.fromXDR(buff);
            // const txMeta = xdr.TransactionMeta.fromXDR(getTXData.resultMetaXdr, "base64");
            return txMeta.v3().sorobanMeta()?.returnValue().bytes().toString("hex") || "";
        }
    } catch (e) {
        console.error(e);
    }

    return "";
}
//#endregion