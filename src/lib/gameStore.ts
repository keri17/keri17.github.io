// In-memory game question store (since questions are static and don't need DB)
// Room code -> question list mapping
const roomQuestions: Map<string, number[]> = new Map();

export function setRoomQuestions(roomCode: string, questionIds: number[]) {
  roomQuestions.set(roomCode, questionIds);
}

export function getRoomQuestions(roomCode: string): number[] | undefined {
  return roomQuestions.get(roomCode);
}

export function deleteRoomQuestions(roomCode: string) {
  roomQuestions.delete(roomCode);
}
