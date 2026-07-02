import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { menuItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const data = await request.json();
    const item = await db
      .update(menuItems)
      .set({
        categoryId: data.categoryId,
        name: data.name,
        nameAm: data.nameAm,
        description: data.description || null,
        descriptionAm: data.descriptionAm || null,
        price: data.price,
        imageUrl: data.imageUrl || null,
        isAvailable: data.isAvailable,
        isFeatured: data.isFeatured,
        sortOrder: data.sortOrder ?? 0,
        updatedAt: new Date(),
      })
      .where(eq(menuItems.id, parseInt(id)))
      .returning();

    return NextResponse.json(item[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update item" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await db.delete(menuItems).where(eq(menuItems.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete item" },
      { status: 500 }
    );
  }
}
