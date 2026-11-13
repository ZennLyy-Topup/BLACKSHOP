"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function OrderResult({ params }: { params: { orderId: string } }) {
  const sp = useSearchParams();
  const paid = sp.get("paid") === "1";

  return (
    <main className="text-center py-32 fade-up">
      <p className="text-7xl mb-6">{paid ? "✅" : "⏳"}</p>
      <h1 className="text-3xl font-bold">{paid ? "Payment Successful!" : "Payment Pending"}</h1>
      <p className="text-gray-500 mt-3">
        {paid
          ? `Order #${params.orderId} has been confirmed. Check your order history for details.`
          : `Order #${params.orderId} is awaiting payment confirmation.`}
      </p>
      <Link href="/orders" className="inline-block mt-8 bg-indigo-500 hover:bg-indigo-400 px-8 py-3 rounded-full font-semibold transition">
        View My Orders
      </Link>
    </main>
  );
}