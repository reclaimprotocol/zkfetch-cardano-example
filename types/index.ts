/**
 * Type definitions for the zkFetch Cardano example project
 */

export interface AddressDetails {
  privateKey: string;
  address: string;
}

export interface ProofData {
  claimData: {
    provider: string;
    parameters: string;
    owner: string;
    timestampS: number;
    context: string;
    identifier: string;
    epoch: number;
  };
  identifier: string;
  signatures: string[];
  extractedParameterValues: {
    price: string;
  };
  witnesses: Array<{
    id: string;
    url: string;
  }>;
}

export interface NetworkConfig {
  blockfrostUrl: string;
  blockfrostApiKey: string;
  network: "Preprod" | "Mainnet";
}

export interface ReclaimConfig {
  appId: string;
  appSecret: string;
}

export interface AppConfig {
  network: NetworkConfig;
  reclaim: ReclaimConfig;
  outputPaths: {
    addressDetails: string;
    proof: string;
  };
}

export interface TransactionMetadata {
  proofIdentifier: string;
  price: string;
}
