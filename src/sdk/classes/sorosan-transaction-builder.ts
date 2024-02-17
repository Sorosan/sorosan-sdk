import {
    Account,
    Address,
    Asset,
    Contract,
    Memo,
    MemoType,
    Operation,
    SorobanRpc,
    TimeoutInfinite,
    Transaction,
    TransactionBuilder,
    xdr,
} from "stellar-sdk";

import { Salt } from "../../lib/soroban/util";
import ba from '../../lib/soroban/binascii';
import { Buffer } from 'buffer';

export class SorosanTransactionBuilder extends TransactionBuilder {
    sourceAccount: Account;
    constructor(
        sourceAccount: Account,
        options?: TransactionBuilder.TransactionBuilderOptions
    ) {
        super(sourceAccount, options); // Call the parent class constructor
        this.sourceAccount = sourceAccount;
    }

    uploadContractWasmOp(value: Buffer): this {
        let hf: xdr.HostFunction = xdr.HostFunction.hostFunctionTypeUploadContractWasm(value);
        let op: any = Operation.invokeHostFunction({
            func: hf,
            auth: [],
        });

        return this.addOperation(op);
    }

    createContractOp(
        wasmId: string,
        address: Account,
        salt: Buffer = Salt(32),
        auth: xdr.SorobanAuthorizationEntry[] = [],
    ): this {
        wasmId = ba.unhexlify(wasmId);
        const wasmIdBuffer = Buffer.from(wasmId, "ascii");

        const buff = Buffer.from(salt);
        const addr = new Address(address.accountId());

        const createContract = new xdr.CreateContractArgs({
            contractIdPreimage: xdr.ContractIdPreimage
                .contractIdPreimageFromAddress(new xdr.ContractIdPreimageFromAddress({
                    address: addr.toScAddress(),
                    salt: buff,
                })),
            executable: xdr.ContractExecutable.contractExecutableWasm(wasmIdBuffer),
        });

        let hf: xdr.HostFunction = xdr.HostFunction
            .hostFunctionTypeCreateContract(createContract);
        let op: any = Operation.invokeHostFunction({
            func: hf,
            auth: auth,
        });

        return this.addOperation(op);
    }

    /**
     * Ideally, contractAddress can be calculated from the asset
     * @param asset 
     * @param contractAddress 
     * @returns 
     */
    createContractFromAssetOp(
        asset: Asset,
        contractAddress: string,

        // source: MuxedAccount = null,
    ): this {
        const addr = new Address(contractAddress);

        const ledgerKey = new xdr.LedgerKeyContractData({
            contract: addr.toScAddress(),
            key: xdr.ScVal.scvLedgerKeyContractInstance(),
            durability: xdr.ContractDataDurability.persistent(),
            // bodyType: xdr.ContractEntryBodyType.dataEntry()
        });

        xdr.LedgerKey.contractData(ledgerKey);
        const contractArgs = new xdr.CreateContractArgs({
            contractIdPreimage: xdr.ContractIdPreimage
                .contractIdPreimageFromAsset(asset.toXDRObject()),
            executable: xdr.ContractExecutable.contractExecutableStellarAsset(),
        });

        const hf = xdr.HostFunction.hostFunctionTypeCreateContract(contractArgs);
        let op: any = Operation.invokeHostFunction({
            func: hf,
            auth: [],
        });

        return this.addOperation(op)
    }

    invokeContractFunctionOp(
        contractAddress: string,
        method: string,
        args: xdr.ScVal[] = [],
        auth: xdr.SorobanAuthorizationEntry[] = [],
    ): this {
        const contract = new Contract(contractAddress);
        return this.addOperation(contract.call(method, ...args))
    }

    changeTrustOp(asset: Asset, limit: string): this {
        return this.addOperation(Operation.changeTrust({
            asset: asset,
            limit: limit,
        }))
    }

    assetPaymentOp(
        destination: string,
        asset: Asset,
        amount: string,
    ): this {
        return this.addOperation(Operation.payment({
            destination,
            asset,
            amount,
        }));
    }

    inflateOp(source: string): this {
        return this.addOperation(Operation.inflation({
            source: source,
        }));
    }

    restoreFootprintOp(): this {
        return this.addOperation(Operation.restoreFootprint({}))
    }

    extendFootprintTtlOp(extendTo: number = 0, source: string): this {
        return this.addOperation(Operation.extendFootprintTtl({
            extendTo,
            source,
        }))
    }

    bumpSequenceOp(bumpTo: string, source: string): this {
        const op = Operation.bumpSequence({
            bumpTo,
            source
        });

        return this.addOperation(op);
    }

    async buildAndPrepare(server: SorobanRpc.Server): Promise<Transaction<Memo<MemoType>, Operation[]>> {
        let tx: Transaction = this
            .setTimeout(TimeoutInfinite)
            .build();

        return await server.prepareTransaction(tx);
    }

    async buildAndPrepareAsTransaction(server: SorobanRpc.Server): Promise<Transaction> {
        let tx: Transaction = this
            .setTimeout(TimeoutInfinite)
            .build();

        return await server.prepareTransaction(tx) as Transaction;
    }
}
