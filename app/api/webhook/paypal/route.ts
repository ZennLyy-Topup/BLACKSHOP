import { NextResponse } from "next/server";
import { fulfillOrder } from "../stripe/route";

export async function POST(req: Request) {
  const event = await req.json();
  // Production: verify webhook signature via PayPal Verify Webhook Signature API
  if (event.event_type === "CHECKOUT.ORDER.APPROVED" || event.event_type === "PAYMENT.CAPTURE.COMPLETED") {
    const orderId = Number(event.resource?.custom_id);
    if (orderId) await fulfillOrder(orderId, "paypal");
  }
  return NextResponse.json({ received: true });
}