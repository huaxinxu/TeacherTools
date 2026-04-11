import { Outlet } from "react-router-dom"
import { AppNav } from "./AppNav"

export function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      {/* Mobile: full width with bottom padding; PC: offset by sidebar width */}
      <main className="pb-20 md:pb-0 md:ml-60">
        <div className="max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}