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

[src/sdk/contract-sdk.ts:20](https://github.com/Sorosan/sorosan-sdk/blob/c05545a/src/sdk/contract-sdk.ts#L20)

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

[src/sdk/soroban.ts:100](https://github.com/Sorosan/sorosan-sdk/blob/c05545a/src/sdk/soroban.ts#L100)

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

[src/sdk/soroban.ts:81](https://github.com/Sorosan/sorosan-sdk/blob/c05545a/src/sdk/soroban.ts#L81)

___

### contractCodeByAddress

▸ **contractCodeByAddress**(`contractAddress`): `Promise`<``null`` \| { `code`: `string` ; `ledgerSeq`: `number`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `contractAddress` | `string` |

#### Returns

`Promise`<``null`` \| { `code`: `string` ; `ledgerSeq`: `number`  }\>

#### Defined in

[src/sdk/contract-sdk.ts:198](https://github.com/Sorosan/sorosan-sdk/blob/c05545a/src/sdk/contract-sdk.ts#L198)

___

### contractCodeByWasm

▸ **contractCodeByWasm**(`wasmId`): `Promise`<``null`` \| { `code`: `string` ; `ledgerSeq`: `number`  }\>

Retrieves the WebAssembly (Wasm) code of a smart contract by its Wasm ID.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `wasmId` | `Buffer` | The unique identifier (Wasm ID) of the contract. |

#### Returns

`Promise`<``null`` \| { `code`: `string` ; `ledgerSeq`: `number`  }\>

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

[src/sdk/contract-sdk.ts:233](https://github.com/Sorosan/sorosan-sdk/blob/c05545a/src/sdk/contract-sdk.ts#L233)

___

### contractInfo

▸ **contractInfo**(`contractAddress`): `Promise`<{ `ledgerSeq`: `number` ; `storage`: readonly `StorageElement`[] ; `wasmId`: `Buffer`  }\>

Retrieves information about the contract with the specified contract address.

This method retrieves information such as the Wasm ID, last modified ledger sequence number, and storage elements of the contract
with the specified contract address using a Sorosan contract instance and the Soroban RPC server.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `contractAddress` | `string` | The address of the contract for which to retrieve information. |

#### Returns

`Promise`<{ `ledgerSeq`: `number` ; `storage`: readonly `StorageElement`[] ; `wasmId`: `Buffer`  }\>

- A promise that resolves to an object containing the Wasm ID, last modified ledger sequence number, and storage elements of the contract.

**`Example`**

```ts
const contractAddress: string;
const contractInfo = await SorosanContract.contractInfo(contractAddress);
console.log('Contract info:', contractInfo);
```

#### Defined in

[src/sdk/contract-sdk.ts:165](https://github.com/Sorosan/sorosan-sdk/blob/c05545a/src/sdk/contract-sdk.ts#L165)

___

### contractInfoByAddress

▸ **contractInfoByAddress**(`contractId`): `Promise`<{ `ledgerSeq`: `number` ; `storage`: readonly `StorageElement`[] ; `wasmId`: `Buffer`  }\>

Retrieves information about the contract with the specified contract ID.

This method retrieves information about the contract with the specified contract ID by first obtaining the contract address and then
retrieving the contract information using the `contractInfo` method.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `contractId` | `string` | The ID of the contract for which to retrieve information. |

#### Returns

`Promise`<{ `ledgerSeq`: `number` ; `storage`: readonly `StorageElement`[] ; `wasmId`: `Buffer`  }\>

- A promise that resolves to an object containing the Wasm ID, last modified ledger sequence number, and storage elements of the contract.

**`Example`**

```ts
const contractId: string;
const contractInfo = await SorosanContract.contractInfoByAddress(contractId);
console.log('Contract info:', contractInfo);
```

#### Defined in

[src/sdk/contract-sdk.ts:193](https://github.com/Sorosan/sorosan-sdk/blob/c05545a/src/sdk/contract-sdk.ts#L193)

___

### decompile

▸ **decompile**(`contractAddress`): `Promise`<`ScSpecEntry`[]\>

Asynchronously retrieves contract information, including code and specification details,
associated with a given contract address.

This function allows you to fetch contract data, including the WebAssembly (Wasm) code,
and extract information about the contract, such as functions with their parameters and outputs,
data structures (structs and enums), and data keys.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `contractAddress` | `string` | The address of the contract for which to retrieve information. |

#### Returns

`Promise`<`ScSpecEntry`[]\>

A promise that resolves to an array of `xdr.ScSpecEntry` objects,
representing the contract's specification and details.

**`Example`**

```ts
// Retrieve contract information for a given contract address
const contractAddress = "GDUY7J7A33TQWOSOQGDO776GGLM3UQERL4J3SPT56F6YS4ID7MLDERI4";
const specs = await sdk.contract.decompileContract(contractAddress);

// Access specific information from the contract specification
const fns = specs.filter(x => x.switch() === xdr.ScSpecEntryKind.scSpecEntryFunctionV0());
const types = specs.filter(x => x.switch() === xdr.ScSpecEntryKind.scSpecEntryUdtStructV0());
const enums = specs.filter(x => x.switch() === xdr.ScSpecEntryKind.scSpecEntryUdtEnumV0());
```

#### Defined in

[src/sdk/contract-sdk.ts:399](https://github.com/Sorosan/sorosan-sdk/blob/c05545a/src/sdk/contract-sdk.ts#L399)

___

### deploy

▸ **deploy**(`wasmId`, `publicKey`): `Promise`<`DeploymentResponse`\>

Deploys a smart contract with a specified Wasm ID to the blockchain.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `wasmId` | `string` | The unique identifier (Wasm ID) of the contract's WebAssembly code. |
| `publicKey` | `string` | The public key of the contract deployer. |

#### Returns

`Promise`<`DeploymentResponse`\>

- The unique identifier (Contract ID) of the deployed contract.

**`Throws`**

If the deployment process encounters an error.

**`Example`**

```ts
// Deploy a contract using a Wasm ID and the contract deployer's public key.
const wasmId = '706ac9480880242cd030a5efeb060d86f51627fb8488f5e78660a7f175b85fe1'; // Replace with the actual Wasm ID.
const publicKey = 'GDLEI7MS6EMTGHB7N5YHSVEMEWSWNUM4T77VDEGNTXSBRTIGMXUCE5GF'; // Replace with the actual public key.

try {
  const contractId = await sdk.contract.deploy(wasmId, publicKey);
  console.log(`Contract deployed successfully. Contract ID: ${contractId}`);
} catch (error) {
  console.error(`Contract deployment failed: ${error.message}`);
}
```

#### Defined in

[src/sdk/contract-sdk.ts:95](https://github.com/Sorosan/sorosan-sdk/blob/c05545a/src/sdk/contract-sdk.ts#L95)

___

### deployWasm

▸ **deployWasm**(`wasmBlob`, `publicKey`): `Promise`<`DeploymentResponse`\>

Deploys a WebAssembly (Wasm) smart contract to the blockchain.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `wasmBlob` | `Blob` | - |
| `publicKey` | `string` | The public key of the contract deployer. |

#### Returns

`Promise`<`DeploymentResponse`\>

- A promise that resolves to the unique identifier (Wasm ID) of the deployed contract.

**`Throws`**

If the deployment process encounters an error or if `wasm` or `publicKey` is falsy.

**`Example`**

```ts
// Deploy a Wasm contract using a Blob containing the contract code.
const wasmBlob = new Blob([wasmBytes], { type: 'application/wasm' });
const publicKey = 'GDLEI7MS6EMTGHB7N5YHSVEMEWSWNUM4T77VDEGNTXSBRTIGMXUCE5GF'; // Replace with the actual public key.

try {
  const wasmId = await sdk.contract.deployWasm(wasmBlob, publicKey);
  console.log(`Contract deployed successfully. Wasm ID: ${wasmId}`);
} catch (error) {
  console.error(`Contract deployment failed: ${error.message}`);
}
```

#### Defined in

[src/sdk/contract-sdk.ts:45](https://github.com/Sorosan/sorosan-sdk/blob/c05545a/src/sdk/contract-sdk.ts#L45)

___

### getContractABI

▸ **getContractABI**(`contractAddress`): `Promise`<`any`[]\>

Retrieves the ABI (Application Binary Interface) of a smart contract by its contract address,
that contains params names and input types, and outputs names and types. All needed information
to call a contract method.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `contractAddress` | `string` | The address of the smart contract. |

#### Returns

`Promise`<`any`[]\>

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

[src/sdk/contract-sdk.ts:349](https://github.com/Sorosan/sorosan-sdk/blob/c05545a/src/sdk/contract-sdk.ts#L349)

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
  sdk.nativeToScVal("GDLEI7MS6EMTGHB7N5YHSVEMEWSWNUM4T77VDEGNTXSBRTIGMXUCE5GF", 'address')
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

[src/sdk/contract-sdk.ts:293](https://github.com/Sorosan/sorosan-sdk/blob/c05545a/src/sdk/contract-sdk.ts#L293)

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

[src/sdk/contract-sdk.ts:484](https://github.com/Sorosan/sorosan-sdk/blob/c05545a/src/sdk/contract-sdk.ts#L484)

___

### load

▸ **load**(`contractAddress`): [`SorosanContract`](SorosanContract.md)

Loads a Sorosan contract instance with the specified contract address.

This method creates and returns a new Sorosan contract instance using the provided contract address.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `contractAddress` | `string` | The address of the contract to load. |

#### Returns

[`SorosanContract`](SorosanContract.md)

- The Sorosan contract instance loaded with the specified contract address.

**`Example`**

```ts
const contractAddress: string;
const contract = SorosanContract.load(contractAddress);
console.log('Loaded contract:', contract);
```

#### Defined in

[src/sdk/contract-sdk.ts:129](https://github.com/Sorosan/sorosan-sdk/blob/c05545a/src/sdk/contract-sdk.ts#L129)

___

### restore

▸ **restore**(`contractAddress`): `Promise`<`GetTransactionResponse`\>

Restores a Soroban smart contract with the given contract address.

This function initiates the restoration process for a Soroban smart contract by creating and signing the necessary transactions.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `contractAddress` | `string` | The address of the smart contract to restore. |

#### Returns

`Promise`<`GetTransactionResponse`\>

Returns `true` if the contract restoration is successful, `false` otherwise.

**`Throws`**

Throws an error if any part of the restoration process fails.

**`Example`**

```ts
const contractAddressToRestore; // Replace with your actual contract address.
const response: SorobanRpc.Api.GetTransactionResponse = await sdk.contract.restore(contractAddressToRestore);
console.log(response.status);
```

#### Defined in

[src/sdk/contract-sdk.ts:419](https://github.com/Sorosan/sorosan-sdk/blob/c05545a/src/sdk/contract-sdk.ts#L419)

___

### wasmId

▸ **wasmId**(`contractAddress`): `Promise`<`Buffer`\>

Retrieves the WebAssembly (Wasm) ID of the contract with the specified contract address.

This method retrieves the Wasm ID of the contract with the specified contract address using a Sorosan contract instance and the Soroban RPC server.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `contractAddress` | `string` | The address of the contract for which to retrieve the Wasm ID. |

#### Returns

`Promise`<`Buffer`\>

- A promise that resolves to the Wasm ID of the contract.

**`Example`**

```ts
const contractAddress: string;
const wasmId = await SorosanContract.wasmId(contractAddress);
console.log('Wasm ID:', wasmId.toString('hex'));
```

#### Defined in

[src/sdk/contract-sdk.ts:146](https://github.com/Sorosan/sorosan-sdk/blob/c05545a/src/sdk/contract-sdk.ts#L146)
