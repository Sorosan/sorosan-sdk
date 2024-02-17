import { Account, Asset, SorobanRpc, Transaction, xdr } from 'stellar-sdk';
import { NetworkDetails } from 'lib/network';
import {
    TransactionResponse,
    accountToScVal,
    getAssetContractId,
    getContractAddress,
    getTokenWasmId,
    signTransactionWithWallet,
    submitTx,
    toScVal
} from 'lib/soroban';
import { Soroban } from './soroban';
import { SorosanToken } from './classes/sorosan-token';

export class TokenSDK extends Soroban {
    constructor(selectedNetwork: NetworkDetails, activePublicKey?: string) {
        super(selectedNetwork, activePublicKey);
    }

    /**
     * 
     */
    load(contractAddress: string): SorosanToken {
        return new SorosanToken(contractAddress, this.selectedNetwork, this.publicKey);
    }

    /**
     * Retrieves the name of a token contract given its contract address.
     *
     * @param {string} contractAddress - The address of the token contract.
     * @returns {Promise<string>} - A promise that resolves to the name of the token contract as a string.
     *
     * @throws {Error} If there is an error in retrieving the token name.
     *
     * @example
     * // Retrieve the name of a token contract by its address.
     * const contractAddress = "CAZNM4AAQCQPUQGR72MIC7NPWHZBDOQKZBUQ3WTULIDALOWMOG23L6JT";
     * const tokenName = await sdk.wallet.name(contractAddress);
     * console.log(`Token Name: ${tokenName}`);  // Example output: Token Name: Stellar Token
     */
    async name(contractAddress: string): Promise<string> {
        const token = new SorosanToken(contractAddress, this.selectedNetwork, this.publicKey);
        return await token.name();
    }

    /**
     * Retrieves the symbol (ticker) of a token contract given its contract address.
     *
     * @param {string} contractAddress - The address of the token contract.
     * @returns {Promise<string>} - A promise that resolves to the symbol (ticker) of the token contract as a string.
     *
     * @throws {Error} If there is an error in retrieving the token symbol.
     *
     * @example
     * // Retrieve the symbol of a token contract by its address.
     * const contractAddress = "CAZNM4AAQCQPUQGR72MIC7NPWHZBDOQKZBUQ3WTULIDALOWMOG23L6JT";
     * const symbol = await sdk.wallet.symbol(contractAddress);
     * console.log(`Token Symbol: ${symbol}`);  // Example output: Token Symbol: XLM
     */
    async symbol(contractAddress: string): Promise<string> {
        const token = new SorosanToken(contractAddress, this.selectedNetwork, this.publicKey);
        return await token.name();
    }

    /**
     * Retrieves the balance of an address for a given token contract.
     *
     * If an `address` is provided, it retrieves the balance for the specified address.
     * If no `address` is provided, it retrieves the balance for the Freighter user's address.
     *
     * @param {string} contractAddress - The address of the token contract.
     * @param {string} [address] - (Optional) The address for which to retrieve the balance. If not provided, the Freighter user's address will be used.
     * @returns {Promise<BigInt>} - A promise that resolves to the balance of the specified address in the token contract as a BigInt.
     *
     * @throws {Error} If there is an error in retrieving the balance or if no address is provided.
     *
     * @example
     * // Example 1: Retrieve the balance of the Freighter user's address for a token contract.
     * const contractAddress = "CAZNM4AAQCQPUQGR72MIC7NPWHZBDOQKZBUQ3WTULIDALOWMOG23L6JT";
     * const symbol = await sdk.wallet.balance(contractAddress);
     * console.log(`Balance: ${symbol}`);  // Example output: Balance: 1000n
     *
     * @example
     * // Example 2: Retrieve the balance of a specific address for a token contract.
     * const contractAddress = "CAZNM4AAQCQPUQGR72MIC7NPWHZBDOQKZBUQ3WTULIDALOWMOG23L6JT";
     * const address = "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN";
     * const symbol = await sdk.wallet.balance(contractAddress, address);
     * console.log(`Balance: ${symbol}`);  // Example output: Balance: 1000n
     */
    async balance(contractAddress: string, address?: string): Promise<BigInt> {
        const token = new SorosanToken(contractAddress, this.selectedNetwork, this.publicKey);
        return await token.balance(address);
    }

