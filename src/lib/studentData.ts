import type { StudentTask } from "./studentStore"

/* ─── Homework ─── */
export interface HomeworkItem {
  id: string
  title: string
  subject: string
  description: string
  deadline: string
  status: "pending" | "completed" | "overdue"
  assignedBy: string
}

export const HOMEWORK_LIST: HomeworkItem[] = [
  {
    id: "hw1",
    title: "完成《草房子》读后感",
    subject: "语文",
    description: "阅读《草房子》第三章至第五章，写一篇不少于400字的读后感，要求有自己的思考和感悟。",
    deadline: "2026-04-18",
    status: "pending",
    assignedBy: "张老师",
  },
  {
    id: "hw2",
    title: "数学练习册第四单元",
    subject: "数学",
    description: "完成练习册P45-P52所有习题，注意列出完整的解题步骤，错题需要用红笔订正。",
    deadline: "2026-04-17",
    status: "pending",
    assignedBy: "李老师",
  },
  {
    id: "hw3",
    title: "英语单词默写",
    subject: "英语",
    description: "Unit 5 词汇表全部单词，家长签字确认默写正确率。要求正确率达到90%以上。",
    deadline: "2026-04-16",
    status: "overdue",
    assignedBy: "王老师",
  },
  {
    id: "hw4",
    title: "科学实验报告",
    subject: "科学",
    description: "完成\"植物的向光性\"实验报告，包含实验目的、材料、步骤、观察记录和结论五个部分。",
    deadline: "2026-04-20",
    status: "pending",
    assignedBy: "陈老师",
  },
  {
    id: "hw5",
    title: "古诗词背诵三首",
    subject: "语文",
    description: "背诵并默写《望庐山瀑布》《春晓》《静夜思》，明天课堂抽查。",
    deadline: "2026-04-15",
    status: "completed",
    assignedBy: "张老师",
  },
  {
    id: "hw6",
    title: "数学口算100题",
    subject: "数学",
    description: "完成100以内加减法口算练习，要求在10分钟内完成，准确率95%以上。",
    deadline: "2026-04-14",
    status: "completed",
    assignedBy: "李老师",
  },
  {
    id: "hw7",
    title: "英语对话练习",
    subject: "英语",
    description: "和同桌练习Unit 5的对话，录制一段2分钟的对话视频发送到班级群。",
    deadline: "2026-04-19",
    status: "pending",
    assignedBy: "王老师",
  },
  {
    id: "hw8",
    title: "手抄报：春天的故事",
    subject: "语文",
    description: "A4纸制作一张以\"春天\"为主题的手抄报，要求图文并茂，色彩丰富。",
    deadline: "2026-04-13",
    status: "overdue",
    assignedBy: "张老师",
  },
]

/* ─── Leaderboard ─── */
export interface LeaderboardEntry {
  id: string
  name: string
  avatar: string
  level: number
  xp: number
  weeklyXp: number
  monthlyXp: number
}

export const LEADERBOARD_DATA: LeaderboardEntry[] = [
  { id: "s1", name: "王小花", avatar: "👧", level: 8, xp: 3200, weeklyXp: 85, monthlyXp: 320 },
  { id: "s2", name: "刘子豪", avatar: "👦", level: 7, xp: 2800, weeklyXp: 92, monthlyXp: 350 },
  { id: "s3", name: "陈雨萱", avatar: "👧", level: 7, xp: 2650, weeklyXp: 78, monthlyXp: 290 },
  { id: "s4", name: "赵天宇", avatar: "👦", level: 6, xp: 1800, weeklyXp: 65, monthlyXp: 240 },
  { id: "current", name: "小明", avatar: "🧙‍♂️", level: 3, xp: 350, weeklyXp: 30, monthlyXp: 120 },
  { id: "s5", name: "孙悦", avatar: "👧", level: 5, xp: 1500, weeklyXp: 55, monthlyXp: 200 },
  { id: "s6", name: "周子涵", avatar: "👦", level: 5, xp: 1350, weeklyXp: 48, monthlyXp: 180 },
  { id: "s7", name: "吴思琪", avatar: "👧", level: 4, xp: 950, weeklyXp: 42, monthlyXp: 160 },
  { id: "s8", name: "郑浩然", avatar: "👦", level: 4, xp: 880, weeklyXp: 38, monthlyXp: 145 },
  { id: "s9", name: "冯佳怡", avatar: "👧", level: 3, xp: 520, weeklyXp: 35, monthlyXp: 130 },
  { id: "s10", name: "杨博文", avatar: "👦", level: 3, xp: 480, weeklyXp: 28, monthlyXp: 110 },
  { id: "s11", name: "许诗涵", avatar: "👧", level: 2, xp: 250, weeklyXp: 22, monthlyXp: 85 },
  { id: "s12", name: "何宇轩", avatar: "👦", level: 2, xp: 200, weeklyXp: 18, monthlyXp: 70 },
  { id: "s13", name: "张雅琪", avatar: "👧", level: 1, xp: 80, weeklyXp: 12, monthlyXp: 45 },
  { id: "s14", name: "林子墨", avatar: "👦", level: 1, xp: 45, weeklyXp: 8, monthlyXp: 30 },
]

