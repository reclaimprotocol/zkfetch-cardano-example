/**
 * Integration tests for the complete zkFetch Cardano workflow
 */

import { afterEach, beforeEach, describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import { createWallet } from "../src/wallet/createWallet.ts";
import { sendTransaction } from "../src/transaction/sendTransaction.ts";
import { fileExists, readJsonFile } from "../src/utils/fileUtils.ts";
import { AddressDetails } from "../types/index.ts";

// Test file paths
const TEST_WALLET_PATH = "./tests/test-wallet.json";
const TEST_PROOF_PATH = "./tests/test-proof.json";

describe("Integration Tests", () => {
  beforeEach(async () => {
    // Clean up any existing test files
    try {
      await Deno.remove(TEST_WALLET_PATH);
    } catch {
      // File doesn't exist, which is fine
    }
    try {
      await Deno.remove(TEST_PROOF_PATH);
    } catch {
      // File doesn't exist, which is fine
    }
  });

  afterEach(async () => {
    // Clean up test files
    try {
      await Deno.remove(TEST_WALLET_PATH);
    } catch {
      // File doesn't exist, which is fine
    }
    try {
      await Deno.remove(TEST_PROOF_PATH);
    } catch {
      // File doesn't exist, which is fine
    }
  });

  it("should create wallet and generate valid address details", async () => {
    const wallet = await createWallet(TEST_WALLET_PATH);

    // Verify wallet object structure
    expect(wallet).toBeInstanceOf(Object);
    expect(wallet).toHaveProperty("privateKey");
    expect(wallet).toHaveProperty("address");
    expect(typeof wallet.privateKey).toEqual("string");
    expect(typeof wallet.address).toEqual("string");

    // Verify file was created
    expect(await fileExists(TEST_WALLET_PATH)).toBeTruthy();

    // Verify file content matches returned object
    const fileContent = await readJsonFile<AddressDetails>(TEST_WALLET_PATH);
    expect(fileContent.privateKey).toEqual(wallet.privateKey);
    expect(fileContent.address).toEqual(wallet.address);
  });

  it("should validate wallet data structure", async () => {
    const wallet = await createWallet(TEST_WALLET_PATH);

    // Verify private key format
    expect(wallet.privateKey.startsWith("ed25519_sk")).toBeTruthy();
    expect(wallet.privateKey.length).toBeGreaterThan(20);

    // Verify address format
    expect(wallet.address.startsWith("addr_test")).toBeTruthy();
    expect(wallet.address.length).toBeGreaterThan(20);
  });

  it("should handle wallet creation with custom path", async () => {
    const customPath = "./tests/custom-wallet.json";

    try {
      const wallet = await createWallet(customPath);
      expect(await fileExists(customPath)).toBeTruthy();

      const fileContent = await readJsonFile<AddressDetails>(customPath);
      expect(fileContent.address).toEqual(wallet.address);
    } finally {
      // Clean up
      try {
        await Deno.remove(customPath);
      } catch {
        // File doesn't exist, which is fine
      }
    }
  });

  it("should validate wallet data structure", async () => {
    const wallet = await createWallet(TEST_WALLET_PATH);

    // Verify private key format
    expect(wallet.privateKey.startsWith("ed25519_sk")).toBeTruthy();
    expect(wallet.privateKey.length).toBeGreaterThan(20);

    // Verify address format
    expect(wallet.address.startsWith("addr_test")).toBeTruthy();
    expect(wallet.address.length).toBeGreaterThan(20);
  });
});
