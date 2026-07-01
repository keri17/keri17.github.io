import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { gameRooms } from "@/db/schema";
import { eq } from "drizzle-orm";
import { allQuestions } from "@/lib/questions";
import { getRoomQuestions } from "@/lib/gameStore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { roomCode, playerNumber, answerIndex } = body;

    if (!roomCode || playerNumber === undefined || answerIndex === undefined) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const [room] = await db
      .select()
      .from(gameRooms)
      .where(eq(gameRooms.roomCode, roomCode.toUpperCase()));

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    if (room.gameFinished) {
      return NextResponse.json({ error: "Game is over" }, { status: 400 });
    }

    // Check if already answered
    if (playerNumber === 1 && room.player1Answered) {
      return NextResponse.json({ error: "Already answered" }, { status: 400 });
    }
    if (playerNumber === 2 && room.player2Answered) {
      return NextResponse.json({ error: "Already answered" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {
      lastActivity: new Date(),
    };

    if (playerNumber === 1) {
      updateData.player1Answered = true;
      updateData.player1Answer = answerIndex;
    } else {
      updateData.player2Answered = true;
      updateData.player2Answer = answerIndex;
    }

    // Check current answer state
    const p1Answered = playerNumber === 1 ? true : room.player1Answered;
    const p2Answered = playerNumber === 2 ? true : room.player2Answered;
    const p1Answer = playerNumber === 1 ? answerIndex : room.player1Answer;
    const p2Answer = playerNumber === 2 ? answerIndex : room.player2Answer;

    // Both answered - resolve the round
    if (p1Answered && p2Answered) {
      const questionIds = getRoomQuestions(roomCode.toUpperCase()) ?? [];
      const currentQIdx = room.currentQuestion;
      const questionId = questionIds[currentQIdx];
      const question = allQuestions.find((q) => q.id === questionId);

      let p1Score = room.player1Score;
      let p2Score = room.player2Score;
      let roundResult = "";

      if (question) {
        const p1Correct = p1Answer === question.correct;
        const p2Correct = p2Answer === question.correct;

        if (p1Correct) p1Score += question.points;
        if (p2Correct) p2Score += question.points;

        if (p1Correct && p2Correct) roundResult = "both_correct";
        else if (p1Correct) roundResult = "p1_correct";
        else if (p2Correct) roundResult = "p2_correct";
        else roundResult = "both_wrong";
      }

      const nextQuestion = currentQIdx + 1;
      const isFinished = nextQuestion >= (room.totalQuestions || 10);

      updateData.player1Score = p1Score;
      updateData.player2Score = p2Score;
      updateData.roundResult = roundResult;
      updateData.currentQuestion = isFinished ? currentQIdx : nextQuestion;
      updateData.gameFinished = isFinished;

      // Reset for next round (we keep answers until client reads them)
      if (!isFinished) {
        // will be reset on next poll after clients read roundResult
      }
    }

    const [updated] = await db
      .update(gameRooms)
      .set(updateData)
      .where(eq(gameRooms.roomCode, roomCode.toUpperCase()))
      .returning();

    return NextResponse.json({ success: true, room: updated });
  } catch (error) {
    console.error("Answer error:", error);
    return NextResponse.json({ error: "Failed to submit answer" }, { status: 500 });
  }
}
