export type Screen = "bike" | "fuel" | "maintenance" | "centres" | "community";

export const screens = [
  { id: "bike", label: "My Bike", kicker: "Your digital garage", title: "One bike. Every detail.", description: "The kilometres, the care, the records. A home for everything that makes your motorcycle yours.", facts: ["Motorcycle profile & odometer", "Service history in one place", "A clear view of what's due"] },
  { id: "fuel", label: "Fuel & Mileage", kicker: "Know your running costs", title: "Every fill tells a story.", description: "Turn petrol receipts into a clearer picture of your real-world mileage and monthly spending.", facts: ["Full-to-full mileage in km/L", "Fuel entries & expense history", "Monthly spending at a glance"] },
  { id: "maintenance", label: "Maintenance", kicker: "A little care goes a long way", title: "Less guesswork. More riding.", description: "Keep routine checks, next services and the money spent on maintenance together.", facts: ["Oil, chain, brakes & tyres", "Upcoming service reminders", "Completed work & costs"] },
  { id: "centres", label: "Service Centres", kicker: "An idea we're exploring", title: "Care, closer to home.", description: "A concept for discovering service options near your motorcycle. These locations and ratings are entirely fictional.", facts: ["Illustrative neighbourhood map", "Sample distances & ratings", "Service details at a tap"] },
  { id: "community", label: "Community", kicker: "The people behind the rides", title: "Good rides. Better company.", description: "A glimpse of a rider community to share the roads, the stories and the moments in between.", facts: ["Fictional rider stories", "Local demo reactions & comments", "Motorcycle & road-trip photos"] },
] satisfies { id: Screen; label: string; kicker: string; title: string; description: string; facts: string[] }[];

export type FuelEntry = { odometer: number; litres: number; price: number; date: string; month: string; mileage: number };
export const initialFuel: FuelEntry[] = [
  { odometer: 12450, litres: 10, price: 105, date: "18 Nov", month: "Nov", mileage: 27 },
  { odometer: 12180, litres: 10, price: 104, date: "08 Nov", month: "Nov", mileage: 26 },
  { odometer: 11920, litres: 12, price: 104, date: "28 Oct", month: "Oct", mileage: 26.5 },
];

export function calculateFill(previous: number, odometer: number, litres: number, price: number) {
  if (![previous, odometer, litres, price].every(Number.isFinite) || odometer <= previous || litres <= 0 || price <= 0) return null;
  return { mileage: (odometer - previous) / litres, expense: litres * price };
}

export const centres = [
  { name: "Pitstop Workshop", distance: "1.2 km", rating: "4.8", services: "General service · Oil & filters", initials: "PW", pin: "pin-one" },
  { name: "Two Wheels Garage", distance: "2.4 km", rating: "4.6", services: "Chain care · Brake inspection", initials: "TW", pin: "pin-two" },
  { name: "Moto Care Studio", distance: "3.1 km", rating: "4.7", services: "Tyres · Routine maintenance", initials: "MC", pin: "pin-three" },
];

export const maintenance = [
  { id: "oil", name: "Engine oil & filter", due: "Due at 13,000 km", expense: 1800 },
  { id: "chain", name: "Clean & lubricate chain", due: "This weekend", expense: 250 },
  { id: "brakes", name: "Inspect brake pads", due: "Next service", expense: 0 },
  { id: "tyres", name: "Check tyre pressure", due: "Before the next ride", expense: 0 },
];

export const rupees = (amount: number) => `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;