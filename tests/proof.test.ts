import * as secp from "@noble/secp256k1";
import { keccak256 } from "npm:ethereum-cryptography/keccak";
import { bytesToHex } from "npm:ethereum-cryptography/utils";
import { Point } from "@noble/secp256k1";
import { ethers } from "npm:ethers";
import {
  assert,
  assertExists,
  assertGreater,
  assertMatch,
  assertStringIncludes,
} from "https://deno.land/std@0.214.0/assert/mod.ts";

async function loadProof() {
  const data = await Deno.readTextFile("./proof.json");
  return JSON.parse(data);
}

Deno.test("Proof should have the correct ETH witness address", async () => {
  const proof = await loadProof();
  const hex = secp.etc.hexToBytes;

  const recoveryId = proof.signatures[0].slice(-2);
  let normalizedRecoveryId;

  if (recoveryId == "1b") {
    normalizedRecoveryId = 0;
  } else if (recoveryId == "1c") {
    normalizedRecoveryId = 1;
  } else {
    throw Error("Invalid Recovery Id");
  }

  // Remove the 0x and recovery id
  const sig = hex(proof.signatures[0].slice(2).slice(0, -2));

  const serilaizedClaim =
    proof.identifier +
    "\n" +
    proof.claimData.owner +
    "\n" +
    proof.claimData.timestampS +
    "\n" +
    proof.claimData.epoch;

  const msgHash = hex(ethers.utils.hashMessage(serilaizedClaim).slice(2));

  const compactSignature = secp.Signature.fromCompact(sig);
  const signature = compactSignature.addRecoveryBit(normalizedRecoveryId);
  const pubKeyCompressed = signature.recoverPublicKey(msgHash);

  const compressedHex = pubKeyCompressed.toHex();
  const compressedBytes = new Uint8Array(
    compressedHex.match(/.{2}/g)!.map((byte) => parseInt(byte, 16))
  );

  // Decompress using noble-secp256k1
  const point = Point.fromHex(compressedBytes); // returns Point with x, y
  const uncompressed = point.toRawBytes(false); // false = uncompressed (65 bytes)

  const pubkey64 = uncompressed.slice(1); // 64 bytes (x + y)

  const hash = keccak256(pubkey64);

  // Take last 20 bytes as Ethereum address
  const ethAddress = "0x" + bytesToHex(hash.slice(-20));

  assert(ethAddress == proof.witnesses[0].id);
});

Deno.test("Proof should have required fields", async () => {
  const proof = await loadProof();

  assertExists(proof.claimData, "Proof should have a claimData field");
  assertExists(proof.signatures, "Proof should have a signatures field");
  assert(proof.signatures.length > 0, "Proof should have signatures");
  assertExists(
    proof.extractedParameterValues,
    "Missing extractedParameterValues"
  );
  assertExists(proof.extractedParameterValues.price, "Missing price field");
});

Deno.test("Price should be a valid positive number", async () => {
  const proof = await loadProof();

  const price = parseFloat(proof.extractedParameterValues.price);
  assert(!isNaN(price), "Price should be a number");
  assertGreater(price, 0, "Price should be greater than zero");
});

Deno.test("Epoch should be a positive integer", async () => {
  const proof = await loadProof();

  const epoch = proof.claimData.epoch;
  assert(
    typeof epoch === "number" && Number.isInteger(epoch),
    "Epoch should be an integer"
  );
  assertGreater(epoch, 0, "Epoch should be greater than zero");
});

Deno.test(
  "Timestamp should be a valid past or near-future UNIX timestamp",
  async () => {
    const proof = await loadProof();

    const timestamp = proof.claimData.timestampS;
    assert(typeof timestamp === "number", "Timestamp should be a number");

    const now = Math.floor(Date.now() / 1000);
    assert(timestamp > 0, "Timestamp should be positive");
    assert(timestamp <= now + 300, "Timestamp should not be far in the future");
  }
);

Deno.test("Provider should be 'http' or 'https'", async () => {
  const proof = await loadProof();

  const provider = proof.claimData.provider;
  assert(typeof provider === "string", "Provider must be a string");
  assert(
    ["http", "https"].includes(provider),
    "Provider must be 'http' or 'https'"
  );
});

Deno.test("Witnesses should be non-empty and valid", async () => {
  const proof = await loadProof();

  const witnesses = proof.witnesses;
  assert(Array.isArray(witnesses), "Witnesses should be an array");
  assert(witnesses.length > 0, "Witnesses should not be empty");

  for (const witness of witnesses) {
    assertExists(witness.id, "Each witness must have an id");
    assertMatch(
      witness.id,
      /^0x[a-fA-F0-9]{40}$/,
      "Witness id should be a valid Ethereum address"
    );
    assertExists(witness.url, "Each witness must have a url");
    assertStringIncludes(
      witness.url,
      "wss://",
      "Witness URL should start with wss://"
    );
  }
});

Deno.test("Parameters should be valid JSON with expected fields", async () => {
  const proof = await loadProof();

  const parametersRaw = proof.claimData.parameters;
  let parameters;
  try {
    parameters = JSON.parse(parametersRaw);
  } catch {
    throw new Error("claimData.parameters is not valid JSON");
  }

  assertExists(parameters.method, "parameters should have method");
  assertExists(parameters.url, "parameters should have url");
  assertExists(
    parameters.responseMatches,
    "parameters should have responseMatches"
  );
  assert(
    Array.isArray(parameters.responseMatches),
    "responseMatches should be an array"
  );
});
