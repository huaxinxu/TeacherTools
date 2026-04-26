import { useMemo } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { ArrowLeft, Lock, Star, TreePine, MapPin, Sparkles } from "lucide-react"
import { getLevelsForSubject, getSubjectInfo } from "@/lib/exploreData"
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
    <div className="animate-fade-in h-screen overflow-auto bg-gradient-to-b from-green-50 to-emerald-100">
      {/* Header - 森林绿渐变，加装饰 */}
      <header className={`bg-gradient-to-r from-emerald-700 via-green-600 to-teal-500 px-5 pt-10 pb-6 md:pt-8 md:rounded-b-3xl sticky top-0 z-30 shadow-lg`}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/student/explore")}
            className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors shadow-md">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <TreePine className="w-6 h-6 text-emerald-200" />
              <h1 className="text-xl font-bold text-white">{subject.label}森林冒险</h1>
            </div>
            <p className="text-white/80 text-sm mt-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              {gradeLabel} · 已通关 {completedCount}/{levels.length}
            </p>
          </div>
        </div>
      </header>

      {/* 森林冒险地图主体 */}
      <div className="relative px-4 py-10 min-h-[calc(100vh-160px)]">
        {/* 森林背景图 - 加深透明度，不抢内容 */}
        <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
          <img 
            src="/vibe_images/background.jpeg" 
            className="w-full h-full object-cover"
            alt="森林冒险背景"
          />
          {/* 背景渐变叠加，增强氛围感 */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-50/60 to-emerald-100/80" />
        </div>

        <div className="relative max-w-lg mx-auto z-10">
          {levels.map((level, i) => {
            const p = progress[level.id]
            const unlocked = isLevelUnlocked(subjectKey as Subject, grade, level.levelNum)
            const hasQuestions = level.questionIds.length > 0
            const canPlay = unlocked && hasQuestions
            const isLeft = i % 2 === 0

            return (
              <div key={level.id} className="relative mb-20">
                {/* 蜿蜒的林间小路（用SVG实现起伏效果） */}
                {i > 0 && (
                  <div className="absolute left-1/2 -top-16 -translate-x-1/2 w-24 h-16 z-0">
                    <svg viewBox="0 0 100 60" className="w-full h-full">
                      <path
                        d={isLeft 
                          ? "M0 0 Q 50 20, 100 60" 
                          : "M100 0 Q 50 20, 0 60"
                        }
                        fill="none"
                        stroke="url(#pathGradient)"
                        strokeWidth="6"
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#166534" />
                          <stop offset="50%" stopColor="#15803d" />
                          <stop offset="100%" stopColor="#16a34a" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                )}

                {/* 关卡节点 */}
                <div className={`flex items-center ${isLeft ? "justify-start" : "justify-end"}`}>
                  <div className={`w-[220px] relative ${isLeft ? "mr-auto" : "ml-auto"}`}>
                    {/* 发光节点圆 */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-20">
                      {/* 外发光效果 */}
                      <div className={`absolute inset-0 rounded-full blur-md scale-125 opacity-60
                        ${p?.completed 
                          ? "bg-amber-400" 
                          : unlocked 
                            ? "bg-green-400" 
                            : "bg-gray-400"
                        }`} 
                      />
                      {/* 节点本体 */}
                      <div className={`relative w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-xl
                        ${p?.completed 
                          ? "bg-gradient-to-br from-amber-400 to-orange-500" 
                          : unlocked 
                            ? "bg-gradient-to-br from-green-400 to-emerald-600" 
                            : "bg-gradient-to-br from-gray-400 to-gray-600"
                        }`}>
                        {p?.completed ? (
                          <Star className="w-6 h-6 text-white fill-white" />
                        ) : unlocked ? (
                          <MapPin className="w-6 h-6 text-white" />
                        ) : (
                          <Lock className="w-6 h-6 text-white" />
                        )}
                      </div>
                    </div>

                    {/* 关卡卡片 - 木质纹理+叶子装饰 */}
                    {canPlay ? (
                      <Link to={`/student/explore/adventure/${subjectKey}/${level.id}`}>
                        <div className={`mt-8 p-4 rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2
                          ${p?.completed 
                            ? "bg-gradient-to-br from-amber-50 to-yellow-100 border-amber-300" 
                            : "bg-gradient-to-br from-green-50 to-emerald-100 border-green-400 animate-pulse"
                          }`}
                        style={{
                          backgroundImage: p?.completed 
                            ? "url('https://picsum.photos/id/152/200/200')" 
                            : "url('https://picsum.photos/id/152/200/200')",
                          backgroundBlendMode: "overlay",
                          backgroundSize: "cover"
                        }}>
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-emerald-800 bg-white/80 px-2 py-0.5 rounded-full">
                              第{level.levelNum}关
                            </span>
                            {p?.completed ? (
                              <div className="flex gap-0.5">
                                {[1,2,3].map(s => (
                                  <Star key={s} className={`w-4 h-4 ${s <= (p.stars ?? 0) ? "text-amber-500 fill-amber-500" : "text-gray-300"}`} />
                                ))}
                              </div>
                            ) : (
                              <span className="text-xs font-bold text-green-700 bg-green-200/80 px-2 py-0.5 rounded-full">
                                出发探险
                              </span>
                            )}
                          </div>
                          <h3 className="text-sm font-bold mt-2 truncate text-gray-800 flex items-center gap-1">
                            <TreePine className="w-4 h-4 text-green-600" />
                            {level.title}
                          </h3>
                          <p className="text-xs text-emerald-700 mt-1 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            奖励 +{level.xpReward} XP
                          </p>
                        </div>
                      </Link>
                    ) : (
                      <div className="mt-8 p-4 rounded-2xl bg-gray-100/80 border-2 border-gray-300 opacity-70 shadow-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-gray-500 bg-white/80 px-2 py-0.5 rounded-full">
                            第{level.levelNum}关
                          </span>
                          <Lock className="w-4 h-4 text-gray-400" />
                        </div>
                        <h3 className="text-sm font-bold mt-2 truncate text-gray-500">
                          {level.title}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">🔒 尚未解锁</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}