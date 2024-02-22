import { Account, Contract, SorobanDataBuilder, SorobanRpc, Transaction, scValToNative, xdr } from 'stellar-sdk';
import { NetworkDetails } from 'lib/network';
import {
    TransactionResponse,
    getContractAddress,
    isContractHash,
    signTransactionWithWallet,
    submitTx,
} from 'lib/soroban';
import { Soroban } from 'sdk/soroban';
import { Buffer } from 'buffer';
import { SorosanContract, StorageElement } from 'sdk/classes/sorosan-contract';

interface DeploymentResponse {
    reciept: SorobanRpc.Api.GetTransactionResponse,
    payload: string,
}

export class ContractSDK extends Soroban {
    constructor(selectedNetwork: NetworkDetails, activePublicKey?: string) {
        super(selectedNetwork, activePublicKey);
    }

    /**
     * Deploys a WebAssembly (Wasm) smart contract to the blockchain.
     *
     * @param {Blob} wasm - The WebAssembly code as a Blob.
     * @param {string} publicKey - The public key of the contract deployer.
     * @returns {Promise<string>} - A promise that resolves to the unique identifier (Wasm ID) of the deployed contract.
     *
     * @throws {Error} If the deployment process encounters an error or if `wasm` or `publicKey` is falsy.
     *
     * @example
     * // Deploy a Wasm contract using a Blob containing the contract code.
     * const wasmBlob = new Blob([wasmBytes], { type: 'application/wasm' });
     * const publicKey = 'GDLEI7MS6EMTGHB7N5YHSVEMEWSWNUM4T77VDEGNTXSBRTIGMXUCE5GF'; // Replace with the actual public key.
     *
     * try {
     *   const wasmId = await sdk.contract.deployWasm(wasmBlob, publicKey);
     *   console.log(`Contract deployed successfully. Wasm ID: ${wasmId}`);
     * } catch (error) {
     *   console.error(`Contract deployment failed: ${error.message}`);
     * }
     */
    async deployWasm(wasmBlob: Blob, publicKey: string): Promise<DeploymentResponse> {
        if (!publicKey) {
            return Promise.reject("Invalid or Missing public key");
        }

        if (!wasmBlob) {
            return Promise.reject("Invalid or Missing WebAssembly (wasm)");
        }

        if (wasmBlob.type !== "application/wasm") {
            throw new Error("Invalid wasm type. Expected 'application/wasm'.");
        }

        const contract = Buffer.from(await wasmBlob.arrayBuffer());
        const txBuilder = await this.initaliseTransactionBuilder(publicKey)
        const tx: Transaction = await txBuilder
            .uploadContractWasmOp(contract)
            .buildAndPrepare(this.server);

        const ret = await signTransactionWithWallet(tx.toXDR(), publicKey, this.selectedNetwork);
        if (ret.status) {
            return Promise.reject("Transaction signing failed");
        }
        const reciept = await submitTx(ret.tx, this.server, this.selectedNetwork);
        const payload = TransactionResponse.wasmId(reciept);    // WasmID

        return { reciept, payload };
    }

    /**
     * Deploys a smart contract with a specified Wasm ID to the blockchain.
     *
     * @param {string} wasmId - The unique identifier (Wasm ID) of the contract's WebAssembly code.
     * @param {string} publicKey - The public key of the contract deployer.
     * @returns {Promise<string>} - The unique identifier (Contract ID) of the deployed contract.
     *
     * @throws {Error} If the deployment process encounters an error.
     *
     * @example
     * // Deploy a contract using a Wasm ID and the contract deployer's public key.
     * const wasmId = '706ac9480880242cd030a5efeb060d86f51627fb8488f5e78660a7f175b85fe1'; // Replace with the actual Wasm ID.
     * const publicKey = 'GDLEI7MS6EMTGHB7N5YHSVEMEWSWNUM4T77VDEGNTXSBRTIGMXUCE5GF'; // Replace with the actual public key.
     *
     * try {
     *   const contractId = await sdk.contract.deploy(wasmId, publicKey);
     *   console.log(`Contract deployed successfully. Contract ID: ${contractId}`);
     * } catch (error) {
     *   console.error(`Contract deployment failed: ${error.message}`);
     * }
     */
    async deploy(wasmId: string, publicKey: string): Promise<DeploymentResponse> {
        const txBuilder = await this.initaliseTransactionBuilder(publicKey);
        const source: Account = await this.server.getAccount(publicKey);
        const tx: Transaction = await txBuilder
            .createContractOp(wasmId, source)
            .buildAndPrepareAsTransaction(this.server);

        const ret = await signTransactionWithWallet(tx.toXDR(), publicKey, this.selectedNetwork);
        if (ret.status) {
            return Promise.reject("Transaction signing failed");
        }

        const reciept = await submitTx(ret.tx, this.server, this.selectedNetwork);
        const payload = TransactionResponse.contractId(reciept);    // contractID

        return {
            reciept,
            payload
        };
    }

