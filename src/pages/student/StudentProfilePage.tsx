import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Modal, Input, Select, useToast } from "@/components/ui/shared"
import { User, School, Ruler, Phone, LogOut, Plus, ChevronRight } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import {
  getHealthRecords, addHealthRecord, getStudentPhone, setStudentPhone,
} from "@/lib/studentStore"
import { fmtDate } from "@/lib/store"
import type { HealthRecord } from "@/lib/studentStore"

/* ── Simple SVG Line Chart ── */
function LineChart({ records, filter }: { records: HealthRecord[]; filter: string }) {
  const filtered = useMemo(() => {
    const now = new Date()
    return records.filter(r => {
      const d = new Date(r.date)
      if (filter === "7d") return (now.getTime() - d.getTime()) <= 7 * 86400000
      if (filter === "30d") return (now.getTime() - d.getTime()) <= 30 * 86400000
      return true
    })
  }, [records, filter])

  if (filtered.length < 2) {
    return (
      <div className="h-40 flex items-center justify-center text-sm text-muted-foreground">
        至少需要2条记录才能绘制图表
      </div>
    )
  }

  const pad = 30
  const w = 320, h = 160
  const innerW = w - pad * 2, innerH = h - pad * 2

  const heights = filtered.map(r => r.height)
  const weights = filtered.map(r => r.weight)
  const hMin = Math.min(...heights) - 5, hMax = Math.max(...heights) + 5
  const wMin = Math.min(...weights) - 2, wMax = Math.max(...weights) + 2

  const toX = (i: number) => pad + (i / (filtered.length - 1)) * innerW
  const toYH = (v: number) => pad + innerH - ((v - hMin) / (hMax - hMin || 1)) * innerH
  const toYW = (v: number) => pad + innerH - ((v - wMin) / (wMax - wMin || 1)) * innerH

  const hPath = filtered.map((r, i) => `${i === 0 ? "M" : "L"}${toX(i)},${toYH(r.height)}`).join(" ")
  const wPath = filtered.map((r, i) => `${i === 0 ? "M" : "L"}${toX(i)},${toYW(r.weight)}`).join(" ")

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-40">
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map(p => (
        <line key={p} x1={pad} y1={pad + innerH * p} x2={w - pad} y2={pad + innerH * p}
          stroke="hsl(var(--border))" strokeWidth="0.5" />
      ))}
      {/* Height line (blue) */}
      <path d={hPath} fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {filtered.map((r, i) => (
        <circle key={`h${i}`} cx={toX(i)} cy={toYH(r.height)} r="3" fill="hsl(var(--primary))" />
      ))}
      {/* Weight line (orange) */}
      <path d={wPath} fill="none" stroke="hsl(var(--accent))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {filtered.map((r, i) => (
        <circle key={`w${i}`} cx={toX(i)} cy={toYW(r.weight)} r="3" fill="hsl(var(--accent))" />
      ))}
      {/* X axis dates */}
      {filtered.length <= 8 && filtered.map((r, i) => (
        <text key={`d${i}`} x={toX(i)} y={h - 4} textAnchor="middle" fontSize="7" fill="hsl(var(--muted-foreground))">
          {r.date.slice(5)}
        </text>
      ))}
      {/* Legend */}
      <circle cx={pad} cy={10} r="3" fill="hsl(var(--primary))" />
      <text x={pad + 6} y={13} fontSize="8" fill="hsl(var(--primary))">身高cm</text>
      <circle cx={pad + 50} cy={10} r="3" fill="hsl(var(--accent))" />
      <text x={pad + 56} y={13} fontSize="8" fill="hsl(var(--accent))">体重kg</text>
    </svg>
  )
}

