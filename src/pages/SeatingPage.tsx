import { useState, useCallback } from "react"
import { Plus, Shuffle, Trash2, UserPlus, Grid3X3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Modal, Input, useToast } from "@/components/ui/shared"
import { getSeatingLayouts, saveSeatingLayout, deleteSeatingLayout, shuffle, uid, type SeatingLayout } from "@/lib/store"
import { cn } from "@/lib/utils"

function emptySeats(r: number, c: number): (string | null)[][] {
  return Array.from({ length: r }, () => Array(c).fill(null))
}

export default function SeatingPage() {
  const { toast } = useToast()
  const [layouts, setLayouts] = useState<SeatingLayout[]>(getSeatingLayouts)
  const [editing, setEditing] = useState<SeatingLayout | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [showStudent, setShowStudent] = useState(false)
  const [newName, setNewName] = useState("")
  const [newRows, setNewRows] = useState("5")
  const [newCols, setNewCols] = useState("6")
  const [studentName, setStudentName] = useState("")
  const [selSeat, setSelSeat] = useState<[number, number] | null>(null)

  const reload = () => setLayouts(getSeatingLayouts())

  const handleCreate = () => {
    const r = parseInt(newRows), c = parseInt(newCols)
    if (!newName.trim()) { toast("请输入名称", "error"); return }
    if (r < 1 || r > 10 || c < 1 || c > 10) { toast("行列需在1-10之间", "error"); return }
    const layout: SeatingLayout = { id: uid(), name: newName.trim(), rows: r, cols: c, seats: emptySeats(r, c), createdAt: Date.now() }
    saveSeatingLayout(layout); reload(); setEditing(layout); setShowCreate(false); setNewName(""); toast("已创建")
  }

  const handleSeatClick = (r: number, c: number) => {
    if (!editing) return
    if (editing.seats[r][c]) {
      const u = { ...editing, seats: editing.seats.map(row => [...row]) }
      u.seats[r][c] = null; setEditing(u); saveSeatingLayout(u); reload()
    } else {
      setSelSeat([r, c]); setStudentName(""); setShowStudent(true)
    }
  }

  const handleAddStudent = () => {
    if (!editing || !selSeat || !studentName.trim()) { toast("请输入姓名", "error"); return }
    const u = { ...editing, seats: editing.seats.map(row => [...row]) }
    u.seats[selSeat[0]][selSeat[1]] = studentName.trim()
    setEditing(u); saveSeatingLayout(u); reload(); setShowStudent(false)
  }

  const handleShuffle = useCallback(() => {
    if (!editing) return
    const students = editing.seats.flat().filter(Boolean) as string[]
    if (!students.length) { toast("请先添加学生", "error"); return }
    const shuffled = shuffle(students)
    const seats = emptySeats(editing.rows, editing.cols)
    let idx = 0
    for (let r = 0; r < editing.rows && idx < shuffled.length; r++)
      for (let c = 0; c < editing.cols && idx < shuffled.length; c++)
        seats[r][c] = shuffled[idx++]
    const u = { ...editing, seats }; setEditing(u); saveSeatingLayout(u); reload(); toast("座位已随机打乱")
  }, [editing, toast])

  const handleBatch = useCallback(() => {
    if (!editing) return
    const input = prompt("请输入学生姓名，用逗号或换行分隔：")
    if (!input) return
    const names = input.split(/[,，\n\r]+/).map(n => n.trim()).filter(Boolean)
    if (!names.length) return
    const seats = editing.seats.map(r => [...r])
    let idx = 0
    for (let r = 0; r < editing.rows && idx < names.length; r++)
      for (let c = 0; c < editing.cols && idx < names.length; c++)
        if (!seats[r][c]) seats[r][c] = names[idx++]
    if (idx < names.length) toast(`座位不足，${names.length - idx}人未安排`, "error")
    const u = { ...editing, seats }; setEditing(u); saveSeatingLayout(u); reload(); toast(`已添加 ${idx} 名学生`)
  }, [editing, toast])

  const cnt = editing ? editing.seats.flat().filter(Boolean).length : 0

  if (editing) {
    return (
      <div className="animate-fade-in">
        <header className="gradient-hero px-5 pt-10 pb-5 md:pt-8 md:rounded-b-2xl">
          <div className="flex items-center gap-3 mb-1">
            <button onClick={() => setEditing(null)} className="text-primary-foreground text-sm font-medium">&larr; 返回</button>
          </div>
          <h1 className="text-xl font-bold text-primary-foreground">{editing.name}</h1>
          <p className="text-primary-foreground/70 text-sm">{editing.rows}行 x {editing.cols}列 · {cnt}名学生</p>
        </header>
        <div className="px-4 md:px-6 -mt-4 space-y-4 md:grid md:grid-cols-3 md:gap-6 md:space-y-0">
          <Card className="border-0 md:col-span-2 md:order-1">
            <CardContent className="p-4">
              <div className="text-center text-xs text-muted-foreground mb-3 pb-2 border-b border-dashed">讲 台</div>
              <div className="overflow-x-auto scrollbar-hide">
                <div className="grid gap-1.5 min-w-fit mx-auto" style={{ gridTemplateColumns: `repeat(${editing.cols}, minmax(0,1fr))`, maxWidth: `${editing.cols * 72}px` }}>
                  {editing.seats.map((row, ri) => row.map((seat, ci) => (
                    <button key={`${ri}-${ci}`} onClick={() => handleSeatClick(ri, ci)}
                      className={cn("w-14 h-14 md:w-16 md:h-16 rounded-xl text-[10px] md:text-xs font-medium transition-all flex items-center justify-center text-center p-0.5 leading-tight",
                        seat ? "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20" : "bg-secondary text-muted-foreground hover:border-primary/30 border border-transparent"
                      )}>{seat || "+"}</button>
                  )))}
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground text-center mt-3">点击空座添加学生，点击已有学生移除</p>
            </CardContent>
          </Card>
          <Card className="border-0 md:col-span-1 md:order-2 md:sticky md:top-4 self-start">
            <CardContent className="p-4 flex flex-wrap gap-2 md:flex-col">
              <Button size="sm" variant="gradient" onClick={handleShuffle}><Shuffle className="w-4 h-4 mr-1" />随机排序</Button>
              <Button size="sm" variant="outline" onClick={handleBatch}><UserPlus className="w-4 h-4 mr-1" />批量添加</Button>
            </CardContent>
          </Card>
        </div>
        <Modal open={showStudent} onClose={() => setShowStudent(false)} title="添加学生">
          <div className="space-y-4">
            <Input label="学生姓名" placeholder="请输入姓名" value={studentName} onChange={e => setStudentName(e.target.value)} autoFocus />
            <Button variant="gradient" className="w-full" size="lg" onClick={handleAddStudent}>确认添加</Button>
          </div>
        </Modal>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <header className="gradient-hero px-5 pt-10 pb-5 md:pt-8 md:rounded-b-2xl">
        <h1 className="text-xl font-bold text-primary-foreground mb-1">座位表管理</h1>
        <p className="text-primary-foreground/70 text-sm">编排学生座位，支持随机打乱</p>
      </header>
      <div className="px-4 md:px-6 -mt-4 space-y-4">
        <Card className="border-0"><CardContent className="p-5">
          <Button variant="gradient" className="w-full md:w-auto" size="lg" onClick={() => { setNewName(""); setNewRows("5"); setNewCols("6"); setShowCreate(true) }}><Plus className="w-5 h-5 mr-2" />新建座位表</Button>
        </CardContent></Card>
        {layouts.length === 0 ? (
          <Card className="border-0"><CardContent className="py-10 text-center"><Grid3X3 className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" /><p className="text-sm text-muted-foreground">暂无座位表</p></CardContent></Card>
        ) : (
          <div className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0 pb-4">{layouts.map(l => {
            const n = l.seats.flat().filter(Boolean).length
            return (
              <Card key={l.id} className="border-0"><CardContent className="p-4 flex items-center justify-between">
                <button className="flex-1 text-left" onClick={() => setEditing(l)}>
                  <p className="font-semibold text-sm">{l.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{l.rows}x{l.cols} · {n}名学生</p>
                </button>
                <button onClick={() => { deleteSeatingLayout(l.id); reload(); toast("已删除") }} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
              </CardContent></Card>
            )
          })}</div>
        )}
      </div>
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="新建座位表">
        <div className="space-y-4">
          <Input label="名称" placeholder="例如：三年二班" value={newName} onChange={e => setNewName(e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="行数" type="number" value={newRows} onChange={e => setNewRows(e.target.value)} />
            <Input label="列数" type="number" value={newCols} onChange={e => setNewCols(e.target.value)} />
          </div>
          <Button variant="gradient" className="w-full" size="lg" onClick={handleCreate}>创建</Button>
        </div>
      </Modal>
    </div>
  )
}