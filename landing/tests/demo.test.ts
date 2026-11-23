import { describe, expect, test } from "bun:test";
import { calculateFill, initialFuel, maintenance, centres } from "../src/demo";

describe("local full-to-full fuel preview", () => {
  test("260 km with 10 litres gives 26 km/L and ₹1,050 at ₹105/L", () => {
    expect(calculateFill(12450, 12710, 10, 105)).toEqual({ mileage: 26, expense: 1050 });
  });
  test("first full tank records expenditure without inventing mileage", () => {
    expect(calculateFill(null, 8450, 10, 105)).toEqual({ mileage: null, expense: 1050 });
  });
  test("Indian sample motorcycle: 350 km and 10 litres gives 35 km/l", () => {
    expect(calculateFill(8450, 8800, 10, 105)).toEqual({ mileage: 35, expense: 1050 });
  });
  test("a fill must advance the last recorded odometer", () => {
    const last = initialFuel[0];
    if (!last) throw new Error("Missing demo fill");
    expect(calculateFill(last.odometer, last.odometer, 10, 105)).toBeNull();
    expect(calculateFill(last.odometer, last.odometer - 1, 10, 105)).toBeNull();
  });
  test("litres and price must be positive finite numbers", () => {
    expect(calculateFill(12450, 12710, 0, 105)).toBeNull();
    expect(calculateFill(12450, 12710, 10, -1)).toBeNull();
    expect(calculateFill(12450, 12710, NaN, 105)).toBeNull();
  });
});

test("bike care includes all five requested motorcycle checks", () => {
  expect(maintenance.map(item => item.id)).toEqual(["oil", "chain", "brakes", "tyres", "service"]);
});
test("service discovery uses illustrative locations and no ratings", () => {
  expect(centres.map(item => item.name)).toEqual(["Demo Workshop A", "Demo Workshop B", "Demo Workshop C"]);
  expect(centres.some(item => "rating" in item)).toBe(false);
});