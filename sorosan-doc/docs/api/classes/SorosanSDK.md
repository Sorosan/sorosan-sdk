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

[sorosan-sdk.ts:26](https://github.com/Sorosan/sorosan-sdk/blob/40fe736/src/sdk/sorosan-sdk.ts#L26)

## Properties

### contract

• **contract**: [`ContractSDK`](ContractSDK.md)

#### Defined in

[sorosan-sdk.ts:22](https://github.com/Sorosan/sorosan-sdk/blob/40fe736/src/sdk/sorosan-sdk.ts#L22)

___

### token

• **token**: [`TokenSDK`](TokenSDK.md)

#### Defined in

[sorosan-sdk.ts:23](https://github.com/Sorosan/sorosan-sdk/blob/40fe736/src/sdk/sorosan-sdk.ts#L23)

___

### util

• **util**: [`UtilSDK`](UtilSDK.md)

#### Defined in

[sorosan-sdk.ts:24](https://github.com/Sorosan/sorosan-sdk/blob/40fe736/src/sdk/sorosan-sdk.ts#L24)

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

### call

▸ **call**(`contractAddress`, `method`, `args?`): `Promise`<`any`\>

Calls a method on a Soroban contract. This method estimates gas, creates a transaction builder,
prepares the transaction, and simulates it on the network.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `contractAddress` | `string` | - |
| `method` | `string` | The name of the method to call on the contract. |
| `args?` | `ScVal`[] | An array of ScVal arguments to pass to the method. |

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

[sorosan-sdk.ts:50](https://github.com/Sorosan/sorosan-sdk/blob/40fe736/src/sdk/sorosan-sdk.ts#L50)

___

### connectWallet

▸ **connectWallet**(): `Promise`<`boolean`\>

Connects to the Soroban via Freighter.

#### Returns

`Promise`<`boolean`\>

A promise that resolves to `true` if the connection to Soroban via
Freighter is successful, otherwise `false`.

#### Defined in

[sorosan-sdk.ts:182](https://github.com/Sorosan/sorosan-sdk/blob/40fe736/src/sdk/sorosan-sdk.ts#L182)

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

[sorosan-sdk.ts:219](https://github.com/Sorosan/sorosan-sdk/blob/40fe736/src/sdk/sorosan-sdk.ts#L219)

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

[sorosan-sdk.ts:156](https://github.com/Sorosan/sorosan-sdk/blob/40fe736/src/sdk/sorosan-sdk.ts#L156)

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

[sorosan-sdk.ts:254](https://github.com/Sorosan/sorosan-sdk/blob/40fe736/src/sdk/sorosan-sdk.ts#L254)

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

[sorosan-sdk.ts:235](https://github.com/Sorosan/sorosan-sdk/blob/40fe736/src/sdk/sorosan-sdk.ts#L235)

___

### send

▸ **send**(`contractAddress`, `method`, `args?`): `Promise`<`boolean`\>

Generic call method for a Soroban contract. This method estimates gas, creates a transaction builder,
prepares the transaction, and submits the transaction to the network via Freighter signing.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `contractAddress` | `string` | - |
| `method` | `string` | The name of the method to call on the contract. |
| `args?` | `ScVal`[] | An array of ScVal arguments to pass to the method. |

#### Returns

`Promise`<`boolean`\>

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

[sorosan-sdk.ts:97](https://github.com/Sorosan/sorosan-sdk/blob/40fe736/src/sdk/sorosan-sdk.ts#L97)

___

### toStroop

▸ **toStroop**(`amount`): `BigNumber`

Converts XLM (Lumen) to stroops (1 XLM = 10^7 stroops).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `amount` | `number` | The amount of XLM to convert. |

#### Returns

`BigNumber`

The equivalent amount in stroops as a BigNumber.

**`Example`**

```ts
const xlmAmount = 5.0; // Replace with the actual amount of XLM to convert.
const stroops = sdk.toStroop(xlmAmount);
console.log(`Equivalent in Stroops: ${stroops.toString()}`);
```

#### Defined in

[sorosan-sdk.ts:268](https://github.com/Sorosan/sorosan-sdk/blob/40fe736/src/sdk/sorosan-sdk.ts#L268)

___

### toXLM

▸ **toXLM**(`amount`): `BigNumber`

Converts stroops to XLM (Lumen) (1 XLM = 10^7 stroops).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `amount` | `number` | The amount in stroops to convert. |

#### Returns

`BigNumber`

The equivalent amount in XLM as a BigNumber.

**`Example`**

```ts
const stroopsAmount = 50000000; // Replace with the actual amount in stroops to convert.
const xlm = sdk.toXLM(stroopsAmount);
console.log(`Equivalent in XLM: ${xlm.toString()}`);
```

#### Defined in

[sorosan-sdk.ts:282](https://github.com/Sorosan/sorosan-sdk/blob/40fe736/src/sdk/sorosan-sdk.ts#L282)
