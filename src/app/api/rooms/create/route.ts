import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { gameRooms } from "@/db/schema";
import { getQuestionsForGame } from "@/lib/questions";
import { setRoomQuestions as storeQuestions } from "@/lib/gameStore";

function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { playerName, category = "mixed", totalQuestions = 10 } = body;

    if (!playerName || playerName.trim().length < 2) {
      return NextResponse.json({ error: "Player name must be at least 2 characters" }, { status: 400 });
    }

    const roomCode = generateRoomCode();
    const questions = getQuestionsForGame(category, totalQuestions);
    const questionIds = questions.map((q) => q.id);

    // Store questions in memory (keyed by room code)
    storeQuestions(roomCode, questionIds);

    const [room] = await db
      .insert(gameRooms)
      .values({
        roomCode,
        player1Name: playerName.trim(),
        category,
        totalQuestions: questions.length,
        lastActivity: new Date(),
      })
      .returning();

    return NextResponse.json({
      success: true,
      room,
      questionIds,
    });
  } catch (error) {
    console.error("Create room error:", error);
    return NextResponse.json({ error: "Failed to create room" }, { status: 500 });
  }
}
