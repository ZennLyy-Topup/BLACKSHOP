"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Orders() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (session) fetch("/api/orders/mine").then(r => r.json()).then(setOrders);
  }, [session]);

  if (!session) return <main className="text-center py-32 text-gray-500">Please sign in to view orders.</main>;

  return (
    <main className="max-w-4xl mx-auto px-6 py-16 fade-up">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      {orders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map(o => (
            <div key={o.id} className="glass rounded-2xl p-5">
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold">Order #{o.id}</span>
                <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                  o.status === "PAID" ? "bg-green-500/15 text-green-400" : "bg-yellow-500/15 text-yellow-400"
                }`}>{o.status}</span>
              </div>
              <p className="text-sm text-gray-400">
                {o.items.map((i: any) => `${i.name} × ${i.qty}`).join(", ")}
              </p>
              <div className="flex justify-between mt-3 text-sm">
                <span className="text-gray-500">{new Date(o.createdAt).toLocaleDateString()} · {o.method}</span>
                <span className="font-bold text-indigo-400">${o.total.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}