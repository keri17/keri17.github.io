import { db } from "@/db";
import { categories, menuItems } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import MenuClient from "./MenuClient";

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const cats = await db
    .select()
    .from(categories)
    .orderBy(asc(categories.sortOrder));

  const items = await db
    .select()
    .from(menuItems)
    .where(eq(menuItems.isAvailable, true))
    .orderBy(asc(menuItems.sortOrder));

  const menuData = cats
    .map((cat) => ({
      ...cat,
      items: items.filter((item) => item.categoryId === cat.id),
    }))
    .filter((cat) => cat.items.length > 0);

  return <MenuClient menuData={menuData} />;
}
