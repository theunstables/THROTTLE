import { describe, expect, test } from "bun:test";
import { calculateFill, initialFuel } from "../src/demo";

describe("local full-to-full fuel preview", () => {
  test("260 km with 10 litres gives 26 km/L and ₹1,050 at ₹105/L", () => {
    expect(calculateFill(12450, 12710, 10, 105)).toEqual({ mileage: 26, expense: 1050 });
  });
  test("a fill must advance the last recorded odometer", () => {
    const last = initialFuel[0];
    if (!last) throw new Error("Missing demo fill");
    expect(calculateFill(last.odometer, last.odometer, 10, 105)).toBeNull();
    expect(calculateFill(last.odometer, 12000, 10, 105)).toBeNull();
  });
  test("litres and price must be positive finite numbers", () => {
    expect(calculateFill(12450, 12710, 0, 105)).toBeNull();
    expect(calculateFill(12450, 12710, 10, -1)).toBeNull();
    expect(calculateFill(12450, 12710, NaN, 105)).toBeNull();
  });
});