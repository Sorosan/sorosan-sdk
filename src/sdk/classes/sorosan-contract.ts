import { Contract, SorobanRpc, scValToNative, xdr } from 'stellar-sdk';
import {
    decodeContractSpecBuffer
} from 'lib/soroban';
import { Buffer } from 'buffer';

/**
 * Represents a SorosanContract, which extends the Contract class.
 * Note: This class may require a server instance as a parameter. For now, we use the dev server instance.
 */
export class SorosanContract extends Contract {
    ledgerKey: xdr.LedgerKey;

    constructor(address: string) {
        super(address);
        this.ledgerKey = xdr.LedgerKey.contractData(
            new xdr.LedgerKeyContractData({
                contract: new Contract(address).address().toScAddress(),
                key: xdr.ScVal.scvLedgerKeyContractInstance(),
                durability: xdr.ContractDataDurability.persistent()
            })
        );
    }

    /**
     * Retrieves the WebAssembly (Wasm) ID of the contract from the Soroban RPC server.
     *
     * This method fetches the Wasm ID of the contract from the Soroban RPC server
     * using the provided server instance.
     *
     * @param {SorobanRpc.Server} server - The Soroban RPC server instance from which to fetch the Wasm ID.
     * @returns {Promise<Buffer>} - A promise that resolves to the Wasm ID of the contract.
     * 
     * @example
     * const server: SorobanRpc.Server;
     * const contractAddress: string;
     * const contract = new SorosanContract(contractAddress);
     * const wasmId = await contract.wasmId(server);
     * console.log(`Wasm ID: ${wasmId.toString('hex')}`);
     */
    async wasmId(server: SorobanRpc.Server): Promise<Buffer> {
        const ledgerEntry = await this.ledgerEntry(server)
        if (!ledgerEntry) {
            return Buffer.from([]);
        }

        // const codeData = xdr.LedgerEntryData
        //     .fromXDR(ledgerEntry.xdr, 'base64')
        //     .contractData();
        const codeData = ledgerEntry.val.contractData();
        const contractInstance = codeData.val().instance();
        return contractInstance.executable().wasmHash();
    }

    /**
     * Retrieves the last modified ledger sequence number associated with the WebAssembly (Wasm) ID of the contract from the Soroban RPC server.
     *
     * This method fetches the last modified ledger sequence number associated with the Wasm ID of the contract from the Soroban RPC server
     * using the provided server instance.
     *
     * @param {SorobanRpc.Server} server - The Soroban RPC server instance from which to fetch the last modified ledger sequence number.
     * @returns {Promise<number>} - A promise that resolves to the last modified ledger sequence number associated with the Wasm ID of the contract.
     * 
     * @example
     * const server: SorobanRpc.Server;
     * const contract: string;
     * const ledgerSeq = await contract.wasmIdLedgerSeq(server);
     * console.log(`Last modified ledger sequence number: ${ledgerSeq}`);
     */
    async wasmIdLedgerSeq(server: SorobanRpc.Server): Promise<number> {
        const ledgerEntry = await this.ledgerEntry(server)
        if (!ledgerEntry) {
            return 0;
        }

        return ledgerEntry.lastModifiedLedgerSeq || 0;
    }

    /**
     * Retrieves the storage elements associated with the contract from the Soroban RPC server.
     *
     * This method fetches the storage elements associated with the contract from the Soroban RPC server
     * using the provided server instance.
     *
     * @param {SorobanRpc.Server} server - The Soroban RPC server instance from which to fetch the storage elements.
     * @returns {Promise<ReadonlyArray<StorageElement>>} - A promise that resolves to an array of storage elements associated with the contract.
     * 
     * @example
     * const server: SorobanRpc.Server;
     * const contract: string;
     * const storageElements = await contract.storage(server);
     * console.log('Storage elements:', storageElements);
     */
    async storage(server: SorobanRpc.Server): Promise<ReadonlyArray<StorageElement>> {
        const ledgerEntry = await this.ledgerEntry(server)
        if (!ledgerEntry) {
            return [];
        }

        const codeData = ledgerEntry.val.contractData();
        const contractInstance = codeData.val().instance();
        const contractStorage = contractInstance.storage();
        return contractStorage ? this.convertStorage(contractStorage) : [];

    }

