import { pgTable, serial, text, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";

export const gameRooms = pgTable("game_rooms", {
  id: serial("id").primaryKey(),
  roomCode: varchar("room_code", { length: 8 }).notNull().unique(),
  player1Name: varchar("player1_name", { length: 50 }).notNull(),
  player2Name: varchar("player2_name", { length: 50 }),
  player1Score: integer("player1_score").notNull().default(0),
  player2Score: integer("player2_score").notNull().default(0),
  currentQuestion: integer("current_question").notNull().default(0),
  player1Answered: boolean("player1_answered").notNull().default(false),
  player2Answered: boolean("player2_answered").notNull().default(false),
  player1Answer: integer("player1_answer"),
  player2Answer: integer("player2_answer"),
  gameStarted: boolean("game_started").notNull().default(false),
  gameFinished: boolean("game_finished").notNull().default(false),
  category: varchar("category", { length: 50 }).notNull().default("mixed"),
  totalQuestions: integer("total_questions").notNull().default(10),
  roundResult: text("round_result"),
  lastActivity: timestamp("last_activity").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type GameRoom = typeof gameRooms.$inferSelect;
export type NewGameRoom = typeof gameRooms.$inferInsert;
