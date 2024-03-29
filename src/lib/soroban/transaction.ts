import { signTransaction } from "@stellar/freighter-api";
import {
    Memo,
    MemoType,
    Operation,
    SorobanRpc,
    Transaction,
    TransactionBuilder,
    scValToNative,
    xdr,
} from "stellar-sdk";
import { NetworkDetails } from "../network";

/**
 * Sign a transaction using a wallet instead of a private key.
 *
 * This function signs a transaction represented as XDR (binary) format using a wallet
 * and a public key on a specified network.
 *
 * @param {string} transactionXDR - The XDR representation of the transaction to be signed.
 * @param {string} publicKey - The public key associated with the wallet used for signing.
 * @param {NetworkDetails} network - The network details specifying the blockchain network to sign the transaction for.
 *
 * @returns {Promise<{ status: string, tx: string }>} A promise that resolves to an object containing the status and the signed transaction XDR.
 */
export const signTransactionWithWallet = async (
    transactionXDR: string,
    publicKey: string,
    network: NetworkDetails,
): Promise<{ status: string, tx: string }> => {
    // console.log("signTransactionWithWallet", transactionXDR, network, publicKey);

    try {
        const tx = await signTransaction(transactionXDR, {
            network: network.network,
            networkPassphrase: network.networkPassphrase,
            accountToSign: publicKey
        });
        return { status: "", tx };
    } catch (e: any) {
        console.error("Signing with Wallet error", e);
        return { status: e, tx: "" };
    }
}

/**
 * Use this method to simulate the execution of a transaction, typically used for calling view-like functions.
 *
 * @template T - The expected type of the simulation result.
 *
 * @param {Transaction<Memo<MemoType>, Operation[]>} tx - The transaction to be simulated.
 * @param {Server} server - The server instance used to perform the simulation.
 *
 * @throws {Error} If there is an error during the simulation or no return value is obtained.
 *
 * @returns {Promise<T>} A promise that resolves to the result of the transaction simulation.
 */
export const simulateTx = async <T>(
    tx: Transaction<Memo<MemoType>, Operation[]>,
    server: SorobanRpc.Server,
): Promise<T> => {
    try {
        // Simulate the transaction using the provided server.
        let response = await server.simulateTransaction(tx);

        // Check if the simulation result indicates an error and throw an error if needed.
        if (SorobanRpc.Api.isSimulationError(response)) {
            response = response as SorobanRpc.Api.SimulateTransactionErrorResponse;
            throw new Error(`Simulation Error: ${response.error}`);
        }

        // Check if the simulation result is a success or restore operation.
        // SorobanRpc.isSimulationSuccess(response) || SorobanRpc.isSimulationRestore(response);
        response = response as SorobanRpc.Api.SimulateTransactionSuccessResponse;

        // Extract the result from the simulation response.
        const scVal = response.result?.retval;

        // Throw an error if no return value is obtained.
        if (!scVal) {
            throw new Error("No return value");
        }

        // Convert the simulation result to the expected native type.
        return scValToNative(scVal);
    } catch (e: any) {
        throw new Error(`Simulation Error: ${e.message}`);
    }
};

/**
 * Submits a transaction to the blockchain network and waits for its confirmation.
 *
 * This function submits a transaction represented as XDR (binary) format to the blockchain network
 * and waits for it to be confirmed. It returns the final transaction result.
 *
 * @param {string} txXDR - The XDR representation of the transaction to be submitted.
 * @param {Server} server - The server instance used to interact with the blockchain network.
 * @param {NetworkDetails} network - The network details specifying the blockchain network to submit the transaction to.
 *
 * @throws {Error} If there is an error during transaction submission or confirmation.
 *
 * @returns {Promise<SorobanRpc.GetTransactionResponse>} A promise that resolves to the final transaction result after confirmation.
 */
export const submitTx = async (
    txXDR: string,
    server: SorobanRpc.Server,
    network: NetworkDetails,
): Promise<SorobanRpc.Api.GetTransactionResponse> => {
    try {
        // Deserialize the XDR transaction and set the network passphrase.
        const tx = TransactionBuilder.fromXDR(
            txXDR,
            network.networkPassphrase
        );

        // Send the transaction to the blockchain network.
        let str = await server.sendTransaction(tx);

        // Check if there is an error in the transaction submission.
        if (str.errorResult) {
            console.error(str.errorResult.result());
            throw new Error("Error submitting transaction");
        }

        // Wait for the transaction to be confirmed.
        let gtr = await server.getTransaction(str.hash);
        while (true) {
            console.log("Waiting for transaction to be confirmed");
            gtr = await server.getTransaction(str.hash);

            // Exit the loop when the transaction is no longer in the NOT_FOUND status.
            if (gtr.status != SorobanRpc.Api.GetTransactionStatus.NOT_FOUND) {
                break;
            }

            // Wait for 1 second before checking again.
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        // Return the final transaction result after confirmation.
        return gtr;
    } catch (e: any) {
        // Handle and rethrow any exceptions that occur during submission or confirmation.
        throw new Error(`Transaction Submission Error: ${e.message}`);
    }
};


export class TransactionResponse {
    static contractId = (gtr: SorobanRpc.Api.GetTransactionResponse): string => {
        if (gtr.status == SorobanRpc.Api.GetTransactionStatus.SUCCESS && gtr.resultMetaXdr) {
            return gtr.returnValue?.address()?.contractId().toString("hex") || "";
        }

        return "";
    }

    static wasmId = (gtr: SorobanRpc.Api.GetTransactionResponse): string => {
        if (gtr.status == SorobanRpc.Api.GetTransactionStatus.SUCCESS && gtr.resultMetaXdr) {
            return gtr.returnValue?.bytes()?.toString("hex") || "";
        }

        return ""
    }

    static scVal = (gtr: SorobanRpc.Api.GetTransactionResponse): xdr.ScVal => {
        if (gtr.status == SorobanRpc.Api.GetTransactionStatus.SUCCESS && gtr.resultMetaXdr) {
            return gtr.returnValue || xdr.ScVal.scvVoid();
        }

        return xdr.ScVal.scvVoid();
    }
}


export const isSorobanTransaction = (tx: Transaction): boolean => {
    if (tx.operations.length !== 1) {
        return false;
    }

    switch (tx.operations[0]?.type) {
        case 'invokeHostFunction':
        case 'extendFootprintTtl':
        case 'restoreFootprint':
            return true;
        default:
            return false;
    }
}