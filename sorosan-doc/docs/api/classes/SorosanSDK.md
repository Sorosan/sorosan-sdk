---
id: "SorosanSDK"
title: "Class: SorosanSDK"
sidebar_label: "SorosanSDK"
sidebar_position: 0
custom_edit_url: null
---

## Hierarchy

- `Soroban`

  ↳ **`SorosanSDK`**

## Constructors

### constructor

• **new SorosanSDK**(`selectedNetwork`, `activePublicKey?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `selectedNetwork` | `NetworkDetails` |
| `activePublicKey?` | `string` |

#### Overrides

Soroban.constructor

#### Defined in

[src/sdk/sorosan-sdk.ts:25](https://github.com/Sorosan/sorosan-sdk/blob/c05545a/src/sdk/sorosan-sdk.ts#L25)

## Properties

### contract

• **contract**: [`ContractSDK`](ContractSDK.md)

#### Defined in

[src/sdk/sorosan-sdk.ts:21](https://github.com/Sorosan/sorosan-sdk/blob/c05545a/src/sdk/sorosan-sdk.ts#L21)

___

### token

• **token**: [`TokenSDK`](TokenSDK.md)

#### Defined in

[src/sdk/sorosan-sdk.ts:22](https://github.com/Sorosan/sorosan-sdk/blob/c05545a/src/sdk/sorosan-sdk.ts#L22)

___

### util

• **util**: [`UtilSDK`](UtilSDK.md)

#### Defined in

[src/sdk/sorosan-sdk.ts:23](https://github.com/Sorosan/sorosan-sdk/blob/c05545a/src/sdk/sorosan-sdk.ts#L23)

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

### call

▸ **call**(`contractAddress`, `method`, `args?`): `Promise`<`any`\>

Calls a method on a Soroban contract. This method estimates gas, creates a transaction builder,
prepares the transaction, and simulates it on the network.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `contractAddress` | `string` | `undefined` | - |
| `method` | `string` | `undefined` | The name of the method to call on the contract. |
| `args` | `ScVal`[] | `[]` | An array of ScVal arguments to pass to the method. |

#### Returns

`Promise`<`any`\>

A promise that resolves to the result of the contract call.

**`Example`**

```ts
const result = await sdk.call(
   "GB...",
   "init",
   [xdr.scVal.scvString("Hello World"), new Address("GB...").toScAddress(), ...]
);
```

#### Defined in

[src/sdk/sorosan-sdk.ts:49](https://github.com/Sorosan/sorosan-sdk/blob/c05545a/src/sdk/sorosan-sdk.ts#L49)

___

### connectWallet

▸ **connectWallet**(): `Promise`<`boolean`\>

Connects to the Soroban via Freighter.

#### Returns

`Promise`<`boolean`\>

A promise that resolves to `true` if the connection to Soroban via
Freighter is successful, otherwise `false`.

#### Defined in

[src/sdk/sorosan-sdk.ts:160](https://github.com/Sorosan/sorosan-sdk/blob/c05545a/src/sdk/sorosan-sdk.ts#L160)

___

### estimateGas

▸ **estimateGas**(`contractAddress`, `method`, `args`): `Promise`<`string`\>

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

#### Defined in

[src/sdk/sorosan-sdk.ts:197](https://github.com/Sorosan/sorosan-sdk/blob/c05545a/src/sdk/sorosan-sdk.ts#L197)

___

### login

▸ **login**(): `Promise`<`boolean`\>

Used to connect to the Soroban via Freighter. This method checks if the user has Freighter installed
and is logged in.

#### Returns

`Promise`<`boolean`\>

A promise that resolves to `true` if the user has Freighter installed
and is logged in, otherwise `false`.

**`Example`**

```ts
const hasFreighter = await sdk.login();
if (!hasFreighter) {
   throw new Error("Freighter not installed or not logged in");
}
```

#### Defined in

[src/sdk/sorosan-sdk.ts:134](https://github.com/Sorosan/sorosan-sdk/blob/c05545a/src/sdk/sorosan-sdk.ts#L134)

___

### nativeToScVal

▸ **nativeToScVal**(`arg`, `type?`): `ScVal`

Convert native value to ScValue. Currently supported types are:
string, number, boolean, object, address, bytes, symbol,
i64, i128, i256, u64, u128, u256

#### Parameters

| Name | Type |
| :------ | :------ |
| `arg` | `any` |
| `type?` | `string` |

#### Returns

`ScVal`

**`Example`**

```ts
const addr: xdr.scVal = sdk.nativeToScVal("GBT57WS2EQU3ECJGH6LGU6I5ZOTBDCTEV2YD7L2ZJAD6U7MNMQPHIBGW", "address"),
const hundred: xdr.scVal = sdk.nativeToScVal(100, "i128"),
```

#### Defined in

[src/sdk/sorosan-sdk.ts:241](https://github.com/Sorosan/sorosan-sdk/blob/c05545a/src/sdk/sorosan-sdk.ts#L241)

___

### nativesToScVal

▸ **nativesToScVal**(`args`): `ScVal`[]

Batch convert of list of native typescript types to
Soroban data types. Note this doesn't support custom types.
You have to manually convert them.

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | `CustomScVal`[] |

#### Returns

`ScVal`[]

**`Example`**

```ts

```

#### Defined in

[src/sdk/sorosan-sdk.ts:222](https://github.com/Sorosan/sorosan-sdk/blob/c05545a/src/sdk/sorosan-sdk.ts#L222)

___

### send

▸ **send**(`contractAddress`, `method`, `args?`): `Promise`<`GetTransactionResponse`\>

Generic call method for a Soroban contract. This method estimates gas, creates a transaction builder,
prepares the transaction, and submits the transaction to the network via Freighter signing.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `contractAddress` | `string` | - |
| `method` | `string` | The name of the method to call on the contract. |
| `args?` | `ScVal`[] | An array of ScVal arguments to pass to the method. |

#### Returns

`Promise`<`GetTransactionResponse`\>

A promise that resolves to `true` if the transaction of the contract call
was successful, otherwise `false`.

this is currently a boolean to determine if the transaction of the
contract call was successful.

**`Example`**

```ts
const result = await sdk.send(
   "GB...",
   "init",
   [xdr.scVal.scvString("Hello World"), new Address("GB...").toScAddress(), ...]
);
```

#### Defined in

[src/sdk/sorosan-sdk.ts:88](https://github.com/Sorosan/sorosan-sdk/blob/c05545a/src/sdk/sorosan-sdk.ts#L88)

___

### structToScVal

▸ **structToScVal**(`struct`): `ScVal`

Converts a Rust type struct into an `xdr.ScVal` on Soroban type.

This function takes a `xdr.ScSpecUdtStructV0` object representing a Rust type struct and converts it
into an `xdr.ScVal` object on the Soroban type system. It handles both unnamed and named structs
and returns the corresponding `xdr.ScVal` representation based on the struct's field names.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `struct` | `ScSpecUdtStructV0` | The `xdr.ScSpecUdtStructV0` object to convert into an `xdr.ScVal`. |

#### Returns

`ScVal`

The converted `xdr.ScVal` representing the Rust struct on Soroban type.

**`Example`**

```ts
// Get Rust information...
const specs = await sdk.contract.decompileContract("CDUL5OW2XI7JJQL7VGWD6Y34SXAV3ZDCSW55SUYRFGHWXVK25E7S7FXJ")
const types = specs.filter(x => x.switch() === xdr.ScSpecEntryKind.scSpecEntryUdtStructV0());

// Convert the Rust struct to an xdr.ScVal
types.forEach((type) => {
     const struct = structToScVal(myStruct as as xdr.scSpecEntryUdtStructV0)
     console.log(struct);
});
```

#### Defined in

[src/sdk/sorosan-sdk.ts:266](https://github.com/Sorosan/sorosan-sdk/blob/c05545a/src/sdk/sorosan-sdk.ts#L266)

___

### transactionBuilder

▸ **transactionBuilder**(`publicKey?`, `fee?`): `Promise`<`SorosanTransactionBuilder`\>

This value is an extension of TransactionBuilder and is used to create and prepare transactions
It contains more methods than the TransactionBuilder and is used to interact with the Soroban network.

#### Parameters

| Name | Type |
| :------ | :------ |
| `publicKey?` | `string` |
| `fee?` | `string` |

#### Returns

`Promise`<`SorosanTransactionBuilder`\>

#### Defined in

[src/sdk/sorosan-sdk.ts:210](https://github.com/Sorosan/sorosan-sdk/blob/c05545a/src/sdk/sorosan-sdk.ts#L210)
