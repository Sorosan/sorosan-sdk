---
id: "ContractSDK"
title: "Class: ContractSDK"
sidebar_label: "ContractSDK"
sidebar_position: 0
custom_edit_url: null
---

## Hierarchy

- `Soroban`

  ↳ **`ContractSDK`**

## Constructors

### constructor

• **new ContractSDK**(`selectedNetwork`, `activePublicKey?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `selectedNetwork` | `NetworkDetails` |
| `activePublicKey?` | `string` |

#### Overrides

Soroban.constructor

#### Defined in

[contract-sdk.ts:19](https://github.com/Sorosan/sorosan-sdk/blob/40fe736/src/sdk/contract-sdk.ts#L19)

## Accessors

### setPublicKey

• `Protected` `set` **setPublicKey**(`publicKey`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `publicKey` | `string` |

#### Returns

`void`

#### Inherited from

Soroban.setPublicKey

#### Defined in

[soroban.ts:100](https://github.com/Sorosan/sorosan-sdk/blob/40fe736/src/sdk/soroban.ts#L100)

## Methods

### calculateEstimateGas

▸ `Protected` **calculateEstimateGas**(`contractAddress`, `method`, `args`): `Promise`<`string`\>

Helper function to estimate the gas cost of a contract call. This estimation is done by creating a
transaction builder and simulating the transaction using the Soroban network. The gas cost is
calculated as the sum of the base fee and the fee obtained from the simulated transaction.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `contractAddress` | `string` | The contract address to estimate gas for. |
| `method` | `string` | The name of the method to be called on the contract. |
| `args` | `ScVal`[] | An array of ScVal arguments to pass to the method. |

#### Returns

`Promise`<`string`\>

A promise that resolves to a string representation of the estimated gas
cost for the contract call.

**`Example`**

```ts
const gasEstimation = await sdk.estimateGas(
   "CCV3ODCHRVCUQTWJZ7F7SLKHGT3JLYWUVHAWMKIYQVSCKMGSOCOJ3AUO",
   "init",
   [xdr.scVal.scvString("Hello World"), new Address("GB...").toScAddress(), ...]
);

const gasCostInStroops: number = parseInt(gasEstimation);   // Convert to a number if needed.
```

#### Inherited from

Soroban.calculateEstimateGas

#### Defined in

[soroban.ts:81](https://github.com/Sorosan/sorosan-sdk/blob/40fe736/src/sdk/soroban.ts#L81)

___

### deploy

▸ **deploy**(`wasmId`, `publicKey`): `Promise`<`string`\>

Deploys a smart contract with a specified Wasm ID to the blockchain.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `wasmId` | `string` | The unique identifier (Wasm ID) of the contract's WebAssembly code. |
| `publicKey` | `string` | The public key of the contract deployer. |

#### Returns

`Promise`<`string`\>

- The unique identifier (Contract ID) of the deployed contract.

**`Throws`**

If the deployment process encounters an error.

**`Example`**

```ts
// Deploy a contract using a Wasm ID and the contract deployer's public key.
const wasmId = '706ac9480880242cd030a5efeb060d86f51627fb8488f5e78660a7f175b85fe1'; // Replace with the actual Wasm ID.
const publicKey = 'GC5S4C6LMT6BCCARUCK5MOMAS4H7OABFSZG2SPYOGUN2KIHN5HNNMCGL'; // Replace with the actual public key.

try {
  const contractId = await sdk.contract.deploy(wasmId, publicKey);
  console.log(`Contract deployed successfully. Contract ID: ${contractId}`);
} catch (error) {
  console.error(`Contract deployment failed: ${error.message}`);
}
```

#### Defined in

[contract-sdk.ts:88](https://github.com/Sorosan/sorosan-sdk/blob/40fe736/src/sdk/contract-sdk.ts#L88)

___

### deployWasm

▸ **deployWasm**(`wasmBlob`, `publicKey`): `Promise`<`string`\>

Deploys a WebAssembly (Wasm) smart contract to the blockchain.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `wasmBlob` | `Blob` | - |
| `publicKey` | `string` | The public key of the contract deployer. |

#### Returns

`Promise`<`string`\>

- A promise that resolves to the unique identifier (Wasm ID) of the deployed contract.

**`Throws`**

If the deployment process encounters an error or if `wasm` or `publicKey` is falsy.

**`Example`**

```ts
// Deploy a Wasm contract using a Blob containing the contract code.
const wasmBlob = new Blob([wasmBytes], { type: 'application/wasm' });
const publicKey = 'GC5S4C6LMT6BCCARUCK5MOMAS4H7OABFSZG2SPYOGUN2KIHN5HNNMCGL'; // Replace with the actual public key.

try {
  const wasmId = await sdk.contract.deployWasm(wasmBlob, publicKey);
  console.log(`Contract deployed successfully. Wasm ID: ${wasmId}`);
} catch (error) {
  console.error(`Contract deployment failed: ${error.message}`);
}
```

#### Defined in

[contract-sdk.ts:44](https://github.com/Sorosan/sorosan-sdk/blob/40fe736/src/sdk/contract-sdk.ts#L44)

___

### getContractABI

▸ **getContractABI**(`contractAddress`): `Promise`<`any`[] \| ``""``\>

Retrieves the ABI (Application Binary Interface) of a smart contract by its contract address.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `contractAddress` | `string` | The address of the smart contract. |

#### Returns

`Promise`<`any`[] \| ``""``\>

- A promise that resolves to an array of contract methods and their details,
including method name, parameters, and outputs.

**`Throws`**

If there is an error in retrieving the contract ABI.

**`Example`**

```ts
// Retrieve the ABI of a smart contract by its address.
const contractAddress = 'CAZNM4AAQCQPUQGR72MIC7NPWHZBDOQKZBUQ3WTULIDALOWMOG23L6JT'; // Replace with the actual contract address.

try {
  const contractABI = await sdk.contract.getContractABI(contractAddress);
  console.log('Contract ABI:', contractABI);
} catch (error) {
  console.error(`Error retrieving contract ABI: ${error.message}`);
}
```

#### Defined in

[contract-sdk.ts:345](https://github.com/Sorosan/sorosan-sdk/blob/40fe736/src/sdk/contract-sdk.ts#L345)

___

### getContractCode

▸ **getContractCode**(`wasmId`): `Promise`<``null`` \| { `wasmCode`: `string` ; `wasmCodeLedger`: `number`  }\>

Retrieves the WebAssembly (Wasm) code of a smart contract by its Wasm ID.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `wasmId` | `Buffer` | The unique identifier (Wasm ID) of the contract. |

#### Returns

`Promise`<``null`` \| { `wasmCode`: `string` ; `wasmCodeLedger`: `number`  }\>

- A promise that resolves to an object
containing the Wasm code as a hexadecimal string and the ledger sequence number when the code was last modified.
Returns `null` if the contract code is not found or if there is an error.

**`Throws`**

If there is an error in retrieving the contract code.

**`Example`**

```ts
// Retrieve the Wasm code of a contract by its Wasm ID.
const wasmId = Buffer.from('abcdef123456', 'hex'); // Replace with the actual Wasm ID.

try {
  const contractCode = await sdk.contract.getContractCode(wasmId);
  if (contractCode) {
    console.log(`Contract code: ${contractCode.wasmCode}`);
    console.log(`Last modified ledger: ${contractCode.wasmCodeLedger}`);
  } else {
    console.error('Contract code not found or an error occurred.');
  }
} catch (error) {
  console.error(`Error retrieving contract code: ${error.message}`);
}
```

#### Defined in

[contract-sdk.ts:223](https://github.com/Sorosan/sorosan-sdk/blob/40fe736/src/sdk/contract-sdk.ts#L223)

___

### getContractData

▸ **getContractData**(`contractAddress`): `Promise`<``null`` \| { `storage`: readonly `StorageElement`[] ; `wasmId`: `Buffer` ; `wasmIdLedger`: `undefined` \| `number`  }\>

Retrieves contract data from Soroban blockchain, including wasmId, wasmIdLedger, and storage.
Use getContractDataByContractHash(contractId) if you have the contract hash.

#### Parameters

| Name | Type |
| :------ | :------ |
| `contractAddress` | `string` |

#### Returns

`Promise`<``null`` \| { `storage`: readonly `StorageElement`[] ; `wasmId`: `Buffer` ; `wasmIdLedger`: `undefined` \| `number`  }\>

A Promise that resolves to an object containing wasmId, wasmIdLedger, and storage, or null if no data is found.

**`Throws`**

If an error occurs during contract data retrieval.

**`Example`**

```ts
const contractAddress = 'CAZNM4AAQCQPUQGR72MIC7NPWHZBDOQKZBUQ3WTULIDALOWMOG23L6JT'; // Replace with the actual contract identifier.

try {
  const contractData = await sdk.contract.getContractData(contractAddress);
  if (contractData) {
    console.log('Contract WASM ID:', contractData.wasmId);
    console.log('WASM ID Ledger:', contractData.wasmIdLedger);
    console.log('Contract Storage:', contractData.storage);
  } else {
    console.log('Contract data not found.');
  }
} catch (error) {
  console.error('Error:', error.message);
}
```

#### Defined in

[contract-sdk.ts:129](https://github.com/Sorosan/sorosan-sdk/blob/40fe736/src/sdk/contract-sdk.ts#L129)

___

### getContractDataByContractHash

▸ **getContractDataByContractHash**(`contractId`): `Promise`<``null`` \| { `storage`: readonly `StorageElement`[] ; `wasmId`: `Buffer` ; `wasmIdLedger`: `undefined` \| `number`  }\>

Retrieves contract data from Soroban blockchain, including wasmId, wasmIdLedger, and storage.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `contractId` | `string` | The identifier of the contract to retrieve data for. |

#### Returns

`Promise`<``null`` \| { `storage`: readonly `StorageElement`[] ; `wasmId`: `Buffer` ; `wasmIdLedger`: `undefined` \| `number`  }\>

A Promise that resolves to an object containing wasmId, wasmIdLedger, and storage, or null if no data is found.

**`Throws`**

If an error occurs during contract data retrieval.

**`Example`**

```ts
const contractAddress = 'CAZNM4AAQCQPUQGR72MIC7NPWHZBDOQKZBUQ3WTULIDALOWMOG23L6JT'; // Replace with the actual contract identifier.
const contractId = sdk.getContractHash(contractAddress);

try {
  const contractData = await sdk.contract.getContractDataByContractHash(contractId);
  if (contractData) {
    console.log('Contract WASM ID:', contractData.wasmId);
    console.log('WASM ID Ledger:', contractData.wasmIdLedger);
    console.log('Contract Storage:', contractData.storage);
  } else {
    console.log('Contract data not found.');
  }
} catch (error) {
  console.error('Error:', error.message);
}
```

#### Defined in

[contract-sdk.ts:192](https://github.com/Sorosan/sorosan-sdk/blob/40fe736/src/sdk/contract-sdk.ts#L192)

___

### initialise

▸ **initialise**(`contractAddress`, `method`, `args`): `Promise`<`boolean`\>

Initializes a contract call, calculates gas estimate, and submits the transaction.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `contractAddress` | `string` | The address of the smart contract. |
| `method` | `string` | The name of the contract method to call. |
| `args` | `ScVal`[] | An array of arguments to pass to the contract method. |

#### Returns

`Promise`<`boolean`\>

- A promise that resolves to `true` if the transaction succeeds,
or `false` if it fails or is canceled.

**`Throws`**

If there is an error in the initialization or submission process.

**`Remarks`**

This function initiates a contract call by calculating the gas estimate, preparing the transaction,
and submitting it to the blockchain. It returns a boolean value indicating the success of the transaction.

**`Example`**

```ts
// Initialize a contract call, calculate gas estimate, and submit the transaction.
const contractAddress = 'CDDKJMTAENCOVJPUWTISOQ23JYSMCLEOKXT7VEVZJWLYZ3PKLNRBXJ5C';
const method = 'initialise'; // Replace with the name of the contract method.
const args = [
  sdk.nativeToScVal("GC5S4C6LMT6BCCARUCK5MOMAS4H7OABFSZG2SPYOGUN2KIHN5HNNMCGL", 'address')
  sdk.nativeToScVal("Token SS")
  sdk.nativeToScVal("SS")
  sdk.nativeToScVal(18, 'i32'),
];

try {
  const isSuccess = await sdk.contract.initialize(contractAddress, method, args);
  if (isSuccess) {
    console.log('Contract call successful.');
  } else {
    console.error('Contract call failed or was canceled.');
  }
} catch (error) {
  console.error(`Error initializing contract call: ${error.message}`);
}
```

#### Defined in

[contract-sdk.ts:287](https://github.com/Sorosan/sorosan-sdk/blob/40fe736/src/sdk/contract-sdk.ts#L287)

___

### isContractHash

▸ **isContractHash**(`val`): `boolean`

Checks if a string is a valid contract hash.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `val` | `string` | The string to check. |

#### Returns

`boolean`

- `true` if the input is a valid contract hash, otherwise `false`.

**`Example`**

```ts
// Check if a string is a valid contract hash.
const hash = '854702b2ee78e509edafc09482c823301b23e3e3417d69e468e488ff7e592bd6'; // Replace with the string to check.
const isValid = sdk.contract.isContractHash(hash);
console.log(`Is valid contract hash: ${isValid}`);
```

#### Defined in

[contract-sdk.ts:454](https://github.com/Sorosan/sorosan-sdk/blob/40fe736/src/sdk/contract-sdk.ts#L454)

___

### restore

▸ **restore**(`contractAddress`): `Promise`<`boolean`\>

Restores a Soroban smart contract with the given contract address.

This function initiates the restoration process for a Soroban smart contract by creating and signing the necessary transactions.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `contractAddress` | `string` | The address of the smart contract to restore. |

#### Returns

`Promise`<`boolean`\>

Returns `true` if the contract restoration is successful, `false` otherwise.

**`Throws`**

Throws an error if any part of the restoration process fails.

**`Example`**

```ts
const contractAddressToRestore = 'GCLFWWP6C3C5ILOVECODE12345'; // Replace with your actual contract address.

try {
  const isRestored = await sdk.contract.restore(contractAddressToRestore);

  if (isRestored) {
    console.log('Contract successfully restored.');
  } else {
    console.error('Contract restoration failed.');
  }
} catch (error) {
  console.error('An error occurred during contract restoration:', error.message);
}
```

#### Defined in

[contract-sdk.ts:413](https://github.com/Sorosan/sorosan-sdk/blob/40fe736/src/sdk/contract-sdk.ts#L413)
