import {
    Account,
    Address,
    Asset,
    Contract,
    Memo,
    Operation,
    SorobanRpc,
    TimeoutInfinite,
    Transaction,
    TransactionBuilder,
    xdr
} from "stellar-sdk";
const { Server } = SorobanRpc;

import { NetworkDetails, RPC, getRPC } from "../network";
import { Salt } from "./util";
import ba from './binascii';

export const BASE_FEE = "100";
export const XLM_DECIMALS = 7;
export const PLACEHOLDER_ACCOUNT = "GC5S4C6LMT6BCCARUCK5MOMAS4H7OABFSZG2SPYOGUN2KIHN5HNNMCGL"

export const getServer = (networkDetails: NetworkDetails) =>
    new Server(getRPC(networkDetails) || RPC.Testnet, {
        allowHttp: networkDetails.networkUrl.startsWith("http://"),
    });

/**
 * Asynchronously creates and configures a transaction builder instance.
 *
 * @param {string} pk - The public key associated with the account.
 * @param {string} fee - The fee to be set for the transaction.
 * @param {Server} server - The server instance used to fetch account details.
 * @param {string} networkPassphrase - The network passphrase for the blockchain network.
 * @returns {Promise<TransactionBuilder>} A promise that resolves to a new TransactionBuilder instance.
 */
export const initaliseTransactionBuilder = async (
    publicKey: string,
    fee: string,
    server: SorobanRpc.Server,
    networkPassphrase: string,
) => {
    const source = await server.getAccount(publicKey);
    return new TransactionBuilder(source, {
        fee,
        networkPassphrase,
    });
};

/**
 * Asynchronously calculates and retrieves the estimated transaction fee for invoking a smart contract method
 * on a blockchain network.
 *
 * @param {string} contractAddress - The address of the smart contract to interact with.
 * @param {TransactionBuilder} txBuilder - The transaction builder instance used to construct the transaction.
 * @param {Server} server - The server instance used to submit the transaction for fee estimation.
 * @param {string} memo - An optional memo to include with the transaction.
 * @param {string} method - The name of the smart contract method to call.
 * @param {xdr.ScVal[]} params - An array of parameters to pass to the smart contract method.
 *
 * @returns {Promise<string>} A promise that resolves to the estimated transaction fee as a string.
 *
 * @throws {Error} If there is a simulation error while estimating the fee, an error is thrown with a description.
 */
export const getEstimatedFee = async (
    contractAddress: string,
    txBuilder: TransactionBuilder,
    server: SorobanRpc.Server,
    memo: string,
    method: string,
    params: xdr.ScVal[],
) => {
    const contract = new Contract(contractAddress);

    const tx = txBuilder
        .addOperation(contract.call(method, ...params))
        .setTimeout(TimeoutInfinite);

    if (memo.length > 0) {
        tx.addMemo(Memo.text(memo));
    }

    const raw = tx.build();

    let response = await server.simulateTransaction(raw);

    if (SorobanRpc.Api.isSimulationError(response)) {
        throw new Error(`Simulation Error: ${response.error}`);
    }

    // response = response as SorobanRpc.SimulateTransactionSuccessResponse;
    const classicFeeNum = parseInt(raw.fee, 10) || 0;
    const minResourceFeeNum = parseInt(response.minResourceFee, 10) || 0;
    const fee = (classicFeeNum + minResourceFeeNum).toString();

    return fee;
};

/**
 * Asynchronously prepares a transaction for invoking a method on a smart contract
 * on a blockchain network.
 *
 * @param {TransactionBuilder} txBuilder - The transaction builder instance used to construct the transaction.
 * @param {Server} server - The server instance used to prepare the transaction.
 * @param {string} contractAddress - The address of the smart contract to interact with.
 * @param {string} method - The name of the smart contract method to call.
 * @param {xdr.ScVal[]} args - An array of arguments to pass to the smart contract method.
 *
 * @returns {Promise<Transaction>} A promise that resolves to the prepared transaction.
 */
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

    const contractIdPreimageFromAddress = new xdr.ContractIdPreimageFromAddress({
        address: addr.toScAddress(),
        salt: buff,
    });
    const contractIdPreimage = xdr.ContractIdPreimage
        .contractIdPreimageFromAddress(contractIdPreimageFromAddress);

    const createContract = new xdr.CreateContractArgs({
        contractIdPreimage: contractIdPreimage,
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
        executable: xdr.ContractExecutable.contractExecutableToken(),
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

export const issueAssetToken = async (
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