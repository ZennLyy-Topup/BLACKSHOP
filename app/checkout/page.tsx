"use client";
import { useCart } from "@/components/CartProvider";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Checkout() {
  const { items, total, clear } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const [method, setMethod] = useState("card");
  const [loading, setLoading] = useState(false);

  const methods = [
    { id: "card", label: "Credit / Debit Card", sub: "Visa · Mastercard · Amex", icon: "💳" },
    { id: "paypal", label: "PayPal", sub: "Fast & buyer-protected", icon: "🅿️" },
    { id: "crypto", label: "Cryptocurrency", sub: "BTC · ETH · USDC & more", icon: "₿" },
  ];

  const pay = async () => {
    if (!session) { router.push("/login"); return; }
    setLoading(true);
    // 1. Create order
    const res = await fetch("/api/orders", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map(i => ({ productId: i.productId, qty: i.qty })),
        method,
      }),
    });
    if (!res.ok) { alert((await res.json()).error); setLoading(false); return; }
    const { orderId } = await res.json();
    // 2. Get payment redirect URL
    const p = await fetch(`/api/payment/${method}`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    });
    const d = await p.json();
    if (d.url) { clear(); window.location.href = d.url; }
    else { alert("Payment initialization failed"); setLoading(false); }
  };

  if (items.length === 0)
    return <main className="text-center py-32 text-gray-500">Your cart is empty. <a href="/" className="text-indigo-400">Shop now</a></main>;

  return (
    <main className="max-w-2xl mx-auto px-6 py-16 fade-up">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {/* Order summary */}
      <div className="glass rounded-2xl p-6 mb-8">
        <p className="font-semibold mb-4">Order Summary</p>
        {items.map(i => (
          <div key={i.productId} className="flex justify-between text-sm py-2 border-b border-white/5">
            <span className="text-gray-400">{i.name} × {i.qty}</span>
            <span>${(i.price * i.qty).toFixed(2)}</span>
          </div>
        ))}
        <div className="flex justify-between font-bold mt-4">
          <span>Total</span><span className="text-indigo-400">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment method */}
      <p className="font-semibold mb-3">Payment Method</p>
      <div className="space-y-3 mb-8">
        {methods.map(m => (
          <button key={m.id} onClick={() => setMethod(m.id)}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition ${
              method === m.id ? "border-indigo-500 bg-indigo-500/10" : "border-white/10 glass hover:bg-white/5"
            }`}>
            <span className="text-2xl">{m.icon}</span>
            <div className="flex-1">
              <p className="font-semibold text-sm">{m.label}</p>
              <p className="text-xs text-gray-500">{m.sub}</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 ${method === m.id ? "border-indigo-500 bg-indigo-500" : "border-gray-600"}`} />
          </button>
        ))}
      </div>

      <button onClick={pay} disabled={loading}
        className="w-full bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 py-4 rounded-2xl font-bold text-lg transition hover:shadow-lg hover:shadow-indigo-500/30">
        {loading ? "Redirecting..." : `Pay $${total.toFixed(2)} Securely`}
      </button>
      <p className="text-center text-xs text-gray-500 mt-4">🔒 Payments are encrypted and processed securely.</p>
    </main>
  );
}