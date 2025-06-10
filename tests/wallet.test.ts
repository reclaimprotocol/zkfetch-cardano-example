import { afterEach, beforeEach, describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import { main } from "../createWallet.ts";

// Define the path for the temporary file
const WALLET_FILE_PATH = "./tests/addressDetails.json";

describe("Wallet Creation (Deno)", () => {
  beforeEach(async () => {
    try {
      await Deno.remove(WALLET_FILE_PATH);
    } catch (error) {
      if (!(error instanceof Deno.errors.NotFound)) {
        throw error;
      }
    }
  });

  afterEach(async () => {
    try {
      await Deno.remove(WALLET_FILE_PATH);
    } catch (error) {
      if (!(error instanceof Deno.errors.NotFound)) {
        throw error;
      }
    }
  });

  it("should create a wallet file", async () => {
    await main(WALLET_FILE_PATH);
    const fileInfo = await Deno.stat(WALLET_FILE_PATH);
    expect(fileInfo.isFile).toBeTruthy();
    expect(fileInfo.size).toBeGreaterThan(0);
  });

  it("should create a valid ed25519 private key", async () => {
    const prefix = "ed25519";
    await main(WALLET_FILE_PATH); // Run main to generate the wallet
    const stringData = await Deno.readTextFile(WALLET_FILE_PATH);
    const jsonData = JSON.parse(stringData);

    expect(typeof jsonData.privateKey).toEqual("string");
    expect(jsonData.privateKey.startsWith(prefix)).toBeTruthy();
  });

  it("should create a valid test address", async () => {
    const prefix = "addr_test";
    await main(WALLET_FILE_PATH);
    const stringData = await Deno.readTextFile(WALLET_FILE_PATH);
    const jsonData = JSON.parse(stringData);

    expect(typeof jsonData.address).toEqual("string");
    expect(jsonData.address.startsWith(prefix)).toBeTruthy();
  });

  it("should create a wallet with expected JSON structure", async () => {
    await main(WALLET_FILE_PATH);
    const stringData = await Deno.readTextFile(WALLET_FILE_PATH);
    const jsonData = JSON.parse(stringData);

    expect(jsonData).toBeInstanceOf(Object);
    expect(jsonData).toHaveProperty("privateKey");
    expect(jsonData).toHaveProperty("address");
    expect(typeof jsonData.privateKey).toEqual("string");
    expect(typeof jsonData.address).toEqual("string");
  });
});
