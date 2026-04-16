import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { login as authLogin, logout as authLogout, getCurrentUser, type UserInfo } from "@/lib/auth"

interface AuthContextType {
  user: UserInfo | null
  login: (username: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(() => getCurrentUser())

  const login = useCallback((username: string, password: string) => {
    const info = authLogin(username, password)
    if (info) { setUser(info); return true }
    return false
  }, [])

  const logout = useCallback(() => {
    authLogout()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
