import { useState, useEffect, useRef, useCallback } from "react"
import { useToast } from "@/components/ui/shared"
import {
  CalendarCheck, Timer, Play, Pause, RotateCcw, Plus, Trash2, CheckCircle2, Circle, Sparkles,
} from "lucide-react"
import {
  hasCheckedInToday, checkinToday, addXp, getCheckinStreak,
  getStudentTasks, addStudentTask, toggleTask, deleteStudentTask, getEquipped,
} from "@/lib/studentStore"
import { TEACHER_TASKS, SHOP_ITEMS } from "@/lib/studentData"
import type { StudentTask } from "@/lib/studentStore"

const today = new Date()
function greeting(): string {
  const h = today.getHours()
  if (h < 6) return "夜深了"
  if (h < 12) return "早上好"
  if (h < 14) return "中午好"
  if (h < 18) return "下午好"
  return "晚上好"
}
/* ── Alarm sound via Web Audio API ── */
function playAlarm() {
  try {
    const ctx = new AudioContext()
    const notes = [659, 784, 659, 784, 659] // E5 G5 E5 G5 E5
    const noteLen = 0.15, gap = 0.08
    notes.forEach((freq, i) => {
      const t = ctx.currentTime + i * (noteLen + gap)
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = "sine"
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0.3, t)
      gain.gain.exponentialRampToValueAtTime(0.01, t + noteLen)
      osc.connect(gain).connect(ctx.destination)
      osc.start(t)
      osc.stop(t + noteLen)
    })
    const t2 = ctx.currentTime + notes.length * (noteLen + gap) + 0.2
    const chord = [523, 659, 784] // C5 E5 G5 chord
    chord.forEach(freq => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = "sine"
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0.25, t2)
      gain.gain.exponentialRampToValueAtTime(0.01, t2 + 0.5)
      osc.connect(gain).connect(ctx.destination)
      osc.start(t2)
      osc.stop(t2 + 0.5)
    })
  } catch { /* AudioContext not available */ }
}

/* ── Pomodoro Card ── */
function PomodoroCard() {
  const [totalSec, setTotalSec] = useState(25 * 60)
  const [left, setLeft] = useState(25 * 60)
  const [running, setRunning] = useState(false)
  const [customMin, setCustomMin] = useState("25")
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const { toast } = useToast()

  const clear = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = null
  }, [])

  useEffect(() => {
    if (!running) { clear(); return }
    intervalRef.current = setInterval(() => {
      setLeft(p => {
        if (p <= 1) {
          clear(); setRunning(false); addXp(5); playAlarm()
          toast("专注完成 +5 XP", "success")
          return 0
        }
        return p - 1
      })
    }, 1000)
    return clear
  }, [running, clear, toast])

  const pct = totalSec > 0 ? ((totalSec - left) / totalSec) * 100 : 0
  const mm = String(Math.floor(left / 60)).padStart(2, "0")
  const ss = String(left % 60).padStart(2, "0")
  const r = 54, c = 2 * Math.PI * r

  const reset = () => { clear(); setRunning(false); setLeft(totalSec) }
  const applyCustom = () => {
    const n = Math.max(1, Math.min(120, Number(customMin) || 25))
    setCustomMin(String(n))
    const s = n * 60; setTotalSec(s); setLeft(s); setRunning(false); clear()
  }

  return (
    <div className="bg-card rounded-2xl shadow-soft p-5 flex flex-col items-center gap-4">
      <div className="flex items-center gap-2 self-start">
        <div className="w-8 h-8 rounded-lg gradient-warm flex items-center justify-center">
          <Timer className="w-4 h-4 text-white" />
        </div>
        <h2 className="font-bold text-base">番茄时钟</h2>
      </div>

      <svg width="160" height="160" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
        <circle cx="60" cy="60" r={r} fill="none" stroke="hsl(var(--primary))" strokeWidth="8"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c - (c * pct) / 100}
          transform="rotate(-90 60 60)" className="transition-all duration-1000" />
        <text x="60" y="56" textAnchor="middle" className="fill-foreground" fontWeight="bold" fontSize="22">{mm}:{ss}</text>
        <text x="60" y="72" textAnchor="middle" className="fill-muted-foreground" fontSize="10">
          {running ? "专注中..." : left === 0 ? "已完成!" : "准备开始"}
        </text>
        {running && (
          <text x="60" y="85" textAnchor="middle" className="fill-muted-foreground" fontSize="7">
            专注中，请勿离开本页面
          </text>
        )}
      </svg>

      <div className="flex items-center gap-3">
        <button onClick={() => setRunning(!running)}
          className="w-11 h-11 rounded-full gradient-hero text-white flex items-center justify-center hover:opacity-90 shadow-glow">
          {running ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </button>
        <button onClick={reset}
          className="w-11 h-11 rounded-full bg-muted text-muted-foreground flex items-center justify-center hover:bg-muted/80">
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-2 w-full max-w-[200px]">
        <input type="number" min="1" max="120" value={customMin}
          onChange={e => setCustomMin(e.target.value)}
          className="flex-1 h-8 rounded-lg border border-input bg-background px-3 text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary/30" />
        <button onClick={applyCustom}
          className="h-8 px-3 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20">
          设置
        </button>
      </div>
    </div>
  )
}

