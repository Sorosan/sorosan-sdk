import { SorobanRpc, TransactionBuilder, xdr } from 'stellar-sdk';
import BigNumber from 'bignumber.js';
import { NetworkDetails } from '../lib/network';
import {
    CustomScVal,
    PLACEHOLDER_ACCOUNT,
    isListOfNumbers,
    prepareContractCall,
    signTransactionWithWallet,
    simulateTx,
    stroopToXlm,
    structNameToXdr,
    structUnnameToXdr,
    submitTx,
    toScVal,
    xlmToStroop
} from '../lib/soroban';
import { Soroban } from './soroban';
import { getPublicKey, getUserInfo, isAllowed, isConnected } from '@stellar/freighter-api';
import { ContractSDK } from './contract-sdk';
import { TokenSDK } from './token-sdk';
import { UtilSDK } from './util-sdk';

export class SorosanSDK extends Soroban {
    contract: ContractSDK;
    token: TokenSDK;
    util: UtilSDK;

    constructor(selectedNetwork: NetworkDetails, activePublicKey?: string) {
        super(selectedNetwork);
        this.contract = new ContractSDK(selectedNetwork, activePublicKey);
        this.token = new TokenSDK(selectedNetwork, activePublicKey);
        this.util = new UtilSDK(selectedNetwork, activePublicKey);
    }

    /**
     * Calls a method on a Soroban contract. This method estimates gas, creates a transaction builder,
     * prepares the transaction, and simulates it on the network.
     *
     * @param {string} contractId - The contract identifier.
     * @param {string} method - The name of the method to call on the contract.
     * @param {xdr.ScVal[]} args - An array of ScVal arguments to pass to the method.
     *
     * @returns {Promise<any>} A promise that resolves to the result of the contract call.
     *
     * @example
     * const result = await sdk.call(
     *    "GB...",
     *    "init",
     *    [xdr.scVal.scvString("Hello World"), new Address("GB...").toScAddress(), ...]
     * );
     */
    async call(
        contractAddress: string,
        method: string,
        args?: xdr.ScVal[],
    ) {
        if (!args) args = [];

        // Call can use a dummy account to stimulate transaction
        let pk = this.publicKey || PLACEHOLDER_ACCOUNT;

        const txBuilder: TransactionBuilder = await this.initaliseTransactionBuilder(pk);
        const transaction = await prepareContractCall(
            txBuilder,
            this.server,
            contractAddress,
            method,
            args
        )

        const result = await simulateTx<any>(transaction, this.server);
        return result;
    }

    /**
     * Generic call method for a Soroban contract. This method estimates gas, creates a transaction builder,
     * prepares the transaction, and submits the transaction to the network via Freighter signing.
     *
     * @param {string} contractId - The contract identifier.
     * @param {string} method - The name of the method to call on the contract.
     * @param {xdr.ScVal[]} args - An array of ScVal arguments to pass to the method.
     *
     * @returns {Promise<boolean>} A promise that resolves to `true` if the transaction of the contract call
     * was successful, otherwise `false`.
     *
     * @example
     * const result = await sdk.send(
     *    "GB...",
     *    "init",
     *    [xdr.scVal.scvString("Hello World"), new Address("GB...").toScAddress(), ...]
     * );
     *
     * @param contractId
     * @param method
     * @param args
     * @returns {boolean} this is currently a boolean to determine if the transaction of the
     * contract call was successful.
     */
    async send(
        contractAddress: string,
        method: string,
        args?: xdr.ScVal[],
    ): Promise<SorobanRpc.Api.GetTransactionResponse> {
        if (!args) args = [];
        const gas = await this.calculateEstimateGas(contractAddress, method, args);

        const txBuilder = await this.initaliseTransactionBuilder(this.publicKey, gas.toString());
        const transaction = await prepareContractCall(
            txBuilder,
            this.server,
            contractAddress,
            method,
            args
        )

        const signedTx = await signTransactionWithWallet(
            transaction.toXDR(),
            this.publicKey!,
            this.selectedNetwork,
        )

        // If there is an error, the user likely canceled the transaction.
        if (signedTx.status) {
            throw new Error(signedTx.status);
        }

        try {
            // Submit transaction
            const gtr = await submitTx(signedTx.tx, this.server, this.selectedNetwork);
            return gtr;
        } catch (e: any) {
            throw new Error(`Transaction Submission Error: ${e.message}`);
        }
    }

    /**
     * Used to connect to the Soroban via Freighter. This method checks if the user has Freighter installed
     * and is logged in.
     *
     * @example
     * const hasFreighter = await sdk.login();
     * if (!hasFreighter) {
     *    throw new Error("Freighter not installed or not logged in");
     * }
     *
     * @returns {Promise<boolean>} A promise that resolves to `true` if the user has Freighter installed
     * and is logged in, otherwise `false`.
     */
    async login(): Promise<boolean> {
        const hasFreighter: boolean = await isConnected();
        const isLoggedIn: boolean = await isAllowed();
        if (!hasFreighter || !isLoggedIn) {
            return false;
        }

        let userInfo = { publicKey: "" };
        userInfo = await getUserInfo();
        if (!userInfo.publicKey) {
            return false;
        }

        this.setPublicKey = userInfo.publicKey;
        this.contract = new ContractSDK(this.selectedNetwork, this.publicKey);
        this.token = new TokenSDK(this.selectedNetwork, this.publicKey);
        this.util = new UtilSDK(this.selectedNetwork, this.publicKey);
        return true;
    }

