import { Navigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import type { UserRole } from "@/lib/auth"
import type { ReactNode } from "react"

export function RequireAuth({ role, children }: { role: UserRole; children: ReactNode }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== role) return <Navigate to="/" replace />
  return <>{children}</>
}
