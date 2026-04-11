import { useState, useMemo, useCallback } from "react"
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Modal, Input, Select, useToast } from "@/components/ui/shared"
import { getEvents, addEvent, deleteEvent, uid, fmtDate, EVENT_TYPES, type CalendarEvent } from "@/lib/store"
import { cn } from "@/lib/utils"

const WK = ["日", "一", "二", "三", "四", "五", "六"]
const MONTHS = ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"]

function monthDays(year: number, month: number) {
  const first = new Date(year, month, 1).getDay()
  const total = new Date(year, month + 1, 0).getDate()
  const prev = new Date(year, month, 0).getDate()
  const days: { d: number; t: "p" | "c" | "n"; full: string }[] = []
  for (let i = first - 1; i >= 0; i--) {
    const dd = prev - i, m = month === 0 ? 11 : month - 1, y = month === 0 ? year - 1 : year
    days.push({ d: dd, t: "p", full: fmtDate(new Date(y, m, dd)) })
  }
  for (let i = 1; i <= total; i++) days.push({ d: i, t: "c", full: fmtDate(new Date(year, month, i)) })
  const rem = 42 - days.length
  for (let i = 1; i <= rem; i++) {
    const m = month === 11 ? 0 : month + 1, y = month === 11 ? year + 1 : year
    days.push({ d: i, t: "n", full: fmtDate(new Date(y, m, i)) })
  }
  return days
}

export default function CalendarPage() {
  const { toast } = useToast()
  const todayStr = fmtDate(new Date())
  const [yr, setYr] = useState(new Date().getFullYear())
  const [mo, setMo] = useState(new Date().getMonth())
  const [sel, setSel] = useState(todayStr)
  const [show, setShow] = useState(false)
  const [events, setEvents] = useState<CalendarEvent[]>(getEvents)
  const [title, setTitle] = useState("")
  const [type, setType] = useState<CalendarEvent["type"]>("class")
  const [time, setTime] = useState("")
  const [note, setNote] = useState("")

  const days = useMemo(() => monthDays(yr, mo), [yr, mo])
  const map = useMemo(() => {
    const m: Record<string, CalendarEvent[]> = {}
    events.forEach(e => { (m[e.date] ??= []).push(e) })
    return m
  }, [events])
  const selEvents = map[sel] || []

  const prev = useCallback(() => { if (mo === 0) { setYr(y => y - 1); setMo(11) } else setMo(m => m - 1) }, [mo])
  const next = useCallback(() => { if (mo === 11) { setYr(y => y + 1); setMo(0) } else setMo(m => m + 1) }, [mo])

  const handleAdd = () => {
    if (!title.trim()) { toast("请输入事项名称", "error"); return }
    addEvent({ id: uid(), date: sel, title: title.trim(), type, time: time || undefined, note: note || undefined })
    setEvents(getEvents()); setTitle(""); setTime(""); setNote(""); setShow(false); toast("事项已添加")
  }
  const handleDel = (id: string) => { deleteEvent(id); setEvents(getEvents()); toast("已删除") }

  return (
    <div className="animate-fade-in">
      <header className="gradient-hero px-5 pt-10 pb-5 md:pt-8 md:rounded-b-2xl">
        <h1 className="text-xl font-bold text-primary-foreground mb-3">日历管理</h1>
        <div className="flex items-center justify-between">
          <button onClick={prev} className="p-1.5 rounded-lg bg-primary-foreground/15 text-primary-foreground"><ChevronLeft className="w-5 h-5" /></button>
          <h2 className="text-primary-foreground font-semibold">{yr}年 {MONTHS[mo]}</h2>
          <button onClick={next} className="p-1.5 rounded-lg bg-primary-foreground/15 text-primary-foreground"><ChevronRight className="w-5 h-5" /></button>
        </div>
      </header>

      <div className="px-4 md:px-6 mt-2 space-y-4 md:grid md:grid-cols-5 md:gap-6 md:space-y-0">
        {/* Calendar */}
        <Card className="border-0 md:col-span-3">
          <CardContent className="p-3 md:p-4">
            <div className="grid grid-cols-7 mb-2">{WK.map(d => <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>)}</div>
            <div className="grid grid-cols-7 gap-0.5">
              {days.map((day, i) => {
                const isToday = day.full === todayStr, isSel = day.full === sel, has = !!map[day.full]?.length
                return (
                  <button key={i} onClick={() => setSel(day.full)} className={cn(
                    "relative flex flex-col items-center justify-center py-2 md:py-3 rounded-xl transition-all text-sm",
                    day.t !== "c" && "text-muted-foreground/40",
                    day.t === "c" && !isSel && "hover:bg-secondary",
                    isSel && "bg-primary text-primary-foreground shadow-glow",
                    isToday && !isSel && "font-bold text-primary"
                  )}>
                    {day.d}
                    {has && <div className={cn("absolute bottom-1 w-1 h-1 rounded-full", isSel ? "bg-primary-foreground" : "bg-primary")} />}
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Events */}
        <section className="md:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">{sel === todayStr ? "今日日程" : `${sel.slice(5)} 日程`}</h3>
            <Button size="sm" variant="gradient" onClick={() => setShow(true)}><Plus className="w-4 h-4 mr-1" />添加</Button>
          </div>
          {selEvents.length === 0 ? (
            <Card className="border-0"><CardContent className="py-8 text-center"><p className="text-sm text-muted-foreground">暂无日程安排</p></CardContent></Card>
          ) : (
            <div className="space-y-2 pb-4">{selEvents.map(ev => {
              const info = EVENT_TYPES[ev.type]
              return (
                <Card key={ev.id} className="border-0"><CardContent className="p-4 flex items-center gap-3">
                  <div className={cn("w-1.5 h-12 rounded-full", info.cls)} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm truncate">{ev.title}</p>
                      <span className={cn("text-[10px] px-1.5 py-0.5 rounded-md font-medium",
                        ev.type === "class" && "bg-primary/10 text-primary",
                        ev.type === "meeting" && "bg-accent/10 text-accent",
                        ev.type === "todo" && "bg-success/10 text-success",
                        ev.type === "other" && "bg-muted text-muted-foreground",
                      )}>{info.label}</span>
                    </div>
                    {ev.time && <p className="text-xs text-muted-foreground mt-0.5">{ev.time}</p>}
                    {ev.note && <p className="text-xs text-muted-foreground mt-0.5 truncate">{ev.note}</p>}
                  </div>
                  <button onClick={() => handleDel(ev.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
                </CardContent></Card>
              )
            })}</div>
          )}
        </section>
      </div>

      <Modal open={show} onClose={() => setShow(false)} title="添加日程">
        <div className="space-y-4">
          <Input label="事项名称" placeholder="例如：三年级数学课" value={title} onChange={e => setTitle(e.target.value)} />
          <Select label="类型" value={type} onChange={e => setType(e.target.value as CalendarEvent["type"])} options={[{value:"class",label:"课程"},{value:"meeting",label:"会议"},{value:"todo",label:"待办"},{value:"other",label:"其他"}]} />
          <Input label="时间（可选）" placeholder="09:00-10:30" value={time} onChange={e => setTime(e.target.value)} />
          <Input label="备注（可选）" placeholder="补充说明..." value={note} onChange={e => setNote(e.target.value)} />
          <Button variant="gradient" className="w-full" size="lg" onClick={handleAdd}>确认添加</Button>
        </div>
      </Modal>
    </div>
  )
}