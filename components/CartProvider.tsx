"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type CartItem = { productId: number; name: string; price: number; qty: number; image?: string };
type CartCtx = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (productId: number) => void;
  setQty: (productId: number, qty: number) => void;
  clear: () => void;
  total: number;
  count: number;
};

const Ctx = createContext<CartCtx>(null as any);
export const useCart = () => useContext(Ctx);

export default function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setItems(JSON.parse(saved));
  }, []);
  useEffect(() => { localStorage.setItem("cart", JSON.stringify(items)); }, [items]);

  const add = (item: CartItem) =>
    setItems(prev => {
      const found = prev.find(i => i.productId === item.productId);
      return found
        ? prev.map(i => (i.productId === item.productId ? { ...i, qty: i.qty + item.qty } : i))
        : [...prev, item];
    });
  const remove = (id: number) => setItems(prev => prev.filter(i => i.productId !== id));
  const setQty = (id: number, qty: number) =>
    setItems(prev => prev.map(i => (i.productId === id ? { ...i, qty: Math.max(1, qty) } : i)));
  const clear = () => setItems([]);
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  return <Ctx.Provider value={{ items, add, remove, setQty, clear, total, count }}>{children}</Ctx.Provider>;
}