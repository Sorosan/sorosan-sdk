// import { Address, Contract, Durability, Keypair, Memo, MemoHash, Networks, Operation, Server, SorobanDataBuilder, SorobanRpc, Transaction, TransactionBuilder, assembleTransaction, xdr } from "soroban-client";
import { BASE_FEE } from "./main";

import { Address, Contract, Memo, MemoHash, Operation, SorobanDataBuilder, SorobanRpc, Transaction, TransactionBuilder, xdr } from "stellar-sdk";
const { Durability, assembleTransaction } = SorobanRpc;

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

export async function restoreContract(
    txBuilder: TransactionBuilder,
    server: SorobanRpc.Server,
    c: Contract,
): Promise<Transaction> {
    const network = (await server.getNetwork()).passphrase
    let tx = txBuilder
        .setTimeout(1000)
        .setNetworkPassphrase(network)
        .setSorobanData(new SorobanDataBuilder()
            .setReadWrite([c.getFootprint()])
            .build())
        .addOperation(Operation.restoreFootprint({}))
        .build();

    tx = await server.prepareTransaction(tx) as Transaction;

    return tx;
}

export const bumpContractInstance = async (
    txBuilder: TransactionBuilder,
    server: SorobanRpc.Server,
    contractAddress: string,
    ledgersToExpire: number,
    publicKey: string,
): Promise<Transaction> => {
    const contract = new Address(contractAddress);
    const ledgerKey: xdr.LedgerKey = xdr.LedgerKey.contractData(
        new xdr.LedgerKeyContractData({
            contract: contract.toScAddress(),
            key: xdr.ScVal.scvLedgerKeyContractInstance(),
            durability: xdr.ContractDataDurability.persistent(),
        })
    );

    const sorobanData = new SorobanDataBuilder()
        .setReadOnly([ledgerKey])
        .build()

    const network = (await server.getNetwork()).passphrase;
    const key = xdr.ScVal.scvLedgerKeyContractInstance()
    const contractData = await server.getContractData(contract, key, Durability.Persistent)
    const hash = contractData.val.contractData().val().instance().executable().wasmHash()

    // const sorobanData = new SorobanDataBuilder()
    //     .setReadWrite([
    //         xdr.LedgerKey.contractCode(
    //             new xdr.LedgerKeyContractCode({
    //                 hash,
    //             })
    //         ),
    //         xdr.LedgerKey.contractData(
    //             new xdr.LedgerKeyContractData({
    //                 contract: contract.toScAddress(),
    //                 key,
    //                 durability: xdr.ContractDataDurability.persistent(),
    //             })
    //         )
    //     ])
    //     .build()

    const acc = new Address(publicKey);
    let tx: Transaction = txBuilder
        .addOperation(Operation.extendFootprintTtl({
            source: publicKey,
            extendTo: 0,
          }))
        .setNetworkPassphrase(network)
        .setSorobanData(sorobanData)
        .setTimeout(0)
        .build()

    // tx = await server.prepareTransaction(tx) as Transaction;
    const sim = await server.simulateTransaction(tx)
    tx = assembleTransaction(tx, sim)
        .addMemo(new Memo(MemoHash, acc.toScAddress().accountId().value()))
        // .setExtraSigners([kp.publicKey()])
        .setTimeout(0)
        .build()

    return tx;
}