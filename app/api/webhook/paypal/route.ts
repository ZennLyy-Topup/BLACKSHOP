
import { NextResponse } from "next/server";
import { fulfillOrder } from "../stripe/route";

async function verifyWebhook(headers: Headers, body: string): Promise<boolean> {
  const res = await fetch(
    process.env.PAYPAL_ENV === "live"
      ? "https://api-m.paypal.com/v1/notifications/verify-webhook-signature"
      : "https://api-m.sandbox.paypal.com/v1/notifications/verify-webhook-signature",
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(process.env.PAYPAL_CLIENT_ID + ":" + process.env.PAYPAL_SECRET).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        auth_algo: headers.get("paypal-auth-algo"),
        cert_url: headers.get("paypal-cert-url"),
        transmission_id: headers.get("paypal-transmission-id"),
        transmission_sig: headers.get("paypal-transmission-sig"),
        transmission_time: headers.get("paypal-transmission-time"),
        webhook_id: process.env.PAYPAL_WEBHOOK_ID,
        webhook_event: JSON.parse(body),
      }),
    }
  );
  const data = await res.json();
  return data.verification_status === "SUCCESS";
}

export async function POST(req: Request) {
  const body = await req.text();
  if (!(await verifyWebhook(req.headers, body)))
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });

  const event = JSON.parse(body);
  if (event.event_type === "CHECKOUT.ORDER.APPROVED" || event.event_type === "PAYMENT.CAPTURE.COMPLETED") {
    const orderId = Number(event.resource?.custom_id);
    if (orderId) await fulfillOrder(orderId, "paypal");
  }
  return NextResponse.json({ received: true });
}