/* ─── Shop Items ─── */
export interface ShopItem {
  id: string
  name: string
  description: string
  category: "costume" | "accessory" | "title"
  price: number
  icon: string
  rarity: "common" | "rare" | "epic" | "legendary"
}

export const SHOP_ITEMS: ShopItem[] = [
  // Costumes
  { id: "c1", name: "学徒法袍", description: "初入魔法学院的标准制服", category: "costume", price: 50, icon: "🧥", rarity: "common" },
  { id: "c2", name: "星辰长袍", description: "缀满星光的神秘长袍", category: "costume", price: 150, icon: "🌟", rarity: "rare" },
  { id: "c3", name: "烈焰战甲", description: "蕴含火焰之力的魔法铠甲", category: "costume", price: 300, icon: "🔥", rarity: "epic" },
  { id: "c4", name: "龙鳞圣袍", description: "传说中由龙鳞编织的至高法袍", category: "costume", price: 500, icon: "🐉", rarity: "legendary" },
  // Accessories
  { id: "a1", name: "木质法杖", description: "橡木制成的基础法杖", category: "accessory", price: 30, icon: "🪄", rarity: "common" },
  { id: "a2", name: "水晶球", description: "可以窥见未来的神秘水晶球", category: "accessory", price: 120, icon: "🔮", rarity: "rare" },
  { id: "a3", name: "智慧之冠", description: "佩戴后思维变得无比清晰", category: "accessory", price: 250, icon: "👑", rarity: "epic" },
  { id: "a4", name: "凤凰羽翼", description: "拥有不死鸟祝福的神圣羽翼", category: "accessory", price: 450, icon: "🪶", rarity: "legendary" },
  // Titles
  { id: "t1", name: "勤奋小蜜蜂", description: "每日坚持签到获得", category: "title", price: 20, icon: "🐝", rarity: "common" },
  { id: "t2", name: "学霸达人", description: "成绩优异者的专属称号", category: "title", price: 100, icon: "📚", rarity: "rare" },
  { id: "t3", name: "魔法精英", description: "掌握高阶魔法的精英学员", category: "title", price: 200, icon: "⚡", rarity: "epic" },
  { id: "t4", name: "大魔导师", description: "魔法学院至高荣誉称号", category: "title", price: 400, icon: "🏆", rarity: "legendary" },
]

/* ─── Teacher Tasks (static, cannot delete) ─── */
export const TEACHER_TASKS: StudentTask[] = [
  { id: "tt1", title: "完成数学练习册第三章", completed: false, source: "teacher", createdAt: 1713100000000 },
  { id: "tt2", title: "背诵古诗三首", completed: false, source: "teacher", createdAt: 1713200000000 },
  { id: "tt3", title: "英语课文朗读打卡", completed: false, source: "teacher", createdAt: 1713300000000 },
  { id: "tt4", title: "整理书包和文具", completed: true, source: "teacher", createdAt: 1713400000000 },
  { id: "tt5", title: "预习科学第六单元", completed: false, source: "teacher", createdAt: 1713500000000 },
]

/* ─── Rarity config ─── */
export const RARITY_CONFIG: Record<ShopItem["rarity"], { label: string; color: string }> = {
  common: { label: "普通", color: "bg-muted text-muted-foreground" },
  rare: { label: "稀有", color: "bg-primary/10 text-primary" },
  epic: { label: "史诗", color: "bg-accent/10 text-accent" },
  legendary: { label: "传说", color: "gradient-gold text-white" },
}
