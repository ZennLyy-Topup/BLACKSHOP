"use client";
import Link from "next/link";
import { useCart } from "./CartProvider";

export default function ProductCard({ product: p }: { product: any }) {
  const { add } = useCart();
  const out = p.stock <= 0;

  return (
    <div className="group glass rounded-2xl overflow-hidden hover:border-indigo-500/50 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300">
      <Link href={`/product/${p.slug}`}>
        <div className="h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative overflow-hidden">
          {p.image ? (
            <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
          ) : (
            <span className="text-5xl group-hover:scale-110 transition">{p.type === "CARD" ? "🃏" : "📦"}</span>
          )}
          {p.featured && (
            <span className="absolute top-3 left-3 bg-amber-500/90 text-black text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
              Featured
            </span>
          )}
          {out && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-sm font-semibold text-red-400">Out of Stock</span>
            </div>
          )}
        </div>
      </Link>
      <div className="p-5">
        <p className="text-[10px] uppercase tracking-widest text-indigo-400 font-semibold mb-1">
          {p.type === "CARD" ? "Digital Card" : "Hardware"}
        </p>
        <Link href={`/product/${p.slug}`} className="font-semibold hover:text-indigo-300 transition line-clamp-1">
          {p.name}
        </Link>
        <p className="text-gray-500 text-xs mt-1 line-clamp-2">{p.desc}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold">${p.price.toFixed(2)}</span>
          <button
            disabled={out}
            onClick={() => add({ productId: p.id, name: p.name, price: p.price, qty: 1, image: p.image })}
            className={`text-sm px-4 py-2 rounded-full font-medium transition ${
              out ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                  : "bg-indigo-500 hover:bg-indigo-400 hover:shadow-lg hover:shadow-indigo-500/30"
            }`}>
            {out ? "Sold Out" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}