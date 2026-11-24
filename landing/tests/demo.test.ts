import { describe, expect, test } from "bun:test";
import { calculateFill, documents, formatDate, getCountdown, initialFuel, maintenance, validateOdometer } from "../src/demo";
import { LAUNCH_TARGET_ISO, WAITLIST_EMBED_URL } from "../src/config";

describe("countdown to 1 January 2027 00:00 IST", () => {
  test("target is midnight IST (18:30 UTC on 31 Dec 2026)", () => {
    expect(new Date(LAUNCH_TARGET_ISO).toISOString()).toBe("2026-12-31T18:30:00.000Z");
  });
  test("exact days/hours/minutes/seconds before launch", () => {
    const t = Date.parse(LAUNCH_TARGET_ISO) - (2 * 86400 + 3 * 3600 + 4 * 60 + 5) * 1000;
    expect(getCountdown(LAUNCH_TARGET_ISO, t)).toEqual({ launched: false, days: 2, hours: 3, minutes: 4, seconds: 5 });
  });
  test("launched at and after target, never negative", () => {
    const t = Date.parse(LAUNCH_TARGET_ISO);
    expect(getCountdown(LAUNCH_TARGET_ISO, t).launched).toBe(true);
    expect(getCountdown(LAUNCH_TARGET_ISO, t + 60_000)).toEqual({ launched: true, days: 0, hours: 0, minutes: 0, seconds: 0 });
  });
});

describe("fuel", () => {
  test("350 km on 10 L = 35 km/L; ₹1,050 for 10 L = ₹105/L", () => {
    expect(calculateFill(8450, 8800, 10, 1050)).toEqual({ mileage: 35, pricePerLitre: 105 });
  });
  test("no previous reading → no mileage invented", () => {
    expect(calculateFill(null, 8450, 10, 1050)).toEqual({ mileage: null, pricePerLitre: 105 });
  });
  test("odometer must advance", () => {
    const last = initialFuel[0];
    if (!last) throw new Error("missing");
    expect(calculateFill(last.odometer, last.odometer, 10, 1050)).toBeNull();
  });
  test("litres and amount must be positive", () => {
    expect(calculateFill(1, 2, 0, 100)).toBeNull();
    expect(calculateFill(1, 2, 5, -1)).toBeNull();
  });
});

describe("odometer", () => {
  test("rejects backwards reading", () => expect(validateOdometer(8450, 8400)).not.toBeNull());
  test("accepts forward reading", () => expect(validateOdometer(8450, 8600)).toBeNull());
});

test("dates are DD/MM/YYYY in IST", () => {
  expect(formatDate(new Date("2026-12-31T19:00:00Z"))).toBe("01/01/2027");
});

test("garage has the five maintenance tasks and four documents", () => {
  expect(maintenance.map(m => m.id)).toEqual(["chain-clean", "chain-lube", "oil", "tyres", "air-filter"]);
  expect(documents.map(d => d.id)).toEqual(["insurance", "rc", "puc", "warranty"]);
});

test("waitlist still points at the existing Google Form", () => {
  expect(WAITLIST_EMBED_URL).toContain("1FAIpQLScD9SsuMJ3NJ2FbYF3yUyVoVeVofAM_Xq2BfzHPckXIhr3M2w");
});
