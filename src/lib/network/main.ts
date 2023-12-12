import { NetworkDetails } from "./network-details";
export type NetworkType = "mainnet" | "testnet" | "futurenet";

export enum RPC {
    Mainnet = "https://rpc-mainnet.stellar.org/",
    Testnet = "https://soroban-testnet.stellar.org/",
    // Futurenet = "https://rpc-futurenet.stellar.org/",
}

export enum Network {
    mainnet = "MAINNET",
    testnet = "TESTNET",
    // futurenet = "FUTURENET",
}

export const getRPC = (network: NetworkDetails) => {
    switch (network.network) {
        case "MAINNET":
            return RPC.Mainnet;
        case "TESTNET":
            return RPC.Testnet;
        // case "FUTURENET":
        //     return RPC.Futurenet;
        default:
            return RPC.Testnet;
    }
}

/**
 * Get the network details for a given network
 * Note that Soroban is only supported on Testnet right now
 * @param network 
 * @returns 
 */
export const getNetworkDetails = (network: NetworkType): NetworkDetails => {
    switch (network) {
        case "mainnet":
            return MAINNET_DETAILS;
        case "testnet":
            return TESTNET_DETAILS;
        // case "futurenet":
        //     return FUTURENET_DETAILS;
        default:
            return TESTNET_DETAILS;   // TODO: change to MAINNET_DETAILS when Soroban is supported on mainnet
    };
}

export const TESTNET_DETAILS: NetworkDetails = {
    network: Network.testnet,
    networkUrl: "https://soroban-testnet.stellar.org:443",
    networkPassphrase: "Test SDF Network ; September 2015",
};

export const MAINNET_DETAILS: NetworkDetails = {
    network: Network.mainnet,
    networkUrl: "https://horizon-mainnet.stellar.org",
    networkPassphrase: "Public Global Stellar Network ; September 2015",
};

// export const FUTURENET_DETAILS: NetworkDetails = {
//     network: Network.mainnet,
//     networkUrl: "https://rpc-futurenet.stellar.org",
//     networkPassphrase: "Test SDF Future Network ; October 2022",
// };


export const DEFAULT_NETWORK: NetworkDetails = TESTNET_DETAILS;