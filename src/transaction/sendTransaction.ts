/**
 * Transaction sending functionality for Cardano
 */

import { Blockfrost, Lucid } from "https://deno.land/x/lucid@0.10.11/mod.ts";
import {
  AddressDetails,
  ProofData,
  TransactionMetadata,
} from "../../types/index.ts";
import {
  readJsonFile,
  validateAddressDetails,
  validateProofData,
} from "../utils/fileUtils.ts";
import { loadConfig } from "../../config/index.ts";

/**
 * Send a transaction with proof metadata to Cardano
 * @param addressDetailsPath - Path to the address details JSON file
 * @param proofPath - Path to the proof JSON file
 * @returns Promise<string> - The transaction hash
 */
export async function sendTransaction(
  addressDetailsPath: string = "addressDetails.json",
  proofPath: string = "proof.json",
): Promise<string> {
  try {
    const config = loadConfig();

    // Load address details
    const addressDetailsData = await readJsonFile<AddressDetails>(
      addressDetailsPath,
    );
    if (!validateAddressDetails(addressDetailsData)) {
      throw new Error("Invalid address details format");
    }

    // Load proof data
    const proofData = await readJsonFile<ProofData>(proofPath);
    if (!validateProofData(proofData)) {
      throw new Error("Invalid proof data format");
    }

    // Initialize Lucid
    const lucid = await Lucid.new(
      new Blockfrost(
        config.network.blockfrostUrl,
        config.network.blockfrostApiKey,
      ),
      config.network.network,
    );

    // Select wallet
    lucid.selectWalletFromPrivateKey(addressDetailsData.privateKey);

    // Prepare metadata
    const metadata: TransactionMetadata = {
      proofIdentifier: proofData.identifier.substring(2), // Remove 0x prefix
      price: proofData.extractedParameterValues.price,
    };

    console.log("Building transaction...");
    console.log(`Proof Identifier: ${metadata.proofIdentifier}`);
    console.log(`Price: $${metadata.price}`);

    // Build the transaction
    const tx = await lucid
      .newTx()
      .payToAddress(addressDetailsData.address, { lovelace: 1_000n })
      .attachMetadata(1, metadata.proofIdentifier)
      .attachMetadata(2, metadata.price)
      .complete();

    // Sign and submit the transaction
    console.log("Signing transaction...");
    const signed = await tx.sign().complete();

    console.log("Submitting transaction...");
    const txHash = await signed.submit();

    console.log("Transaction submitted successfully!");
    console.log(`Transaction Hash: ${txHash}`);

    return txHash;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error sending transaction:", errorMessage);
    throw error;
  }
}

/**
 * Main function for CLI usage
 */
export async function main(): Promise<void> {
  try {
    const addressDetailsPath = Deno.args[0] || "addressDetails.json";
    const proofPath = Deno.args[1] || "proof.json";

    await sendTransaction(addressDetailsPath, proofPath);
  } catch (error) {
    console.error("Error in sendTransaction.ts:", error);
    Deno.exit(1);
  }
}

// CLI execution
if (import.meta.main) {
  await main();
}
