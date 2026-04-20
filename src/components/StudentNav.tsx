import { NavLink, useNavigate } from "react-router-dom"
import { Home, BookOpen, ShoppingBag, User, Sparkles, LogOut, Compass } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/AuthContext"
import { useState } from "react";
import { ChangelogModal } from "@/components/ui/ChangelogModal";

const navItems = [
  { to: "/student", icon: Home, label: "我的中台", end: true },
  { to: "/student/homework", icon: BookOpen, label: "任务中心" },
  { to: "/student/explore", icon: Compass, label: "世界探索" },
  { to: "/student/shop", icon: ShoppingBag, label: "商城" },
  { to: "/student/profile", icon: User, label: "个人资料" },
]

export function StudentNav() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [changelogOpen, setChangelogOpen] = useState(false);

  const handleLogout = () => {
    logout()
    navigate("/login", { replace: true })
  }

  return (
    <>
      {/* ── PC Sidebar ── */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 w-60 gradient-sidebar flex-col z-40">
        <div className="flex items-center gap-3 px-5 h-16 border-b border-sidebar-border">
          <div className="w-8 h-8 rounded-lg gradient-magic flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-sidebar-foreground">My Class Realm</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-hide">
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} end={item.end}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-sidebar-active/20 text-primary-foreground"
                  : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-foreground/5"
              )}>
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-sidebar-border">
           <p className="text-xs text-sidebar-foreground/40">我的班级世界 1.0</p>
           <button className="flex items-center gap-2 text-xs text-sidebar-foreground/40 hover:text-sidebar-foreground/70 hover:bg-sidebar-accent rounded transition-colors w-full mb-2 nav-item" onClick={() => setChangelogOpen(true)}>版本更新日志</button>
           <ChangelogModal 
        open={changelogOpen} 
        onClose={() => setChangelogOpen(false)} 
      />
          <button onClick={handleLogout}
            className="flex items-center gap-2 text-xs text-sidebar-foreground/40 hover:text-sidebar-foreground/70 transition-colors w-full mb-2">
            <LogOut className="w-3.5 h-3.5" />
            <span>退出登录</span>
          </button>
         
        </div>
      </aside>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur-md border-t shadow-medium safe-bottom">
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} end={item.end}
              className={({ isActive }) => cn(
                "flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-colors min-w-[48px]",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
              {({ isActive }) => (
                <>
                  <div className={cn("p-1 rounded-lg", isActive && "bg-primary/10")}>
                    <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span className={cn("text-[10px]", isActive ? "font-semibold" : "font-medium")}>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  )
}
