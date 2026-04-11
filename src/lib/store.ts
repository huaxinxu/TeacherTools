// localStorage-based store for all teacher tools data

export interface CalendarEvent {
  id: string
  date: string // YYYY-MM-DD
  title: string
  type: "class" | "meeting" | "todo" | "other"
  time?: string
  note?: string
}

export interface ScoreRecord {
  id: string
  title: string
  date: string
  imageUrl?: string
  scores: number[]
  createdAt: number
}

export interface SeatingLayout {
  id: string
  name: string
  rows: number
  cols: number
  seats: (string | null)[][]
  createdAt: number
}

const KEYS = {
  events: "tt_events",
  scores: "tt_scores",
  seating: "tt_seating",
} as const

function load<T>(key: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]")
  } catch {
    return []
  }
}

function save<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data))
}

// Calendar Events
export const getEvents = () => load<CalendarEvent>(KEYS.events)
export const getEventsByDate = (date: string) => getEvents().filter(e => e.date === date)

export function addEvent(event: CalendarEvent) {
  const all = getEvents()
  all.push(event)
  save(KEYS.events, all)
}

export function deleteEvent(id: string) {
  save(KEYS.events, getEvents().filter(e => e.id !== id))
}

// Score Records
export const getScores = () => load<ScoreRecord>(KEYS.scores).sort((a, b) => b.createdAt - a.createdAt)

export function addScore(record: ScoreRecord) {
  const all = getScores()
  all.push(record)
  save(KEYS.scores, all)
}

export function deleteScore(id: string) {
  save(KEYS.scores, getScores().filter(r => r.id !== id))
}

// Seating Layouts
export const getSeatingLayouts = () => load<SeatingLayout>(KEYS.seating).sort((a, b) => b.createdAt - a.createdAt)

export function saveSeatingLayout(layout: SeatingLayout) {
  const all = getSeatingLayouts().filter(l => l.id !== layout.id)
  all.push(layout)
  save(KEYS.seating, all)
}

export function deleteSeatingLayout(id: string) {
  save(KEYS.seating, getSeatingLayouts().filter(l => l.id !== id))
}

// Utilities
export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7)

export function fmtDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export const EVENT_TYPES: Record<CalendarEvent["type"], { label: string; cls: string }> = {
  class: { label: "课程", cls: "bg-primary" },
  meeting: { label: "会议", cls: "bg-accent" },
  todo: { label: "待办", cls: "bg-success" },
  other: { label: "其他", cls: "bg-muted-foreground" },
}