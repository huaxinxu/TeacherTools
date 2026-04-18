import { useMemo } from "react"
import { Link } from "react-router-dom"
import { Compass, Swords, Trophy, ChevronRight } from "lucide-react"
import { SUBJECTS, getSubjectInfo } from "@/lib/exploreData"
import { getStudentGrade, getSubjectProgress, getPvpStats } from "@/lib/exploreStore"
import { LEADERBOARD_DATA } from "@/lib/studentData"
import { getStudentXp, getLevel } from "@/lib/studentStore"
import type { Subject } from "@/lib/exploreData"

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

function PvpEntryCard() {
  const stats = getPvpStats()
  const total = stats.wins + stats.losses + stats.draws

  return (
    <Link to="/student/explore/pvp"
      className="block bg-card rounded-2xl shadow-soft overflow-hidden hover:shadow-medium transition-all group">
      <div className="h-2 bg-gradient-to-r from-amber-400 via-red-500 to-purple-600" />
      <div className="p-4 flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-red-500 flex items-center justify-center shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform">
          <Swords className="w-7 h-7 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm">PVP 对战</h3>
          <p className="text-xs text-muted-foreground mt-0.5">匹配对手，限时答题竞技</p>
          {total > 0 && (
            <div className="flex items-center gap-3 mt-2">
              <span className="text-[10px] font-semibold text-emerald-500">{stats.wins}胜</span>
              <span className="text-[10px] font-semibold text-red-400">{stats.losses}负</span>
              <span className="text-[10px] font-semibold text-muted-foreground">{stats.draws}平</span>
            </div>
          )}
          {total === 0 && (
            <p className="text-[10px] text-primary font-medium mt-2">开始你的第一场对战!</p>
          )}
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

export default function ExploreHubPage() {
  const grade = getStudentGrade()
  const gradeLabel = ["", "一", "二", "三"][grade] + "年级"

  return (
    <div className="animate-fade-in">
      <header className="gradient-magic px-5 pt-10 pb-5 md:pt-8 md:rounded-b-2xl">
        <div className="flex items-center gap-2 mb-1">
          <Compass className="w-5 h-5 text-white/80" />
          <h1 className="text-xl font-bold text-white">世界探索</h1>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-white/70 text-sm">探索未知的魔法世界</span>
          <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-medium">{gradeLabel}</span>
        </div>
      </header>

      <div className="px-4 md:px-6 -mt-4 space-y-4 pb-4">
        {/* Adventure section */}
        <div>
          <h2 className="text-sm font-bold text-muted-foreground mb-2 mt-6">冒险模式</h2>
          <div className="space-y-3">
            {SUBJECTS.map(s => (
              <SubjectCard key={s.key} subject={s} grade={grade} />
            ))}
          </div>
        </div>

        {/* PVP section */}
        <div>
          <h2 className="text-sm font-bold text-muted-foreground mb-2">匹配对战</h2>
          <PvpEntryCard />
        </div>

        {/* Rank */}
        <MyRankCard />
      </div>
    </div>
  )
}
