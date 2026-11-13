"use client";
import { useCart } from "@/components/CartProvider";
import { useRouter } from "next/navigation";

export default function Cart() {
  const { items, remove, setQty, clear, total } = useCart();
  const router = useRouter();

  if (items.length === 0)
    return (
      <main className="text-center py-32">
        <p className="text-6xl mb-4">🛒</p>
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <p className="text-gray-500 mt-2">Add some products to get started.</p>
        <a href="/" className="inline-block mt-6 bg-indigo-500 px-8 py-3 rounded-full font-semibold hover:bg-indigo-400 transition">
          Continue Shopping
        </a>
      </main>
    );

  return (
    <main className="max-w-4xl mx-auto px-6 py-16 fade-up">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="space-y-4">
        {items.map(i => (
          <div key={i.productId} className="glass rounded-2xl p-4 flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gray-800 flex items-center justify-center text-2xl shrink-0">
              {i.image ? <img src={i.image} className="w-full h-full object-cover rounded-xl" /> : "📦"}
            </div>
            <div className="flex-1">
              <p className="font-semibold">{i.name}</p>
              <p className="text-sm text-gray-500">${i.price.toFixed(2)} each</p>
            </div>
            <div className="flex items-center glass rounded-full">
              <button onClick={() => setQty(i.productId, i.qty - 1)} className="px-3 py-1">−</button>
              <span className="w-8 text-center text-sm">{i.qty}</span>
              <button onClick={() => setQty(i.productId, i.qty + 1)} className="px-3 py-1">+</button>
            </div>
            <p className="font-bold w-20 text-right">${(i.price * i.qty).toFixed(2)}</p>
            <button onClick={() => remove(i.productId)} className="text-gray-500 hover:text-red-400 transition">✕</button>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl p-6 mt-8 flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">Subtotal ({items.length} items)</p>
          <p className="text-3xl font-extrabold mt-1">${total.toFixed(2)}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={clear} className="glass px-6 py-3 rounded-full text-sm hover:bg-white/10 transition">Clear</button>
          <button onClick={() => router.push("/checkout")}
            className="bg-indigo-500 hover:bg-indigo-400 px-8 py-3 rounded-full font-semibold transition hover:shadow-lg hover:shadow-indigo-500/30">
            Checkout →
          </button>
        </div>
      </div>
    </main>
  );
}