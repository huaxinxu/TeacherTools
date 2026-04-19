import { useMemo } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ArrowLeft, Trophy, ChevronRight } from "lucide-react"
import { SUBJECTS } from "@/lib/exploreData"
import { getStudentGrade, getSubjectProgress } from "@/lib/exploreStore"
import { LEADERBOARD_DATA } from "@/lib/studentData"
import { getStudentXp, getLevel } from "@/lib/studentStore"

function SubjectCard({ subject, grade }: { subject: typeof SUBJECTS[number]; grade: 1 | 2 | 3 }) {
  const progress = getSubjectProgress(subject.key, grade)
  const pct = Math.round((progress.completed / progress.total) * 100)

  return (
    <Link to={`/student/explore/adventure/${subject.key}`}
      className="block bg-card rounded-2xl shadow-soft overflow-hidden hover:shadow-medium transition-all group">
      <div className={`h-2 bg-gradient-to-r ${subject.gradient}`} />
      <div className="p-4 flex items-center gap-4">
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${subject.gradient} flex items-center justify-center text-2xl shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform`}>
          {subject.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm">{subject.label}冒险</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{subject.description}</p>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
              <div className={`h-full rounded-full bg-gradient-to-r ${subject.gradient} transition-all`}
                style={{ width: `${pct}%` }} />
            </div>
            <span className="text-[10px] text-muted-foreground font-medium">{progress.completed}/{progress.total}</span>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground/40 flex-shrink-0 group-hover:text-muted-foreground transition-colors" />
      </div>
    </Link>
  )
}

function MyRankCard() {
  const { rank, total, xp, level } = useMemo(() => {
    const myXp = getStudentXp()
    const lvl = getLevel(myXp)
    const data = LEADERBOARD_DATA.map(e =>
      e.id === "current" ? { ...e, xp: myXp, level: lvl.level } : e
    )
    const sorted = [...data].sort((a, b) => b.xp - a.xp)
    const idx = sorted.findIndex(e => e.id === "current")
    return { rank: idx + 1, total: sorted.length, xp: myXp, level: lvl.level }
  }, [])

  return (
    <Link to="/student/rank"
      className="block bg-card rounded-2xl shadow-soft overflow-hidden hover:shadow-medium transition-shadow">
      <div className="p-4 flex items-center gap-4">
        <div className="relative flex-shrink-0">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.3)]">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
            {rank}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold">我的排名</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            第 <span className="font-bold text-amber-600">{rank}</span> 名 / 共 {total} 人
          </p>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Lv.{level}</span>
            <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{xp} XP</span>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground/40 flex-shrink-0" />
      </div>
      <div className="h-1 bg-gradient-to-r from-amber-400 via-primary to-purple-500" />
    </Link>
  )
}

export default function AdventureSelectPage() {
  const navigate = useNavigate()
  const grade = getStudentGrade()
  const gradeLabel = ["", "一", "二", "三"][grade] + "年级"

  return (
    <div className="animate-fade-in">
      <header className="bg-gradient-to-br from-emerald-500 to-teal-600 px-5 pt-10 pb-5 md:pt-8 md:rounded-b-2xl">
        <button onClick={() => navigate("/student/explore")}
          className="flex items-center gap-1 text-white/70 hover:text-white text-sm mb-2 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>返回</span>
        </button>
        <h1 className="text-xl font-bold text-white">冒险模式</h1>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-white/70 text-sm">选择学科开始闯关之旅</span>
          <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-medium">{gradeLabel}</span>
        </div>
      </header>

      <div className="px-4 md:px-6 -mt-4 space-y-3 pb-4 mt-2">
        {SUBJECTS.map(s => (
          <SubjectCard key={s.key} subject={s} grade={grade} />
        ))}

        <div className="pt-2">
          <MyRankCard />
        </div>
      </div>
    </div>
  )
}
