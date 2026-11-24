export type CountdownState = { launched: boolean; days: number; hours: number; minutes: number; seconds: number };

export function getCountdown(targetIso: string, nowMs: number): CountdownState {
  const diff = Math.max(0, Date.parse(targetIso) - nowMs);
  if (diff === 0) return { launched: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
  const t = Math.floor(diff / 1000);
  return { launched: false, days: Math.floor(t / 86400), hours: Math.floor((t % 86400) / 3600), minutes: Math.floor((t % 3600) / 60), seconds: t % 60 };
}

export const pad = (n: number) => String(n).padStart(2, "0");
export const rupees = (amount: number) => `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

/** Formats a Date as DD/MM/YYYY in India time. */
export function formatDate(d: Date): string {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", day: "2-digit", month: "2-digit", year: "numeric" }).formatToParts(d);
  const get = (t: string) => parts.find(p => p.type === t)?.value ?? "";
  return `${get("day")}/${get("month")}/${get("year")}`;
}

/* ---------- Fuel ---------- */
export type FuelEntry = { id: string; date: string; odometer: number; litres: number; amount: number; mileage: number | null };

export const initialFuel: FuelEntry[] = [
  { id: "f3", date: "18/11/2026", odometer: 8450, litres: 10, amount: 1050, mileage: 35 },
  { id: "f2", date: "08/11/2026", odometer: 8100, litres: 9.5, amount: 988, mileage: 34.7 },
  { id: "f1", date: "27/10/2026", odometer: 7770, litres: 10, amount: 1040, mileage: null },
];

/** Full-to-full calc. Mileage only when a previous reading exists. Price derived from total ÷ litres. */
export function calculateFill(previous: number | null, odometer: number, litres: number, amount: number) {
  if (![odometer, litres, amount].every(Number.isFinite) || odometer < 0 || litres <= 0 || amount <= 0) return null;
  if (previous !== null && (!Number.isFinite(previous) || odometer <= previous)) return null;
  return {
    mileage: previous === null ? null : Math.round(((odometer - previous) / litres) * 10) / 10,
    pricePerLitre: Math.round((amount / litres) * 100) / 100,
  };
}

export const fuelStations = [
  { id: "s1", name: "Sample Fuel Stop A", area: "Outer Ring Road", x: 28, y: 34, price: 102.9 },
  { id: "s2", name: "Sample Fuel Stop B", area: "Hosur Road", x: 64, y: 58, price: 103.4 },
  { id: "s3", name: "Sample Fuel Stop C", area: "Old Airport Road", x: 46, y: 76, price: 102.6 },
];

/* ---------- Garage ---------- */
export const maintenance = [
  { id: "chain-clean", name: "Chain cleaning", schedule: "Every 500 km", due: "Due at 8,500 km", soon: true },
  { id: "chain-lube", name: "Chain lubrication", schedule: "Every 500 km", due: "Due at 8,500 km", soon: true },
  { id: "oil", name: "Engine oil change", schedule: "Every 5,000 km", due: "Due at 10,000 km", soon: false },
  { id: "tyres", name: "Tyre pressure check", schedule: "Every 14 days", due: "Due 28/11/2026", soon: true },
  { id: "air-filter", name: "Air filter inspection", schedule: "Every 3,000 km", due: "Due at 9,000 km", soon: false },
];
export const completedMaintenance = [
  { name: "Brake fluid top-up", date: "02/11/2026" },
  { name: "Chain cleaning", date: "21/10/2026" },
];

export const serviceHistory = [
  { id: "sv3", date: "12/09/2026", title: "Routine 7,500 km service", workshop: "Sample Workshop · Indiranagar", work: "Engine oil and filter change, full inspection, chain adjustment", parts: ["Engine oil 2.5 L", "Oil filter"], cost: 2400, next: "Next service at 12,500 km" },
  { id: "sv2", date: "03/08/2026", title: "Rear puncture repair", workshop: "Sample Tyre Point · HSR Layout", work: "Rear tube replaced, wheel balanced", parts: ["Rear tube"], cost: 450, next: null },
  { id: "sv1", date: "08/06/2026", title: "Chain & brake care", workshop: "Sample Workshop · Indiranagar", work: "Chain tensioned, front brake pads replaced", parts: ["Front brake pads"], cost: 1350, next: null },
];

export const documents = [
  { id: "insurance", name: "Insurance", detail: "Comprehensive policy", expiry: "14/01/2027", status: "Valid" as const },
  { id: "rc", name: "Registration Certificate", detail: "RC · KA 01 XX 0000", expiry: "15/01/2039", status: "Valid" as const },
  { id: "puc", name: "PUC Certificate", detail: "Pollution Under Control", expiry: "18/12/2026", status: "Expiring soon" as const },
  { id: "warranty", name: "Warranty card", detail: "Manufacturer warranty", expiry: "20/01/2027", status: "Valid" as const },
];

export const initialOdometer = [
  { reading: 8450, date: "18/11/2026" },
  { reading: 8100, date: "08/11/2026" },
  { reading: 7770, date: "27/10/2026" },
  { reading: 7320, date: "12/10/2026" },
];

/** Returns an error message, or null when the new reading is acceptable. */
export function validateOdometer(last: number, next: number): string | null {
  if (!Number.isSafeInteger(next) || next <= 0 || next > 9999999) return "Enter a valid reading in km.";
  if (next < last) return `Reading can't go backwards. Last was ${last.toLocaleString("en-IN")} km.`;
  if (next === last) return "That's the same as the last reading.";
  return null;
}

