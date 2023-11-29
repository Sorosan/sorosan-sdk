import { stroopToXlm, xlmToStroop } from "../unit";
import BigNumber from "bignumber.js";
import { describe, it, expect } from 'vitest';

// jest.mock("@shared/api/external");

describe("xlmToStroop", () => {
  it("should convert BigNumber value (1 xlm to 100000 stroops)", () => {
    const xlmAmount = BigNumber(1);
    const actualStroop = BigNumber(10000000).toNumber();

    const expectedStroop = xlmToStroop(xlmAmount).toNumber();

    expect(expectedStroop).toBe(actualStroop);
  });
  it("should convert string values (1 xlm to 100000 stroops)", () => {
    const xlmAmount = "1";
    const actualStroop = BigNumber(10000000).toNumber();

    const expectedStroop = xlmToStroop(xlmAmount).toNumber();

    expect(expectedStroop).toBe(actualStroop);
  });
  it("should convert 0 value (0 xlm to 0 stroops)", () => {
    const xlmAmount = "0";
    const actualStroop = BigNumber(0).toNumber();

    const expectedStroop = xlmToStroop(xlmAmount).toNumber();

    expect(expectedStroop).toBe(actualStroop);
  });
  it("should convert decimal value (1.5 xlm to 15000000 stroops)", () => {
    const xlmAmount = "1.5";
    const actualStroop = BigNumber(15000000).toNumber();

    const expectedStroop = xlmToStroop(xlmAmount).toNumber();

    expect(expectedStroop).toBe(actualStroop);
  });
  it("should throw negative error", () => {
    const xlmAmount = "-1.5";
    const actualTestError = "Invalid input: negative values are not allowed";

    const fx = () => xlmToStroop(xlmAmount);

    expect(fx).toThrowError(actualTestError);
  });
  it("should throw invalid error", () => {
    const xlmAmount = "ten";
    const actualTestError = "Invalid input: not a valid number";

    const fx = () => xlmToStroop(xlmAmount);

    expect(fx).toThrowError(actualTestError);
  });
});