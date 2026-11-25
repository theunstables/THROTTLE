import { describe, expect, test } from "bun:test";
import { garageSectionOrder, validateOdometer } from "../src/demo";
import { waitlistBody, feedbackPrefill, waitlistPrefill, waitlistError, consentText } from "../src/formIntegration";
import { validateReadingDate } from "../src/OdometerPreview";

const v = { email: "test@example.com", city: "Pune", age: "30", feedback: "", consent: false };
test("exactly four garage sections, odometer first", () => expect(garageSectionOrder).toEqual(["odometer", "maintenance", "servicing", "documents"]));
test("reading cannot be lower than previous", () => expect(validateOdometer(8450,8400)).not.toBeNull());
test("forward reading valid", () => expect(validateOdometer(8450,8600)).toBeNull());
test("fractional odometer rejected", () => expect(validateOdometer(8450,8600.5)).not.toBeNull());
test("dates cannot precede last reading", () => expect(validateReadingDate("2026-11-17","2026-11-18","2026-11-24")).not.toBeNull());
test("valid reading date accepted", () => expect(validateReadingDate("2026-11-24","2026-11-18","2026-11-24")).toBeNull());
describe("existing Google destination and field requirements", () => {
 test("waitlist fields map to inspected Google entry IDs", () => { const u=new URL(waitlistPrefill(v));expect(u.pathname).toBe("/forms/d/e/1FAIpQLScD9SsuMJ3NJ2FbYF3yUyVoVeVofAM_Xq2BfzHPckXIhr3M2w/viewform");expect(u.searchParams.get("emailAddress")).toBe("test@example.com");expect(u.searchParams.get("entry.2127194441")).toBe("Pune");expect(u.searchParams.get("entry.170455927")).toBe("30"); });
 test("email is required", () => expect(waitlistError({...v,email:""})).not.toBeNull());
 test("age is required", () => expect(waitlistError({...v,age:""})).not.toBeNull());
 test("consent optional, only populated when chosen", () => {expect(new URL(waitlistPrefill(v)).searchParams.has("entry.1549883233")).toBe(false);expect(new URL(waitlistPrefill({...v,consent:true})).searchParams.get("entry.1549883233")).toBe(consentText);});
 test("feedback does not copy waitlist age or email", () => {const u=new URL(feedbackPrefill("Trip planning","","","reply@example.com"));expect(u.searchParams.get("entry.1393558069")).toContain("Reply email: reply@example.com");expect(u.searchParams.has("entry.170455927")).toBe(false);expect(u.searchParams.has("emailAddress")).toBe(false);});
 test("blank feedback not accepted", () => expect(()=>feedbackPrefill("","","","")).toThrow());
});

test("waitlist sends answers directly to the Google form fields", () => { const b=waitlistBody(v);expect(b.get("emailAddress")).toBe("test@example.com");expect(b.get("entry.170455927")).toBe("30");expect(b.get("entry.2127194441")).toBe("Pune"); });
test("waitlist direct send rejects missing age", () => { expect(()=>waitlistBody({...v,age:""})).toThrow(); });

import { joinBody, joinError } from "../src/formIntegration";
import { findStations } from "../src/demo";
const j = { name: "Asha", email: "asha@example.com", city: "Pune", age: "29", bike: "Yamaha MT-07", features: "Ride planning", problem: "", suggestions: "", consent: false };
describe("unified early-access form", () => {
  test("sends email, city and age to their existing Google fields", () => { const b = joinBody(j); expect(b.get("emailAddress")).toBe("asha@example.com"); expect(b.get("entry.2127194441")).toBe("Pune"); expect(b.get("entry.170455927")).toBe("29"); });
  test("name, motorcycle and ideas go into the existing Feedback field", () => { expect(joinBody(j).get("entry.1393558069")).toBe("Name: Asha\nMotorcycle: Yamaha MT-07\nFeatures wanted: Ride planning"); });
  test("ideas are optional", () => expect(joinError({ ...j, features: "", bike: "", name: "" })).toBeNull());
  test("age stays required", () => expect(joinError({ ...j, age: "" })).not.toBeNull());
  test("email stays required", () => expect(joinError({ ...j, email: "" })).not.toBeNull());
  test("giving feedback does not opt in to updates", () => expect(joinBody(j).has("entry.1549883233")).toBe(false));
});
test("fuel stations sort cheapest first for chosen fuel", () => expect(findStations("", "petrol").map(s => s.id)).toEqual(["s3", "s1", "s2"]));
test("station search filters by area", () => expect(findStations("hosur", "premium").map(s => s.id)).toEqual(["s2"]));
