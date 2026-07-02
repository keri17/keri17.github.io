import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { asc } from "drizzle-orm";

export async function GET() {
  try {
    const cats = await db
      .select()
      .from(categories)
      .orderBy(asc(categories.sortOrder));
    return NextResponse.json(cats);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    const cat = await db
      .insert(categories)
      .values({
        name: data.name,
        nameAm: data.nameAm,
        sortOrder: data.sortOrder ?? 0,
      })
      .returning();

    return NextResponse.json(cat[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
