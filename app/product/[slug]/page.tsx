"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";

export default function ProductDetail() {
  const { slug } = useParams();
  const router = useRouter();
  const { add } = useCart();
  const [p, setP] = useState<any>(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    fetch("/api/products").then(r => r.json())
      .then(list => setP(list.find((x: any) => x.slug === slug)));
  }, [slug]);

  if (!p) return <div className="max-w-7xl mx-auto px-6 py-32 text-center text-gray-500">Loading...</div>;

  const out = p.stock <= 0;

  return (
    <main className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 fade-up">
      <div className="glass rounded-3xl h-96 flex items-center justify-center overflow-hidden">
        {p.image
          ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
          : <span className="text-8xl">{p.type === "CARD" ? "🃏" : "📦"}</span>}
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest text-indigo-400 font-semibold mb-2">
          {p.type === "CARD" ? "Digital Card" : "Hardware"}
        </p>
        <h1 className="text-4xl font-bold tracking-tight">{p.name}</h1>
        <div className="flex items-center gap-3 mt-3">
          <span className="text-amber-400">★★★★★</span>
          <span className="text-sm text-gray-500">(24 reviews)</span>
        </div>
        <p className="text-gray-400 mt-5 leading-relaxed">{p.desc}</p>
        <p className="text-4xl font-extrabold mt-6">${p.price.toFixed(2)}</p>
        <p className={`text-sm mt-2 ${out ? "text-red-400" : "text-green-400"}`}>
          {out ? "● Out of stock" : `● In stock -- ${p.stock} available`}
        </p>

        <div className="flex items-center gap-4 mt-8">
          <div className="flex items-center glass rounded-full">
            <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-2 hover:text-indigo-400">−</button>
            <span className="w-10 text-center font-semibold">{qty}</span>
            <button onClick={() => setQty(qty + 1)} className="px-4 py-2 hover:text-indigo-400">+</button>
          </div>
          <button
            disabled={out}
            onClick={() => { add({ productId: p.id, name: p.name, price: p.price, qty, image: p.image }); router.push("/cart"); }}
            className={`flex-1 py-3.5 rounded-full font-semibold transition ${
              out ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                  : "bg-indigo-500 hover:bg-indigo-400 hover:shadow-lg hover:shadow-indigo-500/30"
            }`}>
            {out ? "Sold Out" : "Add to Cart"}
          </button>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-3 text-center text-xs text-gray-400">
          <div className="glass rounded-xl p-3">🔒 Secure Payment</div>
          <div className="glass rounded-xl p-3">🚚 Fast Delivery</div>
          <div className="glass rounded-xl p-3">↩️ Easy Returns</div>
        </div>
      </div>
    </main>
  );
}