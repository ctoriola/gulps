export type Product = {
  id: string;
  name: string;
  kind: "beans" | "drink";
  price: number; // Naira
  tag?: string;
  notes?: string;
  detail?: string;
  color?: string;
};

// Placeholder catalogue. Swap for your real menu / a Supabase table later.
export const beans: Product[] = [
  {
    id: "mambilla",
    name: "Mambilla Highlands",
    kind: "beans",
    tag: "Origin",
    detail: "Taraba, Nigeria · 250g",
    notes: "Cocoa, plantain, brown sugar",
    price: 14500,
    color: "#8fb3c9",
  },
  {
    id: "dark-roast",
    name: "Lagos Night Roast",
    kind: "beans",
    tag: "Roast",
    detail: "Dark roast · 250g",
    notes: "Dark chocolate, smoke, molasses",
    price: 13500,
    color: "#d98f86",
  },
  {
    id: "yirgacheffe",
    name: "Yirgacheffe",
    kind: "beans",
    tag: "Flavor",
    detail: "Ethiopia · 250g",
    notes: "Jasmine, lemon, honey",
    price: 18000,
    color: "#d7c7a6",
  },
  {
    id: "house-blend",
    name: "Gulpsee House Blend",
    kind: "beans",
    tag: "Blend",
    detail: "Medium roast · 250g",
    notes: "Caramel, hazelnut, orange",
    price: 12500,
    color: "#b9a07e",
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
  { id: "zobo-cold-brew", name: "Zobo Cold Brew", kind: "drink", price: 4500, notes: "Cold brew, hibiscus, ginger" },
];

export const allProducts = [...beans, ...drinks];

export const naira = (n: number) => "₦" + n.toLocaleString("en-NG");