    /**
     * Retrieves the decimal value of a token contract given its contract address.
     *
     * If the address is not provided, it retrieves the decimal value for the Freighter user's balance.
     *
     * @param {string} contractAddress - The address of the token contract.
     * @returns {Promise<number>} - A promise that resolves to the decimal value of the token contract.
     *
     * @throws {Error} If there is an error in retrieving the decimal value.
     *
     * @example
     * // Retrieve the decimal value of a token contract by its address.
     * const contractAddress = "CAZNM4AAQCQPUQGR72MIC7NPWHZBDOQKZBUQ3WTULIDALOWMOG23L6JT";
     * const decimal = await sdk.wallet.decimal(contractAddress);
     * console.log(`Decimal value: ${decimal}`);  // Example output: Decimal value: 7
     */
    async decimal(contractAddress: string): Promise<number> {
        const token = new SorosanToken(contractAddress, this.selectedNetwork, this.publicKey);
        return await token.decimal();
    }

    /**
     * Deploys a smart contract token to the using a given WebAssembly (Wasm) binary code and returns the contract's unique identifier (contractId).
     *
     * @async
     * @param {string} [tokenWasm] - The WebAssembly (Wasm) binary code in hexadecimal format. Default is a placeholder value.
     * @returns {Promise<string>} - A promise that resolves to the unique identifier (contractId) of the deployed smart contract.
     * @throws {Error} If the deployment fails or if contractId retrieval encounters an error.
     *
     * @example
     * const wasmId = "706ac9480880242cd030a5efeb060d86f51627fb8488f5e78660a7f175b85fe1";
     * try {
     *     const contractId = await deploy(wasmId);
     *     const contractAddress = sdk.util.getContractAddress(contractId);
     *     console.log(`Smart contract deployed with contract: ${contractAddress}`);
     * } catch (error) {
     *     console.error(`Smart contract deployment failed: ${error.message}`);
     * }
     */
    async deploy(): Promise<string> {
        const tokenWasm = getTokenWasmId(this.selectedNetwork.network);
        const txBuilder = await this.initaliseTransactionBuilder(this.publicKey);
        const source: Account = await this.server.getAccount(this.publicKey);
        const tx: Transaction = await txBuilder
            .createContractOp(tokenWasm, source)
            .buildAndPrepareAsTransaction(this.server);

        const ret = await signTransactionWithWallet(tx.toXDR(), this.publicKey, this.selectedNetwork);
        if (ret.status) {
            return Promise.reject("Transaction signing failed");
        }

        const reciept = await submitTx(ret.tx, this.server, this.selectedNetwork);
        const payload = TransactionResponse.contractId(reciept);    // contractID

        return payload;
    }

    /**
     * Used ContractSDK.call to call the contract method initialize. This will be deprecated in the future.
     * @param contractAddress 
     * @param name 
     * @param symbol 
     * @param decimal 
     * @returns 
     */
    async initialise(
        contractAddress: string,
        name: string,
        symbol: string,
        decimal: number
    ) {
        const args = [
            accountToScVal(this.publicKey),
            toScVal(decimal, "u32"),
            toScVal(name),
            toScVal(symbol),
        ];
        const method = "initialize";
        const gas = await this.calculateEstimateGas(contractAddress, method, args);
        const txBuilder = await this.initaliseTransactionBuilder(this.publicKey, gas.toString());
        const tx = await txBuilder
            .invokeContractFunctionOp(contractAddress, method, args)
            .buildAndPrepareAsTransaction(this.server);

        const signedTx = await signTransactionWithWallet(
            tx.toXDR(),
            this.publicKey!,
            this.selectedNetwork,
        )

        if (signedTx.status) {
            return false;
        }

        try {
            const gtr = await submitTx(signedTx.tx, this.server, this.selectedNetwork);

            if (gtr.status == SorobanRpc.Api.GetTransactionStatus.SUCCESS && gtr.resultMetaXdr) {
                return true;
            }
        } catch (e) {
            console.log(e);
        }

        return false;
    }

    /**
     * Retrieves the contract address associated with an asset using its code and issuer's public key.
     *
     * @async
     * @param {string} code - The code (symbol) of the asset.
     * @param {string} issuer - The issuer's public key for the asset.
     * @returns {Promise<string>} - A promise that resolves to the contract address of the asset.
     *                            Returns an empty string if an error occurs during retrieval.
     *
     * @example
     * const assetCode = "XLM";
     * const assetIssuer = "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN";
     * try {
     *     const contractAddress = await sdk.token.getContractAddressFromAsset(assetCode, assetIssuer);
     *     console.log(`Contract address for ${assetCode} issued by ${assetIssuer}: ${contractAddress}`);
     * } catch (error) {
     *     console.error(`Failed to retrieve contract address: ${error.message}`);
     * }
     */
    async getContractAddressFromAsset(code: string, issuer: string): Promise<string> {
        try {
            const asset = new Asset(code, issuer);
            const contractId = getAssetContractId(asset, this.selectedNetwork.networkPassphrase);
            return getContractAddress(contractId);
        } catch (e) {
            return "";
        }
    }

