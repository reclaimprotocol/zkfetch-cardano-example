/**
 * Utility functions for file operations
 */

import { AddressDetails, ProofData } from "../../types/index.ts";

/**
 * Safely read and parse a JSON file
 */
export async function readJsonFile<T>(filePath: string): Promise<T> {
  try {
    const content = await Deno.readTextFile(filePath);
    return JSON.parse(content) as T;
  } catch (error) {
    throw new Error(`Failed to read JSON file ${filePath}: ${error.message}`);
  }
}

/**
 * Safely write a JSON file
 */
export async function writeJsonFile<T>(
  filePath: string,
  data: T,
): Promise<void> {
  try {
    const content = JSON.stringify(data, null, 2);
    await Deno.writeTextFile(filePath, content);
  } catch (error) {
    throw new Error(`Failed to write JSON file ${filePath}: ${error.message}`);
  }
}

/**
 * Check if a file exists
 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await Deno.stat(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate address details structure
 */
export function validateAddressDetails(data: unknown): data is AddressDetails {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const addressDetails = data as Record<string, unknown>;

  return (
    typeof addressDetails.privateKey === "string" &&
    typeof addressDetails.address === "string" &&
    addressDetails.privateKey.length > 0 &&
    addressDetails.address.length > 0
  );
}

/**
 * Validate proof data structure
 */
export function validateProofData(data: unknown): data is ProofData {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const proof = data as Record<string, unknown>;

  return (
    typeof proof.claimData === "object" &&
    proof.claimData !== null &&
    typeof proof.identifier === "string" &&
    Array.isArray(proof.signatures) &&
    typeof proof.extractedParameterValues === "object" &&
    proof.extractedParameterValues !== null
  );
}
