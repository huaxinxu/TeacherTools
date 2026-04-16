import { useState, useEffect, useRef, useCallback } from "react"
import { Modal, useToast } from "@/components/ui/shared"
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
    // Second phrase after a short pause
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

/* ── Pomodoro Timer Modal Content ── */
function PomodoroContent() {
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
    <div className="space-y-4">
      <div className="flex justify-center">
        <svg width="180" height="180" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
          <circle cx="60" cy="60" r={r} fill="none" stroke="hsl(var(--primary))" strokeWidth="8"
            strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c - (c * pct) / 100}
            transform="rotate(-90 60 60)" className="transition-all duration-1000" />
          <text x="60" y="56" textAnchor="middle" className="fill-foreground" fontWeight="bold" fontSize="22">{mm}:{ss}</text>
          <text x="60" y="72" textAnchor="middle" className="fill-muted-foreground" fontSize="10">
            {running ? "专注中..." : left === 0 ? "已完成!" : "准备开始"}
          </text>
        </svg>
      </div>
      <div className="flex items-center justify-center gap-3">
        <button onClick={() => setRunning(!running)}
          className="w-12 h-12 rounded-full gradient-hero text-white flex items-center justify-center hover:opacity-90 shadow-glow">
          {running ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </button>
        <button onClick={reset}
          className="w-12 h-12 rounded-full bg-muted text-muted-foreground flex items-center justify-center hover:bg-muted/80">
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>
      <div className="flex items-center gap-2 max-w-[200px] mx-auto">
        <input type="number" min="1" max="120" value={customMin}
          onChange={e => setCustomMin(e.target.value)}
          className="flex-1 h-9 rounded-lg border border-input bg-background px-3 text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary/30" />
        <button onClick={applyCustom}
          className="h-9 px-4 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20">
          设置
        </button>
      </div>
    </div>
  )
}