    /**
     * Retrieves the contract code associated with the contract from the Soroban RPC server.
     *
     * This method fetches the contract code associated with the contract from the Soroban RPC server
     * using the provided server instance.
     *
     * @param {SorobanRpc.Server} server - The Soroban RPC server instance from which to fetch the contract code.
     * @returns {Promise<string>} - A promise that resolves to the contract code associated with the contract.
     * 
     * @example
     * const server: SorobanRpc.Server;
     * const contract: string;
     * const code = await contract.code(server);
     * console.log('Contract code:', code);
     */
    async code(server: SorobanRpc.Server): Promise<string> {
        const wasmId = await this.wasmId(server);
        const ledgerKey = xdr.LedgerKey.contractCode(
            new xdr.LedgerKeyContractCode({
                hash: wasmId
            })
        );

        const ledgerEntries = await server.getLedgerEntries(ledgerKey);

        if (ledgerEntries == null || ledgerEntries.entries == null) {
            return "";
        }

        const ledgerEntry = ledgerEntries.entries[0] as SorobanRpc.Api.LedgerEntryResult;
        const ledgerSeq = ledgerEntry.lastModifiedLedgerSeq as number;
        // const codeEntry = xdr.LedgerEntryData.fromXDR(ledgerEntry.xdr, 'base64');
        const codeEntry = ledgerEntry.val;
        const code = codeEntry.contractCode().code().toString('hex');

        return code;
    }

    /**
     * Retrieves the last modified ledger sequence number associated with the contract code from the Soroban RPC server.
     *
     * This method fetches the last modified ledger sequence number associated with the contract code from the Soroban RPC server
     * using the provided server instance.
     *
     * @param {SorobanRpc.Server} server - The Soroban RPC server instance from which to fetch the last modified ledger sequence number.
     * @returns {Promise<number>} - A promise that resolves to the last modified ledger sequence number associated with the contract code.
     * 
     * @example
     * const server: SorobanRpc.Server;
     * const contract: string;
     * const ledgerSeq = await contract.wasmCodeLedgerSeq(server);
     * console.log(`Last modified ledger sequence number: ${ledgerSeq}`);
     */
    async wasmCodeLedgerSeq(server: SorobanRpc.Server): Promise<number> {
        const wasmId = await this.wasmId(server);
        const ledgerKey = xdr.LedgerKey.contractCode(
            new xdr.LedgerKeyContractCode({
                hash: wasmId
            })
        );

        const ledgerEntries = await server.getLedgerEntries(ledgerKey);

        if (ledgerEntries == null || ledgerEntries.entries == null) {
            return 0;
        }

        const ledgerEntry = ledgerEntries.entries[0] as SorobanRpc.Api.LedgerEntryResult;
        return ledgerEntry.lastModifiedLedgerSeq || 0;
    }

    async specs(
        server: SorobanRpc.Server,
    ): Promise<xdr.ScSpecEntry[]> {
        const code = await this.code(server);
        const buffer = Buffer.from(code || "", "hex");

        const executable = new WebAssembly.Module(buffer);
        const contractSpecificationSection = WebAssembly.Module.customSections(executable, 'contractspecv0');

        let totalEntries: xdr.ScSpecEntry[] = [];
        for (const item of contractSpecificationSection) {
            const entries = await decodeContractSpecBuffer(item);

            entries.forEach((entry: xdr.ScSpecEntry) => {
                totalEntries.push(entry);
            });
        }
        return totalEntries;
    }

    async abi(
        server: SorobanRpc.Server,
    ): Promise<any[]> {
        const entries = await this.specs(server);
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

    private convertStorage = (
        storage: ReadonlyArray<xdr.ScMapEntry>
    ): ReadonlyArray<StorageElement> => storage.map(el => ({
        key: scValToNative(el.key()).toString(),
        keyType: el.key().switch().name,
        value: scValToNative(el.val()).toString(),
        valueType: el.val().switch().name,
    }))

    /**
     * @ignore
     * Retrieves a ledger entry result from the server.
     *
     * @param {SorobanRpc.Server} server - The Soroban RPC server instance.
     * @returns {Promise<SorobanRpc.Api.LedgerEntryResult | null>} - A promise that resolves to a ledger entry result,
     * or `null` if no entry is found.
     */
    private async ledgerEntry(
        server: SorobanRpc.Server,
    ): Promise<SorobanRpc.Api.LedgerEntryResult | null> {
        const ledgerEntries = await server.getLedgerEntries(this.ledgerKey);
        if (ledgerEntries == null || ledgerEntries.entries == null || ledgerEntries.entries.length == 0) {
            return null;
        }

        return ledgerEntries.entries[0] as SorobanRpc.Api.LedgerEntryResult;
    }
}

export interface StorageElement {
    key: string
    keyType: string
    value: string
    valueType: string
}
