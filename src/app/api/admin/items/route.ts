import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { menuItems } from "@/db/schema";
import { getSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    const item = await db
      .insert(menuItems)
      .values({
        categoryId: data.categoryId,
        name: data.name,
        nameAm: data.nameAm,
        description: data.description || null,
        descriptionAm: data.descriptionAm || null,
        price: data.price,
        imageUrl: data.imageUrl || null,
        isAvailable: data.isAvailable ?? true,
        isFeatured: data.isFeatured ?? false,
        sortOrder: data.sortOrder ?? 0,
      })
      .returning();

    return NextResponse.json(item[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create item" },
      { status: 500 }
    );
  }
}
