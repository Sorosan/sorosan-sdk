import { SorobanRpc, xdr } from 'stellar-sdk';
import { DEFAULT_NETWORK, NetworkDetails } from '../lib/network';
import {
    BASE_FEE,
    PLACEHOLDER_ACCOUNT,
    getEstimatedFee,
    getServer,
    initaliseSorosanTransactionBuilder,
} from '../lib/soroban';

export class Soroban {
    /**
     * @ignore
     * The currently selected network details.
     */
    selectedNetwork: NetworkDetails;

    /**
     * @ignore
     * The Soroban server instance.
     */
    server: SorobanRpc.Server;

    /**
     * @ignore
     * The active public key.
     */
    publicKey: string;

    constructor(selectedNetwork: NetworkDetails, activePublicKey?: string) {
        this.selectedNetwork = selectedNetwork || DEFAULT_NETWORK;
        this.server = getServer(selectedNetwork);
        this.publicKey = activePublicKey || "";
    }

    /**
     * @ignore
     * Initialize a transaction builder.
     *
     * @param {string} [pubKey] - The public key to use for the transaction. If not provided, the activePublicKey will be used.
     * @param {string} [fee] - The fee for the transaction. If not provided, the BASE_FEE will be used.
     * @returns {Promise<TxBuilder>} A Promise that resolves to a transaction builder.
     */
    protected async initaliseTransactionBuilder(publicKey?: string, fee?: string) {
        // Use the provided pubKey or the activePublicKey if not provided
        const usedPublicKey = publicKey || this.publicKey;

        // Get the network information
        const network = await this.server.getNetwork();

        // Get the transaction builder
        return await initaliseSorosanTransactionBuilder(
            usedPublicKey,
            fee ? fee.toString() : BASE_FEE,
            this.server,
            network.passphrase,
        );
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
    protected async calculateEstimateGas(
        contractAddress: string,
        method: string,
        args: xdr.ScVal[]
    ): Promise<string> {
        // Create a transaction builder with a placeholder account (no actual account used).
        const txBuilder = await this.initaliseTransactionBuilder(PLACEHOLDER_ACCOUNT);

        // Get the estimated gas cost by simulating the transaction.
        return await getEstimatedFee(
            contractAddress,
            txBuilder,
            this.server,
            "",
            method,
            args
        );
    }

    protected set setPublicKey(publicKey: string) {
        this.publicKey = publicKey;
    }
}

