import { Blockfrost, Lucid } from "https://deno.land/x/lucid@0.10.11/mod.ts";

async function main() {
  let lucid = await Lucid.new(
    new Blockfrost(
      "https://cardano-preprod.blockfrost.io/api/v0",
      "preprodGccWf5cqtgX4hp0kTJIV4KJQ81xwjLLx",
    ),
    "Preprod",
  );

  const addressDetails = JSON.parse(
    await Deno.readTextFile("addressDetails.json"),
  );
  const proof = JSON.parse(await Deno.readTextFile("proof.json"));

  lucid = lucid.selectWalletFromPrivateKey(addressDetails.privateKey);

  console.log(proof.identifier.substring(2));
  const metadata = {
    1: proof.identifier.substring(2),
    2: proof.extractedParameterValues.price,
  };

  // Build the transaction
  const tx = await lucid
    .newTx()
    .payToAddress(addressDetails.address, { lovelace: 1_000n })
    .attachMetadata(1, metadata[1])
    .attachMetadata(2, metadata[2])
    .complete();

  // Sign and submit the transaction
  const signed = await tx.sign().complete();
  const txHash = await signed.submit();
  console.log("Transaction submitted with hash:", txHash);
}

if (import.meta.main) {
  main().catch((err) => {
    console.error("Error running send_transaction.ts:", err);
    Deno.exit(1);
  });
}
