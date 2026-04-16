import { useNavigate } from "react-router-dom"
import { CalendarDays, Camera, Grid3X3, Mic, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { getEvents, getScores, fmtDate } from "@/lib/store"
// 首页
const today = new Date()
const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"]

function greeting(): string {
  const h = today.getHours()
  if (h < 6) return "夜深了"
  if (h < 12) return "早上好"
  if (h < 14) return "中午好"
  if (h < 18) return "下午好"
  return "晚上好"
}

const tools = [
  { icon: CalendarDays, label: "日历管理", desc: "课程与日程安排", gradient: "gradient-hero", to: "/teacher/calendar" },
  { icon: Camera, label: "拍照计分", desc: "快速录入成绩", gradient: "gradient-warm", to: "/teacher/score" },
  { icon: Grid3X3, label: "座位编排", desc: "随机打乱座位", gradient: "gradient-hero", to: "/teacher/seating" },
  { icon: Mic, label: "分贝检测", desc: "教室噪音监测", gradient: "gradient-success", to: "/teacher/decibel" },
]

export default function HomePage() {
  const nav = useNavigate()
  const todayStr = fmtDate(today)
  const todayEvents = getEvents().filter(e => e.date === todayStr)
  const scores = getScores().slice(0, 3)

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <header className="gradient-hero px-5 pt-10 pb-8 md:pt-8 md:rounded-b-2xl">
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-primary-foreground/70 text-sm">{today.getMonth() + 1}月{today.getDate()}日 星期{WEEKDAYS[today.getDay()]}</p>
            <h1 className="text-2xl md:text-3xl font-bold text-primary-foreground mt-1">{greeting()}，老师。</h1>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex-1 bg-primary-foreground/15 backdrop-blur-sm rounded-xl p-3 md:p-4">
            <p className="text-primary-foreground/70 text-xs">今日事项</p>
            <p className="text-primary-foreground text-xl md:text-2xl font-bold mt-0.5">{todayEvents.length}</p>
          </div>
          <div className="flex-1 bg-primary-foreground/15 backdrop-blur-sm rounded-xl p-3 md:p-4">
            <p className="text-primary-foreground/70 text-xs">成绩记录</p>
            <p className="text-primary-foreground text-xl md:text-2xl font-bold mt-0.5">{getScores().length}</p>
          </div>
        </div>
      </header>

      <div className="px-4 md:px-6 -mt-4 space-y-5">
        {/* Hero image */}
        <Card className="overflow-hidden border-0">
          <img src="/images/hero-teacher.png" alt="教师工作台" className="w-full h-40 md:h-56 object-cover" loading="lazy" />
        </Card>

        {/* Quick tools */}
        <section>
          <h2 className="text-base font-semibold mb-3">快捷工具</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {tools.map(t => (
              <button key={t.label} onClick={() => nav(t.to)} className="text-left group">
                <Card className="border-0 hover:shadow-glow transition-shadow">
                  <CardContent className="p-4">
                    <div className={`w-10 h-10 rounded-xl ${t.gradient} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                      <t.icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <p className="font-semibold text-sm">{t.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{t.desc}</p>
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>
        </section>

        {/* Events + Scores side by side on PC */}
        <div className="space-y-5 md:grid md:grid-cols-2 md:gap-6 md:space-y-0 pb-4">
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold">今日日程</h2>
              <button onClick={() => nav("/teacher/calendar")} className="text-xs text-primary font-medium">查看全部</button>
            </div>
            {todayEvents.length === 0 ? (
              <Card className="border-0"><CardContent className="py-8 text-center">
                <Clock className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">今天暂无安排</p>
                <button onClick={() => nav("/calendar")} className="text-xs text-primary font-medium mt-2">去添加日程</button>
              </CardContent></Card>
            ) : (
              <div className="space-y-2">{todayEvents.map(ev => (
                <Card key={ev.id} className="border-0"><CardContent className="p-4 flex items-center gap-3">
                  <div className={`w-1.5 h-10 rounded-full ${ev.type === "class" ? "bg-primary" : ev.type === "meeting" ? "bg-accent" : ev.type === "todo" ? "bg-success" : "bg-muted-foreground"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{ev.title}</p>
                    {ev.time && <p className="text-xs text-muted-foreground mt-0.5">{ev.time}</p>}
                  </div>
                </CardContent></Card>
              ))}</div>
            )}
          </section>

          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold">最近成绩</h2>
              <button onClick={() => nav("/teacher/score")} className="text-xs text-primary font-medium">查看全部</button>
            </div>
            {scores.length === 0 ? (
              <Card className="border-0"><CardContent className="py-8 text-center">
                <p className="text-sm text-muted-foreground">暂无成绩记录</p>
              </CardContent></Card>
            ) : (
              <div className="space-y-2">{scores.map(r => (
                <Card key={r.id} className="border-0"><CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{r.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{r.scores.length} 人 · {r.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">{r.scores.length > 0 ? (r.scores.reduce((a, b) => a + b, 0) / r.scores.length).toFixed(1) : "-"}</p>
                    <p className="text-[10px] text-muted-foreground">平均分</p>
                  </div>
                </CardContent></Card>
              ))}</div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}