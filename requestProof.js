import { ReclaimClient } from "@reclaimprotocol/zk-fetch";
import fs from "fs";
import process from "node:process";

export async function main(path = "proof.json") {
  try {
    const APP_ID = "0x381994d6B9B08C3e7CfE3A4Cd544C85101b8f201";
    const APP_SECRET =
      "0xfdc676e00ac9c648dfbcc271263c2dd95233a8abd391458c91ea88526a299223";

    const reclaimClient = new ReclaimClient(
      APP_ID,
      APP_SECRET,
    );

    // Example URL to fetch the data from
    const url =
      "https://api.coingecko.com/api/v3/simple/price?ids=cardano&vs_currencies=usd";

    // Generate the proof
    const proof = await reclaimClient.zkFetch(
      url,
      { method: "GET" },
      {
        responseMatches: [
          {
            type: "regex",
            value: '\\{"cardano":\\{"usd":(?<price>[\\d\\.]+)\\}\\}',
          },
        ],
      },
    );

    fs.writeFileSync(path, JSON.stringify(proof));
    process.exit(0);
  } catch (e) {
    console.error("Error requesting proof:", e.message);
    process.exit(1);
  }
}

// Only run main() if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
