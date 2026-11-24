import { describe, expect, test } from "bun:test";
import { calculateFill, documents, getCountdown, initialFuel, maintenance } from "../src/demo";
import { LAUNCH_TARGET_ISO } from "../src/config";

describe("launch countdown to 1 January 2027 00:00 IST", () => {
  test("computes exact days, hours, minutes and seconds before launch", () => {
    const oneDayAndChangeBefore = Date.parse(LAUNCH_TARGET_ISO) - ((2 * 86400 + 3 * 3600 + 4 * 60 + 5) * 1000);
    expect(getCountdown(LAUNCH_TARGET_ISO, oneDayAndChangeBefore)).toEqual({
      launched: false,
      days: 2,
      hours: 3,
      minutes: 4,
      seconds: 5,
    });
  });
  test("switches to launched state at and after the target timestamp without negative numbers", () => {
    const exact = Date.parse(LAUNCH_TARGET_ISO);
    expect(getCountdown(LAUNCH_TARGET_ISO, exact)).toEqual({ launched: true, days: 0, hours: 0, minutes: 0, seconds: 0 });
    expect(getCountdown(LAUNCH_TARGET_ISO, exact + 60_000)).toEqual({ launched: true, days: 0, hours: 0, minutes: 0, seconds: 0 });
  });
});

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

test("bike garage includes maintenance tasks and key documents", () => {
  expect(maintenance.map(item => item.id)).toEqual(["chain-clean", "oil", "chain-lube", "tyres"]);
  expect(documents.map(doc => doc.id)).toEqual(["insurance", "rc", "puc"]);
});