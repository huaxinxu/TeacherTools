import { Outlet } from "react-router-dom"
import { StudentNav } from "./StudentNav"
import { TopInfoBar } from "./TopInfoBar"

export function StudentLayout() {
  return (
    <div className="min-h-screen bg-background">
      <StudentNav />
      <main className="pb-20 md:pb-0 md:ml-60">
        <div className="max-w-5xl mx-auto">
          <TopInfoBar role="student" />
          <Outlet />
        </div>
      </main>
    </div>
  )
}