    /**
     * Loads a Sorosan contract instance with the specified contract address.
     *
     * This method creates and returns a new Sorosan contract instance using the provided contract address.
     *
     * @param {string} contractAddress - The address of the contract to load.
     * @returns {SorosanContract} - The Sorosan contract instance loaded with the specified contract address.
     * 
     * @example
     * const contractAddress: string;
     * const contract = SorosanContract.load(contractAddress);
     * console.log('Loaded contract:', contract);
     */
    load(contractAddress: string): SorosanContract {
        return new SorosanContract(contractAddress);
    }

    /**
     * Retrieves the WebAssembly (Wasm) ID of the contract with the specified contract address.
     *
     * This method retrieves the Wasm ID of the contract with the specified contract address using a Sorosan contract instance and the Soroban RPC server.
     *
     * @param {string} contractAddress - The address of the contract for which to retrieve the Wasm ID.
     * @returns {Promise<Buffer>} - A promise that resolves to the Wasm ID of the contract.
     * 
     * @example
     * const contractAddress: string;
     * const wasmId = await SorosanContract.wasmId(contractAddress);
     * console.log('Wasm ID:', wasmId.toString('hex'));
     */
    async wasmId(contractAddress: string): Promise<Buffer> {
        const contract = new SorosanContract(contractAddress);
        return contract.wasmId(this.server);
    }

    /**
     * Retrieves information about the contract with the specified contract address.
     *
     * This method retrieves information such as the Wasm ID, last modified ledger sequence number, and storage elements of the contract
     * with the specified contract address using a Sorosan contract instance and the Soroban RPC server.
     *
     * @param {string} contractAddress - The address of the contract for which to retrieve information.
     * @returns {Promise<any>} - A promise that resolves to an object containing the Wasm ID, last modified ledger sequence number, and storage elements of the contract.
     * 
     * @example
     * const contractAddress: string;
     * const contractInfo = await SorosanContract.contractInfo(contractAddress);
     * console.log('Contract info:', contractInfo);
     */
    async contractInfo(contractAddress: string):
        Promise<{
            wasmId: Buffer,
            ledgerSeq: number,
            storage: ReadonlyArray<StorageElement>
        }> {
        const contract = new SorosanContract(contractAddress);
        const wasmId = await contract.wasmId(this.server);
        const ledgerSeq = await contract.wasmIdLedgerSeq(this.server);
        const storage = await contract.storage(this.server);

        return { wasmId, ledgerSeq, storage };
    }

    /**
     * Retrieves information about the contract with the specified contract ID.
     *
     * This method retrieves information about the contract with the specified contract ID by first obtaining the contract address and then
     * retrieving the contract information using the `contractInfo` method.
     *
     * @param {string} contractId - The ID of the contract for which to retrieve information.
     * @returns {Promise<any>} - A promise that resolves to an object containing the Wasm ID, last modified ledger sequence number, and storage elements of the contract.
     * 
     * @example
     * const contractId: string;
     * const contractInfo = await SorosanContract.contractInfoByAddress(contractId);
     * console.log('Contract info:', contractInfo);
     */
    async contractInfoByAddress(contractId: string) {
        const contractAddress = getContractAddress(contractId);
        return await this.contractInfo(contractAddress);
    }

    async contractCodeByAddress(contractAddress: string):
        Promise<{ code: string, ledgerSeq: number } | null> {
        const contract = new SorosanContract(contractAddress);
        const code = await contract.code(this.server);
        const ledgerSeq = await contract.wasmCodeLedgerSeq(this.server);

        return { code, ledgerSeq };
    }

