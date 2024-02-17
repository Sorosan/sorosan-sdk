import {
    Account,
    Address,
    Asset,
    Contract,
    Memo,
    MuxedAccount,
    Operation,
    SorobanRpc,
    TimeoutInfinite,
    Transaction,
    TransactionBuilder,
    xdr,
} from "stellar-sdk";
const { Server } = SorobanRpc;

import { NetworkDetails, RPC, getRPC } from "../network";
import { SorosanTransactionBuilder } from "../../sdk/classes/sorosan-transaction-builder";

export const BASE_FEE = "100";
export const XLM_DECIMALS = 7;
/**
 * The placeholder account used calling gasless methods.
 */
export const PLACEHOLDER_ACCOUNT = "GDLEI7MS6EMTGHB7N5YHSVEMEWSWNUM4T77VDEGNTXSBRTIGMXUCE5GF"

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
 * This is in use as it allows for the creation of some operation that Soroban does not support.
 * @param publicKey 
 * @param fee 
 * @param server 
 * @param networkPassphrase 
 * @returns 
 */
export const initaliseSorosanTransactionBuilder = async (
    publicKey: string,
    fee: string,
    server: SorobanRpc.Server,
    networkPassphrase: string,
) => {
    const source = await server.getAccount(publicKey);
    return new SorosanTransactionBuilder(source, {
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