    /**
     * Retrieves asset information by its contract address.
     *
     * @async
     * @param {string} contractAddress - The contract address of the asset.
     * @returns {Promise<Asset | null>} - A promise that resolves to the asset information or null if not found.
     *
     * @example
     * const contractAddress = "CAZNM4AAQCQPUQGR72MIC7NPWHZBDOQKZBUQ3WTULIDALOWMOG23L6JT";
     * try {
     *     const assetInfo = await sdk.token.getAsset(contractAddress);
     *     if (assetInfo) {
     *         console.log(`Asset code: ${assetInfo.getCode()}, Issuer: ${assetInfo.getIssuer()}`);
     *     } else {
     *         console.log("Asset not found.");
     *     }
     * } catch (error) {
     *     console.error(`Failed to retrieve asset information: ${error.message}`);
     * }
     */
    // async getAsset(contractAddress: string): Promise<Asset | null> {
    //     try {
    //         return await getAsset(contractAddress);
    //     } catch (e) {
    //         console.error(e);
    //     }
    //     return null;
    // }

    /**
     * Checks if a contract address is associated with a wrapped asset.
     *
     * @async
     * @param {string} contractAddress - The contract address to check.
     * @returns {Promise<boolean>} - A promise that resolves to true if the asset is wrapped, false otherwise.
     *
     * @example
     * const contractAddress = "CAZNM4AAQCQPUQGR72MIC7NPWHZBDOQKZBUQ3WTULIDALOWMOG23L6JT";
     * try {
     *     const isWrapped = await sdk.token.isWrapped(contractAddress);
     *     if (isWrapped) {
     *         console.log(`Asset at ${contractAddress} is wrapped.`);
     *     } else {
     *         console.log(`Asset at ${contractAddress} is not wrapped.`);
     *     }
     * } catch (error) {
     *     console.error(`Failed to determine if asset is wrapped: ${error.message}`);
     * }
     */
    // async isWrapped(contractAddress: string): Promise<boolean> {
    //     try {
    //         const asset = await this.getAsset(contractAddress);
    //         if (asset) {
    //             return true;
    //         }
    //     } catch (e) {
    //         console.error(e);
    //     }
    //     return false;
    // }

    /**
     * Creates a new asset with the specified asset code, asset issuer, and limit.
     * This operation involves two steps: creating a trustline for the asset and funding it.
     * 
     * @param {string} assetCode - The code (symbol) of the asset to create.
     * @param {string} [assetIssuer] - (Optional) The issuer's public key for the asset. Defaults to the current user's public key.
     * @param {string} [limit] - (Optional) The maximum limit for the asset. Defaults to "10000000".
     * @returns {Promise<Asset | undefined>} - A promise that resolves to the created asset or undefined if the operation fails.
     * @throws {Error} If any step of the asset creation process fails.
     * 
     * @example
     * const asset = await sdk.wallet.createAsset(
     *    "WXLM", 
     *    "GDLEI7MS6EMTGHB7N5YHSVEMEWSWNUM4T77VDEGNTXSBRTIGMXUCE5GF",
     *    10000000)
     * console.log(asset.getCode());        // WXLM
     * console.log(asset.getIssuer());      // GDLEI7MS6EMTGHB7N5YHSVEMEWSWNUM4T77VDEGNTXSBRTIGMXUCE5GF
     */
    async createAsset(
        assetCode: string,
        assetIssuer: string = this.publicKey,
        limit: string = "10000000"
    ): Promise<Asset | undefined> {
        const asset = new Asset(assetCode, assetIssuer);
        console.log("Creating asset:", asset.getCode(), asset.getIssuer(), "with limit:", limit);

        try {
            // Create asset trustline
            const trusted: boolean = await this.createAssetTrustline(asset, limit);

            console.log("Asset trustline created:", trusted);
            if (!trusted) {
                return;
            }

            // Fund the asset
            const fundedAsset = await this.fundAsset(asset, limit);

            console.log("Asset fundedAsset created:", fundedAsset);
            if (fundedAsset) {
                console.log("Asset creation successful:", fundedAsset.getCode(), fundedAsset.getIssuer());
                return fundedAsset;
            }
        } catch (error) {
            console.error("Asset creation failed:", error);
        }

        return;
    }

