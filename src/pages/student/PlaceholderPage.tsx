import { Gamepad2 } from "lucide-react"
import { useLocation } from "react-router-dom"

const TITLES: Record<string, string> = {
  "/student/game": "游戏模块",
  "/student/pvp": "匹配对战",
}

export default function PlaceholderPage() {
  const { pathname } = useLocation()
  const title = TITLES[pathname] ?? "功能开发中"

  return (
    <div className="animate-fade-in">
      <header className="gradient-magic px-5 pt-10 pb-5 md:pt-8 md:rounded-b-2xl">
        <h1 className="text-xl font-bold text-white">{title}</h1>
      </header>
      <div className="px-4 md:px-6 -mt-4">
        <div className="bg-card rounded-2xl shadow-medium p-8 text-center">
          <div className="relative inline-block mb-6">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto">
              <Gamepad2 className="w-10 h-10 text-muted-foreground/50" />
            </div>
            <div className="absolute inset-0 rounded-full animate-pulse-ring border-2 border-primary/30" />
          </div>
          <h2 className="text-xl font-bold mb-2">即将上线</h2>
          <p className="text-muted-foreground text-sm">该功能正在开发中，敬请期待</p>
        </div>
      </div>
    </div>
  )
}
