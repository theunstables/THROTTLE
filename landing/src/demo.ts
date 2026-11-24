export type CountdownState = {
  launched: boolean;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export function getCountdown(targetIso: string, nowMs: number): CountdownState {
  const targetMs = Date.parse(targetIso);
  const diff = Math.max(0, targetMs - nowMs);
  if (diff === 0) {
    return { launched: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { launched: false, days, hours, minutes, seconds };
}

export type FuelEntry = { odometer: number; litres: number; price: number; date: string; mileage: number | null };
export const initialFuel: FuelEntry[] = [
  { odometer: 8450, litres: 10, price: 105, date: "18 Nov", mileage: 35 },
  { odometer: 8100, litres: 10, price: 104, date: "08 Nov", mileage: null },
];
export function calculateFill(previous: number | null, odometer: number, litres: number, price: number) {
  if (![odometer, litres, price].every(Number.isFinite) || odometer < 0 || litres <= 0 || price <= 0) return null;
  if (previous !== null && (!Number.isFinite(previous) || odometer <= previous)) return null;
  return { mileage: previous === null ? null : (odometer - previous) / litres, expense: litres * price };
}
export const maintenance = [
  { id: "chain-clean", name: "Chain cleaning", due: "Due at 8,500 km" },
  { id: "oil", name: "Engine oil change", due: "Due at 9,000 km" },
  { id: "chain-lube", name: "Chain lubrication", due: "Every 500 km · 8,500 km" },
  { id: "tyres", name: "Tyre pressure check", due: "Before weekend ride" },
];
export const serviceHistory = [
  { date: "12 Sep 2026", title: "Routine 7,500 km service", detail: "Engine oil, oil filter & full inspection", cost: 2400 },
  { date: "03 Aug 2026", title: "Rear puncture & tube", detail: "6,900 km · New rear tube fitted", cost: 450 },
  { date: "08 Jun 2026", title: "Chain & brake care", detail: "6,000 km · Chain tensioned, pads checked", cost: 350 },
];
export const documents = [
  { id: "insurance", name: "Comprehensive Insurance", expiry: "Valid until 14 Jan 2027", status: "Active" as const },
  { id: "rc", name: "Registration Certificate (RC)", expiry: "Valid until 15 Jan 2039", status: "Active" as const },
  { id: "puc", name: "Pollution Under Control (PUC)", expiry: "Renew by 18 Dec 2026", status: "Due soon" as const },
];
export const upcomingRides = [
  { id: "nandi", title: "Nandi Hills Dawn Run", date: "Sun, 06 Dec · 05:30 IST", meet: "Hebbal Flyover Shell Pump", distance: "125 km round trip" },
  { id: "lavasa", title: "Tamhini Ghat Coffee Ride", date: "Sat, 12 Dec · 06:00 IST", meet: "Chandni Chowk Bypass", distance: "140 km round trip" },
];
export const communities = [
  { id: "touring", name: "Highway Touring India", category: "Touring", members: "Sample group · Long-distance routes" },
  { id: "weekend", name: "Sunday Morning Breakers", category: "Weekend", members: "Sample group · Short dawn rides" },
  { id: "diy", name: "Home Garage & Wrenching", category: "Maintenance", members: "Sample group · Chain & oil care" },
];
export const rupees = (amount: number) => `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
