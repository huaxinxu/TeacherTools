import { useState, useRef, useCallback } from "react"
import { Camera, Plus, Trash2, BarChart3, X, Image as ImgIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Modal, Input, useToast } from "@/components/ui/shared"
import { addScore, getScores, deleteScore, uid, fmtDate, type ScoreRecord } from "@/lib/store"
import { cn } from "@/lib/utils"
//拍照识别功能
function stats(s: number[]) {
  if (!s.length) return { avg: 0, max: 0, min: 0, cnt: 0 }
  const avg = s.reduce((a, b) => a + b, 0) / s.length
  return { avg: Math.round(avg * 10) / 10, max: Math.max(...s), min: Math.min(...s), cnt: s.length }
}

export default function ScorePage() {
  const { toast } = useToast()
  const fileRef = useRef<HTMLInputElement>(null)
  const [records, setRecords] = useState<ScoreRecord[]>(getScores)
  const [showAdd, setShowAdd] = useState(false)
  const [detail, setDetail] = useState<ScoreRecord | null>(null)
  const [title, setTitle] = useState("")
  const [imageUrl, setImageUrl] = useState<string>()
  const [inputs, setInputs] = useState<string[]>([""])

  const onImage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f || !f.type.startsWith("image/")) { toast("请选择图片", "error"); return }
    const r = new FileReader()
    r.onload = ev => setImageUrl(ev.target?.result as string)
    r.readAsDataURL(f)
  }, [toast])

  const handleSave = () => {
    if (!title.trim()) { toast("请输入标题", "error"); return }
    const scores = inputs.map(s => parseFloat(s)).filter(n => !isNaN(n))
    if (!scores.length) { toast("请至少输入一个有效分数", "error"); return }
    addScore({ id: uid(), title: title.trim(), date: fmtDate(new Date()), imageUrl, scores, createdAt: Date.now() })
    setRecords(getScores()); setTitle(""); setImageUrl(undefined); setInputs([""]); setShowAdd(false); toast("已保存")
  }

  const handleDel = (id: string) => { deleteScore(id); setRecords(getScores()); setDetail(null); toast("已删除") }

  return (
    <div className="animate-fade-in">
      <header className="gradient-hero px-5 pt-10 pb-5 md:pt-8 md:rounded-b-2xl">
        <h1 className="text-xl font-bold text-primary-foreground mb-1">拍照计分</h1>
        <p className="text-primary-foreground/70 text-sm">拍照上传试卷，快速录入并统计成绩</p>
      </header>

      <div className="px-4 md:px-6 -mt-4 space-y-4">
        <Card className="border-0"><CardContent className="p-5">
          <Button variant="gradient" className="w-full md:w-auto" size="lg" onClick={() => { setTitle(""); setImageUrl(undefined); setInputs([""]); setShowAdd(true) }}>
            <Camera className="w-5 h-5 mr-2" />新建记录
          </Button>
        </CardContent></Card>

        <section>
          <h2 className="text-base font-semibold mb-3">成绩记录 ({records.length})</h2>
          {records.length === 0 ? (
            <Card className="border-0"><CardContent className="py-10 text-center">
              <BarChart3 className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">暂无成绩记录</p>
            </CardContent></Card>
          ) : (
            <div className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0 pb-4">{records.map(r => {
              const s = stats(r.scores)
              return (
                <button key={r.id} className="w-full text-left" onClick={() => setDetail(r)}>
                  <Card className="border-0 hover:shadow-glow transition-shadow"><CardContent className="p-4 flex items-start gap-3">
                    {r.imageUrl ? <img src={r.imageUrl} alt="" className="w-14 h-14 rounded-xl object-cover flex-shrink-0" /> : <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0"><ImgIcon className="w-6 h-6 text-muted-foreground" /></div>}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{r.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{r.date}</p>
                      <div className="flex gap-3 mt-2">
                        <span className="text-xs text-muted-foreground">人数 <span className="font-semibold text-foreground">{s.cnt}</span></span>
                        <span className="text-xs text-muted-foreground">均分 <span className="font-semibold text-primary">{s.avg}</span></span>
                        <span className="text-xs text-muted-foreground">最高 <span className="font-semibold text-success">{s.max}</span></span>
                      </div>
                    </div>
                  </CardContent></Card>
                </button>
              )
            })}</div>
          )}
        </section>
      </div>

      {/* Add Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="新建成绩记录">
        <div className="space-y-4">
          <Input label="标题" placeholder="例如：第一单元测验" value={title} onChange={e => setTitle(e.target.value)} />
          <div className="space-y-1.5">
            <label className="text-sm font-medium">上传试卷照片（可选）</label>
            <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={onImage} />
            {imageUrl ? (
              <div className="relative"><img src={imageUrl} alt="" className="w-full h-40 object-cover rounded-xl" /><button onClick={() => setImageUrl(undefined)} className="absolute top-2 right-2 p-1 rounded-lg bg-foreground/60 text-primary-foreground"><X className="w-4 h-4" /></button></div>
            ) : (
              <button onClick={() => fileRef.current?.click()} className="w-full h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-secondary/50 transition-colors">
                <Camera className="w-6 h-6 text-muted-foreground" /><span className="text-sm text-muted-foreground">点击拍照或上传图片</span>
              </button>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">输入分数</label>
            <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
              {inputs.map((v, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-6 text-center flex-shrink-0">{i + 1}</span>
                  <input type="number" inputMode="decimal" placeholder="分数" value={v} onChange={e => { const n = [...inputs]; n[i] = e.target.value; setInputs(n) }}
                    className="flex-1 h-9 px-3 rounded-lg border bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
                  {inputs.length > 1 && <button onClick={() => setInputs(inputs.filter((_, j) => j !== i))} className="p-1.5 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>}
                </div>
              ))}
            </div>
            <button onClick={() => setInputs([...inputs, ""])} className="flex items-center gap-1 text-sm text-primary font-medium mt-2"><Plus className="w-4 h-4" />添加一行</button>
          </div>
          <Button variant="gradient" className="w-full" size="lg" onClick={handleSave}>保存记录</Button>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail?.title || ""}>
        {detail && (() => {
          const s = stats(detail.scores)
          return (
            <div className="space-y-4">
              {detail.imageUrl && <img src={detail.imageUrl} alt="" className="w-full h-48 object-cover rounded-xl" />}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-secondary rounded-xl p-3 text-center"><p className="text-xs text-muted-foreground">人数</p><p className="text-xl font-bold mt-0.5">{s.cnt}</p></div>
                <div className="bg-primary/10 rounded-xl p-3 text-center"><p className="text-xs text-muted-foreground">平均分</p><p className="text-xl font-bold text-primary mt-0.5">{s.avg}</p></div>
                <div className="bg-success/10 rounded-xl p-3 text-center"><p className="text-xs text-muted-foreground">最高分</p><p className="text-xl font-bold text-success mt-0.5">{s.max}</p></div>
                <div className="bg-destructive/10 rounded-xl p-3 text-center"><p className="text-xs text-muted-foreground">最低分</p><p className="text-xl font-bold text-destructive mt-0.5">{s.min}</p></div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">分数列表</h4>
                <div className="flex flex-wrap gap-2">{detail.scores.map((sc, i) => (
                  <span key={i} className={cn("px-2.5 py-1 rounded-lg text-xs font-medium", sc >= 90 ? "bg-success/10 text-success" : sc >= 60 ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive")}>{sc}</span>
                ))}</div>
              </div>
              <Button variant="outline" className="w-full text-destructive hover:bg-destructive/10" onClick={() => handleDel(detail.id)}><Trash2 className="w-4 h-4 mr-2" />删除记录</Button>
            </div>
          )
        })()}
      </Modal>
    </div>
  )
}