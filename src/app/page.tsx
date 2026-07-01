"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { allQuestions, categories, Question } from "@/lib/questions";

type GameRoom = {
  id: number;
  roomCode: string;
  player1Name: string;
  player2Name: string | null;
  player1Score: number;
  player2Score: number;
  currentQuestion: number;
  player1Answered: boolean;
  player2Answered: boolean;
  player1Answer: number | null;
  player2Answer: number | null;
  gameStarted: boolean;
  gameFinished: boolean;
  category: string;
  totalQuestions: number;
  roundResult: string | null;
};

type GameState = "home" | "lobby" | "playing" | "round_result" | "finished";

const EMOJIS_CONFETTI = ["💕", "✝️", "⭐", "🌹", "💛", "🎉", "🌟", "💜", "🎊", "🏅"];

function Confetti() {
  const [pieces, setPieces] = useState<{ id: number; emoji: string; left: number; delay: number; duration: number }[]>([]);

  useEffect(() => {
    const newPieces = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      emoji: EMOJIS_CONFETTI[Math.floor(Math.random() * EMOJIS_CONFETTI.length)],
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2,
    }));
    setPieces(newPieces);
    const t = setTimeout(() => setPieces([]), 5000);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            top: "-30px",
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        >
          {p.emoji}
        </div>
      ))}
    </>
  );
}

function FloatingHearts() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {["💕", "✝️", "🌟", "💛", "🌸", "⭐", "💜", "🌹"].map((emoji, i) => (
        <div
          key={i}
          className="absolute text-2xl opacity-10 animate-float"
          style={{
            left: `${10 + i * 12}%`,
            top: `${5 + (i % 4) * 20}%`,
            animationDelay: `${i * 0.7}s`,
            animationDuration: `${3 + i * 0.5}s`,
          }}
        >
          {emoji}
        </div>
      ))}
    </div>
  );
}

