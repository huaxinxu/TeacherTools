import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Layout } from "@/components/Layout"
import { StudentLayout } from "@/components/StudentLayout"
import { RequireAuth } from "@/components/RequireAuth"
import { AuthProvider, useAuth } from "@/contexts/AuthContext"
import { ToastProvider } from "@/components/ui/shared"
import { lazy, Suspense } from "react"

/* ── Teacher Pages ── */
const HomePage = lazy(() => import("@/pages/HomePage"))
const CalendarPage = lazy(() => import("@/pages/CalendarPage"))
const ScorePage = lazy(() => import("@/pages/ScorePage"))
const SeatingPage = lazy(() => import("@/pages/SeatingPage"))
const DecibelPage = lazy(() => import("@/pages/DecibelPage"))
const ProfilePage = lazy(() => import("@/pages/ProfilePage"))

/* ── Student Pages ── */
const StudentHomePage = lazy(() => import("@/pages/student/StudentHomePage"))
const StudentHomeworkPage = lazy(() => import("@/pages/student/StudentHomeworkPage"))
const StudentLeaderboardPage = lazy(() => import("@/pages/student/StudentLeaderboardPage"))
const StudentShopPage = lazy(() => import("@/pages/student/StudentShopPage"))
const StudentProfilePage = lazy(() => import("@/pages/student/StudentProfilePage"))
const PlaceholderPage = lazy(() => import("@/pages/student/PlaceholderPage"))

/* ── Auth Pages ── */
const LoginPage = lazy(() => import("@/pages/LoginPage"))

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function RootRedirect() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return <Navigate to={user.role === "teacher" ? "/teacher" : "/student"} replace />
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<RootRedirect />} />

              {/* Teacher Routes */}
              <Route path="/teacher" element={<RequireAuth role="teacher"><Layout /></RequireAuth>}>
                <Route index element={<HomePage />} />
                <Route path="calendar" element={<CalendarPage />} />
                <Route path="score" element={<ScorePage />} />
                <Route path="seating" element={<SeatingPage />} />
                <Route path="decibel" element={<DecibelPage />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>

              {/* Student Routes */}
              <Route path="/student" element={<RequireAuth role="student"><StudentLayout /></RequireAuth>}>
                <Route index element={<StudentHomePage />} />
                <Route path="homework" element={<StudentHomeworkPage />} />
                <Route path="rank" element={<StudentLeaderboardPage />} />
                <Route path="shop" element={<StudentShopPage />} />
                <Route path="profile" element={<StudentProfilePage />} />
                <Route path="game" element={<PlaceholderPage />} />
                <Route path="pvp" element={<PlaceholderPage />} />
              </Route>

              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  )
}
