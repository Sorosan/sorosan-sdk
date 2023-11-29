import { describe, it, expect, vi } from 'vitest';
import { ContractSDK } from '../../sdk';
import { DEFAULT_NETWORK } from '../../lib/network';
import * as fs from 'fs';
import { TEST_PUBLIC_KEY, TEST_TOKEN_CONTRACT, TEST_TOKEN_WASMID } from './utils';

describe("contract-sdk", () => {
  it("should throw an error with 'Missing WebAssembly' message if wasm is not provided",
    async () => {
      const sdk = new ContractSDK(DEFAULT_NETWORK, TEST_PUBLIC_KEY);

      await expect(sdk.deployWasm(null, TEST_PUBLIC_KEY))
        .rejects
        .toThrow(/Missing WebAssembly/);
    });

  it("should throw an error message if public key is empty",
    async () => {
      const sdk = new ContractSDK(DEFAULT_NETWORK, TEST_PUBLIC_KEY);
      const wasmBuffer = fs.readFileSync("asset/soroban_token_contract.wasm");
      const wasmBlob = new Blob([wasmBuffer]);

      await expect(sdk.deployWasm(wasmBlob, ""))
        .rejects
        .toThrow(/Missing public key/);
    });

  it("should throw an error message if wasm is not of the correct type",
    async () => {
      const sdk = new ContractSDK(DEFAULT_NETWORK, TEST_PUBLIC_KEY);
      const wasmBuffer = fs.readFileSync("asset/soroban_token_contract.wasm");
      const wasmBlob = new Blob([wasmBuffer], { type: "application/json" });

      await expect(sdk.deployWasm(wasmBlob, TEST_PUBLIC_KEY))
        .rejects
        .toThrow(/Expected \'application\/wasm\'/);
    });

  it("should return wasmId when contract data is fetched successfully",
    async () => {
      const sdk = new ContractSDK(DEFAULT_NETWORK, TEST_PUBLIC_KEY);
      const expectedWasmId = TEST_TOKEN_WASMID;

      const data = await sdk.getContractData(TEST_TOKEN_CONTRACT);
      const actualWasmId = data.wasmId.toString("hex");

      expect(actualWasmId).toEqual(expectedWasmId);
    });

  it("should return contract code and ledger number when contract code is fetched successfully",
    async () => {
      const sdk = new ContractSDK(DEFAULT_NETWORK, TEST_PUBLIC_KEY);
      const data = await sdk.getContractData(TEST_TOKEN_CONTRACT);
      const actualCode = await sdk.getContractCode(data.wasmId);

      expect(actualCode).not.toBeNull();
      expect(actualCode.wasmCode).not.toBeNull();
      expect(actualCode.wasmCodeLedger).not.toBeNull();
    });

  it("should return ABI methods when contract ABI is fetched successfully",
    async () => {
      const sdk = new ContractSDK(DEFAULT_NETWORK, TEST_PUBLIC_KEY);

      const abi = await sdk.getContractABI(TEST_TOKEN_CONTRACT);
      const initializeMethodExist = abi.find(method => method.name === "initialize");
      const balanceMethodExist = abi.find(method => method.name === "balance");
      const mintMethodExist = abi.find(method => method.name === "mint");
      const symbolMethodExist = abi.find(method => method.name === "symbol");
      const nameMethodExist = abi.find(method => method.name === "name");

      expect(initializeMethodExist).toBeTruthy();
      expect(balanceMethodExist).toBeTruthy();
      expect(mintMethodExist).toBeTruthy();
      expect(symbolMethodExist).toBeTruthy();
      expect(nameMethodExist).toBeTruthy();
    }, 10000);

    it("should return decompile and return contract specs from valid contract successfully",
    async () => {
      const sdk = new ContractSDK(DEFAULT_NETWORK, TEST_PUBLIC_KEY);

      const specs = await sdk.decompile(TEST_TOKEN_CONTRACT);
      const expectedToHaveFunctions = specs.some(method => method.switch().name === "scSpecEntryFunctionV0");

      expect(specs).not.toBeNull();
      expect(specs.length > 0).toBeTruthy();
      expect(expectedToHaveFunctions).toBeTruthy();
    }, 10000);
});