    /**
     * Wraps the specified asset to create a wrapped token.
     * This operation involves creating a wrapped token contract on the blockchain.
     * 
     * @param {Asset} asset - The asset to wrap.
     * @returns {Promise<string>} - A promise that resolves to the contract address of the wrapped token.
     * @throws {Error} If the asset is not provided, the wrap operation fails, or there is an issue with contract creation.
     * 
     * @example
     * const asset = await sdk.wallet.createAsset(
     *    "WXLM", 
     *    "GDLEI7MS6EMTGHB7N5YHSVEMEWSWNUM4T77VDEGNTXSBRTIGMXUCE5GF",
     *    10000000)
     * const contractAddress = await sdk.wallet.wrap(asset);        // Main method
     * console.log(contractAddress);
     */
    async wrap(asset: Asset): Promise<string> {
        console.log("Wrapping Asset", asset.getCode(), asset?.getIssuer());
        if (!asset) {
            throw new Error("Asset not created");
        }

        const txBuilder = await this.initaliseTransactionBuilder();

        const contractAddress = await this.getContractAddressFromAsset(
            asset?.getCode(),
            asset.getIssuer());

        const tx = await txBuilder
            .createContractFromAssetOp(asset, contractAddress)
            .buildAndPrepareAsTransaction(this.server);

        const signedTx = await signTransactionWithWallet(
            tx.toXDR(),
            this.publicKey!,
            this.selectedNetwork,
        );

        if (signedTx.status) {
            console.error("WrapToken operation failed:", signedTx.status);
            return "";
        }

        try {
            const result = await this.submitAndGetValue(signedTx.tx);
            if (result) {
                return contractAddress;
            }
        } catch (error) {
            console.error("WrapToken failed:", error);
        }

        return contractAddress;
    }

    /**
     * @ignore
     * Funds an asset by creating a payment transaction for the specified asset and limit.
     * If successful, returns the funded asset; otherwise, returns undefined.
     *
     * @param {Asset} asset - The asset to fund.
     * @param {string} limit - The maximum limit for the asset.
     * @returns {Promise<Asset | undefined>} - A promise that resolves to the funded asset or undefined if the operation fails.
     */
    private async fundAsset(asset: Asset, limit: string): Promise<Asset | undefined> {
        const txBuilder = await this.initaliseTransactionBuilder();
        const tx: Transaction = await txBuilder
            .assetPaymentOp(this.publicKey, asset, limit)
            .buildAndPrepareAsTransaction(this.server);

        const signedTx = await signTransactionWithWallet(
            tx.toXDR(),
            this.publicKey!,
            this.selectedNetwork
        );

        if (signedTx.status) {
            console.error("Asset funding failed:", signedTx.status);
            return undefined;
        }

        try {
            const result = await this.submitAndGetValue(signedTx.tx);
            if (result) {
                return asset;
            }
        } catch (e: any) {
            console.error("FundAsset submit transaction failed:", e.message);
        }

        return;
    }

    /**
     * @ignore
     * Creates a trustline for the specified asset with the given limit.
     * If successful, returns true; otherwise, returns false.
     *
     * @param {Asset} asset - The asset for which to create a trustline.
     * @param {string} limit - The maximum limit for the trustline.
     * @returns {Promise<boolean>} - A promise that resolves to true if the trustline is successfully created, false otherwise.
     */
    private async createAssetTrustline(asset: Asset, limit: string): Promise<boolean> {
        const txBuilder = await this.initaliseTransactionBuilder();
        const tx: Transaction = await txBuilder
            .changeTrustOp(asset, limit)
            .buildAndPrepareAsTransaction(this.server);

        const signedTx = await signTransactionWithWallet(
            tx.toXDR(),
            this.publicKey!,
            this.selectedNetwork
        );

        if (signedTx.status) {
            console.error("ChangeTrust operation failed:", signedTx.status);
            return false;
        }

        let trusted: boolean = false;
        try {
            const result = await this.submitAndGetValue(signedTx.tx);
            (result != null) && (trusted = true);
        } catch (e: any) {
            console.error("ChangeTrust submit transaction failed:", e.message);
        }

        return trusted;
    }

    /**
     * @ignore
     * Submits a transaction and handles the result to extract the contract's return value.
     *
     * @private
     * @param {string} tx - The transaction to submit.
     * @returns {Promise<xdr.ScVal | undefined>} - A promise that resolves to the contract's return value if successful; otherwise, returns undefined.
     */
    private async submitAndGetValue(tx: string): Promise<xdr.ScVal | undefined> {
        try {
            const gtr = await submitTx(tx, this.server, this.selectedNetwork);
            return TransactionResponse.scVal(gtr);
        } catch (e: any) {
            console.error("ChangeTrust submit transaction failed:", e.message);
        }

        return;
    }
}


