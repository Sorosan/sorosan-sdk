import { Address } from 'stellar-sdk';
import { NetworkDetails } from 'lib/network';
import {
    PLACEHOLDER_ACCOUNT,
    simulateTx
} from 'lib/soroban';
import { Soroban } from 'sdk/soroban';
import { SorosanContract } from './sorosan-contract';

export class SorosanToken extends Soroban {
    contract: SorosanContract;

    constructor(
        contractAddress: string,
        selectedNetwork: NetworkDetails,
        activePublicKey?: string
    ) {
        super(selectedNetwork, activePublicKey);
        this.contract = new SorosanContract(contractAddress);

    }

    /**
     * Retrieves the name of the contract.
     *
     * This method invokes the "name" function of the contract using a transaction builder and the Soroban RPC server.
     *
     * @returns {Promise<string>} - A promise that resolves to the name of the contract.
     * 
     * @example
     * const contractAddress: string;
     * const token = new Token(contractAddress);
     * const name = await token.name();
     * console.log('Contract name:', name);
     */
    async name(): Promise<string> {
        const txBuilder = await this.initaliseTransactionBuilder(this.publicKey || PLACEHOLDER_ACCOUNT);
        const tx = await txBuilder
            .invokeContractFunctionOp(this.contract.contractId(), "name")
            .buildAndPrepare(this.server);

        return await simulateTx<string>(tx, this.server);
    }

    /**
     * Retrieves the symbol of the contract.
     *
     * This method invokes the "symbol" function of the contract using a transaction builder and the Soroban RPC server.
     *
     * @returns {Promise<string>} - A promise that resolves to the symbol of the contract.
     * 
     * @example
     * const contractAddress: string;
     * const token = new Token(contractAddress);
     * const symbol = await token.symbol();
     * console.log('Contract symbol:', symbol);
     */
    async symbol(): Promise<string> {
        const txBuilder = await this.initaliseTransactionBuilder(this.publicKey || PLACEHOLDER_ACCOUNT);
        const tx = await txBuilder
            .invokeContractFunctionOp(this.contract.contractId(), "symbol")
            .buildAndPrepare(this.server);

        return await simulateTx<string>(tx, this.server);
    }

    /**
     * Retrieves the decimal of the contract.
     *
     * This method invokes the "decimal" function of the contract using a transaction builder and the Soroban RPC server.
     *
     * @returns {Promise<number>} - A promise that resolves to the decimal of the contract.
     * 
     * @example
     * const contractAddress: string;
     * const token = new Token(contractAddress);
     * const decimal = token contract.decimal();
     * console.log('Contract decimal:', decimal);
     */
    async decimal(): Promise<number> {
        const txBuilder = await this.initaliseTransactionBuilder(this.publicKey || PLACEHOLDER_ACCOUNT);
        const tx = await txBuilder
            .invokeContractFunctionOp(this.contract.contractId(), "decimal")
            .buildAndPrepare(this.server);

        return await simulateTx<number>(tx, this.server);
    }

    /**
     * Retrieves the balance of the specified address from the contract.
     *
     * This method retrieves the balance of the specified address from the contract using a transaction builder and the Soroban RPC server.
     *
     * @param {string} [address] - The address for which to retrieve the balance. If not provided, the balance of the contract owner is retrieved.
     * @returns {Promise<BigInt>} - A promise that resolves to the balance of the specified address from the contract.
     * 
     * @example
     * const address: string;
     * const contractAddress: string;
     * const token = new Token(contractAddress);
     * const balance = await token.balance(address);
     * console.log(`Balance of address ${address || 'contract owner'}: ${balance}`);
     */
    async balance(address?: string): Promise<BigInt> {
        const addr = address || this.publicKey;
        if (!addr) {
            return BigInt(0); // throw new Error("No address");
        }

        const txBuilder = await this.initaliseTransactionBuilder(this.publicKey || PLACEHOLDER_ACCOUNT);
        const params = [new Address(addr).toScVal()];
        const tx = await txBuilder
            .invokeContractFunctionOp(this.contract.contractId(), "balance", params)
            .buildAndPrepare(this.server);

        return await simulateTx<BigInt>(tx, this.server);
    }
}