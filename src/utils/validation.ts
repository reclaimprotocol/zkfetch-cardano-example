/**
 * Validation utilities for the zkFetch Cardano example
 */

/**
 * Validate that a string is a valid Cardano test address
 */
export function isValidCardanoTestAddress(address: string): boolean {
  return /^addr_test1[a-z0-9]+$/.test(address);
}

/**
 * Validate that a string is a valid ed25519 private key
 */
export function isValidEd25519PrivateKey(privateKey: string): boolean {
  return /^ed25519_sk[a-z0-9]+$/.test(privateKey);
}

/**
 * Validate that a string is a valid Ethereum address
 */
export function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate that a number is a valid UNIX timestamp
 */
export function isValidTimestamp(timestamp: number): boolean {
  const now = Math.floor(Date.now() / 1000);
  return timestamp > 0 && timestamp <= now + 300; // Allow 5 minutes in the future
}

/**
 * Validate that a string is a valid positive number
 */
export function isValidPositiveNumber(value: string): boolean {
  const num = parseFloat(value);
  return !isNaN(num) && num > 0;
}

/**
 * Validate that a string is a valid URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
