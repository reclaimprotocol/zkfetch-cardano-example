import { Lucid, Blockfrost } from "https://deno.land/x/lucid@0.10.11/mod.ts";

import fs from "node:fs";

async function main() {
  const addressDetails = {
    privateKey: "",
    address: "",
  };

  const lucid = await Lucid.new(
    new Blockfrost(
      "https://cardano-preprod.blockfrost.io/api/v0",
      "preprodGccWf5cqtgX4hp0kTJIV4KJQ81xwjLLx"
    ),
    "Preprod"
  );

  // Generate a new private key (bech32-encoded) and select it
  const privateKey = lucid.utils.generatePrivateKey();
  lucid.selectWalletFromPrivateKey(privateKey);

  addressDetails.privateKey = privateKey;

  const address = await lucid.wallet.address();

  addressDetails.address = address;

  fs.writeFileSync("addressDetails.json", JSON.stringify(addressDetails));
}

if (import.meta.main) {
  main().catch((err) => {
    console.error("Error create_wallet.ts", err);
    Deno.exit(1);
  });
}
