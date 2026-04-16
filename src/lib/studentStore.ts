import { uid, fmtDate } from "./store"

/* ─── Types ─── */
export interface StudentTask {
  id: string
  title: string
  completed: boolean
  source: "teacher" | "self"
  createdAt: number
}

export interface HealthRecord {
  id: string
  date: string
  height: number
  weight: number
}

/* ─── Keys ─── */
const K = {
  xp: "tt_stu_xp",
  spent: "tt_stu_spent",
  checkin: "tt_stu_checkin",
  tasks: "tt_stu_tasks",
  inventory: "tt_stu_inventory",
  equipped: "tt_stu_equipped",
  health: "tt_stu_health",
  phone: "tt_stu_phone",
} as const

/* ─── Helpers ─── */
function loadNum(key: string): number {
  try { return Number(localStorage.getItem(key)) || 0 } catch { return 0 }
}
function saveNum(key: string, v: number) { localStorage.setItem(key, String(v)) }
function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch { return fallback }
}
function save<T>(key: string, v: T) { localStorage.setItem(key, JSON.stringify(v)) }

/* ─── XP / Level ─── */
const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500]

export function getLevel(xp: number) {
  let level = 1
  for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) level = i + 1
    else break
  }
  const currentThreshold = LEVEL_THRESHOLDS[level - 1] ?? 0
  const nextThreshold = LEVEL_THRESHOLDS[level] ?? currentThreshold + 500
  return {
    level,
    currentXp: xp - currentThreshold,
    nextLevelXp: nextThreshold - currentThreshold,
  }
}

export function getStudentXp(): number { return loadNum(K.xp) }
export function addXp(n: number) { saveNum(K.xp, getStudentXp() + n) }

export function getSpentPoints(): number { return loadNum(K.spent) }
export function spendPoints(n: number) { saveNum(K.spent, getSpentPoints() + n) }
export function getAvailablePoints(): number { return getStudentXp() - getSpentPoints() }

/* ─── Check-in ─── */
export function getCheckins(): string[] { return load<string[]>(K.checkin, []) }

export function hasCheckedInToday(): boolean {
  return getCheckins().includes(fmtDate(new Date()))
}

export function checkinToday(): boolean {
  if (hasCheckedInToday()) return false
  const list = getCheckins()
  list.push(fmtDate(new Date()))
  save(K.checkin, list)
  return true
}

export function getCheckinStreak(): number {
  const set = new Set(getCheckins())
  let streak = 0
  const d = new Date()
  while (set.has(fmtDate(d))) {
    streak++
    d.setDate(d.getDate() - 1)
  }
  return streak
}

/* ─── Tasks ─── */
export function getStudentTasks(): StudentTask[] { return load<StudentTask[]>(K.tasks, []) }

export function addStudentTask(title: string): StudentTask {
  const task: StudentTask = { id: uid(), title, completed: false, source: "self", createdAt: Date.now() }
  const list = getStudentTasks()
  list.push(task)
  save(K.tasks, list)
  return task
}

export function toggleTask(id: string) {
  const list = getStudentTasks().map(t => t.id === id ? { ...t, completed: !t.completed } : t)
  save(K.tasks, list)
}

export function deleteStudentTask(id: string) {
  save(K.tasks, getStudentTasks().filter(t => t.id !== id))
}

/* ─── Inventory / Equipment ─── */
export function getInventory(): string[] { return load<string[]>(K.inventory, []) }

export function addToInventory(itemId: string) {
  const inv = getInventory()
  if (!inv.includes(itemId)) { inv.push(itemId); save(K.inventory, inv) }
}

export function getEquipped(): Record<string, string> { return load<Record<string, string>>(K.equipped, {}) }

export function equipItem(slot: string, itemId: string) {
  const eq = getEquipped()
  eq[slot] = itemId
  save(K.equipped, eq)
}

/* ─── Health Records ─── */
export function getHealthRecords(): HealthRecord[] {
  return load<HealthRecord[]>(K.health, []).sort((a, b) => a.date.localeCompare(b.date))
}

export function addHealthRecord(date: string, height: number, weight: number) {
  const list = load<HealthRecord[]>(K.health, [])
  list.push({ id: uid(), date, height, weight })
  save(K.health, list)
}

export function deleteHealthRecord(id: string) {
  save(K.health, load<HealthRecord[]>(K.health, []).filter(r => r.id !== id))
}

/* ─── Phone ─── */
export function getStudentPhone(): string { return localStorage.getItem(K.phone) ?? "" }
export function setStudentPhone(phone: string) { localStorage.setItem(K.phone, phone) }
