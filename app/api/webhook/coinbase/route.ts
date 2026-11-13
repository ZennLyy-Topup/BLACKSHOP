import { NextResponse } from "next/server";
import { fulfillOrder } from "../stripe/route";

export async function POST(req: Request) {
  const event = await req.json();
  // Production: verify X-CC-Webhook-Signature HMAC against COINBASE_WEBHOOK_SECRET
  if (event.event?.type === "charge:confirmed") {
    const orderId = Number(event.event.data?.metadata?.orderId);
    if (orderId) await fulfillOrder(orderId, "crypto");
  }
  return NextResponse.json({ received: true });
}