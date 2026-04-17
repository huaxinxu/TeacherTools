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

/* ── Avatar Card ── */
function AvatarCard() {
  const equipped = getEquipped()
  const costumeName = equipped.costume ? SHOP_ITEMS.find(i => i.id === equipped.costume)?.name : null
  const accessoryName = equipped.accessory ? SHOP_ITEMS.find(i => i.id === equipped.accessory)?.name : null
  const titleName = equipped.title ? SHOP_ITEMS.find(i => i.id === equipped.title)?.name : null

  return (
    <div className="bg-card rounded-2xl shadow-soft p-5 flex flex-col items-center gap-3">
      <div className="flex items-center gap-2 self-start">
        <div className="w-8 h-8 rounded-lg gradient-magic flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <h2 className="font-bold text-base">我的形象</h2>
      </div>

      <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center animate-float">
        <img src="/images/wizard-avatar.png" alt="魔法士" className="w-24 h-24 object-contain"
          onError={e => { (e.target as HTMLImageElement).style.display = "none"; (e.target as HTMLImageElement).parentElement!.innerHTML = '<span class="text-5xl">🧙‍♂️</span>' }} />
      </div>

      <div className="inline-block px-3 py-1 rounded-full gradient-magic text-white text-xs font-medium">
        {titleName ?? "魔法学徒"}
      </div>

      <div className="grid grid-cols-2 gap-2 w-full">
        <div className="bg-muted/50 rounded-xl p-2.5 text-center">
          <p className="text-[10px] text-muted-foreground">装扮</p>
          <p className="text-xs font-medium mt-0.5">{costumeName ?? "默认法袍"}</p>
        </div>
        <div className="bg-muted/50 rounded-xl p-2.5 text-center">
          <p className="text-[10px] text-muted-foreground">饰品</p>
          <p className="text-xs font-medium mt-0.5">{accessoryName ?? "无"}</p>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">前往积分商城解锁更多装扮</p>
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
            <h1 className="text-xl md:text-2xl font-bold text-white drop-shadow-lg">我的书房</h1>
            <p className="text-white/80 text-sm mt-1 drop-shadow-md">今天也要加油学习哦！</p>
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
