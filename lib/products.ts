import { pairings } from "./content";

export type Product = {
  id: string;
  name: string;
  kind: "coffee" | "drink";
  price: number; // Naira
  /** Name shown in the cart, when it differs from the card/menu name. */
  cartName?: string;
  /** The coffee's real name, kept secret until the reveal (see lib/content.ts). */
  realName?: string;
  notes?: string;
  detail?: string;
  /** Colours for the blurred artwork behind the cup on a locked Pairing card. */
  art?: [string, string, string];
};

// Until the names are revealed, every coffee is shown as "Unnamed Brew"; the
// cart tells them apart by their tasting notes.
const brewName = (real: string) => (pairings.namesRevealed ? real : "Unnamed Brew");
const cartLine = (real: string, notes: string) =>
  pairings.namesRevealed ? `${real}, pour-over` : `Unnamed Brew (${notes}), pour-over`;

// The four coffees, each paired with an artwork at Hare and Grouse (not revealed yet).
// Ordering one online orders a pour-over made with it, at the pour-over price.
export const coffees: Product[] = [
  {
    id: "mambilla",
    realName: "Mambilla Highlands",
    name: brewName("Mambilla Highlands"),
    cartName: cartLine("Mambilla Highlands", "cocoa, plantain, brown sugar"),
    kind: "coffee",
    detail: "Taraba, Nigeria",
    notes: "Cocoa, plantain, brown sugar",
    price: 5000,
    art: ["#3f6f8f", "#d9a441", "#8c3b2a"],
  },
  {
    id: "dark-roast",
    realName: "Lagos Night Roast",
    name: brewName("Lagos Night Roast"),
    cartName: cartLine("Lagos Night Roast", "dark chocolate, smoke, molasses"),
    kind: "coffee",
    detail: "Dark roast",
    notes: "Dark chocolate, smoke, molasses",
    price: 5000,
    art: ["#1f2a44", "#b24a3a", "#e3c27a"],
  },
  {
    id: "yirgacheffe",
    realName: "Yirgacheffe",
    name: brewName("Yirgacheffe"),
    cartName: cartLine("Yirgacheffe", "jasmine, lemon, honey"),
    kind: "coffee",
    detail: "Ethiopia",
    notes: "Jasmine, lemon, honey",
    price: 5000,
    art: ["#e9d36b", "#6f9a7c", "#e8a0a0"],
  },
  {
    id: "house-blend",
    realName: "Gulpsee House Blend",
    name: brewName("Gulpsee House Blend"),
    cartName: cartLine("Gulpsee House Blend", "caramel, hazelnut, orange"),
    kind: "coffee",
    detail: "Medium roast",
    notes: "Caramel, hazelnut, orange",
    price: 5000,
    art: ["#c9783c", "#4b5f3a", "#efe0c4"],
  },
];

export const drinks: Product[] = [
  { id: "espresso", name: "Espresso", kind: "drink", price: 2500, notes: "Double shot, house blend" },
  { id: "americano", name: "Americano", kind: "drink", price: 3000, notes: "Espresso, hot water" },
  { id: "cappuccino", name: "Cappuccino", kind: "drink", price: 3800, notes: "Espresso, thick foam" },
  { id: "latte", name: "Café Latte", kind: "drink", price: 4000, notes: "Espresso, silky milk" },
  { id: "flat-white", name: "Flat White", kind: "drink", price: 4200, notes: "Ristretto, micro-foam" },
  { id: "pour-over", name: "Pour-over", kind: "drink", price: 5000, notes: "Single origin, by hand" },
  { id: "iced-caramel", name: "Iced Caramel Latte", kind: "drink", price: 4800, notes: "Over ice, house caramel" },
  // Launch drink on the Unnamed Menu: shown by its contents only (see lib/content.ts).
  { id: "zobo-cold-brew", name: "No name yet", cartName: "New drink: cold brew, hibiscus, ginger", kind: "drink", price: 4500, notes: "Cold brew, hibiscus, ginger" },
];

export const allProducts = [...coffees, ...drinks];

export const naira = (n: number) => "₦" + n.toLocaleString("en-NG");
