import { useMemo } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { ArrowLeft, Lock, Star, ChevronRight } from "lucide-react"
import { getLevelsForSubject, getSubjectInfo, getQuestionsForLevel } from "@/lib/exploreData"
import { getStudentGrade, getAdventureProgress, isLevelUnlocked } from "@/lib/exploreStore"
import type { Subject } from "@/lib/exploreData"

export default function AdventureLevelMapPage() {
  const { subject: subjectKey } = useParams<{ subject: string }>()
  const navigate = useNavigate()
  const grade = getStudentGrade()
  const subject = getSubjectInfo(subjectKey as Subject)
  const gradeLabel = ["", "一", "二", "三"][grade] + "年级"

  const { levels, progress } = useMemo(() => {
    const levels = getLevelsForSubject(subjectKey as Subject, grade)
    const progress = getAdventureProgress()
    return { levels, progress }
  }, [subjectKey, grade])

  const completedCount = levels.filter(l => progress[l.id]?.completed).length

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <header className={`bg-gradient-to-r ${subject.gradient} px-5 pt-10 pb-5 md:pt-8 md:rounded-b-2xl`}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/student/explore")}
            className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">{subject.icon} {subject.label}冒险</h1>
            <p className="text-white/70 text-sm mt-0.5">{gradeLabel} · 已通关 {completedCount}/20</p>
          </div>
        </div>
      </header>

      {/* Level Map */}
      <div className="px-4 md:px-6 -mt-4 pb-8">
        <div className="relative max-w-md mx-auto pt-6">
          {/* Vertical path line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-6 bottom-0 w-0.5 bg-muted" />

          {levels.map((level, i) => {
            const p = progress[level.id]
            const unlocked = isLevelUnlocked(subjectKey as Subject, grade, level.levelNum)
            const hasQuestions = level.questionIds.length > 0
            const canPlay = unlocked && hasQuestions
            const isLeft = i % 2 === 0

            return (
              <div key={level.id}
                className={`relative flex items-center mb-6 ${isLeft ? "flex-row" : "flex-row-reverse"}`}>
                {/* Connector dot on the center line */}
                <div className="absolute left-1/2 -translate-x-1/2 z-10">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    p?.completed
                      ? `bg-gradient-to-br ${subject.gradient} border-white shadow-sm`
                      : unlocked
                        ? "bg-white border-primary animate-pulse"
                        : "bg-muted border-muted-foreground/20"
                  }`} />
                </div>

                {/* Spacer for the other side */}
                <div className="w-1/2" />

                {/* Level card */}
                <div className={`w-1/2 ${isLeft ? "pr-8" : "pl-8"}`}>
                  {canPlay ? (
                    <Link to={`/student/explore/adventure/${subjectKey}/${level.id}`}
                      className={`block p-3 rounded-xl transition-all ${
                        p?.completed
                          ? "bg-card shadow-soft hover:shadow-medium"
                          : "bg-card shadow-soft ring-2 ring-primary/30 hover:ring-primary/50"
                      }`}>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-muted-foreground">{grade}-{level.levelNum}</span>
                        {p?.completed && (
                          <div className="flex gap-0.5">
                            {[1, 2, 3].map(s => (
                              <Star key={s} className={`w-3 h-3 ${s <= (p.stars ?? 0) ? "text-amber-400 fill-amber-400" : "text-muted-foreground/20"}`} />
                            ))}
                          </div>
                        )}
                        {!p?.completed && (
                          <span className="text-[10px] font-bold text-primary">GO</span>
                        )}
                      </div>
                      <p className="text-xs font-semibold mt-1 truncate">{level.title}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">+{level.xpReward} XP</p>
                    </Link>
                  ) : unlocked && !hasQuestions ? (
                    <div className="p-3 rounded-xl bg-card/50 border border-dashed border-muted-foreground/20">
                      <span className="text-[10px] font-bold text-muted-foreground">{grade}-{level.levelNum}</span>
                      <p className="text-xs font-semibold mt-1 truncate text-muted-foreground">{level.title}</p>
                      <p className="text-[10px] text-muted-foreground/60 mt-0.5">即将开放</p>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-muted/30 opacity-50">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-muted-foreground">{grade}-{level.levelNum}</span>
                        <Lock className="w-3 h-3 text-muted-foreground/40" />
                      </div>
                      <p className="text-xs font-semibold mt-1 truncate text-muted-foreground">{level.title}</p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
