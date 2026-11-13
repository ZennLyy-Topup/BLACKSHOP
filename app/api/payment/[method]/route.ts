import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

const URL = process.env.NEXT_PUBLIC_URL!;

export async function POST(req: Request, { params }: any) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { orderId } = await req.json();
  const order = await db.order.findUnique({ where: { id: orderId } });
  if (!order || order.userId !== Number((session.user as any).id))
    return NextResponse.json({ error: "Order not found." }, { status: 404 });

  if (params.method === "card") return cardCheckout(order);
  if (params.method === "paypal") return paypalCheckout(order);
  if (params.method === "crypto") return cryptoCheckout(order);
  return NextResponse.json({ error: "Unknown payment method." }, { status: 400 });
}

/* ───────── Stripe (Visa / Mastercard / Amex) ───────── */
async function cardCheckout(order: any) {
  const { default: Stripe } = await import("stripe");
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const s = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{
      price_data: {
        currency: "usd",
        unit_amount: Math.round(order.total * 100),
        product_data: { name: `NexusStore Order #${order.id}` },
      },
      quantity: 1,
    }],
    metadata: { orderId: String(order.id) },
    success_url: `${URL}/checkout/${order.id}?paid=1`,
    cancel_url: `${URL}/checkout/${order.id}`,
  });
  return NextResponse.json({ url: s.url });
}

/* ───────── PayPal ───────── */
async function paypalCheckout(order: any) {
  const authRes = await fetch(
    process.env.PAYPAL_ENV === "live"
      ? "https://api-m.paypal.com/v1/oauth2/token"
      : "https://api-m.sandbox.paypal.com/v1/oauth2/token",
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(process.env.PAYPAL_CLIENT_ID + ":" + process.env.PAYPAL_SECRET).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    }
  );
  const { access_token } = await authRes.json();
  const base = process.env.PAYPAL_ENV === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
  const res = await fetch(`${base}/v2/checkout/orders`, {
    method: "POST",
    headers: { Authorization: `Bearer ${access_token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [{
        amount: { currency_code: "USD", value: order.total.toFixed(2) },
        custom_id: String(order.id),
      }],
      application_context: {
        return_url: `${URL}/checkout/${order.id}?paid=1`,
        cancel_url: `${URL}/checkout/${order.id}`,
      },
    }),
  });
  const data = await res.json();
  const approve = data.links?.find((l: any) => l.rel === "approve");
  return NextResponse.json({ url: approve?.href ?? null });
}

/* ───────── Crypto (Coinbase Commerce) ───────── */
async function cryptoCheckout(order: any) {
  const res = await fetch("https://api.commerce.coinbase.com/charges", {
    method: "POST",
    headers: {
      "X-CC-Api-Key": process.env.COINBASE_API_KEY!,
      "X-CC-Version": "2018-03-22",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: `NexusStore Order #${order.id}`,
      pricing_type: "fixed_price",
      local_price: { amount: String(order.total), currency: "USD" },
      redirect_url: `${URL}/checkout/${order.id}?paid=1`,
      cancel_url: `${URL}/checkout/${order.id}`,
      metadata: { orderId: String(order.id) },
    }),
  });
  const data = await res.json();
  return NextResponse.json({ url: data.data?.hosted_url ?? null });
}