    /**
* Retrieves the WebAssembly (Wasm) code of a smart contract by its Wasm ID.
*
* @param {Buffer} wasmId - The unique identifier (Wasm ID) of the contract.
* @returns {Promise<{ wasmCode: string, wasmCodeLedger: number } | null>} - A promise that resolves to an object
* containing the Wasm code as a hexadecimal string and the ledger sequence number when the code was last modified.
* Returns `null` if the contract code is not found or if there is an error.
*
* @throws {Error} If there is an error in retrieving the contract code.
*
* @example
* // Retrieve the Wasm code of a contract by its Wasm ID.
* const wasmId = Buffer.from('abcdef123456', 'hex'); // Replace with the actual Wasm ID.
*
* try {
*   const contractCode = await sdk.contract.getContractCode(wasmId);
*   if (contractCode) {
*     console.log(`Contract code: ${contractCode.wasmCode}`);
*     console.log(`Last modified ledger: ${contractCode.wasmCodeLedger}`);
*   } else {
*     console.error('Contract code not found or an error occurred.');
*   }
* } catch (error) {
*   console.error(`Error retrieving contract code: ${error.message}`);
* }
*/
    async contractCodeByWasm(
        wasmId: Buffer
    ): Promise<{ code: string, ledgerSeq: number } | null> {
        const ledgerKey = xdr.LedgerKey.contractCode(
            new xdr.LedgerKeyContractCode({
                hash: wasmId
            })
        );

        const ledgerEntries = await this.server.getLedgerEntries(ledgerKey);
        if (ledgerEntries == null || ledgerEntries.entries == null) {
            return { code: "", ledgerSeq: 0 };
        }

        const ledgerEntry = ledgerEntries.entries[0] as SorobanRpc.Api.LedgerEntryResult;
        const ledgerSeq = ledgerEntry.lastModifiedLedgerSeq as number;
        // const codeEntry = xdr.LedgerEntryData.fromXDR(ledgerEntry.xdr, 'base64');
        const codeEntry = ledgerEntry.val;
        const code = codeEntry.contractCode().code().toString('hex');

        return { code, ledgerSeq };
    }