function StarField() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {Array.from({ length: 40 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${1 + Math.random() * 2}px`,
            height: `${1 + Math.random() * 2}px`,
            opacity: 0.1 + Math.random() * 0.3,
            animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const [gameState, setGameState] = useState<GameState>("home");
  const [playerNumber, setPlayerNumber] = useState<1 | 2>(1);
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [room, setRoom] = useState<GameRoom | null>(null);
  const [questionIds, setQuestionIds] = useState<number[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("mixed");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [roundResultShown, setRoundResultShown] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevRoundRef = useRef<number>(-1);
  const prevResultRef = useRef<string | null>(null);

  const currentQ = room ? allQuestions.find((q) => q.id === questionIds[room.currentQuestion]) : null;

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    setTimeLeft(30);
    setTimerActive(true);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          stopTimer();
          setTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [stopTimer]);

  const fetchRoom = useCallback(async (code: string) => {
    try {
      const res = await fetch(`/api/rooms/${code}`);
      const data = await res.json();
      if (data.room) {
        setRoom(data.room);
        if (data.questionIds?.length) setQuestionIds(data.questionIds);
        return data.room as GameRoom;
      }
    } catch {
      // silent
    }
    return null;
  }, []);

  const startPolling = useCallback((code: string) => {
    stopPolling();
    pollRef.current = setInterval(async () => {
      const updatedRoom = await fetchRoom(code);
      if (updatedRoom) {
        setRoom((prev) => {
          if (!prev) return updatedRoom;
          return updatedRoom;
        });
      }
    }, 1500);
  }, [fetchRoom, stopPolling]);

  // React to room state changes
  useEffect(() => {
    if (!room) return;

    // Game started - move from lobby to playing
    if (room.gameStarted && gameState === "lobby") {
      setGameState("playing");
      startPolling(room.roomCode);
      startTimer();
    }

    // Both answered - show round result
    if (room.roundResult && !roundResultShown && gameState === "playing") {
      setRoundResultShown(true);
      stopTimer();
      setGameState("round_result");
      if (room.roundResult === "both_correct" || room.roundResult === "p1_correct" || room.roundResult === "p2_correct") {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000);
      }
      prevResultRef.current = room.roundResult;
    }

    // New question (after advancing)
    if (!room.roundResult && roundResultShown && !room.gameFinished) {
      setRoundResultShown(false);
      setSelectedAnswer(null);
      setHasAnswered(false);
      setGameState("playing");
      startTimer();
    }

    // Game finished
    if (room.gameFinished && gameState !== "finished") {
      setGameState("finished");
      stopPolling();
      setShowConfetti(true);
    }
  }, [room, gameState, roundResultShown, startPolling, startTimer, stopTimer, stopPolling]);

  useEffect(() => {
    return () => {
      stopPolling();
      stopTimer();
    };
  }, [stopPolling, stopTimer]);

  const createRoom = async () => {
    if (!playerName.trim()) { setError("Please enter your name!"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/rooms/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerName, category: selectedCategory, totalQuestions: 10 }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); return; }
      setRoom(data.room);
      setQuestionIds(data.questionIds);
      setRoomCode(data.room.roomCode);
      setPlayerNumber(1);
      setGameState("lobby");
      startPolling(data.room.roomCode);
    } catch {
      setError("Failed to create room. Try again!");
    } finally {
      setLoading(false);
    }
  };

  const joinRoom = async () => {
    if (!playerName.trim()) { setError("Please enter your name!"); return; }
    if (!joinCode.trim()) { setError("Please enter the room code!"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/rooms/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerName, roomCode: joinCode.trim().toUpperCase() }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); return; }
      setRoom(data.room);
      setQuestionIds(data.questionIds);
      setRoomCode(data.room.roomCode);
      setPlayerNumber(2);
      setGameState("playing");
      startPolling(data.room.roomCode);
      startTimer();
    } catch {
      setError("Failed to join room. Try again!");
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async (answerIdx: number) => {
    if (hasAnswered || !room) return;
    setSelectedAnswer(answerIdx);
    setHasAnswered(true);
    stopTimer();

    try {
      const res = await fetch("/api/rooms/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomCode: room.roomCode, playerNumber, answerIndex: answerIdx }),
      });
      const data = await res.json();
      if (data.room) setRoom(data.room);
    } catch {
      setError("Failed to submit answer. Retrying...");
    }
  };

  const advanceToNext = async () => {
    if (!room) return;
    try {
      const res = await fetch("/api/rooms/next", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomCode: room.roomCode }),
      });
      const data = await res.json();
      if (data.room) setRoom(data.room);
    } catch {
      setError("Failed to advance. Try again.");
    }
  };

  const resetGame = () => {
    stopPolling();
    stopTimer();
    setGameState("home");
    setRoom(null);
    setQuestionIds([]);
    setPlayerName("");
    setRoomCode("");
    setJoinCode("");
    setSelectedAnswer(null);
    setHasAnswered(false);
    setError("");
    setRoundResultShown(false);
    setSelectedCategory("mixed");
  };

  const myName = playerNumber === 1 ? room?.player1Name : room?.player2Name;
  const partnerName = playerNumber === 1 ? room?.player2Name : room?.player1Name;
  const myScore = playerNumber === 1 ? room?.player1Score : room?.player2Score;
  const partnerScore = playerNumber === 1 ? room?.player2Score : room?.player1Score;
  const iHaveAnswered = playerNumber === 1 ? room?.player1Answered : room?.player2Answered;
  const partnerHasAnswered = playerNumber === 1 ? room?.player2Answered : room?.player1Answered;
  const myAnswer = playerNumber === 1 ? room?.player1Answer : room?.player2Answer;
  const partnerAnswer = playerNumber === 1 ? room?.player2Answer : room?.player1Answer;

  const progress = room ? ((room.currentQuestion) / room.totalQuestions) * 100 : 0;

  // =================== RENDER HOME ===================
  if (gameState === "home") {
    return (
      <div
        className="min-h-screen relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0f0617 0%, #1a0533 25%, #0d1b2a 50%, #1a0a2e 75%, #0f0617 100%)",
        }}
      >
        <StarField />
        <FloatingHearts />
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
          {/* Header */}
          <div className="text-center mb-10 animate-slide-in-up">
            <div className="text-7xl mb-4 animate-heartbeat">💕</div>
            <h1 className="text-5xl md:text-7xl font-black mb-3" style={{ letterSpacing: "-0.02em" }}>
              <span className="gradient-text">Abate</span>
              <span className="text-white mx-3">&</span>
              <span className="gradient-text">Abebaye</span>
            </h1>
            <p className="text-xl md:text-2xl text-purple-300 font-medium mb-2">
              Our Special Couples Quiz Game ✝️
            </p>
            <p className="text-purple-400 text-sm">
              Ethiopian Orthodox · Fun & Clean · Real-time
            </p>
          </div>

          {/* Main Card */}
          <div className="glass rounded-3xl p-8 md:p-12 w-full max-w-md animate-slide-in-up shadow-2xl"
            style={{ animationDelay: "0.2s" }}>

            {error && (
              <div className="mb-6 p-4 rounded-2xl text-center animate-bounce-in"
                style={{ background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.4)" }}>
                <p className="text-red-300 font-medium">⚠️ {error}</p>
              </div>
            )}

            <div className="mb-6">
              <label className="text-purple-300 text-sm font-semibold mb-2 block uppercase tracking-wider">
                👤 Your Name
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Abate or Abebaye..."
                maxLength={20}
                className="w-full px-5 py-4 rounded-2xl text-white text-lg font-medium outline-none"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(168,85,247,0.4)",
                  transition: "all 0.3s",
                }}
                onKeyDown={(e) => e.key === "Enter" && createRoom()}
              />
            </div>

            {/* Category */}
            <div className="mb-8">
              <label className="text-purple-300 text-sm font-semibold mb-3 block uppercase tracking-wider">
                🎯 Choose Category
              </label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className="p-3 rounded-xl text-sm font-medium transition-all"
                    style={{
                      background: selectedCategory === cat.id
                        ? "linear-gradient(135deg, #ec4899, #a855f7)"
                        : "rgba(255,255,255,0.06)",
                      border: selectedCategory === cat.id
                        ? "1px solid rgba(236,72,153,0.6)"
                        : "1px solid rgba(255,255,255,0.1)",
                      color: selectedCategory === cat.id ? "white" : "rgba(200,180,255,0.8)",
                      transform: selectedCategory === cat.id ? "scale(1.02)" : "scale(1)",
                    }}
                  >
                    {cat.emoji} {cat.label.split(" ").slice(0, 2).join(" ")}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={createRoom}
              disabled={loading}
              className="w-full py-5 rounded-2xl text-white text-xl font-bold btn-primary mb-4 shadow-lg"
            >
              {loading ? "✨ Creating..." : "🚀 Create New Game"}
            </button>

            <div className="relative flex items-center my-6">
              <div className="flex-1 h-px" style={{ background: "rgba(168,85,247,0.3)" }} />
              <span className="px-4 text-purple-400 text-sm font-medium">or join existing</span>
              <div className="flex-1 h-px" style={{ background: "rgba(168,85,247,0.3)" }} />
            </div>

            <div className="flex gap-3">
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="Room Code"
                maxLength={6}
                className="flex-1 px-4 py-4 rounded-2xl text-white text-lg font-bold text-center tracking-widest outline-none"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(168,85,247,0.4)",
                }}
                onKeyDown={(e) => e.key === "Enter" && joinRoom()}
              />
              <button
                onClick={joinRoom}
                disabled={loading}
                className="px-6 py-4 rounded-2xl text-white font-bold btn-gold shadow-lg"
              >
                {loading ? "..." : "Join 💌"}
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 mt-10 w-full max-w-md animate-slide-in-up"
            style={{ animationDelay: "0.4s" }}>
            {[
              { emoji: "⚡", text: "Real-time" },
              { emoji: "✝️", text: "Faith-based" },
              { emoji: "🎮", text: "50+ Questions" },
            ].map((f, i) => (
              <div key={i} className="glass rounded-2xl p-4 text-center">
                <div className="text-3xl mb-1">{f.emoji}</div>
                <div className="text-purple-300 text-xs font-medium">{f.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // =================== RENDER LOBBY ===================
  if (gameState === "lobby") {
    return (
      <div
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0f0617, #1a0533, #0d1b2a)" }}
      >
        <StarField />
        <FloatingHearts />
        <div className="relative z-10 text-center px-4">
          <div className="glass rounded-3xl p-10 md:p-14 max-w-md w-full mx-auto shadow-2xl animate-slide-in-up">
            <div className="text-6xl mb-6 animate-spin-slow">⏳</div>
            <h2 className="text-3xl font-black text-white mb-3">Waiting for Partner</h2>
            <p className="text-purple-300 mb-8 text-lg">Share this code with {partnerName || "your partner"}!</p>

            <div className="mb-8">
              <div
                className="text-6xl font-black tracking-widest py-6 px-8 rounded-2xl animate-pulse-glow"
                style={{
                  background: "linear-gradient(135deg, rgba(236,72,153,0.2), rgba(168,85,247,0.2))",
                  border: "2px solid rgba(236,72,153,0.5)",
                  color: "#f472b6",
                  letterSpacing: "0.3em",
                }}
              >
                {roomCode}
              </div>
            </div>

            <div className="glass-dark rounded-xl p-4 mb-6 text-left">
              <p className="text-purple-300 text-sm font-semibold mb-2">📋 How to play:</p>
              <p className="text-purple-400 text-xs">1. Share the room code above</p>
              <p className="text-purple-400 text-xs">2. Partner opens the game & enters the code</p>
              <p className="text-purple-400 text-xs">3. Game starts automatically!</p>
            </div>

            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-sm font-medium">You: {playerName} ✓</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <span className="text-purple-400 text-sm">Waiting for partner...</span>
            </div>

            <button onClick={resetGame} className="mt-8 text-purple-500 text-sm hover:text-purple-300 transition-colors">
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =================== RENDER PLAYING ===================
  if (gameState === "playing" && room) {
    const q = allQuestions.find((q) => q.id === questionIds[room.currentQuestion]);
    if (!q) return null;

    const qNumber = room.currentQuestion + 1;
    const totalQ = room.totalQuestions;
    const timerPercent = (timeLeft / 30) * 100;
    const timerColor = timeLeft > 20 ? "#22c55e" : timeLeft > 10 ? "#f59e0b" : "#ef4444";

    return (
      <div
        className="min-h-screen relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0f0617, #1a0533, #0d1b2a)" }}
      >
        <StarField />
        {showConfetti && <Confetti />}

        {/* Top Bar */}
        <div className="relative z-10 px-4 py-4">
          <div className="max-w-2xl mx-auto">
            {/* Scores */}
            <div className="flex items-center justify-between mb-3">
              <div className="glass rounded-2xl px-4 py-3 text-center min-w-[110px]">
                <div className="text-xs text-purple-300 font-semibold uppercase tracking-wider mb-1">{myName}</div>
                <div className="text-3xl font-black gradient-text">{myScore ?? 0}</div>
                <div className="text-xs text-purple-400">pts</div>
              </div>

              <div className="flex flex-col items-center">
                <div className="text-3xl mb-1">💕</div>
                <div className="text-purple-300 text-xs font-medium">Q {qNumber}/{totalQ}</div>
              </div>

              <div className="glass rounded-2xl px-4 py-3 text-center min-w-[110px]">
                <div className="text-xs text-purple-300 font-semibold uppercase tracking-wider mb-1">{partnerName ?? "Partner"}</div>
                <div className="text-3xl font-black gradient-text">{partnerScore ?? 0}</div>
                <div className="text-xs text-purple-400">pts</div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-2 rounded-full overflow-hidden mb-4" style={{ background: "rgba(255,255,255,0.1)" }}>
              <div
                className="h-full rounded-full progress-bar"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, #ec4899, #a855f7)",
                }}
              />
            </div>

            {/* Timer */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${timerPercent}%`, background: timerColor }}
                />
              </div>
              <div
                className="text-lg font-black w-10 text-center"
                style={{ color: timerColor }}
              >
                {timeLeft}s
              </div>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="relative z-10 px-4 pb-8">
          <div className="max-w-2xl mx-auto">
            <div className="glass rounded-3xl p-6 md:p-8 mb-6 animate-slide-in-up shadow-2xl">
              <div className="text-center mb-5">
                <span className="text-5xl">{q.emoji}</span>
                <div className="mt-2">
                  <span
                    className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                    style={{
                      background: "rgba(168,85,247,0.2)",
                      border: "1px solid rgba(168,85,247,0.3)",
                      color: "#c084fc",
                    }}
                  >
                    {q.category} • +{q.points} pts
                  </span>
                </div>
              </div>
              <p className="text-white text-xl md:text-2xl font-bold text-center leading-relaxed">
                {q.question}
              </p>
            </div>

            {/* Answer Buttons */}
            <div className="grid grid-cols-1 gap-3 mb-6">
              {q.options.map((option, idx) => {
                const isSelected = selectedAnswer === idx;
                const isAnswered = hasAnswered;

                let bgStyle = "rgba(255,255,255,0.06)";
                let borderStyle = "rgba(255,255,255,0.1)";
                let textColor = "rgba(220,210,255,0.9)";

                if (isAnswered && isSelected) {
                  bgStyle = "rgba(168,85,247,0.3)";
                  borderStyle = "rgba(168,85,247,0.7)";
                  textColor = "white";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => submitAnswer(idx)}
                    disabled={isAnswered}
                    className="answer-btn w-full px-6 py-4 rounded-2xl text-left font-semibold text-base flex items-center gap-4"
                    style={{
                      background: bgStyle,
                      border: `2px solid ${borderStyle}`,
                      color: textColor,
                      opacity: isAnswered && !isSelected ? 0.5 : 1,
                    }}
                  >
                    <span
                      className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                      style={{
                        background: isAnswered && isSelected
                          ? "linear-gradient(135deg, #ec4899, #a855f7)"
                          : "rgba(168,85,247,0.2)",
                        color: isAnswered && isSelected ? "white" : "#c084fc",
                      }}
                    >
                      {["A", "B", "C", "D"][idx]}
                    </span>
                    {option}
                  </button>
                );
              })}
            </div>

            {/* Status indicators */}
            <div className="glass rounded-2xl p-4">
              <div className="flex justify-around">
                <div className="text-center">
                  <div className={`text-2xl mb-1 ${iHaveAnswered ? "opacity-100" : "opacity-30"}`}>
                    {iHaveAnswered ? "✅" : "🕐"}
                  </div>
                  <div className="text-xs text-purple-300">{myName ?? "You"}</div>
                  <div className="text-xs text-purple-400">{iHaveAnswered ? "Answered!" : "Thinking..."}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1 animate-heartbeat">💕</div>
                  <div className="text-xs text-purple-300">vs</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl mb-1 ${partnerHasAnswered ? "opacity-100" : "opacity-30"}`}>
                    {partnerHasAnswered ? "✅" : "🕐"}
                  </div>
                  <div className="text-xs text-purple-300">{partnerName ?? "Partner"}</div>
                  <div className="text-xs text-purple-400">{partnerHasAnswered ? "Answered!" : "Thinking..."}</div>
                </div>
              </div>
              {iHaveAnswered && !partnerHasAnswered && (
                <div className="mt-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "0.15s" }} />
                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "0.3s" }} />
                    <span className="text-purple-400 text-sm ml-1">Waiting for {partnerName ?? "partner"}...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =================== ROUND RESULT ===================
  if (gameState === "round_result" && room) {
    const q = allQuestions.find((q) => q.id === questionIds[room.currentQuestion]);
    if (!q) return null;

    const result = room.roundResult;
    const iWon = (playerNumber === 1 && result === "p1_correct") ||
                 (playerNumber === 2 && result === "p2_correct") ||
                 result === "both_correct";
    const bothWrong = result === "both_wrong";
    const partnerWon = !iWon && !bothWrong;

    const resultEmoji = bothWrong ? "😅" : iWon && result === "both_correct" ? "🎉" : iWon ? "🏆" : "💪";
    const resultText = bothWrong
      ? "Oops! Both missed it!"
      : result === "both_correct"
      ? "Amazing! You both got it! 🎊"
      : iWon
      ? `You got it right! Well done! 🎉`
      : `${partnerName} got it right! Good try! 💪`;

    const myAnswerText = myAnswer !== null && myAnswer !== undefined ? q.options[myAnswer] : "—";
    const partnerAnswerText = partnerAnswer !== null && partnerAnswer !== undefined ? q.options[partnerAnswer] : "—";
    const correctAnswerText = q.options[q.correct];

    return (
      <div
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0f0617, #1a0533, #0d1b2a)" }}
      >
        <StarField />
        {showConfetti && <Confetti />}

        <div className="relative z-10 px-4 w-full max-w-lg mx-auto">
          <div className="glass rounded-3xl p-8 md:p-10 shadow-2xl animate-bounce-in">
            <div className="text-center mb-6">
              <div className="text-7xl mb-4">{resultEmoji}</div>
              <h2
                className="text-2xl md:text-3xl font-black mb-2"
                style={{ color: bothWrong ? "#f87171" : "#f472b6" }}
              >
                {resultText}
              </h2>
            </div>

            {/* Correct Answer */}
            <div
              className="rounded-2xl p-4 mb-6 text-center"
              style={{
                background: "rgba(34,197,94,0.15)",
                border: "1px solid rgba(34,197,94,0.4)",
              }}
            >
              <p className="text-green-300 text-xs font-semibold uppercase tracking-wider mb-1">✅ Correct Answer</p>
              <p className="text-white text-lg font-bold">{correctAnswerText}</p>
            </div>

            {/* Both Answers */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div
                className="rounded-2xl p-4 text-center"
                style={{
                  background: (playerNumber === 1 && result === "p1_correct") || (playerNumber === 2 && result === "p2_correct") || result === "both_correct"
                    ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
                  border: `1px solid ${(playerNumber === 1 && result === "p1_correct") || (playerNumber === 2 && result === "p2_correct") || result === "both_correct"
                    ? "rgba(34,197,94,0.4)" : "rgba(239,68,68,0.4)"}`,
                }}
              >
                <div className="text-purple-300 text-xs font-semibold mb-1">👤 {myName}</div>
                <div className="text-white text-sm font-medium leading-tight">{myAnswerText}</div>
                <div className="text-xl mt-1">
                  {((playerNumber === 1 && result === "p1_correct") || (playerNumber === 2 && result === "p2_correct") || result === "both_correct") ? "✅" : "❌"}
                </div>
              </div>
              <div
                className="rounded-2xl p-4 text-center"
                style={{
                  background: (playerNumber === 1 && result === "p2_correct") || (playerNumber === 2 && result === "p1_correct") || result === "both_correct"
                    ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
                  border: `1px solid ${(playerNumber === 1 && result === "p2_correct") || (playerNumber === 2 && result === "p1_correct") || result === "both_correct"
                    ? "rgba(34,197,94,0.4)" : "rgba(239,68,68,0.4)"}`,
                }}
              >
                <div className="text-purple-300 text-xs font-semibold mb-1">💕 {partnerName ?? "Partner"}</div>
                <div className="text-white text-sm font-medium leading-tight">{partnerAnswerText}</div>
                <div className="text-xl mt-1">
                  {((playerNumber === 1 && result === "p2_correct") || (playerNumber === 2 && result === "p1_correct") || result === "both_correct") ? "✅" : "❌"}
                </div>
              </div>
            </div>

            {/* Scores */}
            <div className="flex justify-around mb-8">
              <div className="text-center">
                <div className="text-3xl font-black gradient-text">{myScore ?? 0}</div>
                <div className="text-purple-400 text-xs">{myName}</div>
              </div>
              <div className="text-2xl">💕</div>
              <div className="text-center">
                <div className="text-3xl font-black gradient-text">{partnerScore ?? 0}</div>
                <div className="text-purple-400 text-xs">{partnerName ?? "Partner"}</div>
              </div>
            </div>

            {/* Next button (only player 1 advances) */}
            {room.gameFinished ? (
              <button
                onClick={() => setGameState("finished")}
                className="w-full py-5 rounded-2xl text-white text-xl font-bold btn-primary shadow-lg"
              >
                🏆 See Final Results!
              </button>
            ) : playerNumber === 1 ? (
              <button
                onClick={advanceToNext}
                className="w-full py-5 rounded-2xl text-white text-xl font-bold btn-primary shadow-lg"
              >
                Next Question ➡️
              </button>
            ) : (
              <div className="text-center py-4">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "0.15s" }} />
                  <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "0.3s" }} />
                </div>
                <p className="text-purple-400 text-sm mt-2">Waiting for {room.player1Name} to continue...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // =================== FINISHED ===================
  if (gameState === "finished" && room) {
    const p1Score = room.player1Score;
    const p2Score = room.player2Score;
    const myFinalScore = playerNumber === 1 ? p1Score : p2Score;
    const partnerFinalScore = playerNumber === 1 ? p2Score : p1Score;
    const iWon = myFinalScore > partnerFinalScore;
    const isDraw = myFinalScore === partnerFinalScore;

    const winnerName = p1Score > p2Score ? room.player1Name : p2Score > p1Score ? (room.player2Name ?? "Partner") : "Nobody";
    const finalMsg = isDraw
      ? "It's a Perfect Tie! Love wins! 💕"
      : `${winnerName} wins! 🏆`;

    return (
      <div
        className="min-h-screen flex items-center justify-center relative overflow-hidden px-4"
        style={{ background: "linear-gradient(135deg, #0f0617, #1a0533, #0d1b2a)" }}
      >
        <StarField />
        <Confetti />
        <FloatingHearts />

        <div className="relative z-10 w-full max-w-lg">
          <div className="glass rounded-3xl p-8 md:p-12 text-center shadow-2xl animate-bounce-in">
            <div className="text-8xl mb-4">{isDraw ? "🤝" : iWon ? "🏆" : "🥈"}</div>
            <h1 className="text-4xl font-black text-white mb-2">Game Over!</h1>
            <p className="text-2xl font-bold mb-8" style={{ color: "#f472b6" }}>{finalMsg}</p>

            {/* Final Scores */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div
                className="rounded-2xl p-6"
                style={{
                  background: p1Score >= p2Score ? "rgba(236,72,153,0.2)" : "rgba(255,255,255,0.05)",
                  border: p1Score >= p2Score ? "2px solid rgba(236,72,153,0.5)" : "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div className="text-purple-300 text-sm font-semibold mb-2">{room.player1Name}</div>
                <div className="text-5xl font-black gradient-text">{p1Score}</div>
                <div className="text-purple-400 text-xs mt-1">points</div>
                {p1Score > p2Score && <div className="text-yellow-400 mt-2">👑 Winner!</div>}
              </div>
              <div
                className="rounded-2xl p-6"
                style={{
                  background: p2Score >= p1Score ? "rgba(236,72,153,0.2)" : "rgba(255,255,255,0.05)",
                  border: p2Score >= p1Score ? "2px solid rgba(236,72,153,0.5)" : "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div className="text-purple-300 text-sm font-semibold mb-2">{room.player2Name ?? "Partner"}</div>
                <div className="text-5xl font-black gradient-text">{p2Score}</div>
                <div className="text-purple-400 text-xs mt-1">points</div>
                {p2Score > p1Score && <div className="text-yellow-400 mt-2">👑 Winner!</div>}
              </div>
            </div>

            <div
              className="rounded-2xl p-5 mb-8"
              style={{ background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.3)" }}
            >
              <p className="text-purple-300 text-sm font-medium leading-relaxed">
                {isDraw
                  ? "💕 You two are perfectly matched! Just like two souls created for each other. God bless your love! ✝️"
                  : iWon
                  ? `🌟 Congratulations ${myName}! You're a quiz champion! But the real prize is your love for ${partnerName}! 💕`
                  : `✝️ Well played! ${partnerName} wins today, but your love makes you both winners every day! 💕`
                }
              </p>
            </div>

            <button
              onClick={resetGame}
              className="w-full py-5 rounded-2xl text-white text-xl font-bold btn-primary shadow-lg"
            >
              🎮 Play Again!
            </button>
            <button
              onClick={resetGame}
              className="mt-4 text-purple-400 text-sm hover:text-purple-300 transition-colors"
            >
              ← Change Settings
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