    /**
     * Connects to the Soroban via Freighter.
     *
     * @returns {Promise<boolean>} A promise that resolves to `true` if the connection to Soroban via
     * Freighter is successful, otherwise `false`.
     */
    async connectWallet(): Promise<boolean> {
        const hasFreighter: boolean = await isConnected();
        const isLoggedIn: boolean = await isAllowed();
        if (!hasFreighter || !isLoggedIn) {
            return false;
        }

        this.publicKey = await getPublicKey();
        if (!this.publicKey) {
            return false;
        }

        this.setPublicKey = this.publicKey;
        return true;
    }

    /**
     * Helper function to estimate the gas cost of a contract call. This estimation is done by creating a
     * transaction builder and simulating the transaction using the Soroban network. The gas cost is
     * calculated as the sum of the base fee and the fee obtained from the simulated transaction.
     *
     * @param {string} contractAddress - The contract address to estimate gas for.
     * @param {string} method - The name of the method to be called on the contract.
     * @param {xdr.ScVal[]} args - An array of ScVal arguments to pass to the method.
     *
     * @returns {Promise<string>} A promise that resolves to a string representation of the estimated gas
     * cost for the contract call.
     *
     * @example
     * const gasEstimation = await sdk.estimateGas(
     *    "CCV3ODCHRVCUQTWJZ7F7SLKHGT3JLYWUVHAWMKIYQVSCKMGSOCOJ3AUO",
     *    "init",
     *    [xdr.scVal.scvString("Hello World"), new Address("GB...").toScAddress(), ...]
     * );
     *
     * const gasCostInStroops: number = parseInt(gasEstimation);   // Convert to a number if needed.
     */
    async estimateGas(
        contractAddress: string,
        method: string,
        args: xdr.ScVal[]
    ): Promise<string> {
        return await this.calculateEstimateGas(contractAddress, method, args);
    }

    /**
     * Batch convert of list of native typescript types to
     * Soroban data types. Note this doesn't support custom types.
     * You have to manually convert them.
     * @example
     * @param args 
     * @returns {xdr.ScVal[]}
     */
    nativesToScVal(args: CustomScVal[]): xdr.ScVal[] {
        const ret: xdr.ScVal[] = [];
        args.forEach((arg) => {
            ret.push(toScVal(arg.value, arg.type));
        });
        return ret;
    }

    /**
     * Convert native value to ScValue. Currently supported types are:
     * string, number, boolean, object, address, bytes, symbol,
     * i64, i128, i256, u64, u128, u256
     * @example
     * const addr: xdr.scVal = sdk.nativeToScVal("GBT57WS2EQU3ECJGH6LGU6I5ZOTBDCTEV2YD7L2ZJAD6U7MNMQPHIBGW", "address"),
     * const hundred: xdr.scVal = sdk.nativeToScVal(100, "i128"),
     * @param arg 
     * @param type 
     * @returns 
     */
    nativeToScVal(arg: any, type?: string): xdr.ScVal {
        return toScVal(arg, type);
    }

    /**
     * Converts a Rust type struct into an `xdr.ScVal` on Soroban type.
     *
     * This function takes a `xdr.ScSpecUdtStructV0` object representing a Rust type struct and converts it
     * into an `xdr.ScVal` object on the Soroban type system. It handles both unnamed and named structs
     * and returns the corresponding `xdr.ScVal` representation based on the struct's field names.
     *
     * @param {xdr.ScSpecUdtStructV0} struct - The `xdr.ScSpecUdtStructV0` object to convert into an `xdr.ScVal`.
     * @returns {xdr.ScVal} The converted `xdr.ScVal` representing the Rust struct on Soroban type.
     *
     * @example
     * // Get Rust information...
     * const specs = await sdk.contract.decompileContract("CDUL5OW2XI7JJQL7VGWD6Y34SXAV3ZDCSW55SUYRFGHWXVK25E7S7FXJ")
     * const types = specs.filter(x => x.switch() === xdr.ScSpecEntryKind.scSpecEntryUdtStructV0());
     * 
     * // Convert the Rust struct to an xdr.ScVal
     * types.forEach((type) => {
     *      const struct = structToScVal(myStruct as as xdr.scSpecEntryUdtStructV0)
     *      console.log(struct);
     * });
     */
    structToScVal(struct: xdr.ScSpecUdtStructV0): xdr.ScVal {
        const keys = struct.fields().map(x => x.name().toString());
        const isUnamedStruct = isListOfNumbers(keys);
        if (isUnamedStruct) {
            return structUnnameToXdr(struct);
        } else {
            return structNameToXdr(struct);
        }
    }

    /**
    * Converts XLM (Lumen) to stroops (1 XLM = 10^7 stroops).
    *
    * @param {number} amount - The amount of XLM to convert.
    * @returns {BigNumber} The equivalent amount in stroops as a BigNumber.
    * @example
    * const xlmAmount = 5.0; // Replace with the actual amount of XLM to convert.
    * const stroops = sdk.toStroop(xlmAmount);
    * console.log(`Equivalent in Stroops: ${stroops.toString()}`);
    */
    toStroop(amount: number): BigNumber {
        return xlmToStroop(amount.toString());
    }

    /**
     * Converts stroops to XLM (Lumen) (1 XLM = 10^7 stroops).
     *
     * @param {number} amount - The amount in stroops to convert.
     * @returns {BigNumber} The equivalent amount in XLM as a BigNumber.
     * @example
     * const stroopsAmount = 50000000; // Replace with the actual amount in stroops to convert.
     * const xlm = sdk.toXLM(stroopsAmount);
     * console.log(`Equivalent in XLM: ${xlm.toString()}`);
     */
    toXLM(amount: number): BigNumber {
        return stroopToXlm(BigNumber(amount));
    }
}

