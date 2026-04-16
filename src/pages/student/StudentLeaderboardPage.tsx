import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Trophy } from "lucide-react"
import { LEADERBOARD_DATA } from "@/lib/studentData"
import { getStudentXp, getLevel } from "@/lib/studentStore"

type TimeFilter = "weekly" | "monthly" | "all"

const FILTERS: { key: TimeFilter; label: string }[] = [
  { key: "weekly", label: "本周" },
  { key: "monthly", label: "本月" },
  { key: "all", label: "总榜" },
]

const MEDALS = ["🥇", "🥈", "🥉"]

export default function StudentLeaderboardPage() {
  const [filter, setFilter] = useState<TimeFilter>("all")

  const sorted = useMemo(() => {
    const xp = getStudentXp()
    const lvl = getLevel(xp)
    const data = LEADERBOARD_DATA.map(e =>
      e.id === "current" ? { ...e, xp, level: lvl.level, weeklyXp: Math.min(xp, e.weeklyXp + 10), monthlyXp: Math.min(xp, e.monthlyXp + 30) } : e
    )
    const key = filter === "weekly" ? "weeklyXp" : filter === "monthly" ? "monthlyXp" : "xp"
    return [...data].sort((a, b) => b[key] - a[key])
  }, [filter])

  const xpKey = filter === "weekly" ? "weeklyXp" : filter === "monthly" ? "monthlyXp" : "xp"
  const top3 = sorted.slice(0, 3)
  const rest = sorted.slice(3)

  // Reorder for podium: [#2, #1, #3]
  const podiumOrder = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : top3

  return (
    <div className="animate-fade-in">
      <header className="gradient-gold px-5 pt-10 pb-5 md:pt-8 md:rounded-b-2xl">
        <div className="flex items-center gap-2 mb-1">
          <Trophy className="w-5 h-5 text-white/80" />
          <h1 className="text-xl font-bold text-white">排行榜</h1>
        </div>
        <p className="text-white/70 text-sm">与同学们一起进步</p>
      </header>

      <div className="px-4 md:px-6 -mt-4 space-y-4 pb-4">
        {/* Time filters */}
        <Card className="border-0">
          <CardContent className="p-3">
            <div className="flex items-center gap-1 justify-center">
              {FILTERS.map(f => (
                <button key={f.key} onClick={() => setFilter(f.key)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    filter === f.key ? "gradient-gold text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}>
                  {f.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Podium Top 3 */}
        {top3.length >= 3 && (
          <div className="flex items-end justify-center gap-3 pt-4 pb-2">
            {podiumOrder.map((entry, i) => {
              const rank = i === 0 ? 2 : i === 1 ? 1 : 3
              const isCenter = rank === 1
              const isCurrent = entry.id === "current"
              return (
                <div key={entry.id} className={`flex flex-col items-center ${isCenter ? "mb-4" : ""}`}>
                  <span className="text-2xl mb-1">{MEDALS[rank - 1]}</span>
                  <div className={`${isCenter ? "w-16 h-16" : "w-12 h-12"} rounded-full flex items-center justify-center text-2xl ${
                    isCurrent ? "ring-2 ring-primary ring-offset-2" : ""
                  } bg-gradient-to-br from-amber-50 to-orange-50`}>
                    {entry.avatar}
                  </div>
                  <p className={`text-xs font-semibold mt-1.5 ${isCurrent ? "text-primary" : ""}`}>{entry.name}</p>
                  <span className="text-[10px] text-muted-foreground">Lv.{entry.level}</span>
                  <span className="text-xs font-bold text-amber-600 mt-0.5">{entry[xpKey]} XP</span>
                </div>
              )
            })}
          </div>
        )}

        {/* Rest of leaderboard */}
        <Card className="border-0">
          <CardContent className="p-0 divide-y">
            {rest.map((entry, i) => {
              const rank = i + 4
              const isCurrent = entry.id === "current"
              return (
                <div key={entry.id}
                  className={`flex items-center gap-3 px-4 py-3 ${isCurrent ? "bg-primary/5" : ""}`}>
                  <span className="w-6 text-center text-sm font-bold text-muted-foreground">{rank}</span>
                  <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-lg">
                    {entry.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isCurrent ? "text-primary" : ""}`}>
                      {entry.name}
                      {isCurrent && <span className="text-[10px] ml-1 text-primary/60">(我)</span>}
                    </p>
                    <span className="text-[10px] text-muted-foreground">Lv.{entry.level}</span>
                  </div>
                  <span className="text-sm font-bold text-amber-600">{entry[xpKey]}</span>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
