---
id: "UtilSDK"
title: "Class: UtilSDK"
sidebar_label: "UtilSDK"
sidebar_position: 0
custom_edit_url: null
---

## Hierarchy

- `Soroban`

  ↳ **`UtilSDK`**

## Constructors

### constructor

• **new UtilSDK**(`selectedNetwork`, `activePublicKey?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `selectedNetwork` | `NetworkDetails` |
| `activePublicKey?` | `string` |

#### Overrides

Soroban.constructor

#### Defined in

[util-sdk.ts:14](https://github.com/Sorosan/sorosan-sdk/blob/37164b5/src/sdk/util-sdk.ts#L14)

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

[util-sdk.ts:30](https://github.com/Sorosan/sorosan-sdk/blob/37164b5/src/sdk/util-sdk.ts#L30)

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

[util-sdk.ts:104](https://github.com/Sorosan/sorosan-sdk/blob/37164b5/src/sdk/util-sdk.ts#L104)

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

[util-sdk.ts:125](https://github.com/Sorosan/sorosan-sdk/blob/37164b5/src/sdk/util-sdk.ts#L125)

___

### isSorobanTransaction

▸ **isSorobanTransaction**(`tx`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `tx` | `Transaction`<`Memo`<`MemoType`\>, `Operation`[]\> |

#### Returns

`boolean`

#### Defined in

[util-sdk.ts:129](https://github.com/Sorosan/sorosan-sdk/blob/37164b5/src/sdk/util-sdk.ts#L129)

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

[util-sdk.ts:83](https://github.com/Sorosan/sorosan-sdk/blob/37164b5/src/sdk/util-sdk.ts#L83)

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

[util-sdk.ts:62](https://github.com/Sorosan/sorosan-sdk/blob/37164b5/src/sdk/util-sdk.ts#L62)

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

[util-sdk.ts:46](https://github.com/Sorosan/sorosan-sdk/blob/37164b5/src/sdk/util-sdk.ts#L46)
