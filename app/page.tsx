"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [tab, setTab] = useState("ALL");
  const [q, setQ] = useState("");

  useEffect(() => {
    fetch("/api/products").then(r => r.json()).then(setProducts);
    const t = new URLSearchParams(window.location.search).get("tab");
    if (t) setTab(t);
  }, []);

  const featured = products.filter(p => p.featured).slice(0, 3);
  const list = products.filter(
    p => (tab === "ALL" || p.type === tab) && p.name.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <main>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/60 via-transparent to-transparent" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px]" />
        <div className="relative max-w-7xl mx-auto px-6 py-28 text-center fade-up">
          <p className="text-indigo-400 text-sm font-semibold tracking-[0.2em] uppercase mb-4">
            Premium Gear · Digital Cards
          </p>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
            Everything you need.<br />
            <span className="gradient-text">One trusted store.</span>
          </h1>
          <p className="mt-6 text-gray-400 max-w-xl mx-auto text-lg">
            Shop top-tier hardware and digital cards with instant delivery.
            Check out securely with Visa, PayPal, or Crypto.
          </p>
          <div className="mt-10 flex gap-4 justify-center">
            <Link href="#products"
              className="bg-indigo-500 hover:bg-indigo-400 px-8 py-3.5 rounded-full font-semibold transition hover:shadow-lg hover:shadow-indigo-500/30">
              Browse Products
            </Link>
            <Link href="/register"
              className="glass px-8 py-3.5 rounded-full font-semibold hover:bg-white/10 transition">
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* ── Trust badges ── */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: "⚡", title: "Instant Delivery", desc: "Cards delivered in seconds" },
            { icon: "🔒", title: "Secure Payments", desc: "256-bit encrypted checkout" },
            { icon: "🌍", title: "Global Shipping", desc: "We ship to 180+ countries" },
            { icon: "💬", title: "24/7 Support", desc: "Real humans, always online" },
          ].map(b => (
            <div key={b.title} className="glass rounded-2xl p-5 hover:bg-white/[0.07] transition">
              <div className="text-2xl mb-2">{b.icon}</div>
              <p className="font-semibold text-sm">{b.title}</p>
              <p className="text-gray-500 text-xs mt-1">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured ── */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pb-16">
          <h2 className="text-2xl font-bold mb-6">⭐ Featured</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* ── Catalog ── */}
      <section id="products" className="max-w-7xl mx-auto px-6 pb-24">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h2 className="text-2xl font-bold">All Products</h2>
          <div className="flex gap-3">
            <input
              value={q} onChange={e => setQ(e.target.value)}
              placeholder="Search products..."
              className="glass rounded-full px-5 py-2.5 text-sm outline-none focus:border-indigo-500 transition w-56"
            />
            <div className="flex glass rounded-full p-1">
              {[["ALL", "All"], ["ITEM", "Hardware"], ["CARD", "Cards"]].map(([v, l]) => (
                <button key={v} onClick={() => setTab(v)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                    tab === v ? "bg-indigo-500 text-white" : "text-gray-400 hover:text-white"
                  }`}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        {list.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-4xl mb-3">🔍</p>
            <p>No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {list.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>
    </main>
  );
}