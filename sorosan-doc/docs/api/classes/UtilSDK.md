---
id: "UtilSDK"
title: "Class: UtilSDK"
sidebar_label: "UtilSDK"
sidebar_position: 0
custom_edit_url: null
---

## Constructors

### constructor

• **new UtilSDK**()

## Methods

### addressScVal

▸ **addressScVal**(`address`): `ScVal`

Converts a string address to a Soroban ScVal type Address.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `string` | The string address to convert to a ScVal. |

#### Returns

`ScVal`

Soroban ScVal representing the address.

**`Example`**

```ts
const str = "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN";
const address: xdr.ScVal = sdk.util.addressScVal(str);
console.log(address);
```

#### Defined in

[src/sdk/util-sdk.ts:27](https://github.com/Sorosan/sorosan-sdk/blob/c05545a/src/sdk/util-sdk.ts#L27)

___

### isAddress

▸ **isAddress**(`val`): `boolean`

Checks if a string is a valid Soroban address.

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `string` |

#### Returns

`boolean`

`true` if the string is a valid 56-character alphanumeric Soroban address, otherwise `false`.

**`Example`**

```ts
const str = "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN";
const isAddress: boolean = sdk.util.isAddress(str);
console.log(isAddress); // true
```

**`Example`**

```ts
const str = "CCV3ODCHRVCUQTWJZ7F7SLKHGT3JLYWUVHAWMKIYQVSCKMGSOCOJ3AUO";
const isAddress: boolean = sdk.util.isAddress(str);
console.log(isAddress); // false
```

#### Defined in

[src/sdk/util-sdk.ts:101](https://github.com/Sorosan/sorosan-sdk/blob/c05545a/src/sdk/util-sdk.ts#L101)

___

### isContractAddress

▸ **isContractAddress**(`val`): `boolean`

Checks if a string is a valid Soroban contract address.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `val` | `string` | The string to check for Soroban contract address validity. |

#### Returns

`boolean`

`true` if the string is a valid Soroban contract address, otherwise `false`.

**`Example`**

```ts
const str = "CCV3ODCHRVCUQTWJZ7F7SLKHGT3JLYWUVHAWMKIYQVSCKMGSOCOJ3AUO";
const isContractAddress: boolean = sdk.util.isContractAddress(str);
console.log(isContractAddress); // true
```

**`Example`**

```ts
const str = "CCV3ODCHRVCUQTWJZ7F7SL";
const isContractAddress: boolean = sdk.util.isContractAddress(str);
console.log(isContractAddress); // false
```

#### Defined in

[src/sdk/util-sdk.ts:122](https://github.com/Sorosan/sorosan-sdk/blob/c05545a/src/sdk/util-sdk.ts#L122)

___

### isSorobanTransaction

▸ **isSorobanTransaction**(`tx`): `boolean`

Checks if a transaction is a Soroban transaction.

This method determines whether the provided transaction is a Soroban transaction by checking its operations.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tx` | `Transaction`<`Memo`<`MemoType`\>, `Operation`[]\> | The transaction to check. |

#### Returns

`boolean`

- A boolean indicating whether the transaction is a Soroban transaction.

**`Example`**

```ts
// Example usage:
const transaction: Transaction;
const isSorobanTx = sdk.util.isSorobanTransaction(transaction);
console.log('Is Soroban transaction:', isSorobanTx);
```

#### Defined in

[src/sdk/util-sdk.ts:140](https://github.com/Sorosan/sorosan-sdk/blob/c05545a/src/sdk/util-sdk.ts#L140)

___

### mask

▸ **mask**(`str`): `string`

Shortens an address or hash to a fixed length for display.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `str` | `string` | The address or hash to shorten. |

#### Returns

`string`

The shortened string if its length is greater than 10 characters; otherwise, the original string.

**`Example`**

```ts
const str = "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN";
const short: string = sdk.util.mask(str);
console.log(short); // GA5Z...K4KZVN
```

**`Example`**

```ts
const str = "ABC";
const short: string = sdk.util.mask(str);
console.log(short); // ABC
```

#### Defined in

[src/sdk/util-sdk.ts:80](https://github.com/Sorosan/sorosan-sdk/blob/c05545a/src/sdk/util-sdk.ts#L80)

___

### toContractAddress

▸ **toContractAddress**(`id`): `string`

Converts a contract hash to its contract address.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | The contract hash to convert to its contract address. |

#### Returns

`string`

The contract address as a string.

**`Example`**

```ts
const str = "c13dfd0485a7a572bad3e54676cf99d6257535d38e5f251086e5b5c8b01f4b23";
const hash: string = sdk.util.contractHash(str);
console.log(hash); // CDAT37IEQWT2K4V22PSUM5WPTHLCK5JV2OHF6JIQQ3S3LSFQD5FSGYN6
```

#### Defined in

[src/sdk/util-sdk.ts:59](https://github.com/Sorosan/sorosan-sdk/blob/c05545a/src/sdk/util-sdk.ts#L59)

___

### toContractHash

▸ **toContractHash**(`hash`): `string`

Converts a contract address to its contract hash.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hash` | `string` | The contract address to convert to its contract hash. |

#### Returns

`string`

The contract hash as a string.

**`Example`**

```ts
const str = "CDAT37IEQWT2K4V22PSUM5WPTHLCK5JV2OHF6JIQQ3S3LSFQD5FSGYN6";
const id: string = sdk.util.contractAddress(str);
console.log(id); // c13dfd0485a7a572bad3e54676cf99d6257535d38e5f251086e5b5c8b01f4b23
```

#### Defined in

[src/sdk/util-sdk.ts:43](https://github.com/Sorosan/sorosan-sdk/blob/c05545a/src/sdk/util-sdk.ts#L43)

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

[src/sdk/util-sdk.ts:154](https://github.com/Sorosan/sorosan-sdk/blob/c05545a/src/sdk/util-sdk.ts#L154)

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

[src/sdk/util-sdk.ts:168](https://github.com/Sorosan/sorosan-sdk/blob/c05545a/src/sdk/util-sdk.ts#L168)
