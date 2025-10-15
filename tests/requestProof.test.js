// requestProof.test.js
import { after, before, describe, test } from "node:test";
import assert from "node:assert";
import fs from "node:fs/promises";
import { main } from "../requestProof.js";

const OUTPUT_FILE_PATH = `./proof.json`;

describe("Reclaim Proof Generation (Node.js)", () => {
  // Use before/after to clean up files
  before(async () => {
    // Remove previous proof file if it exists
    try {
      await fs.unlink(OUTPUT_FILE_PATH);
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  });

  test("should create a proof.json file", async () => {
    // Call the main function directly.
    // It will write to proof.json.
    const path = OUTPUT_FILE_PATH;
    await main(path);

    // Check if the file exists
    const stats = await fs.stat(OUTPUT_FILE_PATH);
    assert.strictEqual(stats.isFile(), true, "proof.json should be a file");
    assert.ok(stats.size > 0, "proof.json should not be empty");
  });

  test("should contain valid JSON with expected properties", async () => {
    const path = OUTPUT_FILE_PATH;
    await main(path);

    const fileContent = await fs.readFile(OUTPUT_FILE_PATH, "utf8");
    const proof = JSON.parse(fileContent);

    assert.ok(
      typeof proof === "object" && proof !== null,
      "Proof should be an object",
    );
    assert.ok("claimData" in proof, "Proof should have a claimData");
    assert.ok("identifier" in proof, "Proof should have a identifier");
    assert.ok("signatures" in proof, "Proof should have signatures");
  });
});
