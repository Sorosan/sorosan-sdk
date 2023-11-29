import { describe, it, expect, vi } from 'vitest';
import { SorosanSDK, UtilSDK } from '../../sdk';
import { DEFAULT_NETWORK } from '../../lib/network';
import { TEST_PUBLIC_KEY, TEST_TOKEN_CONTRACT } from './utils';
import { xdr } from 'stellar-sdk';

describe("sorosan-sdk", () => {
  it("should return valid non zero gas amount", async () => {
    const sdk = new SorosanSDK(DEFAULT_NETWORK, TEST_PUBLIC_KEY);
    const args = [
      sdk.nativeToScVal(TEST_PUBLIC_KEY, "address"),
      sdk.nativeToScVal(100, "i128"),
    ];
    const expectedGas = 0;  // This can vary so we check if its non zero

    const gas = await sdk.estimateGas(TEST_TOKEN_CONTRACT, "mint", args);
    const actualGas = parseInt(gas);

    expect(actualGas).not.toBeNull();
    expect(actualGas).greaterThan(expectedGas);
  });

  it("should throw invalid contract if provide invalid contract", async () => {
    const sdk = new SorosanSDK(DEFAULT_NETWORK, TEST_PUBLIC_KEY);
    const args = [];

    const fx = async () => await sdk.estimateGas("", "mint", args);

    expect(fx).rejects.toThrowError("Invalid contract ID");
  });

  it("should throw error if provide invalid contract details", async () => {
    const sdk = new SorosanSDK(DEFAULT_NETWORK, TEST_PUBLIC_KEY);
    const args = [];

    const fx = async () => await sdk.estimateGas(TEST_TOKEN_CONTRACT, "mint", args);

    expect(fx).rejects.toThrowError();
  });

  it("should return value from valid contract call", async () => {
    const sdk = new SorosanSDK(DEFAULT_NETWORK, TEST_PUBLIC_KEY);
    const args = [];
    const expectedTokenName = "Token A";

    const actualTokenName: string = await sdk.call(TEST_TOKEN_CONTRACT, "name", args);

    expect(actualTokenName).toEqual(expectedTokenName);
  });

  it("should return valid scvAddress of type address", async () => {
    const sdk = new SorosanSDK(DEFAULT_NETWORK, TEST_PUBLIC_KEY);
    const expectedName = xdr.ScValType.scvAddress().name;
    const expectedValue = xdr.ScValType.scvAddress().value;

    const value = sdk.nativeToScVal(TEST_PUBLIC_KEY, "address");
    const actualName = value.switch().name;
    const actualValue = value.switch().value;

    expect(actualName).toEqual(expectedName);
    expect(actualValue).toEqual(expectedValue);
  });

  it("should return valid scvString of no type", async () => {
    const sdk = new SorosanSDK(DEFAULT_NETWORK, TEST_PUBLIC_KEY);
    const expectedName = xdr.ScValType.scvString().name;
    const expectedValue = xdr.ScValType.scvString().value;

    const value = sdk.nativeToScVal(TEST_PUBLIC_KEY);
    const actualName = value.switch().name;
    const actualValue = value.switch().value;

    expect(actualName).toEqual(expectedName);
    expect(actualValue).toEqual(expectedValue);
  });

  it("should return scvBool of type boolean", async () => {
    const sdk = new SorosanSDK(DEFAULT_NETWORK, TEST_PUBLIC_KEY);
    const expectedName = xdr.ScValType.scvBool().name;
    const expectedValue = xdr.ScValType.scvBool().value;

    const value = sdk.nativeToScVal(true);
    const actualName = value.switch().name;
    const actualValue = value.switch().value;

    expect(actualName).toEqual(expectedName);
    expect(actualValue).toEqual(expectedValue);
  });

  it("should return scvI32 of type boolean", async () => {
    const sdk = new SorosanSDK(DEFAULT_NETWORK, TEST_PUBLIC_KEY);
    const expectedName = xdr.ScValType.scvI32().name;
    const expectedValue = xdr.ScValType.scvI32().value;

    const value = sdk.nativeToScVal(1, "bool");
    const actualName = value.switch().name;
    const actualValue = value.switch().value;

    expect(actualName).toEqual(expectedName);
    expect(actualValue).toEqual(expectedValue);
  });

  it("should return scvString if type is bool", async () => {
    const sdk = new SorosanSDK(DEFAULT_NETWORK, TEST_PUBLIC_KEY);
    const expectedName = xdr.ScValType.scvString().name;
    const expectedValue = xdr.ScValType.scvString().value;

    const value = sdk.nativeToScVal("true", "bool");
    const actualName = value.switch().name;
    const actualValue = value.switch().value;

    expect(actualName).toEqual(expectedName);
    expect(actualValue).toEqual(expectedValue);
  });

  it("should return scvString of type boolean", async () => {
    const sdk = new SorosanSDK(DEFAULT_NETWORK, TEST_PUBLIC_KEY);
    const expectedName = xdr.ScValType.scvAddress().name;
    const expectedValue = xdr.ScValType.scvAddress().value;

    const value = sdk.nativeToScVal(TEST_PUBLIC_KEY, "address");
    const actualName = value.switch().name;
    const actualValue = value.switch().value;

    expect(actualName).toEqual(expectedName);
    expect(actualValue).toEqual(expectedValue);
  });

  it("should return scvI32 of type number", async () => {
    const sdk = new SorosanSDK(DEFAULT_NETWORK, TEST_PUBLIC_KEY);
    const expectedName = xdr.ScValType.scvI32().name;
    const expectedValue = xdr.ScValType.scvI32().value;

    const value = sdk.nativeToScVal(12);
    const actualName = value.switch().name;
    const actualValue = value.switch().value;

    expect(actualName).toEqual(expectedName);
    expect(actualValue).toEqual(expectedValue);
  });

  it("should return scvI64 of type scvI64", async () => {
    const sdk = new SorosanSDK(DEFAULT_NETWORK, TEST_PUBLIC_KEY);
    const expectedName = xdr.ScValType.scvI64().name;
    const expectedValue = xdr.ScValType.scvI64().value;

    const value = sdk.nativeToScVal(12, "scvI64");
    const actualName = value.switch().name;
    const actualValue = value.switch().value;

    expect(actualName).toEqual(expectedName);
    expect(actualValue).toEqual(expectedValue);
  });

  it("should return scvI64 of type i64", async () => {
    const sdk = new SorosanSDK(DEFAULT_NETWORK, TEST_PUBLIC_KEY);
    const expectedName = xdr.ScValType.scvI64().name;
    const expectedValue = xdr.ScValType.scvI64().value;

    const value = sdk.nativeToScVal(12, "i64");
    const actualName = value.switch().name;
    const actualValue = value.switch().value;

    expect(actualName).toEqual(expectedName);
    expect(actualValue).toEqual(expectedValue);
  });

})