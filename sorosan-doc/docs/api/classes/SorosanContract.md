---
id: "SorosanContract"
title: "Class: SorosanContract"
sidebar_label: "SorosanContract"
sidebar_position: 0
custom_edit_url: null
---

Represents a SorosanContract, which extends the Contract class.
Note: This class may require a server instance as a parameter. For now, we use the dev server instance.

## Hierarchy

- `Contract`

  ↳ **`SorosanContract`**

## Constructors

### constructor

• **new SorosanContract**(`address`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |

#### Overrides

Contract.constructor

#### Defined in

src/sdk/classes/sorosan-contract.ts:14

## Properties

### ledgerKey

• **ledgerKey**: `LedgerKey`

#### Defined in

src/sdk/classes/sorosan-contract.ts:12

## Methods

### abi

▸ **abi**(`server`): `Promise`<`any`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `Server` |

#### Returns

`Promise`<`any`[]\>

#### Defined in

src/sdk/classes/sorosan-contract.ts:198

___

### address

▸ **address**(): `Address`

#### Returns

`Address`

#### Inherited from

Contract.address

#### Defined in

node_modules/@stellar/stellar-base/types/index.d.ts:32

___

### call

▸ **call**(`method`, `...params`): `Operation2`<`InvokeHostFunction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `method` | `string` |
| `...params` | `ScVal`[] |

#### Returns

`Operation2`<`InvokeHostFunction`\>

#### Inherited from

Contract.call

#### Defined in

node_modules/@stellar/stellar-base/types/index.d.ts:30

___

### code

▸ **code**(`server`): `Promise`<`string`\>

Retrieves the contract code associated with the contract from the Soroban RPC server.

This method fetches the contract code associated with the contract from the Soroban RPC server
using the provided server instance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `server` | `Server` | The Soroban RPC server instance from which to fetch the contract code. |

#### Returns

`Promise`<`string`\>

- A promise that resolves to the contract code associated with the contract.

**`Example`**

```ts
const server: SorobanRpc.Server;
const contract: string;
const code = await contract.code(server);
console.log('Contract code:', code);
```

#### Defined in

src/sdk/classes/sorosan-contract.ts:122

___

### contractId

▸ **contractId**(): `string`

#### Returns

`string`

#### Inherited from

Contract.contractId

#### Defined in

node_modules/@stellar/stellar-base/types/index.d.ts:31

___

### convertStorage

▸ `Private` **convertStorage**(`storage`): readonly `StorageElement`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `storage` | readonly `ScMapEntry`[] |

#### Returns

readonly `StorageElement`[]

#### Defined in

src/sdk/classes/sorosan-contract.ts:227

___

### getFootprint

▸ **getFootprint**(): `LedgerKey`

#### Returns

`LedgerKey`

#### Inherited from

Contract.getFootprint

#### Defined in

node_modules/@stellar/stellar-base/types/index.d.ts:33

___

### specs

▸ **specs**(`server`): `Promise`<`ScSpecEntry`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `Server` |

#### Returns

`Promise`<`ScSpecEntry`[]\>

#### Defined in

src/sdk/classes/sorosan-contract.ts:178

___

### storage

▸ **storage**(`server`): `Promise`<readonly `StorageElement`[]\>

Retrieves the storage elements associated with the contract from the Soroban RPC server.

This method fetches the storage elements associated with the contract from the Soroban RPC server
using the provided server instance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `server` | `Server` | The Soroban RPC server instance from which to fetch the storage elements. |

#### Returns

`Promise`<readonly `StorageElement`[]\>

- A promise that resolves to an array of storage elements associated with the contract.

**`Example`**

```ts
const server: SorobanRpc.Server;
const contract: string;
const storageElements = await contract.storage(server);
console.log('Storage elements:', storageElements);
```

#### Defined in

src/sdk/classes/sorosan-contract.ts:94

___

### toString

▸ **toString**(): `string`

#### Returns

`string`

#### Inherited from

Contract.toString

#### Defined in

node_modules/@stellar/stellar-base/types/index.d.ts:35

___

### wasmCodeLedgerSeq

▸ **wasmCodeLedgerSeq**(`server`): `Promise`<`number`\>

Retrieves the last modified ledger sequence number associated with the contract code from the Soroban RPC server.

This method fetches the last modified ledger sequence number associated with the contract code from the Soroban RPC server
using the provided server instance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `server` | `Server` | The Soroban RPC server instance from which to fetch the last modified ledger sequence number. |

#### Returns

`Promise`<`number`\>

- A promise that resolves to the last modified ledger sequence number associated with the contract code.

**`Example`**

```ts
const server: SorobanRpc.Server;
const contract: string;
const ledgerSeq = await contract.wasmCodeLedgerSeq(server);
console.log(`Last modified ledger sequence number: ${ledgerSeq}`);
```

#### Defined in

src/sdk/classes/sorosan-contract.ts:160

___

### wasmId

▸ **wasmId**(`server`): `Promise`<`Buffer`\>

Retrieves the WebAssembly (Wasm) ID of the contract from the Soroban RPC server.

This method fetches the Wasm ID of the contract from the Soroban RPC server
using the provided server instance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `server` | `Server` | The Soroban RPC server instance from which to fetch the Wasm ID. |

#### Returns

`Promise`<`Buffer`\>

- A promise that resolves to the Wasm ID of the contract.

**`Example`**

```ts
const server: SorobanRpc.Server;
const contractAddress: string;
const contract = new SorosanContract(contractAddress);
const wasmId = await contract.wasmId(server);
console.log(`Wasm ID: ${wasmId.toString('hex')}`);
```

#### Defined in

src/sdk/classes/sorosan-contract.ts:41

___

### wasmIdLedgerSeq

▸ **wasmIdLedgerSeq**(`server`): `Promise`<`number`\>

Retrieves the last modified ledger sequence number associated with the WebAssembly (Wasm) ID of the contract from the Soroban RPC server.

This method fetches the last modified ledger sequence number associated with the Wasm ID of the contract from the Soroban RPC server
using the provided server instance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `server` | `Server` | The Soroban RPC server instance from which to fetch the last modified ledger sequence number. |

#### Returns

`Promise`<`number`\>

- A promise that resolves to the last modified ledger sequence number associated with the Wasm ID of the contract.

**`Example`**

```ts
const server: SorobanRpc.Server;
const contract: string;
const ledgerSeq = await contract.wasmIdLedgerSeq(server);
console.log(`Last modified ledger sequence number: ${ledgerSeq}`);
```

#### Defined in

src/sdk/classes/sorosan-contract.ts:70
