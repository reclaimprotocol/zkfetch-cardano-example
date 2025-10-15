/**
 * Configuration management for the zkFetch Cardano example
 */

import { AppConfig } from "../types/index.ts";

/**
 * Default configuration for the application
 */
export const defaultConfig: AppConfig = {
  network: {
    blockfrostUrl: "https://cardano-preprod.blockfrost.io/api/v0",
    blockfrostApiKey: "preprodGccWf5cqtgX4hp0kTJIV4KJQ81xwjLLx",
    network: "Preprod",
  },
  reclaim: {
    appId: "0x381994d6B9B08C3e7CfE3A4Cd544C85101b8f201",
    appSecret: "0xfdc676e00ac9c648dfbcc271263c2dd95233a8abd391458c91ea88526a299223",
  },
  outputPaths: {
    addressDetails: "addressDetails.json",
    proof: "proof.json",
  },
};

/**
 * Load configuration with optional environment variable overrides
 */
export function loadConfig(): AppConfig {
  return {
    network: {
      blockfrostUrl: Deno.env.get("BLOCKFROST_URL") ?? defaultConfig.network.blockfrostUrl,
      blockfrostApiKey: Deno.env.get("BLOCKFROST_API_KEY") ?? defaultConfig.network.blockfrostApiKey,
      network: (Deno.env.get("CARDANO_NETWORK") as "Preprod" | "Mainnet") ?? defaultConfig.network.network,
    },
    reclaim: {
      appId: defaultConfig.reclaim.appId,
      appSecret: defaultConfig.reclaim.appSecret,
    },
    outputPaths: {
      addressDetails: Deno.env.get("ADDRESS_DETAILS_PATH") ?? defaultConfig.outputPaths.addressDetails,
      proof: Deno.env.get("PROOF_PATH") ?? defaultConfig.outputPaths.proof,
    },
  };
}
