import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { gameRooms } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getRoomQuestions } from "@/lib/gameStore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { playerName, roomCode } = body;

    if (!playerName || playerName.trim().length < 2) {
      return NextResponse.json({ error: "Player name must be at least 2 characters" }, { status: 400 });
    }
    if (!roomCode) {
      return NextResponse.json({ error: "Room code is required" }, { status: 400 });
    }

    const [room] = await db
      .select()
      .from(gameRooms)
      .where(eq(gameRooms.roomCode, roomCode.toUpperCase()));

    if (!room) {
      return NextResponse.json({ error: "Room not found. Check the code!" }, { status: 404 });
    }

    if (room.gameStarted) {
      return NextResponse.json({ error: "Game already started!" }, { status: 400 });
    }

    if (room.player2Name) {
      return NextResponse.json({ error: "Room is full!" }, { status: 400 });
    }

    const [updated] = await db
      .update(gameRooms)
      .set({
        player2Name: playerName.trim(),
        gameStarted: true,
        lastActivity: new Date(),
      })
      .where(eq(gameRooms.roomCode, roomCode.toUpperCase()))
      .returning();

    const questionIds = getRoomQuestions(roomCode.toUpperCase()) ?? [];

    return NextResponse.json({
      success: true,
      room: updated,
      questionIds,
    });
  } catch (error) {
    console.error("Join room error:", error);
    return NextResponse.json({ error: "Failed to join room" }, { status: 500 });
  }
}
