/**
 * Main entry point for the zkFetch Cardano example
 */

import { createWallet } from "./wallet/createWallet.ts";
import { sendTransaction } from "./transaction/sendTransaction.ts";
import { loadConfig } from "../config/index.ts";

/**
 * Complete workflow: create wallet, request proof, and send transaction
 */
export async function runCompleteWorkflow(): Promise<void> {
  try {
    const config = loadConfig();

    console.log("Starting zkFetch Cardano example workflow...\n");

    // Step 1: Create wallet
    console.log("1. Creating wallet...");
    await createWallet(config.outputPaths.addressDetails);
    console.log("Wallet created successfully\n");

    // Step 2: Request proof (using Node.js)
    console.log("2. Requesting proof...");
    console.log("Please run: npm run request-proof");
    console.log("Then continue with step 3\n");

    // Step 3: Send transaction
    console.log("3. Sending transaction...");
    const txHash = await sendTransaction(
      config.outputPaths.addressDetails,
      config.outputPaths.proof,
    );
    console.log("Transaction sent successfully\n");

    console.log("Workflow completed successfully!");
    console.log(`Transaction Hash: ${txHash}`);
  } catch (error) {
    console.error("Workflow failed:", error.message);
    throw error;
  }
}

/**
 * Main function for CLI usage
 */
async function main(): Promise<void> {
  const command = Deno.args[0];

  switch (command) {
    case "wallet":
      await createWallet();
      break;
    case "proof":
      console.log("Please use: npm run request-proof");
      console.log("Proof requesting uses Node.js, not Deno");
      break;
    case "transaction":
      await sendTransaction();
      break;
    case "workflow":
    case undefined:
      await runCompleteWorkflow();
      break;
    default:
      console.log(
        "Usage: deno run --allow-net --allow-write --allow-read --allow-env src/index.ts [command]",
      );
      console.log("Commands:");
      console.log("  wallet     - Create a new wallet");
      console.log("  proof      - Request a proof");
      console.log("  transaction - Send a transaction");
      console.log("  workflow   - Run complete workflow (default)");
      Deno.exit(1);
  }
}

// CLI execution
if (import.meta.main) {
  await main();
}
