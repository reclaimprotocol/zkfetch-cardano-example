# API Documentation

## Overview

This document provides comprehensive API documentation for the zkFetch Cardano example project.

## Core Modules

### Wallet Module (`src/wallet/createWallet.ts`)

#### `createWallet(outputPath?: string): Promise<AddressDetails>`

Creates a new Cardano wallet and saves the address details to a JSON file.

**Parameters:**
- `outputPath` (optional): Path to save the address details JSON file. Defaults to "addressDetails.json".

**Returns:**
- `Promise<AddressDetails>`: The created wallet details containing private key and address.

**Throws:**
- `Error`: If wallet creation fails or validation errors occur.

**Example:**
```typescript
import { createWallet } from "./src/wallet/createWallet.ts";

const wallet = await createWallet("my-wallet.json");
console.log(`Address: ${wallet.address}`);
```

### Proof Module (`requestProof.js`)

#### `main(path?: string): Promise<void>`

Requests a proof containing ADA price data from Reclaim Protocol using Node.js.

**Parameters:**
- `path` (optional): Path to save the proof JSON file. Defaults to "proof.json".

**Usage:**
```bash
# Using npm script
npm run request-proof

# Direct execution
node requestProof.js

# With custom path
node requestProof.js custom-proof.json
```

**Example:**
```javascript
import { main } from "./requestProof.js";

await main("ada-price-proof.json");
```

### Transaction Module (`src/transaction/sendTransaction.ts`)

#### `sendTransaction(addressDetailsPath?: string, proofPath?: string): Promise<string>`

Sends a Cardano transaction with proof metadata.

**Parameters:**
- `addressDetailsPath` (optional): Path to the address details JSON file. Defaults to "addressDetails.json".
- `proofPath` (optional): Path to the proof JSON file. Defaults to "proof.json".

**Returns:**
- `Promise<string>`: The transaction hash.

**Throws:**
- `Error`: If transaction sending fails or validation errors occur.

**Example:**
```typescript
import { sendTransaction } from "./src/transaction/sendTransaction.ts";

const txHash = await sendTransaction("wallet.json", "proof.json");
console.log(`Transaction Hash: ${txHash}`);
```

## Utility Functions

### File Utilities (`src/utils/fileUtils.ts`)

#### `readJsonFile<T>(filePath: string): Promise<T>`

Safely reads and parses a JSON file.

**Parameters:**
- `filePath`: Path to the JSON file to read.

**Returns:**
- `Promise<T>`: Parsed JSON data.

**Throws:**
- `Error`: If file reading or parsing fails.

#### `writeJsonFile<T>(filePath: string, data: T): Promise<void>`

Safely writes data to a JSON file.

**Parameters:**
- `filePath`: Path to write the JSON file.
- `data`: Data to serialize and write.

**Throws:**
- `Error`: If file writing fails.

#### `fileExists(filePath: string): Promise<boolean>`

Checks if a file exists.

**Parameters:**
- `filePath`: Path to check.

**Returns:**
- `Promise<boolean>`: True if file exists, false otherwise.

#### `validateAddressDetails(data: unknown): data is AddressDetails`

Validates that data conforms to the AddressDetails interface.

**Parameters:**
- `data`: Data to validate.

**Returns:**
- `boolean`: True if data is valid AddressDetails.

#### `validateProofData(data: unknown): data is ProofData`

Validates that data conforms to the ProofData interface.

**Parameters:**
- `data`: Data to validate.

**Returns:**
- `boolean`: True if data is valid ProofData.

### Validation Utilities (`src/utils/validation.ts`)

#### `isValidCardanoTestAddress(address: string): boolean`

Validates that a string is a valid Cardano test address.

**Parameters:**
- `address`: Address string to validate.

**Returns:**
- `boolean`: True if address is valid.

#### `isValidEd25519PrivateKey(privateKey: string): boolean`

Validates that a string is a valid ed25519 private key.

**Parameters:**
- `privateKey`: Private key string to validate.

