import { useAuth } from "@/contexts/AuthContext"
import { getStudentXp, getLevel, getAvailablePoints } from "@/lib/studentStore"
import { Coins } from "lucide-react"
import type { UserRole } from "@/lib/auth"

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"]

export function TopInfoBar({ role }: { role: UserRole }) {
  const { user } = useAuth()
  if (!user) return null

  const today = new Date()
  const dateStr = `${today.getMonth() + 1}月${today.getDate()}日 星期${WEEKDAYS[today.getDay()]}`

  if (role === "teacher") {
    return (
      <div className="sticky top-0 z-30 bg-card/95 backdrop-blur-md border-b h-14 flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{user.avatar}</span>
          <span className="font-semibold text-sm">{user.displayName}</span>
        </div>
        <span className="text-xs text-muted-foreground">{dateStr}</span>
      </div>
    )
  }

  // Student mode
  const xp = getStudentXp()
  const { level, currentXp, nextLevelXp } = getLevel(xp)
  const points = getAvailablePoints()
  const progress = nextLevelXp > 0 ? (currentXp / nextLevelXp) * 100 : 100

  return (
    <div className="sticky top-0 z-30 bg-card/95 backdrop-blur-md border-b h-14 flex items-center gap-3 px-4 md:px-6">
      {/* Avatar + Name + Level */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {user.avatar.startsWith("/") ? (
          <img src={user.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
        ) : (
          <span className="text-2xl">{user.avatar}</span>
        )}
        <span className="font-semibold text-sm hidden sm:inline">{user.displayName}</span>
        <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold gradient-magic text-white">
          Lv.{level}
        </span>
      </div>

      {/* XP Progress */}
      <div className="flex-1 min-w-0 max-w-[200px]">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full gradient-hero rounded-full transition-all duration-500"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
          {currentXp} / {nextLevelXp} XP
        </p>
      </div>

      {/* Points */}
      <div className="flex items-center gap-1 flex-shrink-0 ml-auto">
        <Coins className="w-4 h-4 text-amber-500" />
        <span className="text-sm font-bold text-amber-600">{points}</span>
      </div>
    </div>
  )
}
