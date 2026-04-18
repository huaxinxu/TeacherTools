import { useMemo, useState } from "react"
import { CalendarDays, Camera, Grid3X3, Mic, Trash2, Download, Upload, AlertTriangle, GraduationCap } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/shared"
import { useToast } from "@/components/ui/shared"
import { getEvents, getScores, getSeatingLayouts } from "@/lib/store"
import { getStudentGrade, setStudentGrade } from "@/lib/exploreStore"

export default function ProfilePage() {
  const { toast } = useToast()
  const [confirmClear, setConfirmClear] = useState(false)
  const [currentGrade, setCurrentGrade] = useState<1 | 2 | 3>(getStudentGrade)

  const stats = useMemo(() => ({
    events: getEvents().length,
    scores: getScores().length,
    seating: getSeatingLayouts().length,
  }), [])

  const handleExport = () => {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      events: getEvents(),
      scores: getScores(),
      seating: getSeatingLayouts(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `teacher-tools-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast("数据已导出")
  }

  const handleImport = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = () => {
      const file = input.files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result as string)
          if (data.events) localStorage.setItem("tt_events", JSON.stringify(data.events))
          if (data.scores) localStorage.setItem("tt_scores", JSON.stringify(data.scores))
          if (data.seating) localStorage.setItem("tt_seating", JSON.stringify(data.seating))
          toast("数据已导入，刷新页面生效")
        } catch {
          toast("导入失败，文件格式不正确", "error")
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  const handleClear = () => {
    localStorage.removeItem("tt_events")
    localStorage.removeItem("tt_scores")
    localStorage.removeItem("tt_seating")
    setConfirmClear(false)
    toast("所有数据已清除")
    setTimeout(() => window.location.reload(), 800)
  }

  const statCards = [
    { icon: CalendarDays, label: "日历事件", value: stats.events, color: "text-primary", bg: "bg-primary/10" },
    { icon: Camera, label: "计分记录", value: stats.scores, color: "text-accent", bg: "bg-accent/10" },
    { icon: Grid3X3, label: "座位方案", value: stats.seating, color: "text-success", bg: "bg-success/10" },
    { icon: Mic, label: "分贝检测", value: "实时", color: "text-orange-500", bg: "bg-orange-50" },
  ]

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold">个人中心</h1>
        <p className="text-sm text-muted-foreground mt-0.5">管理你的数据和设置</p>
      </div>

      <div className="md:grid md:grid-cols-3 md:gap-6 space-y-6 md:space-y-0">
        {/* Main content */}
        <div className="md:col-span-2 space-y-6">
          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {statCards.map(s => (
              <Card key={s.label}>
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-2`}>
                    <s.icon className={`w-5 h-5 ${s.color}`} />
                  </div>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Data management */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">数据管理</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                所有数据存储在浏览器本地 (localStorage)，更换浏览器或清除缓存会丢失数据。建议定期导出备份。
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" onClick={handleExport}>
                  <Download className="w-4 h-4 mr-2" /> 导出数据
                </Button>
                <Button variant="outline" onClick={handleImport}>
                  <Upload className="w-4 h-4 mr-2" /> 导入数据
                </Button>
                <Button variant="destructive" onClick={() => setConfirmClear(true)}>
                  <Trash2 className="w-4 h-4 mr-2" /> 清除数据
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side column */}
        <div className="space-y-4">
          {/* About card */}
          <Card className="gradient-hero text-primary-foreground">
            <CardContent className="p-5">
              <p className="font-bold text-lg mb-1">教师助手</p>
              <p className="text-sm opacity-90 mb-3">v1.0.0</p>
              <p className="text-xs opacity-75 leading-relaxed">
                专为教师设计的多功能工具集，涵盖日历管理、试卷计分、座位编排、课堂分贝监测等实用功能。
              </p>
            </CardContent>
          </Card>

          {/* Grade Setting */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-primary" />
                学生年级设置
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-xs text-muted-foreground mb-3">设置学生可以访问的冒险关卡年级</p>
              <div className="flex gap-2">
                {([1, 2, 3] as const).map(g => (
                  <button key={g}
                    onClick={() => {
                      setStudentGrade(g)
                      setCurrentGrade(g)
                      toast(`已设置为${["", "一", "二", "三"][g]}年级`, "success")
                    }}
                    className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                      currentGrade === g
                        ? "gradient-hero text-white shadow-glow"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}>
                    {["", "一", "二", "三"][g]}年级
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Features overview */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">功能概览</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <ul className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <CalendarDays className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">记录课程、会议和待办事项</span>
                </li>
                <li className="flex gap-3">
                  <Camera className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">拍照上传试卷，录入分数统计</span>
                </li>
                <li className="flex gap-3">
                  <Grid3X3 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">可视化编辑座位表，支持随机排序</span>
                </li>
                <li className="flex gap-3">
                  <Mic className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">实时分贝监测，管理课堂纪律</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-secondary/50">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                数据完全存储在你的浏览器中，不会上传到任何服务器，保护你和学生的隐私安全。
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirm Clear Modal */}
      <Modal open={confirmClear} onClose={() => setConfirmClear(false)} title="确认清除数据">
        <div className="flex flex-col items-center text-center py-2">
          <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <AlertTriangle className="w-7 h-7 text-destructive" />
          </div>
          <p className="text-sm text-muted-foreground mb-6">此操作将删除所有日历事件、计分记录和座位方案，且不可恢复。</p>
          <div className="flex gap-3 w-full">
            <Button variant="outline" className="flex-1" onClick={() => setConfirmClear(false)}>取消</Button>
            <Button variant="destructive" className="flex-1" onClick={handleClear}>确认清除</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
