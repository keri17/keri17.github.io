import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { gameRooms } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { roomCode } = body;

    const [room] = await db
      .select()
      .from(gameRooms)
      .where(eq(gameRooms.roomCode, roomCode.toUpperCase()));

    if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });

    const [updated] = await db
      .update(gameRooms)
      .set({
        player1Answered: false,
        player2Answered: false,
        player1Answer: null,
        player2Answer: null,
        roundResult: null,
        lastActivity: new Date(),
      })
      .where(eq(gameRooms.roomCode, roomCode.toUpperCase()))
      .returning();

    return NextResponse.json({ success: true, room: updated });
  } catch (error) {
    console.error("Next round error:", error);
    return NextResponse.json({ error: "Failed to advance" }, { status: 500 });
  }
}
