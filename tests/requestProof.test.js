// requestProof.test.js
import { after, before, describe, test } from "node:test";
import assert from "node:assert";
import fs from "node:fs/promises";
import { main } from "../requestProof.js";

const TEST_OUTPUT_FILE_PATH = `./test-proof.json`;

describe("Reclaim Proof Generation (Node.js)", () => {
  // Use before/after to clean up files
  before(async () => {
    // Remove test proof file if it exists
    try {
      await fs.unlink(TEST_OUTPUT_FILE_PATH);
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  });

  after(async () => {
    // Clean up test proof file
    try {
      await fs.unlink(TEST_OUTPUT_FILE_PATH);
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  });

  test("should create a proof.json file and contain valid JSON with expected properties", async () => {
    // Call the main function with a test file path to avoid modifying the original
    await main(TEST_OUTPUT_FILE_PATH);

    // Check if the file exists
    const stats = await fs.stat(TEST_OUTPUT_FILE_PATH);
    assert.strictEqual(stats.isFile(), true, "test-proof.json should be a file");
    assert.ok(stats.size > 0, "test-proof.json should not be empty");

    // Check the content
    const fileContent = await fs.readFile(TEST_OUTPUT_FILE_PATH, "utf8");
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