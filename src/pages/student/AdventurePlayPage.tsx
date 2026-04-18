import { useState, useMemo, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Star, ChevronRight, CheckCircle2, XCircle } from "lucide-react"
import { getLevelById, getQuestionsForLevel, getSubjectInfo } from "@/lib/exploreData"
import { completeLevel } from "@/lib/exploreStore"
import { useToast } from "@/components/ui/shared"
import type { Question } from "@/lib/exploreData"

export default function AdventurePlayPage() {
  const { subject, levelId } = useParams<{ subject: string; levelId: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()

  const levelDef = useMemo(() => getLevelById(levelId!), [levelId])
  const questions = useMemo(() => levelDef ? getQuestionsForLevel(levelDef) : [], [levelDef])
  const subjectInfo = getSubjectInfo(subject as "chinese" | "math" | "english")

  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<(boolean | null)[]>(() => new Array(questions.length).fill(null))
  const [fillInValue, setFillInValue] = useState("")
  const [showFeedback, setShowFeedback] = useState(false)
  const [lastCorrect, setLastCorrect] = useState(false)
  const [finished, setFinished] = useState(false)
  const [result, setResult] = useState<{ stars: number; xpEarned: number; correct: number } | null>(null)

  const q = questions[currentIdx] as Question | undefined

  const handleAnswer = useCallback((isCorrect: boolean) => {
    setAnswers(prev => {
      const next = [...prev]
      next[currentIdx] = isCorrect
      return next
    })
    setLastCorrect(isCorrect)
    setShowFeedback(true)

    setTimeout(() => {
      setShowFeedback(false)
      setFillInValue("")
      if (currentIdx + 1 < questions.length) {
        setCurrentIdx(currentIdx + 1)
      } else {
        // Level complete
        const correctCount = answers.filter(a => a === true).length + (isCorrect ? 1 : 0)
        const res = completeLevel(levelId!, correctCount, questions.length, levelDef!.xpReward)
        setResult({ ...res, correct: correctCount })
        setFinished(true)
      }
    }, 1500)
  }, [currentIdx, questions.length, answers, levelId, levelDef])

  const handleChoiceSelect = (idx: number) => {
    if (showFeedback) return
    const correct = q!.type === "choice"
      ? idx === q!.correctIndex
      : q!.type === "scenario"
        ? idx === (q as Extract<Question, { type: "scenario" }>).correctIndex
        : false
    handleAnswer(correct)
  }

  const handleFillInSubmit = () => {
    if (showFeedback || !fillInValue.trim()) return
    const correct = fillInValue.trim().toLowerCase() === (q as Extract<Question, { type: "fill-in" }>).answer.toLowerCase()
    handleAnswer(correct)
  }

  // No questions available
  if (!levelDef || questions.length === 0) {
    return (
      <div className="animate-fade-in p-6 text-center">
        <p className="text-lg font-bold mb-2">暂未开放</p>
        <p className="text-sm text-muted-foreground mb-4">该关卡题目正在准备中</p>
        <button onClick={() => navigate(-1)}
          className="px-4 py-2 rounded-xl gradient-hero text-white text-sm font-medium">
          返回
        </button>
      </div>
    )
  }

  // Result screen
  if (finished && result) {
    const nextLevelNum = levelDef.levelNum + 1
    const nextLevelId = `${subject}-${levelDef.grade}-${nextLevelNum}`
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center min-h-[60vh] px-6">
        <div className="bg-card rounded-2xl shadow-medium p-8 w-full max-w-sm text-center">
          {/* Stars */}
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3].map(s => (
              <Star key={s}
                className={`w-10 h-10 transition-all duration-500 ${
                  s <= result.stars
                    ? "text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                    : "text-muted-foreground/20"
                }`}
                style={{ animationDelay: `${s * 200}ms` }} />
            ))}
          </div>

          <h2 className="text-xl font-bold mb-1">
            {result.stars === 3 ? "完美通关!" : result.stars === 2 ? "通关成功!" : "勉强通过"}
          </h2>
          <p className="text-muted-foreground text-sm mb-4">
            答对 {result.correct}/{questions.length} 题
          </p>

          {/* XP earned */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-6">
            <span className="text-lg">✨</span>
            <span className="text-sm font-bold text-primary">+{result.xpEarned} XP</span>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            {nextLevelNum <= 20 && (
              <button onClick={() => navigate(`/student/explore/adventure/${subject}/${nextLevelId}`, { replace: true })}
                className="w-full py-2.5 rounded-xl gradient-hero text-white text-sm font-semibold flex items-center justify-center gap-1">
                下一关 <ChevronRight className="w-4 h-4" />
              </button>
            )}
            <button onClick={() => navigate(`/student/explore/adventure/${subject}`)}
              className="w-full py-2.5 rounded-xl bg-muted text-muted-foreground text-sm font-medium hover:bg-muted/80">
              返回地图
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Question screen
  return (
    <div className="animate-fade-in">
      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b px-4 py-3">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <button onClick={() => {
            if (confirm("确定退出？当前进度将丢失")) navigate(-1)
          }} className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate">{levelDef.title}</p>
            <p className="text-[10px] text-muted-foreground">{currentIdx + 1} / {questions.length}</p>
          </div>
          {/* Progress dots */}
          <div className="flex gap-1.5">
            {questions.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full transition-all ${
                answers[i] === true ? "bg-emerald-400" :
                answers[i] === false ? "bg-red-400" :
                i === currentIdx ? `bg-gradient-to-r ${subjectInfo.gradient} ring-2 ring-primary/30` :
                "bg-muted"
              }`} />
            ))}
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="px-4 md:px-6 py-6 max-w-lg mx-auto">
        {/* Scenario description */}
        {q?.type === "scenario" && (
          <div className="mb-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/30">
            <p className="text-xs font-medium text-amber-700 dark:text-amber-400 mb-1">情景描述</p>
            <p className="text-sm text-amber-900 dark:text-amber-200">{(q as Extract<Question, { type: "scenario" }>).scenario}</p>
          </div>
        )}

        {/* Prompt */}
        <div className="mb-6">
          <p className="text-lg font-bold leading-relaxed">{q?.prompt}</p>
        </div>

        {/* Answer area */}
        {q?.type === "fill-in" && (
          <div className="space-y-3">
            <input
              value={fillInValue}
              onChange={e => setFillInValue(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleFillInSubmit()}
              placeholder="输入你的答案..."
              disabled={showFeedback}
              className="w-full h-12 rounded-xl border-2 border-input bg-background px-4 text-base font-medium focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
              autoFocus
            />
            <button onClick={handleFillInSubmit}
              disabled={showFeedback || !fillInValue.trim()}
              className="w-full py-3 rounded-xl gradient-hero text-white font-semibold disabled:opacity-50">
              确认
            </button>
          </div>
        )}

        {(q?.type === "choice" || q?.type === "scenario") && (
          <div className="space-y-2.5">
            {(q.options as string[]).map((opt, i) => {
              const labels = ["A", "B", "C", "D"]
              const correctIdx = q.type === "choice" ? q.correctIndex : (q as Extract<Question, { type: "scenario" }>).correctIndex
              const isCorrect = i === correctIdx
              const isSelected = showFeedback && (
                (lastCorrect && isCorrect) || (!lastCorrect && i === correctIdx)
              )

              return (
                <button key={i}
                  onClick={() => handleChoiceSelect(i)}
                  disabled={showFeedback}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all ${
                    showFeedback && isCorrect
                      ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/20"
                      : showFeedback && !lastCorrect && !isCorrect
                        ? "border-muted opacity-40"
                        : "border-input hover:border-primary/40 active:scale-[0.98]"
                  } disabled:cursor-default`}>
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    showFeedback && isCorrect
                      ? "bg-emerald-400 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {labels[i]}
                  </span>
                  <span className="text-sm font-medium flex-1">{opt}</span>
                </button>
              )
            })}
          </div>
        )}

        {/* Feedback overlay */}
        {showFeedback && q && (
          <div className={`mt-4 p-4 rounded-xl animate-fade-in ${
            lastCorrect
              ? "bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/30"
              : "bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30"
          }`}>
            <div className="flex items-center gap-2 mb-1">
              {lastCorrect
                ? <><CheckCircle2 className="w-5 h-5 text-emerald-500" /><span className="font-bold text-sm text-emerald-700 dark:text-emerald-400">正确!</span></>
                : <><XCircle className="w-5 h-5 text-red-500" /><span className="font-bold text-sm text-red-700 dark:text-red-400">错误</span></>
              }
            </div>
            {q.explanation && (
              <p className="text-xs text-muted-foreground mt-1">{q.explanation}</p>
            )}
            {!lastCorrect && q.type === "fill-in" && (
              <p className="text-xs font-medium mt-1">正确答案：{(q as Extract<Question, { type: "fill-in" }>).answer}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
