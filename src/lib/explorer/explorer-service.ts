import { ExplorerContractResponse } from "./explorer-contract-reponse";

export const EXPLORER_BASE_URL = "https://api.stellarchain.io/v1";

export class ExplorerService {

    static async getContract(
        contractId: string,
    ) {
        const response = await fetch(`${EXPLORER_BASE_URL}/contracts/${contractId}`);

        let data: ExplorerContractResponse = {} as ExplorerContractResponse;
        if (!response.ok) return {} as ExplorerContractResponse;

        data = await response.json();
        return data;
    }
}