import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Layout } from "@/components/Layout"
import { ToastProvider } from "@/components/ui/shared"
import { lazy, Suspense } from "react"

const HomePage = lazy(() => import("@/pages/HomePage"))
const CalendarPage = lazy(() => import("@/pages/CalendarPage"))
const ScorePage = lazy(() => import("@/pages/ScorePage"))
const SeatingPage = lazy(() => import("@/pages/SeatingPage"))
const DecibelPage = lazy(() => import("@/pages/DecibelPage"))
const ProfilePage = lazy(() => import("@/pages/ProfilePage"))

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="score" element={<ScorePage />} />
              <Route path="seating" element={<SeatingPage />} />
              <Route path="decibel" element={<DecibelPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ToastProvider>
  )
}
