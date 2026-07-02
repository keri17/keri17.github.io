import { NextResponse } from "next/server";
import { db } from "@/db";
import { categories } from "@/db/schema";

export async function GET() {
  try {
    const cats = await db.select().from(categories);
    return NextResponse.json({ seeded: cats.length > 0, count: cats.length });
  } catch {
    return NextResponse.json({ seeded: false, count: 0 });
  }
}