/* ---------- Community ---------- */
export const posts = [
  { id: "p1", author: "Sample rider · Arjun", bike: "Classic 350", place: "Weekend cafe stop", text: "The best part of a weekend ride? Parking up, taking in the view and talking motorcycles.", likes: 42, comments: ["Sample: That fog is unreal!", "Sample: Joining next Sunday."] },
  { id: "p2", author: "Sample rider · Meera", bike: "Himalayan 450", place: "Spiti Valley", text: "Day 4 — Kaza to Langza. Thin air, wide smiles.", likes: 87, comments: ["Sample: Bucket list route."] },
];
export const upcomingRides = [
  { id: "nandi", title: "Nandi Hills Dawn Run", date: "06/12/2026 · 05:30", meet: "Sample meeting point · Hebbal", distance: "125 km round trip", text: "Easy-paced climb, breakfast at the top, back by 10." },
  { id: "tamhini", title: "Tamhini Ghat Coffee Ride", date: "12/12/2026 · 06:00", meet: "Sample meeting point · Chandni Chowk, Pune", distance: "140 km round trip", text: "Twisties through the ghat, coffee stop at Mulshi." },
];
export const communities = [
  { id: "weekend", name: "Weekend Riders", category: "Weekend rides", about: "Early starts, coffee stops and short escapes from the city." },
  { id: "touring", name: "Touring Collective", category: "Touring", about: "Long-distance routes, packing lists and stories from the road." },
  { id: "adventure", name: "Adventure Riders", category: "Adventure", about: "Trail techniques, mountain routes and getting off the beaten path." },
  { id: "enfield", name: "Royal Enfield Riders", category: "Classic motorcycles", about: "Owner tips and classic motorcycle journeys. Unofficial demo." },
  { id: "sports", name: "Sports Bike Community", category: "Sport riding", about: "Track preparation, safety and performance-minded conversations." },
  { id: "photo", name: "Motorcycle Photography", category: "Photography", about: "Chasing good light and sharing motorcycles through a lens." },
];
export const people = [
  { id: "r1", name: "Sample · Kabir", bike: "Interceptor 650", location: "Bengaluru", interests: ["Touring", "Photography"], bio: "Fictional weekend explorer with a camera in the tank bag." },
  { id: "r2", name: "Sample · Ananya", bike: "Duke 390", location: "Pune", interests: ["Track days", "Weekend rides"], bio: "Fictional rider who loves learning better cornering technique." },
  { id: "r3", name: "Sample · Rohan", bike: "Classic 350", location: "Mysuru", interests: ["Home garage", "Coffee rides"], bio: "Fictional motorcycle tinkerer and breakfast-ride enthusiast." },
];

export const garageSectionOrder = ["odometer", "maintenance", "servicing", "documents"] as const;
