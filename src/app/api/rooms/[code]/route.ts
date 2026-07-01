import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { gameRooms } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getRoomQuestions } from "@/lib/gameStore";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const [room] = await db
      .select()
      .from(gameRooms)
      .where(eq(gameRooms.roomCode, code.toUpperCase()));

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const questionIds = getRoomQuestions(code.toUpperCase()) ?? [];

    return NextResponse.json({ room, questionIds });
  } catch (error) {
    console.error("Get room error:", error);
    return NextResponse.json({ error: "Failed to get room" }, { status: 500 });
  }
}
