import { describe, expect, test } from "bun:test";
import { findStations, garageSectionOrder, validateOdometer } from "../src/demo";
import { consentText, joinBody, joinError } from "../src/formIntegration";
import { validateReadingDate } from "../src/OdometerPreview";

const emailOnly = { email: "test@example.com", feedback: "", consent: false };

test("exactly four garage sections, odometer first", () => expect(garageSectionOrder).toEqual(["odometer", "maintenance", "servicing", "documents"]));
test("reading cannot be lower than previous", () => expect(validateOdometer(8450, 8400)).not.toBeNull());
test("forward reading valid", () => expect(validateOdometer(8450, 8600)).toBeNull());
test("fractional odometer rejected", () => expect(validateOdometer(8450, 8600.5)).not.toBeNull());
test("dates cannot precede last reading", () => expect(validateReadingDate("2026-11-17", "2026-11-18", "2026-11-24")).not.toBeNull());
test("valid reading date accepted", () => expect(validateReadingDate("2026-11-24", "2026-11-18", "2026-11-24")).toBeNull());

describe("simplified early-access form", () => {
  test("email is required", () => expect(joinError({ ...emailOnly, email: "" })).toBe("Enter your email address."));
  test("invalid email is rejected", () => expect(joinError({ ...emailOnly, email: "not-an-email" })).not.toBeNull());
  test("valid email only is accepted", () => expect(joinError(emailOnly)).toBeNull());
  test("email-only POST has no feedback answer or marketing consent", () => {
    const body = joinBody(emailOnly);
    expect(body.get("emailAddress")).toBe("test@example.com");
    expect(body.get("entry.1393558069")).toBe("");
    expect(body.has("entry.1549883233")).toBe(false);
  });
  test("feedback and consent map to their separate existing Google fields", () => {
    const body = joinBody({ email: " rider@example.com ", feedback: " Add ride planning ", consent: true });
    expect(body.get("emailAddress")).toBe("rider@example.com");
    expect(body.get("entry.1393558069")).toBe("Add ride planning");
    expect(body.get("entry.1549883233")).toBe(consentText);
  });
  test("feedback never opts the rider into updates", () => {
    expect(joinBody({ ...emailOnly, feedback: "Service reminders" }).has("entry.1549883233")).toBe(false);
  });
  test("feedback remains optional when consent is selected", () => {
    expect(joinError({ email: "test@example.com", feedback: "", consent: true })).toBeNull();
  });
  test("POST contains no removed personal or motorcycle fields", () => {
    const body = joinBody({ email: "test@example.com", feedback: "Ideas", consent: true });
    expect([...body.keys()].sort()).toEqual(["emailAddress", "entry.1393558069", "entry.1549883233"]);
  });
});

test("fuel stations sort cheapest first for chosen fuel", () => expect(findStations("", "petrol").map(station => station.id)).toEqual(["s3", "s1", "s2"]));
test("station search filters by area", () => expect(findStations("hosur", "premium").map(station => station.id)).toEqual(["s2"]));
