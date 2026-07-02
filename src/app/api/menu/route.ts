import { NextResponse } from "next/server";
import { db } from "@/db";
import { menuItems, categories } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export async function GET() {
  try {
    const cats = await db
      .select()
      .from(categories)
      .orderBy(asc(categories.sortOrder));

    const items = await db
      .select()
      .from(menuItems)
      .orderBy(asc(menuItems.sortOrder));

    const result = cats.map((cat) => ({
      ...cat,
      items: items.filter((item) => item.categoryId === cat.id),
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch menu" },
      { status: 500 }
    );
  }
}
