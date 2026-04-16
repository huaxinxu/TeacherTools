export type UserRole = "teacher" | "student"

export interface UserInfo {
  role: UserRole
  username: string
  displayName: string
  avatar: string
}

const AUTH_KEY = "tt_auth"

const CREDENTIALS: Record<string, { password: string; info: UserInfo }> = {
  teacher: {
    password: "123456",
    info: { role: "teacher", username: "teacher", displayName: "张老师", avatar: "👩‍🏫" },
  },
  student: {
    password: "123456",
    info: { role: "student", username: "student", displayName: "小明", avatar: "/images/wizard-avatar.png" },
  },
}

export function login(username: string, password: string): UserInfo | null {
  const entry = CREDENTIALS[username]
  if (!entry || entry.password !== password) return null
  localStorage.setItem(AUTH_KEY, JSON.stringify(entry.info))
  return entry.info
}

export function logout(): void {
  localStorage.removeItem(AUTH_KEY)
}

export function getCurrentUser(): UserInfo | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY)
    if (!raw) return null
    return JSON.parse(raw) as UserInfo
  } catch {
    return null
  }
}
