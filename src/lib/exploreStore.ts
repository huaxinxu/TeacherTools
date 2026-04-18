/* ─── 世界探索 — localStorage 存储层 ─── */

import { addXp } from "@/lib/studentStore"
import type { Subject } from "@/lib/exploreData"

// ── localStorage keys ──
const K = {
  grade: "tt_stu_grade",
  adventure: "tt_stu_adventure",
  pvp: "tt_stu_pvp",
} as const

// ── 年级 ──

export function getStudentGrade(): 1 | 2 | 3 {
  const v = localStorage.getItem(K.grade)
  const n = v ? Number(v) : 1
  return (n >= 1 && n <= 3 ? n : 1) as 1 | 2 | 3
}

export function setStudentGrade(g: 1 | 2 | 3): void {
  localStorage.setItem(K.grade, String(g))
}

// ── 冒险进度 ──

export interface AdventureProgress {
  completed: boolean
  stars: number        // 1-3
  bestScore: number    // correctCount
  completedAt: number  // timestamp
}

function loadAdventure(): Record<string, AdventureProgress> {
  try {
    return JSON.parse(localStorage.getItem(K.adventure) || "{}")
  } catch { return {} }
}

function saveAdventure(data: Record<string, AdventureProgress>): void {
  localStorage.setItem(K.adventure, JSON.stringify(data))
}

export function getAdventureProgress(): Record<string, AdventureProgress> {
  return loadAdventure()
}

export function getLevelProgress(levelId: string): AdventureProgress | null {
  return loadAdventure()[levelId] ?? null
}

export function isLevelUnlocked(subject: Subject, grade: number, levelNum: number): boolean {
  if (levelNum <= 1) return true
  const prevId = `${subject}-${grade}-${levelNum - 1}`
  const prev = loadAdventure()[prevId]
  return prev?.completed === true
}

export function completeLevel(
  levelId: string,
  correctCount: number,
  totalQuestions: number,
  xpReward: number,
): { stars: number; xpEarned: number; isNewBest: boolean } {
  const data = loadAdventure()
  const prev = data[levelId]
  const pct = totalQuestions > 0 ? correctCount / totalQuestions : 0
  const stars = pct >= 1 ? 3 : pct >= 0.6 ? 2 : 1

  const isFirstClear = !prev?.completed
  const isNewBest = !prev || correctCount > prev.bestScore

  // XP: 首次通关全额，重复通关 1/3
  const xpEarned = isFirstClear ? xpReward : Math.max(1, Math.floor(xpReward / 3))

  if (isNewBest) {
    data[levelId] = {
      completed: true,
      stars: Math.max(stars, prev?.stars ?? 0),
      bestScore: correctCount,
      completedAt: Date.now(),
    }
  } else if (!prev?.completed) {
    data[levelId] = {
      completed: true,
      stars,
      bestScore: correctCount,
      completedAt: Date.now(),
    }
  }

  saveAdventure(data)
  addXp(xpEarned)

  return { stars: data[levelId]!.stars, xpEarned, isNewBest }
}

export function getSubjectProgress(subject: Subject, grade: number): { completed: number; total: number } {
  const data = loadAdventure()
  let completed = 0
  for (let i = 1; i <= 20; i++) {
    if (data[`${subject}-${grade}-${i}`]?.completed) completed++
  }
  return { completed, total: 20 }
}

// ── PVP 记录 ──

export interface PvpRecord {
  id: string
  timestamp: number
  opponent: string
  myScore: number
  opponentScore: number
  xpEarned: number
  subject: Subject
  result: "win" | "lose" | "draw"
}

function loadPvp(): PvpRecord[] {
  try {
    return JSON.parse(localStorage.getItem(K.pvp) || "[]")
  } catch { return [] }
}

export function getPvpHistory(): PvpRecord[] {
  return loadPvp()
}

export function getPvpStats(): { wins: number; losses: number; draws: number } {
  const records = loadPvp()
  let wins = 0, losses = 0, draws = 0
  for (const r of records) {
    if (r.result === "win") wins++
    else if (r.result === "lose") losses++
    else draws++
  }
  return { wins, losses, draws }
}

export function addPvpRecord(
  subject: Subject,
  opponent: string,
  myScore: number,
  opponentScore: number,
): PvpRecord {
  const result = myScore > opponentScore ? "win" : myScore < opponentScore ? "lose" : "draw"
  const xpEarned = result === "win" ? 15 : result === "draw" ? 10 : 5

  const record: PvpRecord = {
    id: `pvp-${Date.now()}`,
    timestamp: Date.now(),
    opponent,
    myScore,
    opponentScore,
    xpEarned,
    subject,
    result,
  }

  const data = loadPvp()
  data.push(record)
  localStorage.setItem(K.pvp, JSON.stringify(data))
  addXp(xpEarned)

  return record
}