    /**
     * Initializes a contract call, calculates gas estimate, and submits the transaction.
     *
     * @param {string} contractAddress - The address of the smart contract.
     * @param {string} method - The name of the contract method to call.
     * @param {xdr.ScVal[]} args - An array of arguments to pass to the contract method.
     * @returns {Promise<boolean>} - A promise that resolves to `true` if the transaction succeeds,
     * or `false` if it fails or is canceled.
     *
     * @throws {Error} If there is an error in the initialization or submission process.
     *
     * @remarks
     * This function initiates a contract call by calculating the gas estimate, preparing the transaction,
     * and submitting it to the blockchain. It returns a boolean value indicating the success of the transaction.
     *
     * @example
     * // Initialize a contract call, calculate gas estimate, and submit the transaction.
     * const contractAddress = 'CDDKJMTAENCOVJPUWTISOQ23JYSMCLEOKXT7VEVZJWLYZ3PKLNRBXJ5C';
     * const method = 'initialise'; // Replace with the name of the contract method.
     * const args = [
     *   sdk.nativeToScVal("GDLEI7MS6EMTGHB7N5YHSVEMEWSWNUM4T77VDEGNTXSBRTIGMXUCE5GF", 'address')
     *   sdk.nativeToScVal("Token SS")
     *   sdk.nativeToScVal("SS")
     *   sdk.nativeToScVal(18, 'i32'),
     * ];
     *
     * try {
     *   const isSuccess = await sdk.contract.initialize(contractAddress, method, args);
     *   if (isSuccess) {
     *     console.log('Contract call successful.');
     *   } else {
     *     console.error('Contract call failed or was canceled.');
     *   }
     * } catch (error) {
     *   console.error(`Error initializing contract call: ${error.message}`);
     * }
     */
    async initialise(
        contractAddress: string,
        method: string,
        args: xdr.ScVal[]
    ) {
        const gas = await this.calculateEstimateGas(contractAddress, method, args);
        const txBuilder = await this.initaliseTransactionBuilder(this.publicKey, gas.toString());
        const tx: Transaction = await txBuilder
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
     * Retrieves the ABI (Application Binary Interface) of a smart contract by its contract address,
     * that contains params names and input types, and outputs names and types. All needed information
     * to call a contract method.
     *
     * @param {string} contractAddress - The address of the smart contract.
     * @returns {Promise<any[]>} - A promise that resolves to an array of contract methods and their details,
     * including method name, parameters, and outputs.
     *
     * @throws {Error} If there is an error in retrieving the contract ABI.
     *
     * @example
     * // Retrieve the ABI of a smart contract by its address.
     * const contractAddress = 'CAZNM4AAQCQPUQGR72MIC7NPWHZBDOQKZBUQ3WTULIDALOWMOG23L6JT'; // Replace with the actual contract address.
     *
     * try {
     *   const contractABI = await sdk.contract.getContractABI(contractAddress);
     *   console.log('Contract ABI:', contractABI);
     * } catch (error) {
     *   console.error(`Error retrieving contract ABI: ${error.message}`);
     * }
     */
    async getContractABI(contractAddress: string) {
        // Get Contract Code (Wasm)
        const entries = await this.decompile(contractAddress);
        let functions: any[] = [];
        entries.forEach((entry: xdr.ScSpecEntry) => {
            if (entry.switch() === xdr.ScSpecEntryKind.scSpecEntryFunctionV0()) {
                const functionV0 = entry.value() as xdr.ScSpecFunctionV0;
                const name = functionV0.name().toString();
                const doc = functionV0.doc().toString();

                const inputs = functionV0.inputs().map((input: xdr.ScSpecFunctionInputV0) => ({
                    doc: input.doc().toString(),
                    name: input.name().toString(),
                    value: input.type().switch().value,
                    type: input.type().switch().name
                }));

                const outputs = functionV0.outputs().map((output: xdr.ScSpecTypeDef) => ({
                    value: output.switch().value,
                    type: output.switch().name
                }));

                functions.push({ doc, name, inputs, outputs });
            }
        });
        return functions;
    }

    /**
     * Asynchronously retrieves contract information, including code and specification details,
     * associated with a given contract address.
     *
     * This function allows you to fetch contract data, including the WebAssembly (Wasm) code,
     * and extract information about the contract, such as functions with their parameters and outputs,
     * data structures (structs and enums), and data keys.
     *
     * @param {string} contractAddress - The address of the contract for which to retrieve information.
     * @returns {Promise<xdr.ScSpecEntry[]>} A promise that resolves to an array of `xdr.ScSpecEntry` objects,
     * representing the contract's specification and details.
     *
     * @example
     * // Retrieve contract information for a given contract address
     * const contractAddress = "GDUY7J7A33TQWOSOQGDO776GGLM3UQERL4J3SPT56F6YS4ID7MLDERI4";
     * const specs = await sdk.contract.decompileContract(contractAddress);
     *
     * // Access specific information from the contract specification
     * const fns = specs.filter(x => x.switch() === xdr.ScSpecEntryKind.scSpecEntryFunctionV0());
     * const types = specs.filter(x => x.switch() === xdr.ScSpecEntryKind.scSpecEntryUdtStructV0());
     * const enums = specs.filter(x => x.switch() === xdr.ScSpecEntryKind.scSpecEntryUdtEnumV0());
     */
    async decompile(contractAddress: string): Promise<xdr.ScSpecEntry[]> {
        const contract = new SorosanContract(contractAddress);
        return await contract.specs(this.server);
    }

    /**
     * Restores a Soroban smart contract with the given contract address.
     *
     * This function initiates the restoration process for a Soroban smart contract by creating and signing the necessary transactions.
     *
     * @param {string} contractAddress - The address of the smart contract to restore.
     * @returns {boolean} Returns `true` if the contract restoration is successful, `false` otherwise.
     *
     * @throws {Error} Throws an error if any part of the restoration process fails.
     *
     * @example
     * const contractAddressToRestore; // Replace with your actual contract address.
     * const response: SorobanRpc.Api.GetTransactionResponse = await sdk.contract.restore(contractAddressToRestore);
     * console.log(response.status);
     */
    async restore(contractAddress: string): Promise<SorobanRpc.Api.GetTransactionResponse> {
        const ledger = await this.server.getLatestLedger();

        if (!ledger) {
            return {
                status: SorobanRpc.Api.GetTransactionStatus.NOT_FOUND
            } as SorobanRpc.Api.GetMissingTransactionResponse;
        }

        const txBuilder = await this.initaliseTransactionBuilder(this.publicKey, '1000000');

        const ledgerKey = xdr.LedgerKey.contractData(
            new xdr.LedgerKeyContractData({
                contract: new Contract(contractAddress).address().toScAddress(),
                key: xdr.ScVal.scvLedgerKeyContractInstance(),
                durability: xdr.ContractDataDurability.persistent()
            })
        );

        const ledgerEntries = await this.server.getLedgerEntries(ledgerKey);
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

        let tx: Transaction = await txBuilder
            // .addOperation(Operation.bumpFootprintExpiration({ ledgersToExpire: 101 }))
            .restoreFootprintOp()
            .setNetworkPassphrase(this.selectedNetwork.networkPassphrase)
            .setSorobanData(sorobanData)
            .buildAndPrepareAsTransaction(this.server);

        const signedTx = await signTransactionWithWallet(
            tx.toXDR(),
            this.publicKey!,
            this.selectedNetwork,
        )

        if (signedTx.status) {
            return {
                status: SorobanRpc.Api.GetTransactionStatus.FAILED
            } as SorobanRpc.Api.GetFailedTransactionResponse;
        }

        return await submitTx(signedTx.tx, this.server, this.selectedNetwork);
    }

    /**
     * Checks if a string is a valid contract hash.
     *
     * @param {string} val - The string to check.
     * @returns {boolean} - `true` if the input is a valid contract hash, otherwise `false`.
     *
     * @example
     * // Check if a string is a valid contract hash.
     * const hash = '854702b2ee78e509edafc09482c823301b23e3e3417d69e468e488ff7e592bd6'; // Replace with the string to check.
     * const isValid = sdk.contract.isContractHash(hash);
     * console.log(`Is valid contract hash: ${isValid}`);
     */
    isContractHash(val: string) {
        return isContractHash(val);
    }
}
