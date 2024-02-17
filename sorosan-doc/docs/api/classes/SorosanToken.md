---
id: "SorosanToken"
title: "Class: SorosanToken"
sidebar_label: "SorosanToken"
sidebar_position: 0
custom_edit_url: null
---

## Hierarchy

- `Soroban`

  ↳ **`SorosanToken`**

## Constructors

### constructor

• **new SorosanToken**(`contractAddress`, `selectedNetwork`, `activePublicKey?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `contractAddress` | `string` |
| `selectedNetwork` | `NetworkDetails` |
| `activePublicKey?` | `string` |

#### Overrides

Soroban.constructor

#### Defined in

src/sdk/classes/sorosan-token.ts:13

## Properties

### contract

• **contract**: [`SorosanContract`](SorosanContract.md)

#### Defined in

src/sdk/classes/sorosan-token.ts:11

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

### balance

▸ **balance**(`address?`): `Promise`<`BigInt`\>

Retrieves the balance of the specified address from the contract.

This method retrieves the balance of the specified address from the contract using a transaction builder and the Soroban RPC server.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address?` | `string` | The address for which to retrieve the balance. If not provided, the balance of the contract owner is retrieved. |

#### Returns

`Promise`<`BigInt`\>

- A promise that resolves to the balance of the specified address from the contract.

**`Example`**

```ts
const address: string;
const contractAddress: string;
const token = new Token(contractAddress);
const balance = await token.balance(address);
console.log(`Balance of address ${address || 'contract owner'}: ${balance}`);
```

#### Defined in

src/sdk/classes/sorosan-token.ts:104

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

[src/sdk/soroban.ts:81](https://github.com/Sorosan/sorosan-sdk/blob/c05545a/src/sdk/soroban.ts#L81)

___

### decimal

▸ **decimal**(): `Promise`<`number`\>

Retrieves the decimal of the contract.

This method invokes the "decimal" function of the contract using a transaction builder and the Soroban RPC server.

#### Returns

`Promise`<`number`\>

- A promise that resolves to the decimal of the contract.

**`Example`**

```ts
const contractAddress: string;
const token = new Token(contractAddress);
const decimal = token contract.decimal();
console.log('Contract decimal:', decimal);
```

#### Defined in

src/sdk/classes/sorosan-token.ts:80

___

### name

▸ **name**(): `Promise`<`string`\>

Retrieves the name of the contract.

This method invokes the "name" function of the contract using a transaction builder and the Soroban RPC server.

#### Returns

`Promise`<`string`\>

- A promise that resolves to the name of the contract.

**`Example`**

```ts
const contractAddress: string;
const token = new Token(contractAddress);
const name = await token.name();
console.log('Contract name:', name);
```

#### Defined in

src/sdk/classes/sorosan-token.ts:36

___

### symbol

▸ **symbol**(): `Promise`<`string`\>

Retrieves the symbol of the contract.

This method invokes the "symbol" function of the contract using a transaction builder and the Soroban RPC server.

#### Returns

`Promise`<`string`\>

- A promise that resolves to the symbol of the contract.

**`Example`**

```ts
const contractAddress: string;
const token = new Token(contractAddress);
const symbol = await token.symbol();
console.log('Contract symbol:', symbol);
```

#### Defined in

src/sdk/classes/sorosan-token.ts:58
