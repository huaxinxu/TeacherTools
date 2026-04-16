import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Modal, useToast } from "@/components/ui/shared"
import { BookOpen, Clock, CheckCircle2, AlertCircle, Filter } from "lucide-react"
import { HOMEWORK_LIST, type HomeworkItem } from "@/lib/studentData"

type FilterType = "all" | "pending" | "completed" | "overdue"

const FILTERS: { key: FilterType; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "pending", label: "待完成" },
  { key: "completed", label: "已完成" },
  { key: "overdue", label: "已逾期" },
]

const STATUS_CONFIG: Record<HomeworkItem["status"], { label: string; color: string; icon: typeof CheckCircle2 }> = {
  pending: { label: "待完成", color: "bg-primary/10 text-primary", icon: Clock },
  completed: { label: "已完成", color: "bg-success/10 text-success", icon: CheckCircle2 },
  overdue: { label: "已逾期", color: "bg-destructive/10 text-destructive", icon: AlertCircle },
}

function daysDiff(deadline: string): number {
  const now = new Date(); now.setHours(0, 0, 0, 0)
  const dl = new Date(deadline); dl.setHours(0, 0, 0, 0)
  return Math.ceil((dl.getTime() - now.getTime()) / 86400000)
}

export default function StudentHomeworkPage() {
  const [filter, setFilter] = useState<FilterType>("all")
  const [statusOverride, setStatusOverride] = useState<Record<string, HomeworkItem["status"]>>({})
  const [detail, setDetail] = useState<HomeworkItem | null>(null)
  const { toast } = useToast()

  const items = useMemo(() => {
    return HOMEWORK_LIST.map(hw => ({
      ...hw,
      status: statusOverride[hw.id] ?? hw.status,
    })).filter(hw => filter === "all" || hw.status === filter)
  }, [filter, statusOverride])

  const handleComplete = (id: string) => {
    setStatusOverride(prev => ({ ...prev, [id]: "completed" }))
    setDetail(null)
    toast("已标记完成", "success")
  }

  const SUBJECT_COLOR: Record<string, string> = {
    "语文": "bg-red-50 text-red-600",
    "数学": "bg-blue-50 text-blue-600",
    "英语": "bg-green-50 text-green-600",
    "科学": "bg-purple-50 text-purple-600",
  }

  return (
    <div className="animate-fade-in">
      <header className="gradient-hero px-5 pt-10 pb-5 md:pt-8 md:rounded-b-2xl">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="w-5 h-5 text-white/80" />
          <h1 className="text-xl font-bold text-white">作业列表</h1>
        </div>
        <p className="text-white/70 text-sm">共 {HOMEWORK_LIST.length} 项作业</p>
      </header>

      <div className="px-4 md:px-6 -mt-4 space-y-4 pb-4">
        {/* Filter tabs */}
        <Card className="border-0">
          <CardContent className="p-3">
            <div className="flex items-center gap-1">
              <Filter className="w-4 h-4 text-muted-foreground mr-1" />
              {FILTERS.map(f => (
                <button key={f.key} onClick={() => setFilter(f.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    filter === f.key ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}>
                  {f.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Homework list */}
        {items.length === 0 ? (
          <Card className="border-0">
            <CardContent className="py-8 text-center">
              <BookOpen className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">暂无相关作业</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {items.map(hw => {
              const cfg = STATUS_CONFIG[hw.status]
              const days = daysDiff(hw.deadline)
              const StatusIcon = cfg.icon
              return (
                <button key={hw.id} onClick={() => setDetail(hw)} className="w-full text-left">
                  <Card className="border-0 hover:shadow-glow transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${SUBJECT_COLOR[hw.subject] ?? "bg-muted text-muted-foreground"}`}>
                              {hw.subject}
                            </span>
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium inline-flex items-center gap-1 ${cfg.color}`}>
                              <StatusIcon className="w-3 h-3" />
                              {cfg.label}
                            </span>
                          </div>
                          <p className="font-medium text-sm truncate">{hw.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {hw.assignedBy} | 截止 {hw.deadline}
                            {hw.status === "pending" && days > 0 && ` (剩余${days}天)`}
                            {hw.status === "overdue" && ` (已逾期${Math.abs(days)}天)`}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail?.title ?? ""}>
        {detail && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${SUBJECT_COLOR[detail.subject] ?? "bg-muted text-muted-foreground"}`}>
                {detail.subject}
              </span>
              <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${STATUS_CONFIG[statusOverride[detail.id] ?? detail.status].color}`}>
                {STATUS_CONFIG[statusOverride[detail.id] ?? detail.status].label}
              </span>
            </div>
            <p className="text-sm text-foreground leading-relaxed">{detail.description}</p>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>布置老师：{detail.assignedBy}</p>
              <p>截止日期：{detail.deadline}</p>
            </div>
            {(statusOverride[detail.id] ?? detail.status) !== "completed" && (
              <button onClick={() => handleComplete(detail.id)}
                className="w-full h-10 rounded-lg bg-success text-white text-sm font-semibold hover:opacity-90">
                标记完成
              </button>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
