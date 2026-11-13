import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const { default: Stripe } = await import("stripe");
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;
  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const orderId = Number(event.data.object.metadata.orderId);
    await fulfillOrder(orderId, "card");
  }
  return NextResponse.json({ received: true });
}

export async function fulfillOrder(orderId: number, method: string) {
  const order = await db.order.findUnique({ where: { id: orderId }, include: { items: true } });
  if (!order || order.status === "PAID") return;
  await db.$transaction([
    db.order.update({ where: { id: orderId }, data: { status: "PAID", method } }),
    ...order.items.map(i =>
      db.product.update({ where: { id: i.productId }, data: { stock: { decrement: i.qty } } })
    ),
  ]);
}