import { Link } from "react-router-dom"
import { Compass, Swords, Map, ChevronRight } from "lucide-react"
import { getStudentGrade } from "@/lib/exploreStore"

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
          <span className="text-white/70 text-sm">选择你的冒险方式</span>
          <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-medium">{gradeLabel}</span>
        </div>
      </header>

      <div className="px-4 md:px-6 -mt-4 space-y-4 pb-4 mt-2">
        {/* Adventure Mode Card */}
        <Link to="/student/explore/adventure"
          className="block bg-card rounded-2xl shadow-soft overflow-hidden hover:shadow-medium transition-all group">
          <div className="relative p-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-100/60 to-transparent rounded-bl-full" />
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-105 transition-transform">
                <Map className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg">冒险模式</h3>
                <p className="text-sm text-muted-foreground mt-1">探索语数英三大学科的知识关卡</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium">闯关挑战</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">获取积分</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-medium">星级评定</span>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-muted-foreground/40 flex-shrink-0 group-hover:translate-x-1 group-hover:text-emerald-500 transition-all" />
            </div>
          </div>
          <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500" />
        </Link>

        {/* PVP Mode Card */}
        <Link to="/student/explore/pvp"
          className="block bg-card rounded-2xl shadow-soft overflow-hidden hover:shadow-medium transition-all group">
          <div className="relative p-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-100/60 to-transparent rounded-bl-full" />
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 via-red-500 to-purple-600 flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-105 transition-transform">
                <Swords className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg">PVP 对战</h3>
                <p className="text-sm text-muted-foreground mt-1">匹配对手，限时答题竞技比拼</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">实时对战</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">限时挑战</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-medium">积分奖励</span>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-muted-foreground/40 flex-shrink-0 group-hover:translate-x-1 group-hover:text-amber-500 transition-all" />
            </div>
          </div>
          <div className="h-1.5 bg-gradient-to-r from-amber-400 via-red-500 to-purple-600" />
        </Link>
      </div>
    </div>
  )
}