/* ── Task Modal Content ── */
function TaskContent() {
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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{allTasks.filter(t => !t.completed).length} 项待完成</p>
        <button onClick={() => setAdding(!adding)}
          className="flex items-center gap-1 text-xs text-primary font-medium">
          <Plus className="w-3.5 h-3.5" /> 添加任务
        </button>
      </div>
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
      <div className="space-y-1.5 max-h-[300px] overflow-y-auto scrollbar-hide">
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

/* ── Avatar Modal Content ── */
function AvatarContent() {
  const equipped = getEquipped()
  const costumeName = equipped.costume ? SHOP_ITEMS.find(i => i.id === equipped.costume)?.name : null
  const accessoryName = equipped.accessory ? SHOP_ITEMS.find(i => i.id === equipped.accessory)?.name : null
  const titleName = equipped.title ? SHOP_ITEMS.find(i => i.id === equipped.title)?.name : null

  return (
    <div className="text-center space-y-4">
      <div className="relative inline-block">
        <div className="w-36 h-36 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center mx-auto animate-float">
          <img src="/images/wizard-avatar.png" alt="魔法士" className="w-32 h-32 object-contain"
            onError={e => { (e.target as HTMLImageElement).style.display = "none"; (e.target as HTMLImageElement).parentElement!.innerHTML = '<span class="text-6xl">🧙‍♂️</span>' }} />
        </div>
      </div>
      <div className="space-y-2">
        <div className="inline-block px-3 py-1 rounded-full gradient-magic text-white text-xs font-medium">
          {titleName ?? "魔法学徒"}
        </div>
        <div className="grid grid-cols-2 gap-2 max-w-[240px] mx-auto mt-3">
          <div className="bg-muted/50 rounded-xl p-3">
            <p className="text-[10px] text-muted-foreground">装扮</p>
            <p className="text-sm font-medium mt-0.5">{costumeName ?? "默认法袍"}</p>
          </div>
          <div className="bg-muted/50 rounded-xl p-3">
            <p className="text-[10px] text-muted-foreground">饰品</p>
            <p className="text-sm font-medium mt-0.5">{accessoryName ?? "无"}</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">前往积分商城解锁更多装扮</p>
      </div>
    </div>
  )
}

/* ── Scene Hotspot (transparent, overlays the actual object) ── */
function Hotspot({ label, onClick, className, size = "w-16 h-16 md:w-20 md:h-20" }: {
  label: string; onClick: () => void; className: string; size?: string
}) {
  return (
    <button onClick={onClick}
      className={`absolute group cursor-pointer ${className}`}
      title={label}>
      <div className="relative">
        {/* Invisible clickable area with hover glow */}
        <div className={`${size} rounded-full transition-all duration-300 group-hover:bg-white/15 group-hover:shadow-[0_0_24px_8px_rgba(255,255,255,0.25)] group-active:scale-90`} />
        {/* Label appears on hover */}
        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-semibold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {label}
        </span>
        {/* Subtle breathing ring hint */}
        <div className="absolute inset-1 rounded-full border border-white/25 animate-pulse pointer-events-none group-hover:border-white/50" />
      </div>
    </button>
  )
}

/* ── Main Page ── */
export default function StudentHomePage() {
  const [activeModal, setActiveModal] = useState<"pomodoro" | "tasks" | "avatar" | null>(null)
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
    <div className="animate-fade-in">
      {/* ── Study Room Scene ── */}
      <div className="relative w-full overflow-hidden" style={{ minHeight: "calc(100vh - 3.5rem - 4rem)" }}>
        {/* Background image */}
        <img src="/images/study-room-bg.png" alt=""
          className="absolute inset-0 w-full h-full object-cover" />

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

        {/* Top area: title + check-in */}
        <div className="relative z-10 flex items-start justify-between p-4 md:p-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white drop-shadow-lg">我的书房</h1>
            <p className="text-white/70 text-sm drop-shadow-md mt-0.5">点击桌上的物品开始探索</p>
          </div>
          <button onClick={handleCheckin} disabled={checkedIn}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold shadow-medium transition-all ${
              checkedIn
                ? "bg-success/90 text-white cursor-default"
                : "bg-card/90 backdrop-blur-sm text-primary hover:bg-card active:scale-95"
            }`}>
            <CalendarCheck className="w-4 h-4" />
            {checkedIn ? (
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> 已签到</span>
            ) : (
              <span>签到 +1</span>
            )}
            {streak > 0 && <span className="text-[10px] opacity-70 ml-0.5">({streak}天)</span>}
          </button>
        </div>

        {/* ── Interactive Hotspots — positioned over actual objects ── */}
        {/* Clock on desk (right side) — matches the round clock in the image */}
        <Hotspot
          label="番茄时钟"
          onClick={() => setActiveModal("pomodoro")}
          className="bottom-[18%] right-[20%] md:bottom-[18%] md:right-[23%]"
          size="w-14 h-14 md:w-[72px] md:h-[72px]"
        />

        {/* Sticky notes on desk (left side) — matches the colored notes in the image */}
        <Hotspot
          label="任务便签"
          onClick={() => setActiveModal("tasks")}
          className="bottom-[26%] left-[28%] md:bottom-[27%] md:left-[30%]"
          size="w-12 h-10 md:w-16 md:h-12"
        />

        {/* Character — matches the chair area in center */}
        <Hotspot
          label="我的形象"
          onClick={() => setActiveModal("avatar")}
          className="bottom-[32%] left-1/2 -translate-x-1/2 md:bottom-[34%]"
          size="w-14 h-14 md:w-20 md:h-20"
        />

        {/* Floating character sitting at desk */}
        <div className="absolute bottom-[34%] left-1/2 -translate-x-1/2 md:bottom-[38%] pointer-events-none z-[5]">
          <div className="w-16 h-16 md:w-24 md:h-24 animate-float">
            <img src="/images/wizard-avatar.png" alt="" className="w-full h-full object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
              onError={e => { (e.target as HTMLImageElement).style.display = "none"; (e.target as HTMLImageElement).parentElement!.innerHTML = '<span class="text-4xl md:text-5xl">🧙‍♂️</span>' }} />
          </div>
        </div>

        {/* Bottom decorative gradient */}
        <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* ── Quick info bar below scene ── */}
      <div className="px-4 md:px-6 -mt-6 relative z-10 pb-4">
        <div className="bg-card rounded-2xl shadow-medium p-4 grid grid-cols-3 gap-3">
          <button onClick={() => setActiveModal("pomodoro")}
            className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-muted/50 transition-colors">
            <div className="w-10 h-10 rounded-xl gradient-warm flex items-center justify-center">
              <Timer className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-medium">番茄时钟</span>
          </button>
          <button onClick={() => setActiveModal("tasks")}
            className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-muted/50 transition-colors">
            <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
              <span className="text-lg">📝</span>
            </div>
            <span className="text-xs font-medium">任务待办</span>
          </button>
          <button onClick={() => setActiveModal("avatar")}
            className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-muted/50 transition-colors">
            <div className="w-10 h-10 rounded-xl gradient-magic flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-medium">我的形象</span>
          </button>
        </div>
      </div>

      {/* ── Modals ── */}
      <Modal open={activeModal === "pomodoro"} onClose={() => setActiveModal(null)} title="番茄时钟">
        <PomodoroContent />
      </Modal>
      <Modal open={activeModal === "tasks"} onClose={() => setActiveModal(null)} title="任务待办" wide>
        <TaskContent />
      </Modal>
      <Modal open={activeModal === "avatar"} onClose={() => setActiveModal(null)} title="我的形象">
        <AvatarContent />
      </Modal>
    </div>
  )
}
