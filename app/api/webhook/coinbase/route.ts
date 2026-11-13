
import { NextResponse } from "next/server";
import crypto from "crypto";
import { fulfillOrder } from "../stripe/route";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("x-cc-webhook-signature") || "";
  const expected = crypto
    .createHmac("sha256", process.env.COINBASE_WEBHOOK_SECRET!)
    .update(body)
    .digest("hex");
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected)))
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });

  const event = JSON.parse(body);
  if (event.event?.type === "charge:confirmed") {
    const orderId = Number(event.event.data?.metadata?.orderId);
    if (orderId) await fulfillOrder(orderId, "crypto");
  }
  return NextResponse.json({ received: true });
}