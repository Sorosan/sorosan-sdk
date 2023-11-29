export interface ExplorerContractResponse {
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