/**
 * Wallet creation functionality for Cardano
 */

import { Blockfrost, Lucid } from "https://deno.land/x/lucid@0.10.11/mod.ts";
import { AddressDetails } from "../../types/index.ts";
import { validateAddressDetails, writeJsonFile } from "../utils/fileUtils.ts";
import {
  isValidCardanoTestAddress,
  isValidEd25519PrivateKey,
} from "../utils/validation.ts";
import { loadConfig } from "../../config/index.ts";

/**
 * Create a new Cardano wallet and save address details
 * @param outputPath - Path to save the address details JSON file
 * @returns Promise<AddressDetails> - The created wallet details
 */
export async function createWallet(
  outputPath: string = "addressDetails.json",
): Promise<AddressDetails> {
  try {
    const config = loadConfig();

    const lucid = await Lucid.new(
      new Blockfrost(
        config.network.blockfrostUrl,
        config.network.blockfrostApiKey,
      ),
      config.network.network,
    );

    // Generate a new private key (bech32-encoded) and select it
    const privateKey = lucid.utils.generatePrivateKey();
    lucid.selectWalletFromPrivateKey(privateKey);

    const address = await lucid.wallet.address();

    // Validate the generated data
    if (!isValidEd25519PrivateKey(privateKey)) {
      throw new Error("Generated private key is not valid");
    }

    if (!isValidCardanoTestAddress(address)) {
      throw new Error("Generated address is not a valid Cardano test address");
    }

    const addressDetails: AddressDetails = {
      privateKey,
      address,
    };

    // Save to file
    await writeJsonFile(outputPath, addressDetails);

    console.log(`Wallet created successfully!`);
    console.log(`Address: ${address}`);
    console.log(`Details saved to: ${outputPath}`);

    return addressDetails;
  } catch (error) {
    console.error("Error creating wallet:", error.message);
    throw error;
  }
}

/**
 * Main function for CLI usage
 */
export async function main(
  outputPath: string = "addressDetails.json",
): Promise<void> {
  try {
    await createWallet(outputPath);
  } catch (error) {
    console.error("Error in createWallet.ts:", error);
    Deno.exit(1);
  }
}

// CLI execution
if (import.meta.main) {
  const outputPath = Deno.args[0] || "addressDetails.json";
  await main(outputPath);
}
