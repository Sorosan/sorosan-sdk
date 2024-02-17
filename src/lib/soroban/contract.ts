import { Address, Contract, Memo, MemoHash, Operation, SorobanDataBuilder, SorobanRpc, Transaction, TransactionBuilder, xdr } from "stellar-sdk";
const { Durability, assembleTransaction } = SorobanRpc;
import { Buffer } from "buffer";

export const decodeContractSpecBuffer = async (buffer: ArrayBuffer) => {
    const arrayBuffer = new Uint8Array(buffer);
    const decodedData = [];
    let offset = 0;

    while (offset < arrayBuffer.length) {
        let success = false;
        for (let length = 1; length <= arrayBuffer.length - offset; length++) {
            const subArray = arrayBuffer.subarray(offset, offset + length) as any;
            try {
                const partialDecodedData = xdr.ScSpecEntry.fromXDR(
                    subArray,
                    'base64',
                );

                decodedData.push(partialDecodedData);
                offset += length;
                success = true;
                break;
            } catch (error) {
                // Log or handle the error
            }
        }
        if (!success) {
            console.log('Failed to decode further. Stopping.');
            break;
        }
        if (offset >= arrayBuffer.length) {
            break;
        }
    }
    return decodedData;
}

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

/**
 * To implementation to SDK
 * @param txBuilder 
 * @param server 
 * @param contractAddress 
 * @param ledgersToExpire 
 * @param publicKey 
 * @returns 
 */
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