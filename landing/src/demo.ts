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
  { id: "oil", name: "Engine oil", due: "Replace at 9,000 km" },
  { id: "chain", name: "Chain cleaning & lubrication", due: "Check at 8,500 km" },
  { id: "brakes", name: "Brake inspection", due: "Inspect at 9,000 km" },
  { id: "tyres", name: "Tyre condition", due: "Inspect at 8,500 km" },
  { id: "service", name: "General servicing", due: "Service at 9,000 km" },
];
export const centres = [
  { name: "Demo Workshop A", distance: "1.2 km", services: "General servicing · Engine oil", pin: "pin-one" },
  { name: "Demo Workshop B", distance: "2.4 km", services: "Chain care · Brake inspection", pin: "pin-two" },
  { name: "Demo Workshop C", distance: "3.1 km", services: "Tyres · Repairs", pin: "pin-three" },
];
export const records = [
  { date: "12 Sep 2026", title: "Routine service", detail: "7,500 km · Oil, filter & general inspection", cost: 2400, category: "Service" },
  { date: "03 Aug 2026", title: "Rear puncture repaired", detail: "6,900 km · Tube replacement", cost: 450, category: "Repair" },
  { date: "08 Jun 2026", title: "Chain care", detail: "6,000 km · Cleaned, adjusted & lubricated", cost: 250, category: "Service" },
  { date: "15 Jan 2024", title: "A new chapter", detail: "Royal Enfield Classic 350 · First owner", cost: 0, category: "Ownership" },
];
export const rupees = (amount: number) => `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