**Returns:**
- `boolean`: True if private key is valid.

#### `isValidEthereumAddress(address: string): boolean`

Validates that a string is a valid Ethereum address.

**Parameters:**
- `address`: Address string to validate.

**Returns:**
- `boolean`: True if address is valid.

#### `isValidTimestamp(timestamp: number): boolean`

Validates that a number is a valid UNIX timestamp.

**Parameters:**
- `timestamp`: Timestamp to validate.

**Returns:**
- `boolean`: True if timestamp is valid.

#### `isValidPositiveNumber(value: string): boolean`

Validates that a string represents a valid positive number.

**Parameters:**
- `value`: String value to validate.

**Returns:**
- `boolean`: True if value is a valid positive number.

#### `isValidUrl(url: string): boolean`

Validates that a string is a valid URL.

**Parameters:**
- `url`: URL string to validate.

**Returns:**
- `boolean`: True if URL is valid.

## Configuration

### Configuration Module (`config/index.ts`)

#### `loadConfig(): AppConfig`

Loads application configuration with optional environment variable overrides.

**Returns:**
- `AppConfig`: Complete application configuration.

**Environment Variables:**
- `BLOCKFROST_URL`: Override Blockfrost API URL
- `BLOCKFROST_API_KEY`: Override Blockfrost API key
- `CARDANO_NETWORK`: Override Cardano network (Preprod/Mainnet)
- `ADDRESS_DETAILS_PATH`: Override address details file path
- `PROOF_PATH`: Override proof file path

## Type Definitions

### Core Types (`types/index.ts`)

#### `AddressDetails`

```typescript
interface AddressDetails {
  privateKey: string;
  address: string;
}
```

#### `ProofData`

```typescript
interface ProofData {
  claimData: {
    provider: string;
    parameters: string;
    owner: string;
    timestampS: number;
    context: string;
    identifier: string;
    epoch: number;
  };
  identifier: string;
  signatures: string[];
  extractedParameterValues: {
    price: string;
  };
  witnesses: Array<{
    id: string;
    url: string;
  }>;
}
```

#### `NetworkConfig`

```typescript
interface NetworkConfig {
  blockfrostUrl: string;
  blockfrostApiKey: string;
  network: "Preprod" | "Mainnet";
}
```

#### `ReclaimConfig`

```typescript
interface ReclaimConfig {
  appId: string;
  appSecret: string;
}
```

#### `AppConfig`

```typescript
interface AppConfig {
  network: NetworkConfig;
  reclaim: ReclaimConfig;
  outputPaths: {
    addressDetails: string;
    proof: string;
  };
}
```

#### `TransactionMetadata`

```typescript
interface TransactionMetadata {
  proofIdentifier: string;
  price: string;
}
```

## Error Handling

All functions include comprehensive error handling with descriptive error messages. Common error scenarios include:

- **File I/O Errors**: When reading/writing files fails
- **Network Errors**: When API calls fail
- **Validation Errors**: When data doesn't meet expected format
- **Configuration Errors**: When required configuration is missing

## Examples

### Complete Workflow

```typescript
import { createWallet } from "./src/wallet/createWallet.ts";
import { sendTransaction } from "./src/transaction/sendTransaction.ts";

async function runWorkflow() {
  try {
    // Create wallet
    const wallet = await createWallet();
    console.log(`Created wallet: ${wallet.address}`);

    // Request proof (using Node.js)
    console.log("Please run: npm run request-proof");

    // Send transaction
    const txHash = await sendTransaction();
    console.log(`Transaction: ${txHash}`);
  } catch (error) {
    console.error("Workflow failed:", error.message);
  }
}
```

### Custom Configuration

```typescript
import { loadConfig } from "./config/index.ts";

// Override configuration via environment variables
Deno.env.set("BLOCKFROST_API_KEY", "your-custom-key");
Deno.env.set("CARDANO_NETWORK", "Mainnet");

const config = loadConfig();
console.log(`Using network: ${config.network.network}`);
```