/* ── Main Page ── */
export default function StudentProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  // Class binding
  const [region, setRegion] = useState("")
  const [applied, setApplied] = useState(false)

  // Health
  const [records, setRecords] = useState<HealthRecord[]>(getHealthRecords)
  const [showHealth, setShowHealth] = useState(false)
  const [hDate, setHDate] = useState(fmtDate(new Date()))
  const [hHeight, setHHeight] = useState("")
  const [hWeight, setHWeight] = useState("")
  const [chartFilter, setChartFilter] = useState("30d")

  // Phone
  const [phone, setPhone] = useState(getStudentPhone)
  const [showPhone, setShowPhone] = useState(false)
  const [phoneInput, setPhoneInput] = useState(phone)

  const handleApply = () => {
    setApplied(true)
    toast("申请已发送，等待老师审核", "success")
  }

  const handleAddHealth = () => {
    const h = Number(hHeight), w = Number(hWeight)
    if (!hDate || !h || !w) { toast("请填写完整信息", "error"); return }
    addHealthRecord(hDate, h, w)
    setRecords(getHealthRecords())
    setShowHealth(false)
    setHHeight(""); setHWeight("")
    toast("记录已添加", "success")
  }

  const handleSavePhone = () => {
    if (!/^1\d{10}$/.test(phoneInput)) { toast("请输入11位手机号", "error"); return }
    setStudentPhone(phoneInput)
    setPhone(phoneInput)
    setShowPhone(false)
    toast("手机号已更新", "success")
  }

  const maskPhone = (p: string) => p ? p.slice(0, 3) + "****" + p.slice(7) : "未绑定"

  const handleLogout = () => {
    logout()
    navigate("/login", { replace: true })
  }

  return (
    <div className="animate-fade-in">
      <header className="gradient-hero px-5 pt-10 pb-5 md:pt-8 md:rounded-b-2xl">
        <div className="flex items-center gap-2 mb-1">
          <User className="w-5 h-5 text-white/80" />
          <h1 className="text-xl font-bold text-white">个人中心</h1>
        </div>
        <p className="text-white/70 text-sm">{user?.displayName}</p>
      </header>

      <div className="px-4 md:px-6 -mt-4 space-y-4 pb-4">
        {/* Section 1: Class Binding */}
        <Card className="border-0">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <School className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-sm">班级绑定</h3>
            </div>
            <div className="bg-muted/50 rounded-xl p-3 mb-4">
              <p className="text-xs text-muted-foreground">当前班级</p>
              <p className="text-sm font-semibold mt-0.5">三年二班</p>
            </div>
            <div className="space-y-3">
              <Select label="选择地区" value={region} onChange={e => setRegion(e.target.value)}
                options={[{ value: "", label: "请选择" }, { value: "北京", label: "北京" }, { value: "上海", label: "上海" }, { value: "广州", label: "广州" }]} />
              {region && (
                <>
                  <Input label="搜索学校" placeholder={`搜索${region}的学校...`} />
                  <div className="bg-muted/50 rounded-lg p-2">
                    <p className="text-xs text-muted-foreground mb-1">搜索结果</p>
                    <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-card text-sm flex items-center justify-between">
                      <span>{region}市第一实验小学</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                  <button onClick={handleApply} disabled={applied}
                    className={`w-full h-9 rounded-lg text-sm font-medium ${
                      applied ? "bg-success/10 text-success" : "gradient-hero text-white hover:opacity-90"
                    }`}>
                    {applied ? "申请已发送" : "申请加入"}
                  </button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Health Records */}
        <Card className="border-0">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Ruler className="w-5 h-5 text-success" />
                <h3 className="font-semibold text-sm">身高体重记录</h3>
              </div>
              <button onClick={() => setShowHealth(true)}
                className="flex items-center gap-1 text-xs text-primary font-medium">
                <Plus className="w-3.5 h-3.5" /> 添加
              </button>
            </div>
            {/* Date filter */}
            <div className="flex gap-1 mb-3">
              {[{ k: "7d", l: "近7天" }, { k: "30d", l: "近30天" }, { k: "1y", l: "近1年" }].map(f => (
                <button key={f.k} onClick={() => setChartFilter(f.k)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium ${
                    chartFilter === f.k ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                  }`}>
                  {f.l}
                </button>
              ))}
            </div>
            <LineChart records={records} filter={chartFilter} />
            {/* Latest record */}
            {records.length > 0 && (
              <div className="mt-3 bg-muted/50 rounded-xl p-3 flex items-center justify-around">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">最新身高</p>
                  <p className="text-lg font-bold text-primary">{records[records.length - 1].height}<span className="text-xs font-normal">cm</span></p>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">最新体重</p>
                  <p className="text-lg font-bold text-accent">{records[records.length - 1].weight}<span className="text-xs font-normal">kg</span></p>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">记录日期</p>
                  <p className="text-sm font-medium">{records[records.length - 1].date}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Section 3: Account Info */}
        <Card className="border-0">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Phone className="w-5 h-5 text-accent" />
              <h3 className="font-semibold text-sm">账号信息</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">用户名</span>
                <span className="text-sm font-medium">{user?.username}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">角色</span>
                <span className="text-sm font-medium">学生</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">手机号</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{maskPhone(phone)}</span>
                  <button onClick={() => { setPhoneInput(phone); setShowPhone(true) }}
                    className="text-xs text-primary font-medium">编辑</button>
                </div>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">加入日期</span>
                <span className="text-sm font-medium">2026-03-01</span>
              </div>
            </div>
            <button onClick={handleLogout}
              className="w-full h-10 mt-4 rounded-lg border border-destructive/30 text-destructive text-sm font-medium hover:bg-destructive/5 flex items-center justify-center gap-2">
              <LogOut className="w-4 h-4" /> 退出登录
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Health record modal */}
      <Modal open={showHealth} onClose={() => setShowHealth(false)} title="添加身高体重记录">
        <div className="space-y-3">
          <Input label="日期" type="date" value={hDate} onChange={e => setHDate(e.target.value)} />
          <Input label="身高 (cm)" type="number" value={hHeight} onChange={e => setHHeight(e.target.value)} placeholder="如 145" />
          <Input label="体重 (kg)" type="number" value={hWeight} onChange={e => setHWeight(e.target.value)} placeholder="如 38" />
          <button onClick={handleAddHealth}
            className="w-full h-10 rounded-lg gradient-hero text-white text-sm font-semibold hover:opacity-90">
            保存记录
          </button>
        </div>
      </Modal>

      {/* Phone edit modal */}
      <Modal open={showPhone} onClose={() => setShowPhone(false)} title="修改手机号">
        <div className="space-y-3">
          <Input label="手机号" type="tel" value={phoneInput} onChange={e => setPhoneInput(e.target.value)}
            placeholder="输入11位手机号" maxLength={11} />
          <button onClick={handleSavePhone}
            className="w-full h-10 rounded-lg gradient-hero text-white text-sm font-semibold hover:opacity-90">
            保存
          </button>
        </div>
      </Modal>
    </div>
  )
}
