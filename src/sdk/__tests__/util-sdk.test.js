import { describe, it, expect, vi } from 'vitest';
import { UtilSDK } from '../../sdk';
import { DEFAULT_NETWORK } from '../../lib/network';
import { TEST_PUBLIC_KEY, TEST_TOKEN_CONTRACT } from './utils';
import { getContractHash, mask } from '../../lib/soroban';

describe("util-sdk", () => {
  it("should return the correct contract address when given a valid contract hash", async () => {
    const utilSDK = new UtilSDK(DEFAULT_NETWORK);

    const contractHash = getContractHash(TEST_TOKEN_CONTRACT);
    const expectedContractAddress = TEST_TOKEN_CONTRACT;

    const actualContractAddress = await utilSDK.toContractAddress(contractHash);

    expect(expectedContractAddress).toEqual(actualContractAddress);
  });

  it("should return the default contract address when given an empty contract has", async () => {
    const utilSDK = new UtilSDK(DEFAULT_NETWORK);
    const contractHash = "";
    const expectedContractAddress = "CAYRE";

    const actualContractAddress = await utilSDK.toContractAddress(contractHash);

    expect(expectedContractAddress).toEqual(actualContractAddress);
  });

  it("should return the correct contract hash when given a valid contract address", async () => {
    const utilSDK = new UtilSDK(DEFAULT_NETWORK);
    const contractAddress = "";
    const expectedContractHash = "";

    const actualContractHash = await utilSDK.toContractHash(contractAddress);

    expect(expectedContractHash).toEqual(actualContractHash);
  });

  it("should return the masked contract address when given a valid contract address", async () => {
    const utilSDK = new UtilSDK(DEFAULT_NETWORK);
    const contractAddress = TEST_TOKEN_CONTRACT;
    const expectedContractHash = getContractHash(TEST_TOKEN_CONTRACT);

    const actualContractHash = await utilSDK.toContractHash(contractAddress);

    expect(expectedContractHash).toEqual(actualContractHash);
  });

  it("should return the masked contract hash when given a valid contract hash", async () => {
    const utilSDK = new UtilSDK(DEFAULT_NETWORK);
    const contractAddress = TEST_TOKEN_CONTRACT;
    const expectedMask = mask(TEST_TOKEN_CONTRACT);

    const actualMask = await utilSDK.mask(contractAddress);

    expect(expectedMask).toEqual(actualMask);
  });

  it("should return the masked contract hash when given a valid contract hash", async () => {
    const utilSDK = new UtilSDK(DEFAULT_NETWORK);
    const contractHash = getContractHash(TEST_TOKEN_CONTRACT);
    const expectedMask = mask(contractHash);

    const actualMask = await utilSDK.mask(contractHash);

    expect(expectedMask).toEqual(actualMask);
  });

  it("should return the original input when given input length is < 10", async () => {
    const utilSDK = new UtilSDK(DEFAULT_NETWORK);
    const input = "123456";
    const expectedMask = "123456";

    const actualMask = await utilSDK.mask(input);

    expect(expectedMask).toEqual(actualMask);
  });

  it("should return an empty string when given an empty input", async () => {
    const utilSDK = new UtilSDK(DEFAULT_NETWORK);
    const input = "";
    const expectedMask = "";

    const actualMask = await utilSDK.mask(input);

    expect(expectedMask).toEqual(actualMask);
  });

  it("Should return true for a valid address", async () => {
    const sdk = new UtilSDK(DEFAULT_NETWORK, TEST_PUBLIC_KEY);
    const expectedValue = true;

    const actualValue = await sdk.isAddress(TEST_PUBLIC_KEY);

    expect(actualValue).toEqual(expectedValue);
  });

  it("Should return false for an invalid address", async () => {
    const sdk = new UtilSDK(DEFAULT_NETWORK, TEST_PUBLIC_KEY);
    const input = "GAYRE";
    const expectedValue = false;

    const actualValue = await sdk.isAddress(input);

    expect(actualValue).toEqual(expectedValue);
  });

  it("Should return true for a valid contract address", async () => {
    const sdk = new UtilSDK(DEFAULT_NETWORK, TEST_PUBLIC_KEY);
    const expectedValue = true;

    const actualValue = await sdk.isContractAddress(TEST_TOKEN_CONTRACT);

    expect(actualValue).toEqual(expectedValue);
  });

  it("Should return false for an invalid contract address", async () => {
    const sdk = new UtilSDK(DEFAULT_NETWORK, TEST_PUBLIC_KEY);
    const input = "CAYRE";
    const expectedValue = false;

    const actualValue = await sdk.isContractAddress(input);

    expect(actualValue).toEqual(expectedValue);
  });
});