import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const { email, password, name } = await req.json();
  if (!email || !password || !name)
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  if (await db.user.findUnique({ where: { email } }))
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 400 });
  const user = await db.user.create({
    data: { email, name, password: await bcrypt.hash(password, 10) },
  });
  return NextResponse.json({ ok: true, id: user.id });
}