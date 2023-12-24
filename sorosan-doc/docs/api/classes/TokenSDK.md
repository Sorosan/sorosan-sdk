---
id: "TokenSDK"
title: "Class: TokenSDK"
sidebar_label: "TokenSDK"
sidebar_position: 0
custom_edit_url: null
---

## Hierarchy

- `Soroban`

  ↳ **`TokenSDK`**

## Constructors

### constructor

• **new TokenSDK**(`selectedNetwork`, `activePublicKey?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `selectedNetwork` | `NetworkDetails` |
| `activePublicKey?` | `string` |

#### Overrides

Soroban.constructor

#### Defined in

[token-sdk.ts:29](https://github.com/Sorosan/sorosan-sdk/blob/37164b5/src/sdk/token-sdk.ts#L29)

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

[soroban.ts:100](https://github.com/Sorosan/sorosan-sdk/blob/37164b5/src/sdk/soroban.ts#L100)

## Methods

### balance

▸ **balance**(`contractAddress`, `address?`): `Promise`<`BigInt`\>

Retrieves the balance of an address for a given token contract.

If an `address` is provided, it retrieves the balance for the specified address.
If no `address` is provided, it retrieves the balance for the Freighter user's address.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `contractAddress` | `string` | The address of the token contract. |
| `address?` | `string` | (Optional) The address for which to retrieve the balance. If not provided, the Freighter user's address will be used. |

#### Returns

`Promise`<`BigInt`\>

- A promise that resolves to the balance of the specified address in the token contract as a BigInt.

**`Throws`**

If there is an error in retrieving the balance or if no address is provided.

**`Example`**

```ts
// Example 1: Retrieve the balance of the Freighter user's address for a token contract.
const contractAddress = "CAZNM4AAQCQPUQGR72MIC7NPWHZBDOQKZBUQ3WTULIDALOWMOG23L6JT";
const symbol = await sdk.wallet.balance(contractAddress);
console.log(`Balance: ${symbol}`);  // Example output: Balance: 1000n
```

**`Example`**

```ts
// Example 2: Retrieve the balance of a specific address for a token contract.
const contractAddress = "CAZNM4AAQCQPUQGR72MIC7NPWHZBDOQKZBUQ3WTULIDALOWMOG23L6JT";
const address = "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN";
const symbol = await sdk.wallet.balance(contractAddress, address);
console.log(`Balance: ${symbol}`);  // Example output: Balance: 1000n
```

#### Defined in

[token-sdk.ts:98](https://github.com/Sorosan/sorosan-sdk/blob/37164b5/src/sdk/token-sdk.ts#L98)

___

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

[soroban.ts:81](https://github.com/Sorosan/sorosan-sdk/blob/37164b5/src/sdk/soroban.ts#L81)

___

### createAsset

▸ **createAsset**(`assetCode`, `assetIssuer?`, `limit?`): `Promise`<`undefined` \| `Asset`\>

Creates a new asset with the specified asset code, asset issuer, and limit.
This operation involves two steps: creating a trustline for the asset and funding it.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `assetCode` | `string` | `undefined` | The code (symbol) of the asset to create. |
| `assetIssuer?` | `string` | `undefined` | (Optional) The issuer's public key for the asset. Defaults to the current user's public key. |
| `limit?` | `string` | `"10000000"` | (Optional) The maximum limit for the asset. Defaults to "10000000". |

#### Returns

`Promise`<`undefined` \| `Asset`\>

- A promise that resolves to the created asset or undefined if the operation fails.

**`Throws`**

If any step of the asset creation process fails.

**`Example`**

```ts
const asset = await sdk.wallet.createAsset(
   "WXLM", 
   "GC5S4C6LMT6BCCARUCK5MOMAS4H7OABFSZG2SPYOGUN2KIHN5HNNMCGL",
   10000000)
console.log(asset.getCode());        // WXLM
console.log(asset.getIssuer());      // GC5S4C6LMT6BCCARUCK5MOMAS4H7OABFSZG2SPYOGUN2KIHN5HNNMCGL
```

#### Defined in

[token-sdk.ts:325](https://github.com/Sorosan/sorosan-sdk/blob/37164b5/src/sdk/token-sdk.ts#L325)

___

### decimal

▸ **decimal**(`contractAddress`): `Promise`<`number`\>

Retrieves the decimal value of a token contract given its contract address.

If the address is not provided, it retrieves the decimal value for the Freighter user's balance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `contractAddress` | `string` | The address of the token contract. |

#### Returns

`Promise`<`number`\>

- A promise that resolves to the decimal value of the token contract.

**`Throws`**

If there is an error in retrieving the decimal value.

**`Example`**

```ts
// Retrieve the decimal value of a token contract by its address.
const contractAddress = "CAZNM4AAQCQPUQGR72MIC7NPWHZBDOQKZBUQ3WTULIDALOWMOG23L6JT";
const decimal = await sdk.wallet.decimal(contractAddress);
console.log(`Decimal value: ${decimal}`);  // Example output: Decimal value: 7
```

#### Defined in

[token-sdk.ts:127](https://github.com/Sorosan/sorosan-sdk/blob/37164b5/src/sdk/token-sdk.ts#L127)

___

### deploy

▸ **deploy**(`tokenWasm?`): `Promise`<`string`\>

Deploys a smart contract token to the using a given WebAssembly (Wasm) binary code and returns the contract's unique identifier (contractId).

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `tokenWasm?` | `string` | `"a04a42a9dddb6259c256837063aeed66eb78145a579e128306d524b40adb4fe6"` | The WebAssembly (Wasm) binary code in hexadecimal format. Default is a placeholder value. |

#### Returns

`Promise`<`string`\>

- A promise that resolves to the unique identifier (contractId) of the deployed smart contract.

**`Async`**

**`Throws`**

If the deployment fails or if contractId retrieval encounters an error.

**`Example`**

```ts
const wasmId = "706ac9480880242cd030a5efeb060d86f51627fb8488f5e78660a7f175b85fe1";
try {
    const contractId = await deploy(wasmId);
    const contractAddress = sdk.util.getContractAddress(contractId);
    console.log(`Smart contract deployed with contract: ${contractAddress}`);
} catch (error) {
    console.error(`Smart contract deployment failed: ${error.message}`);
}
```

#### Defined in

[token-sdk.ts:151](https://github.com/Sorosan/sorosan-sdk/blob/37164b5/src/sdk/token-sdk.ts#L151)

___

### getContractAddressFromAsset

▸ **getContractAddressFromAsset**(`code`, `issuer`): `Promise`<`string`\>

Retrieves the contract address associated with an asset using its code and issuer's public key.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `code` | `string` | The code (symbol) of the asset. |
| `issuer` | `string` | The issuer's public key for the asset. |

#### Returns

`Promise`<`string`\>

- A promise that resolves to the contract address of the asset.
                           Returns an empty string if an error occurs during retrieval.

**`Async`**

**`Example`**

```ts
const assetCode = "XLM";
const assetIssuer = "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN";
try {
    const contractAddress = await sdk.token.getContractAddressFromAsset(assetCode, assetIssuer);
    console.log(`Contract address for ${assetCode} issued by ${assetIssuer}: ${contractAddress}`);
} catch (error) {
    console.error(`Failed to retrieve contract address: ${error.message}`);
}
```

#### Defined in

[token-sdk.ts:236](https://github.com/Sorosan/sorosan-sdk/blob/37164b5/src/sdk/token-sdk.ts#L236)

___

### initialise

▸ **initialise**(`contractAddress`, `name`, `symbol`, `decimal`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `contractAddress` | `string` |
| `name` | `string` |
| `symbol` | `string` |
| `decimal` | `number` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[token-sdk.ts:171](https://github.com/Sorosan/sorosan-sdk/blob/37164b5/src/sdk/token-sdk.ts#L171)

___

### name

▸ **name**(`contractAddress`): `Promise`<`string`\>

Retrieves the name of a token contract given its contract address.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `contractAddress` | `string` | The address of the token contract. |

#### Returns

`Promise`<`string`\>

- A promise that resolves to the name of the token contract as a string.

**`Throws`**

If there is an error in retrieving the token name.

**`Example`**

```ts
// Retrieve the name of a token contract by its address.
const contractAddress = "CAZNM4AAQCQPUQGR72MIC7NPWHZBDOQKZBUQ3WTULIDALOWMOG23L6JT";
const tokenName = await sdk.wallet.name(contractAddress);
console.log(`Token Name: ${tokenName}`);  // Example output: Token Name: Stellar Token
```

#### Defined in

[token-sdk.ts:47](https://github.com/Sorosan/sorosan-sdk/blob/37164b5/src/sdk/token-sdk.ts#L47)

___

### symbol

▸ **symbol**(`contractAddress`): `Promise`<`string`\>

Retrieves the symbol (ticker) of a token contract given its contract address.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `contractAddress` | `string` | The address of the token contract. |

#### Returns

`Promise`<`string`\>

- A promise that resolves to the symbol (ticker) of the token contract as a string.

**`Throws`**

If there is an error in retrieving the token symbol.

**`Example`**

```ts
// Retrieve the symbol of a token contract by its address.
const contractAddress = "CAZNM4AAQCQPUQGR72MIC7NPWHZBDOQKZBUQ3WTULIDALOWMOG23L6JT";
const symbol = await sdk.wallet.symbol(contractAddress);
console.log(`Token Symbol: ${symbol}`);  // Example output: Token Symbol: XLM
```

#### Defined in

[token-sdk.ts:67](https://github.com/Sorosan/sorosan-sdk/blob/37164b5/src/sdk/token-sdk.ts#L67)

___

### wrap

▸ **wrap**(`asset`): `Promise`<`string`\>

Wraps the specified asset to create a wrapped token.
This operation involves creating a wrapped token contract on the blockchain.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `asset` | `Asset` | The asset to wrap. |

#### Returns

`Promise`<`string`\>

- A promise that resolves to the contract address of the wrapped token.

**`Throws`**

If the asset is not provided, the wrap operation fails, or there is an issue with contract creation.

**`Example`**

```ts
const asset = await sdk.wallet.createAsset(
   "WXLM", 
   "GC5S4C6LMT6BCCARUCK5MOMAS4H7OABFSZG2SPYOGUN2KIHN5HNNMCGL",
   10000000)
const contractAddress = await sdk.wallet.wrap(asset);        // Main method
console.log(contractAddress);
```

#### Defined in

[token-sdk.ts:373](https://github.com/Sorosan/sorosan-sdk/blob/37164b5/src/sdk/token-sdk.ts#L373)
