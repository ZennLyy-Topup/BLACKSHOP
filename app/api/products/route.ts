import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  return NextResponse.json(
    await db.product.findMany({ where: { active: true }, orderBy: { createdAt: "desc" } })
  );
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const d = await req.json();
    const slug = d.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now().toString(36);
    const product = await db.product.create({
      data: { ...d, slug, price: Number(d.price), stock: Number(d.stock) },
    });
    return NextResponse.json(product);
  } catch { return NextResponse.json({ error: "Forbidden" }, { status: 403 }); }
}

export async function PUT(req: Request) {
  try {
    await requireAdmin();
    const { id, ...data } = await req.json();
    if (data.price !== undefined) data.price = Number(data.price);
    if (data.stock !== undefined) data.stock = Number(data.stock);
    return NextResponse.json(await db.product.update({ where: { id }, data }));
  } catch { return NextResponse.json({ error: "Forbidden" }, { status: 403 }); }
}

export async function DELETE(req: Request) {
  try {
    await requireAdmin();
    const { id } = await req.json();
    await db.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: "Forbidden" }, { status: 403 }); }
}