/* ── Task Card ── */
function TaskCard() {
  const [tasks, setTasks] = useState<StudentTask[]>(getStudentTasks)
  const [adding, setAdding] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const { toast } = useToast()
  const allTasks = [...TEACHER_TASKS, ...tasks]

  const handleAdd = () => {
    if (!newTitle.trim()) return
    addStudentTask(newTitle.trim())
    setTasks(getStudentTasks())
    setNewTitle(""); setAdding(false)
    toast("任务已添加", "success")
  }

  return (
    <div className="bg-card rounded-2xl shadow-soft p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
            <span className="text-base">📝</span>
          </div>
          <h2 className="font-bold text-base">任务待办</h2>
        </div>
        <button onClick={() => setAdding(!adding)}
          className="flex items-center gap-1 text-xs text-primary font-medium hover:text-primary/80">
          <Plus className="w-3.5 h-3.5" /> 添加
        </button>
      </div>

      <p className="text-xs text-muted-foreground">{allTasks.filter(t => !t.completed).length} 项待完成</p>

      {adding && (
        <div className="flex gap-2">
          <input value={newTitle} onChange={e => setNewTitle(e.target.value)}
            placeholder="输入任务内容..."
            onKeyDown={e => e.key === "Enter" && handleAdd()}
            className="flex-1 h-9 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <button onClick={handleAdd}
            className="h-9 px-3 rounded-lg gradient-hero text-white text-sm font-medium hover:opacity-90">
            添加
          </button>
        </div>
      )}

      <div className="space-y-1 max-h-[260px] overflow-y-auto scrollbar-hide">
        {allTasks.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-6">暂无任务，点击上方添加</p>
        )}
        {allTasks.map(t => (
          <div key={t.id} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-muted/50 group transition-colors">
            <button onClick={() => {
              if (t.source === "teacher") return
              toggleTask(t.id); setTasks(getStudentTasks())
            }} className={t.source === "teacher" ? "cursor-default" : "cursor-pointer"}>
              {t.completed ? (
                <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground/40 flex-shrink-0" />
              )}
            </button>
            <span className={`text-sm flex-1 ${t.completed ? "line-through text-muted-foreground/50" : ""}`}>
              {t.source === "teacher" && <span className="mr-1 text-xs">📋</span>}
              {t.title}
            </span>
            {t.source === "self" && (
              <button onClick={() => { deleteStudentTask(t.id); setTasks(getStudentTasks()) }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1">
                <Trash2 className="w-3.5 h-3.5 text-destructive/60" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Avatar Card — Game-style hero showcase ── */
function AvatarCard() {
  const equipped = getEquipped()
  const costumeName = equipped.costume ? SHOP_ITEMS.find(i => i.id === equipped.costume)?.name : null
  const accessoryName = equipped.accessory ? SHOP_ITEMS.find(i => i.id === equipped.accessory)?.name : null
  const titleName = equipped.title ? SHOP_ITEMS.find(i => i.id === equipped.title)?.name : null

  /* Floating sparkle particles */
  const particles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    left: `${10 + Math.random() * 80}%`,
    delay: `${Math.random() * 3}s`,
    size: 3 + Math.random() * 4,
  }))

  return (
    <div className="rounded-2xl shadow-soft overflow-hidden relative">
      {/* Epic background */}
      <div className="relative bg-gradient-to-b from-[#1a0a2e] via-[#2d1b69] to-[#1a0a2e] py-5 px-4">
        {/* Ambient glow behind character */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-amber-400/15 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] w-32 h-32 rounded-full bg-purple-500/20 blur-2xl pointer-events-none" />

        {/* Floating sparkle particles */}
        {particles.map(p => (
          <div key={p.id} className="absolute animate-drift pointer-events-none"
            style={{ left: p.left, bottom: "20%", animationDelay: p.delay }}>
            <svg width={p.size} height={p.size} viewBox="0 0 10 10" className="text-amber-300/80">
              <polygon points="5,0 6,4 10,5 6,6 5,10 4,6 0,5 4,4" fill="currentColor" />
            </svg>
          </div>
        ))}

        {/* Header */}
        <div className="flex items-center gap-2 mb-3 relative z-10">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.4)]">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <h2 className="font-bold text-sm text-amber-100/90">我的形象</h2>
        </div>

        {/* Character display */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Magic circle behind character */}
          <div className="absolute top-4 w-36 h-36 rounded-full border border-amber-400/20 animate-[spin_20s_linear_infinite] pointer-events-none">
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-amber-400/60" />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-purple-400/60" />
            <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 rounded-full bg-amber-400/40" />
            <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 rounded-full bg-purple-400/40" />
          </div>

          {/* Character image */}
          <div className="animate-float relative">
            <img src="/images/wizard-avatar.png" alt="魔法士"
              className="w-40 h-40 object-contain drop-shadow-[0_8px_24px_rgba(168,85,247,0.4)]"
              onError={e => { (e.target as HTMLImageElement).style.display = "none"; (e.target as HTMLImageElement).parentElement!.innerHTML = '<span class="text-7xl">🧙‍♂️</span>' }} />
          </div>

          {/* Title badge - ornate style */}
          <div className="relative -mt-1 mb-2">
            {/* Decorative wings */}
            <div className="absolute top-1/2 -translate-y-1/2 -left-4 w-4 h-[1px] bg-gradient-to-l from-amber-400/80 to-transparent" />
            <div className="absolute top-1/2 -translate-y-1/2 -right-4 w-4 h-[1px] bg-gradient-to-r from-amber-400/80 to-transparent" />
            <div className="px-4 py-1 rounded-full text-xs font-bold tracking-wider text-amber-200 border border-amber-400/40 bg-gradient-to-r from-amber-900/40 via-amber-700/30 to-amber-900/40 shadow-[0_0_12px_rgba(245,158,11,0.2)]"
              style={{ backgroundSize: "200% 100%" }}>
              {titleName ?? "魔法学徒"}
            </div>
          </div>
        </div>
      </div>

      {/* Equipment panel — below the scene */}
      <div className="bg-card p-4 space-y-3">
        {/* Equipment slots */}
        <div className="grid grid-cols-2 gap-2">
          <div className="relative group flex items-center gap-2.5 p-2.5 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20 border border-purple-200/50 dark:border-purple-700/30 transition-all hover:shadow-md">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <span className="text-sm">👘</span>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-muted-foreground leading-tight">装扮</p>
              <p className="text-xs font-semibold truncate">{costumeName ?? "默认法袍"}</p>
            </div>
          </div>
          <div className="relative group flex items-center gap-2.5 p-2.5 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border border-blue-200/50 dark:border-blue-700/30 transition-all hover:shadow-md">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <span className="text-sm">💎</span>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-muted-foreground leading-tight">饰品</p>
              <p className="text-xs font-semibold truncate">{accessoryName ?? "无"}</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <a href="/student/shop"
          className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-700/30 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors">
          <Sparkles className="w-3.5 h-3.5" />
          前往积分商城解锁更多装扮
        </a>
      </div>
    </div>
  )
}

/* ── Checkin Card ── */
function CheckinCard() {
  const [checkedIn, setCheckedIn] = useState(hasCheckedInToday)
  const [streak, setStreak] = useState(getCheckinStreak)
  const { toast } = useToast()

  const handleCheckin = () => {
    if (checkinToday()) {
      addXp(1); setCheckedIn(true); setStreak(getCheckinStreak())
      toast("签到成功 +1 XP", "success")
    }
  }

  return (
    <div className="bg-card rounded-2xl shadow-soft p-5 flex flex-col items-center gap-3">
      <div className="flex items-center gap-2 self-start">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
          <CalendarCheck className="w-4 h-4 text-white" />
        </div>
        <h2 className="font-bold text-base">每日签到</h2>
      </div>

      <div className="flex flex-col items-center gap-2 py-2">
        <div className="text-4xl">{checkedIn ? "🎉" : "📅"}</div>
        {streak > 0 && (
          <p className="text-sm text-muted-foreground">已连续签到 <span className="font-bold text-primary">{streak}</span> 天</p>
        )}
      </div>

      <button onClick={handleCheckin} disabled={checkedIn}
        className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
          checkedIn
            ? "bg-success/15 text-success cursor-default"
            : "gradient-hero text-white hover:opacity-90 active:scale-[0.98] shadow-glow"
        }`}>
        {checkedIn ? (
          <span className="flex items-center justify-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> 今日已签到</span>
        ) : (
          "立即签到 +1 XP"
        )}
      </button>
    </div>
  )
}

/* ── Main Page ── */
export default function StudentHomePage() {
  return (
    <div className="animate-fade-in space-y-5 pb-6">
      {/* Banner header */}
      <div className="relative rounded-2xl overflow-hidden shadow-soft">
        <img src="/images/student-banner.png" alt=""
          className="w-full h-36 md:h-44 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/60 to-purple-500/40" />
        <div className="absolute inset-0 flex items-center px-5 md:px-8">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white drop-shadow-lg">欢迎回来</h1>
            <p className="text-white/80 text-sm mt-1 drop-shadow-md">{greeting()}</p>
          </div>
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-1">
        <CheckinCard />
        <PomodoroCard />
        <TaskCard />
        <AvatarCard />
      </div>
    </div>
  )
}
