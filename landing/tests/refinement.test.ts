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
