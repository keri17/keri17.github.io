import { NextResponse } from "next/server";
import { db } from "@/db";
import { categories, menuItems, adminUsers } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST() {
  try {
    // Check if data already exists
    const existingCategories = await db.select().from(categories);
    if (existingCategories.length > 0) {
      return NextResponse.json({ message: "Already seeded" });
    }

    // Create admin user
    const hash = await bcrypt.hash("admin123", 10);
    await db.insert(adminUsers).values({
      username: "admin",
      passwordHash: hash,
    });

    // Create categories
    const cats = await db
      .insert(categories)
      .values([
        { name: "Kitfo Special", nameAm: "ክትፎ ልዩ", sortOrder: 1 },
        { name: "Meat Dishes", nameAm: "የስጋ ምግቦች", sortOrder: 2 },
        { name: "Fasting Food", nameAm: "የጾም ምግቦች", sortOrder: 3 },
        { name: "Beverages", nameAm: "መጠጦች", sortOrder: 4 },
        { name: "Extras", nameAm: "ተጨማሪ", sortOrder: 5 },
      ])
      .returning();

    const catMap: Record<string, number> = {};
    for (const c of cats) {
      catMap[c.name] = c.id;
    }

    // Insert menu items with real images
    await db.insert(menuItems).values([
      // Kitfo Special
      {
        categoryId: catMap["Kitfo Special"],
        name: "Special Kitfo",
        nameAm: "ልዩ ክትፎ",
        description: "Premium minced raw beef with spiced butter and mitmita",
        descriptionAm: "ምርጥ የተፈጨ ጥሬ ሥጋ በቅቤ እና ሚጥሚጣ",
        price: 450,
        imageUrl:
          "https://images.pexels.com/photos/128401/pexels-photo-128401.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        isAvailable: true,
        isFeatured: true,
        sortOrder: 1,
      },
      {
        categoryId: catMap["Kitfo Special"],
        name: "Leb Leb Kitfo",
        nameAm: "ልብ ልብ ክትፎ",
        description: "Lightly cooked kitfo with ayib and gomen",
        descriptionAm: "ቀለል ያለ ብስል ክትፎ ከአይብ እና ጎመን ጋር",
        price: 480,
        imageUrl:
          "https://images.pexels.com/photos/17311778/pexels-photo-17311778.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        isAvailable: true,
        isFeatured: true,
        sortOrder: 2,
      },
      {
        categoryId: catMap["Kitfo Special"],
        name: "Kitfo with Injera",
        nameAm: "ክትፎ በእንጀራ",
        description: "Classic kitfo served with fresh injera",
        descriptionAm: "ክትፎ ከትኩስ እንጀራ ጋር",
        price: 420,
        imageUrl:
          "https://images.pexels.com/photos/7368034/pexels-photo-7368034.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        isAvailable: true,
        isFeatured: false,
        sortOrder: 3,
      },
      {
        categoryId: catMap["Kitfo Special"],
        name: "Gored Gored",
        nameAm: "ጎረድ ጎረድ",
        description: "Cubed raw beef seasoned with awaze and spiced butter",
        descriptionAm: "በቅቤ እና አዋዜ የተቀመመ ጥሬ ሥጋ ቁርጥ",
        price: 500,
        imageUrl:
          "https://images.pexels.com/photos/31120516/pexels-photo-31120516.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        isAvailable: true,
        isFeatured: true,
        sortOrder: 4,
      },
      // Meat Dishes
      {
        categoryId: catMap["Meat Dishes"],
        name: "Tibs",
        nameAm: "ጥብስ",
        description: "Sauteed beef with onions, peppers, and rosemary",
        descriptionAm: "በሽንኩርት፣ ቃሪያ እና ጤና አዳም የተጠበሰ ሥጋ",
        price: 380,
        imageUrl:
          "https://images.pexels.com/photos/27588093/pexels-photo-27588093.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        isAvailable: true,
        isFeatured: false,
        sortOrder: 1,
      },
      {
        categoryId: catMap["Meat Dishes"],
        name: "Special Tibs",
        nameAm: "ልዩ ጥብስ",
        description: "Premium sauteed beef with vegetables",
        descriptionAm: "ምርጥ በአትክልት የተጠበሰ ሥጋ",
        price: 420,
        imageUrl:
          "https://images.pexels.com/photos/36734922/pexels-photo-36734922.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        isAvailable: true,
        isFeatured: false,
        sortOrder: 2,
      },
      {
        categoryId: catMap["Meat Dishes"],
        name: "Kurt / Raw Meat",
        nameAm: "ቁርጥ",
        description: "Fresh cubed raw beef served with mitmita and mustard",
        descriptionAm: "ትኩስ ጥሬ ሥጋ ቁርጥ ከሚጥሚጣ እና ሰናፍጭ ጋር",
        price: 400,
        imageUrl:
          "https://images.pexels.com/photos/31647676/pexels-photo-31647676.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        isAvailable: true,
        isFeatured: false,
        sortOrder: 3,
      },
      {
        categoryId: catMap["Meat Dishes"],
        name: "Dulet",
        nameAm: "ዱለት",
        description: "Minced tripe, liver and beef with spices",
        descriptionAm: "የተፈጨ ጨጓራ፣ ጉበት እና ሥጋ ከቅመም ጋር",
        price: 350,
        imageUrl:
          "https://images.pexels.com/photos/17849429/pexels-photo-17849429.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        isAvailable: true,
        isFeatured: false,
        sortOrder: 4,
      },
      {
        categoryId: catMap["Meat Dishes"],
        name: "Zilzil Tibs",
        nameAm: "ዝልዝል ጥብስ",
        description: "Strips of beef sauteed with onion and pepper",
        descriptionAm: "ረጅም ቁርጥ ሥጋ በሽንኩርት እና ቃሪያ",
        price: 390,
        imageUrl:
          "https://images.pexels.com/photos/37206710/pexels-photo-37206710.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        isAvailable: true,
        isFeatured: false,
        sortOrder: 5,
      },
      // Fasting Food
      {
        categoryId: catMap["Fasting Food"],
        name: "Beyaynet",
        nameAm: "በያይነት",
        description: "Assorted vegetable dishes on injera",
        descriptionAm: "የተለያዩ የአትክልት ወጦች በእንጀራ",
        price: 250,
        imageUrl:
          "https://images.pexels.com/photos/38330332/pexels-photo-38330332.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        isAvailable: true,
        isFeatured: false,
        sortOrder: 1,
      },
      {
        categoryId: catMap["Fasting Food"],
        name: "Shiro",
        nameAm: "ሽሮ",
        description: "Ground chickpea stew with spices",
        descriptionAm: "የተፈጨ ሽምብራ ወጥ ከቅመም ጋር",
        price: 180,
        imageUrl:
          "https://images.pexels.com/photos/37081059/pexels-photo-37081059.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        isAvailable: true,
        isFeatured: false,
        sortOrder: 2,
      },
      {
        categoryId: catMap["Fasting Food"],
        name: "Misir Wot",
        nameAm: "ምስር ወጥ",
        description: "Spicy red lentil stew",
        descriptionAm: "ቅመም ያለበት ቀይ ምስር ወጥ",
        price: 180,
        imageUrl:
          "https://images.pexels.com/photos/22735421/pexels-photo-22735421.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        isAvailable: true,
        isFeatured: false,
        sortOrder: 3,
      },
      // Beverages
      {
        categoryId: catMap["Beverages"],
        name: "Fresh Juice",
        nameAm: "ፍሬሽ ጭማቂ",
        description: "Mixed fresh fruit juice",
        descriptionAm: "የተለያዩ ትኩስ ፍራፍሬ ጭማቂ",
        price: 120,
        imageUrl:
          "https://images.pexels.com/photos/31823001/pexels-photo-31823001.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        isAvailable: true,
        isFeatured: false,
        sortOrder: 1,
      },
      {
        categoryId: catMap["Beverages"],
        name: "Sprite / Coca Cola",
        nameAm: "ስፕራይት / ኮካ ኮላ",
        description: "Soft drinks",
        descriptionAm: "ለስላሳ መጠጦች",
        price: 60,
        imageUrl:
          "https://images.pexels.com/photos/31822992/pexels-photo-31822992.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        isAvailable: true,
        isFeatured: false,
        sortOrder: 2,
      },
      {
        categoryId: catMap["Beverages"],
        name: "Bottled Water",
        nameAm: "ውሃ",
        description: "Bottled mineral water",
        descriptionAm: "የታሸገ ውሃ",
        price: 30,
        imageUrl:
          "https://images.pexels.com/photos/3558/morning-breakfast-orange-juice.jpg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        isAvailable: true,
        isFeatured: false,
        sortOrder: 3,
      },
      // Extras
      {
        categoryId: catMap["Extras"],
        name: "Extra Injera",
        nameAm: "ተጨማሪ እንጀራ",
        description: "Additional injera",
        descriptionAm: "ተጨማሪ እንጀራ",
        price: 20,
        imageUrl:
          "https://images.pexels.com/photos/7776552/pexels-photo-7776552.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        isAvailable: true,
        isFeatured: false,
        sortOrder: 1,
      },
      {
        categoryId: catMap["Extras"],
        name: "Ayib",
        nameAm: "አይብ",
        description: "Traditional cottage cheese",
        descriptionAm: "ባህላዊ የእንጀራ አይብ",
        price: 50,
        imageUrl:
          "https://images.pexels.com/photos/36870863/pexels-photo-36870863.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        isAvailable: true,
        isFeatured: false,
        sortOrder: 2,
      },
    ]);

    return NextResponse.json({ message: "Seeded successfully!" });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Seeding failed", details: String(error) },
      { status: 500 }
    );
  }
}
