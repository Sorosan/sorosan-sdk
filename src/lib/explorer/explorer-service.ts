export namespace ExplorerService {
    export const EXPLORER_BASE_URL = "https://api.stellarchain.io/v1";

    export const getContract = async (contractId: string): Promise<ContractResponse> => {
        const response = await fetch(`${EXPLORER_BASE_URL}/contracts/${contractId}`);
        if (!response.ok) return {} as ContractResponse;

        return await response.json() as ContractResponse;
    }
}

export interface ContractResponse {
    id: number;
    asset_code: string | null;
    asset_issuer: string | null;
    asset_address: string | null;
    contract_id: string;
    contract_code: string;
    created_at: string;
    transactions_count: number;
    wasmParsed: string,
    create_transaction: {
        id: number;
        contract_id: number;
        source_account: string;
        host_functions: string;
        hash: string;
    }
    transactions: any[];
}