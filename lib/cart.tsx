"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { allProducts, type Product } from "./products";

type Line = { id: string; qty: number };
type CartCtx = {
  lines: (Line & { product: Product })[];
  count: number;
  subtotal: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (id: string) => void;
  setQty: (id: string, qty: number) => void;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "gulpsee-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [raw, setRaw] = useState<Line[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) setRaw(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(raw));
    } catch {}
  }, [raw]);

  const add = useCallback((id: string) => {
    setRaw((r) => {
      const hit = r.find((l) => l.id === id);
      return hit ? r.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l)) : [...r, { id, qty: 1 }];
    });
    setOpen(true);
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setRaw((r) => (qty <= 0 ? r.filter((l) => l.id !== id) : r.map((l) => (l.id === id ? { ...l, qty } : l))));
  }, []);

  const value = useMemo<CartCtx>(() => {
    const lines = raw
      .map((l) => ({ ...l, product: allProducts.find((p) => p.id === l.id)! }))
      .filter((l) => l.product);
    return {
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotal: lines.reduce((n, l) => n + l.qty * l.product.price, 0),
      open,
      setOpen,
      add,
      setQty,
    };
  }, [raw, open, add, setQty]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}
