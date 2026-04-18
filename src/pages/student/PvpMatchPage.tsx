import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Swords, Trophy, X } from "lucide-react"
import { SUBJECTS, PVP_BOTS, getChoiceQuestionsForPvp } from "@/lib/exploreData"
import { getStudentGrade, addPvpRecord } from "@/lib/exploreStore"
import { useToast } from "@/components/ui/shared"
import type { Subject, Question } from "@/lib/exploreData"

type Phase = "pick" | "matching" | "battle" | "result"

const ROUND_TIME = 15 // seconds per question
const TOTAL_ROUNDS = 5

export default function PvpMatchPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const grade = getStudentGrade()

  const [phase, setPhase] = useState<Phase>("pick")
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [bot, setBot] = useState(PVP_BOTS[0])
  const [questions, setQuestions] = useState<Question[]>([])
  const [round, setRound] = useState(0)
  const [myScore, setMyScore] = useState(0)
  const [botScore, setBotScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME)
  const [myAnswered, setMyAnswered] = useState(false)
  const [botAnswered, setBotAnswered] = useState(false)
  const [myCorrect, setMyCorrect] = useState<boolean | null>(null)
  const [botCorrect, setBotCorrect] = useState<boolean | null>(null)
  const [showRoundResult, setShowRoundResult] = useState(false)
  const [pvpResult, setPvpResult] = useState<{ result: "win" | "lose" | "draw"; xpEarned: number } | null>(null)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const botTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimers = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
    if (botTimerRef.current) { clearTimeout(botTimerRef.current); botTimerRef.current = null }
  }, [])

  // Start matching
  const startMatch = (sub: Subject) => {
    setSelectedSubject(sub)
    setPhase("matching")

    const randomBot = PVP_BOTS[Math.floor(Math.random() * PVP_BOTS.length)]
    setBot(randomBot)

    const qs = getChoiceQuestionsForPvp(sub, grade, TOTAL_ROUNDS)
    setQuestions(qs)

    setTimeout(() => {
      setPhase("battle")
      setRound(0)
      setMyScore(0)
      setBotScore(0)
      startRound()
    }, 2500)
  }

  // Start a round
  const startRound = useCallback(() => {
    setTimeLeft(ROUND_TIME)
    setMyAnswered(false)
    setBotAnswered(false)
    setMyCorrect(null)
    setBotCorrect(null)
    setShowRoundResult(false)

    // Countdown timer
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Time's up
          clearTimers()
          setMyAnswered(true)
          setMyCorrect(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Bot answers after random delay
    const delay = 1000 + Math.random() * 5000
    botTimerRef.current = setTimeout(() => {
      setBotAnswered(true)
    }, delay)
  }, [clearTimers])

  // Determine bot answer correctness when botAnswered changes
  useEffect(() => {
    if (botAnswered && botCorrect === null) {
      const isCorrect = Math.random() < bot.accuracy
      setBotCorrect(isCorrect)
      if (isCorrect) setBotScore(s => s + 1)
    }
  }, [botAnswered, botCorrect, bot.accuracy])

  // Check if round is over (both answered or time up)
  useEffect(() => {
    if (phase !== "battle") return
    if (myAnswered && botAnswered && !showRoundResult) {
      clearTimers()
      setShowRoundResult(true)

      setTimeout(() => {
        const nextRound = round + 1
        if (nextRound >= questions.length || nextRound >= TOTAL_ROUNDS) {
          // Match over
          const finalMyScore = myScore + (myCorrect ? 0 : 0) // already counted
          const finalBotScore = botScore + (botCorrect && !botAnswered ? 0 : 0)
          finishMatch()
        } else {
          setRound(nextRound)
          startRound()
        }
      }, 1500)
    }
  }, [myAnswered, botAnswered, showRoundResult, phase])

  // Handle time up - auto-end bot too
  useEffect(() => {
    if (timeLeft === 0 && !botAnswered) {
      setBotAnswered(true)
    }
  }, [timeLeft, botAnswered])

  const finishMatch = () => {
    clearTimers()
    const record = addPvpRecord(selectedSubject!, bot.name, myScore, botScore)
    setPvpResult({ result: record.result, xpEarned: record.xpEarned })
    setPhase("result")
  }

  // Player selects an answer
  const handleSelect = (idx: number) => {
    if (myAnswered || showRoundResult) return
    const q = questions[round]
    const correctIdx = q.type === "choice" ? q.correctIndex : (q as Extract<Question, { type: "scenario" }>).correctIndex
    const isCorrect = idx === correctIdx
    setMyAnswered(true)
    setMyCorrect(isCorrect)
    if (isCorrect) setMyScore(s => s + 1)

    // If time ran out and bot not yet answered, force bot
    if (!botAnswered) {
      // Bot will answer via its timer or we force it at round end
    }
  }

  const q = questions[round]

  // ── Phase: Pick Subject ──
  if (phase === "pick") {
    return (
      <div className="animate-fade-in">
        <header className="bg-gradient-to-r from-amber-500 via-red-500 to-purple-600 px-5 pt-10 pb-5 md:pt-8 md:rounded-b-2xl">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/student/explore")}
              className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center hover:bg-white/30">
              <ArrowLeft className="w-4 h-4 text-white" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">PVP 对战</h1>
              <p className="text-white/70 text-sm mt-0.5">选择学科开始匹配</p>
            </div>
          </div>
        </header>

        <div className="px-4 md:px-6 -mt-4 space-y-3 pb-4">
          {SUBJECTS.map(s => (
            <button key={s.key} onClick={() => startMatch(s.key)}
              className="w-full bg-card rounded-2xl shadow-soft p-5 flex items-center gap-4 hover:shadow-medium transition-all active:scale-[0.98]">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center text-2xl`}>
                {s.icon}
              </div>
              <div className="text-left flex-1">
                <h3 className="font-bold">{s.label}对战</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{TOTAL_ROUNDS}道{s.label}题，限时竞技</p>
              </div>
              <Swords className="w-5 h-5 text-muted-foreground/40" />
            </button>
          ))}
        </div>
      </div>
    )
  }

  // ── Phase: Matching ──
  if (phase === "matching") {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center min-h-[60vh] px-6">
        <div className="w-20 h-20 rounded-full border-4 border-primary border-t-transparent animate-spin mb-6" />
        <h2 className="text-lg font-bold mb-1">正在匹配对手...</h2>
        <p className="text-sm text-muted-foreground">请稍候</p>
      </div>
    )
  }

  // ── Phase: Battle ──
  if (phase === "battle" && q) {
    const subInfo = SUBJECTS.find(s => s.key === selectedSubject)!
    return (
      <div className="animate-fade-in">
        {/* Score header */}
        <div className="bg-card border-b px-4 py-3">
          <div className="flex items-center justify-between max-w-lg mx-auto">
            {/* Me */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">🧙‍♂️</div>
              <div>
                <p className="text-xs font-semibold">小明</p>
                <p className="text-lg font-bold text-primary">{myScore}</p>
              </div>
            </div>

            {/* VS */}
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-muted-foreground">第 {round + 1}/{Math.min(TOTAL_ROUNDS, questions.length)} 题</span>
              <span className="text-lg font-black text-muted-foreground/40">VS</span>
            </div>

            {/* Bot */}
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-xs font-semibold">{bot.name}</p>
                <p className="text-lg font-bold text-red-500">{botScore}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-lg">{bot.avatar}</div>
            </div>
          </div>

          {/* Timer bar */}
          <div className="mt-2 max-w-lg mx-auto">
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-1000 ${
                timeLeft > 5 ? "bg-primary" : "bg-red-500"
              }`} style={{ width: `${(timeLeft / ROUND_TIME) * 100}%` }} />
            </div>
            <p className={`text-center text-xs mt-1 font-bold ${timeLeft <= 5 ? "text-red-500" : "text-muted-foreground"}`}>
              {timeLeft}s
            </p>
          </div>
        </div>

        {/* Question */}
        <div className="px-4 md:px-6 py-4 max-w-lg mx-auto">
          {q.type === "scenario" && (
            <div className="mb-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/30">
              <p className="text-xs text-amber-700 dark:text-amber-400">{(q as Extract<Question, { type: "scenario" }>).scenario}</p>
            </div>
          )}

          <p className="text-base font-bold mb-4">{q.prompt}</p>

          <div className="space-y-2">
            {(q.options as string[]).map((opt, i) => {
              const labels = ["A", "B", "C", "D"]
              const correctIdx = q.type === "choice" ? q.correctIndex : (q as Extract<Question, { type: "scenario" }>).correctIndex
              const isCorrect = i === correctIdx

              return (
                <button key={i} onClick={() => handleSelect(i)}
                  disabled={myAnswered}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                    showRoundResult && isCorrect
                      ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/20"
                      : showRoundResult && myCorrect === false && !isCorrect
                        ? "border-muted opacity-40"
                        : "border-input hover:border-primary/40 active:scale-[0.98]"
                  } disabled:cursor-default`}>
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    showRoundResult && isCorrect ? "bg-emerald-400 text-white" : "bg-muted text-muted-foreground"
                  }`}>{labels[i]}</span>
                  <span className="text-sm font-medium flex-1">{opt}</span>
                </button>
              )
            })}
          </div>

          {/* Round result mini display */}
          {showRoundResult && (
            <div className="mt-4 flex items-center justify-center gap-6 animate-fade-in">
              <div className={`text-center ${myCorrect ? "text-emerald-500" : "text-red-400"}`}>
                <p className="text-xs">你</p>
                <p className="text-lg font-bold">{myCorrect ? "✓" : "✗"}</p>
              </div>
              <div className={`text-center ${botCorrect ? "text-emerald-500" : "text-red-400"}`}>
                <p className="text-xs">{bot.name}</p>
                <p className="text-lg font-bold">{botCorrect ? "✓" : "✗"}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── Phase: Result ──
  if (phase === "result" && pvpResult) {
    const bannerConfig = {
      win: { text: "胜利!", emoji: "🏆", gradient: "from-amber-400 to-amber-600", color: "text-amber-600" },
      lose: { text: "失败", emoji: "😢", gradient: "from-gray-400 to-gray-600", color: "text-gray-500" },
      draw: { text: "平局", emoji: "🤝", gradient: "from-blue-400 to-blue-600", color: "text-blue-500" },
    }[pvpResult.result]

    return (
      <div className="animate-fade-in flex flex-col items-center justify-center min-h-[60vh] px-6">
        <div className="bg-card rounded-2xl shadow-medium p-8 w-full max-w-sm text-center">
          <div className="text-5xl mb-3">{bannerConfig.emoji}</div>
          <h2 className={`text-2xl font-black mb-4 ${bannerConfig.color}`}>{bannerConfig.text}</h2>

          {/* Score comparison */}
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl mx-auto">🧙‍♂️</div>
              <p className="text-xs font-medium mt-1">小明</p>
              <p className="text-2xl font-black text-primary">{myScore}</p>
            </div>
            <span className="text-2xl font-black text-muted-foreground/30">:</span>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-xl mx-auto">{bot.avatar}</div>
              <p className="text-xs font-medium mt-1">{bot.name}</p>
              <p className="text-2xl font-black text-red-500">{botScore}</p>
            </div>
          </div>

          {/* XP */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-6">
            <span className="text-lg">✨</span>
            <span className="text-sm font-bold text-primary">+{pvpResult.xpEarned} XP</span>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <button onClick={() => { setPhase("pick"); setPvpResult(null) }}
              className="w-full py-2.5 rounded-xl gradient-hero text-white text-sm font-semibold">
              再来一局
            </button>
            <button onClick={() => navigate("/student/explore")}
              className="w-full py-2.5 rounded-xl bg-muted text-muted-foreground text-sm font-medium hover:bg-muted/80">
              返回大厅
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
