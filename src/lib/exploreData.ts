/* ─── 世界探索 — 类型定义 + 题库 + 关卡 + Bot ─── */

// ── 基础类型 ──

export type Subject = "chinese" | "math" | "english"
export type QuestionType = "fill-in" | "choice" | "scenario"

export interface SubjectInfo {
  key: Subject
  label: string
  icon: string
  gradient: string
  color: string
  description: string
}

export const SUBJECTS: SubjectInfo[] = [
  { key: "chinese", label: "语文", icon: "📖", gradient: "from-rose-400 to-pink-600", color: "text-rose-500", description: "拼音、汉字、诗词、阅读" },
  { key: "math", label: "数学", icon: "🔢", gradient: "from-blue-400 to-indigo-600", color: "text-blue-500", description: "计算、图形、应用题" },
  { key: "english", label: "英语", icon: "🔤", gradient: "from-emerald-400 to-teal-600", color: "text-emerald-500", description: "字母、单词、对话" },
]

export function getSubjectInfo(s: Subject): SubjectInfo {
  return SUBJECTS.find(x => x.key === s)!
}

// ── 题目类型 ──

export interface FillInQuestion {
  id: string; type: "fill-in"; subject: Subject; grade: 1 | 2 | 3
  prompt: string; answer: string; explanation?: string
}
export interface ChoiceQuestion {
  id: string; type: "choice"; subject: Subject; grade: 1 | 2 | 3
  prompt: string; options: string[]; correctIndex: number; explanation?: string
}
export interface ScenarioQuestion {
  id: string; type: "scenario"; subject: Subject; grade: 1 | 2 | 3
  scenario: string; prompt: string; options: string[]; correctIndex: number; explanation?: string
}
export type Question = FillInQuestion | ChoiceQuestion | ScenarioQuestion

// ── 关卡定义 ──

export interface LevelDef {
  id: string        // "chinese-1-3"
  subject: Subject
  grade: 1 | 2 | 3
  levelNum: number
  title: string
  questionIds: string[]
  xpReward: number
}

// ── PVP Bot ──

export interface PvpBot {
  name: string
  avatar: string
  level: number
  accuracy: number
}

export const PVP_BOTS: PvpBot[] = [
  { name: "学霸小花", avatar: "👧", level: 7, accuracy: 0.75 },
  { name: "聪明豆", avatar: "🐱", level: 5, accuracy: 0.65 },
  { name: "书虫阿宝", avatar: "🐼", level: 4, accuracy: 0.6 },
  { name: "闪电侠", avatar: "⚡", level: 6, accuracy: 0.7 },
  { name: "小小博士", avatar: "🎓", level: 8, accuracy: 0.8 },
  { name: "糊涂蛋", avatar: "🥚", level: 2, accuracy: 0.45 },
  { name: "大力士", avatar: "💪", level: 3, accuracy: 0.5 },
  { name: "梦想家", avatar: "🌟", level: 5, accuracy: 0.65 },
]

// ── 题库 ──
// 按 subject + grade 组织，id 格式：{subject}-g{grade}-q{num}

export const QUESTION_BANK: Question[] = [

  // ═══════════════════════════════════════
  //  语文 · 一年级
  // ═══════════════════════════════════════

  // 关卡1: 认识拼音
  { id: "ch-g1-q1", type: "choice", subject: "chinese", grade: 1, prompt: "「b」的正确读音是？", options: ["玻", "坡", "摸", "佛"], correctIndex: 0, explanation: "b 读作「玻」" },
  { id: "ch-g1-q2", type: "fill-in", subject: "chinese", grade: 1, prompt: "请写出「妈妈」的拼音（不含声调）", answer: "mama", explanation: "妈妈的拼音是 māma" },
  { id: "ch-g1-q3", type: "choice", subject: "chinese", grade: 1, prompt: "下列哪个是韵母？", options: ["a", "b", "d", "g"], correctIndex: 0, explanation: "a 是韵母，b/d/g 都是声母" },
  { id: "ch-g1-q4", type: "scenario", subject: "chinese", grade: 1, scenario: "小明在学习拼音，看到一个字母长得像数字6。", prompt: "这个字母是什么？", options: ["b", "d", "p", "q"], correctIndex: 0, explanation: "b 像数字6，d 像反写的6" },

  // 关卡2: 基础汉字
  { id: "ch-g1-q5", type: "fill-in", subject: "chinese", grade: 1, prompt: "「日」字有几画？", answer: "4", explanation: "日字共4画" },
  { id: "ch-g1-q6", type: "choice", subject: "chinese", grade: 1, prompt: "「大」字的笔顺第一笔是？", options: ["横", "撇", "竖", "捺"], correctIndex: 0, explanation: "大字笔顺：横、撇、捺" },
  { id: "ch-g1-q7", type: "choice", subject: "chinese", grade: 1, prompt: "下面哪个字是上下结构？", options: ["花", "明", "你", "他"], correctIndex: 0, explanation: "花是上下结构（艹+化）" },
  { id: "ch-g1-q8", type: "fill-in", subject: "chinese", grade: 1, prompt: "一（）二（）三（）请在括号里填数字的大写：壹、___、___", answer: "贰叁", explanation: "一二三的大写是壹贰叁" },

  // 关卡3: 简单词语
  { id: "ch-g1-q9", type: "choice", subject: "chinese", grade: 1, prompt: "「高兴」的反义词是？", options: ["伤心", "开心", "快乐", "高大"], correctIndex: 0, explanation: "高兴的反义词是伤心" },
  { id: "ch-g1-q10", type: "scenario", subject: "chinese", grade: 1, scenario: "放学了，天上下起了小雨。", prompt: "形容小雨可以用哪个词？", options: ["毛毛雨", "倾盆大雨", "狂风暴雨", "暴风雪"], correctIndex: 0, explanation: "小雨用「毛毛雨」形容最合适" },
  { id: "ch-g1-q11", type: "fill-in", subject: "chinese", grade: 1, prompt: "春天来了，花儿___了。（填一个字）", answer: "开", explanation: "春天来了，花儿开了" },
  { id: "ch-g1-q12", type: "choice", subject: "chinese", grade: 1, prompt: "「红红的太阳」中「红红的」描述的是什么？", options: ["太阳的颜色", "太阳的大小", "太阳的形状", "太阳的温度"], correctIndex: 0, explanation: "「红红的」形容太阳的颜色" },

  // 关卡4: 古诗入门
  { id: "ch-g1-q13", type: "fill-in", subject: "chinese", grade: 1, prompt: "锄禾日当午，汗滴___下土。", answer: "禾", explanation: "《悯农》：锄禾日当午，汗滴禾下土" },
  { id: "ch-g1-q14", type: "choice", subject: "chinese", grade: 1, prompt: "「床前明月光」出自哪首诗？", options: ["静夜思", "春晓", "悯农", "咏鹅"], correctIndex: 0, explanation: "这是李白的《静夜思》" },
  { id: "ch-g1-q15", type: "choice", subject: "chinese", grade: 1, prompt: "「鹅鹅鹅，曲项向天歌」的作者是？", options: ["骆宾王", "李白", "杜甫", "白居易"], correctIndex: 0, explanation: "《咏鹅》是骆宾王7岁时写的" },
  { id: "ch-g1-q16", type: "scenario", subject: "chinese", grade: 1, scenario: "春天的早晨，小鸟在窗外叫。你想起了一首古诗。", prompt: "这首诗最可能是？", options: ["春晓", "静夜思", "悯农", "咏鹅"], correctIndex: 0, explanation: "春眠不觉晓，处处闻啼鸟——《春晓》" },

  // 关卡5: 看图说话
  { id: "ch-g1-q17", type: "scenario", subject: "chinese", grade: 1, scenario: "图片上有：一棵大树，树下有一只小猫在睡觉，天上有太阳。", prompt: "下面哪句话描述最完整？", options: ["大树下面，小猫在太阳下睡觉", "有一棵树", "小猫在跑", "天很黑"], correctIndex: 0, explanation: "好的描述要包含图片中的主要元素" },
  { id: "ch-g1-q18", type: "choice", subject: "chinese", grade: 1, prompt: "量词填空：一（）小狗", options: ["只", "个", "条", "头"], correctIndex: 0, explanation: "小狗用量词「只」" },
  { id: "ch-g1-q19", type: "fill-in", subject: "chinese", grade: 1, prompt: "弯弯的月亮像小___。（填一个字）", answer: "船", explanation: "弯弯的月亮像小船" },
  { id: "ch-g1-q20", type: "choice", subject: "chinese", grade: 1, prompt: "「小白兔，白又白，两只耳朵竖起来」，接下来是？", options: ["爱吃萝卜爱吃菜", "跳来跳去真可爱", "蹦蹦跳跳真可爱", "毛茸茸的真可爱"], correctIndex: 0, explanation: "这是经典儿歌《小白兔》" },

  // ═══════════════════════════════════════
  //  语文 · 二年级
  // ═══════════════════════════════════════

  { id: "ch-g2-q1", type: "choice", subject: "chinese", grade: 2, prompt: "「望」字是什么结构？", options: ["上下结构", "左右结构", "半包围结构", "独体字"], correctIndex: 0, explanation: "望字上面是亡+月，下面是王，属于上下结构" },
  { id: "ch-g2-q2", type: "fill-in", subject: "chinese", grade: 2, prompt: "成语填空：守株待___", answer: "兔", explanation: "守株待兔，比喻不主动努力而坐等好事" },
  { id: "ch-g2-q3", type: "choice", subject: "chinese", grade: 2, prompt: "「春风又绿江南岸」中「绿」是什么意思？", options: ["使……变绿", "绿色的", "绿色植物", "青草"], correctIndex: 0, explanation: "这里「绿」用作动词，意思是使变绿" },
  { id: "ch-g2-q4", type: "scenario", subject: "chinese", grade: 2, scenario: "小红写了一封信给奶奶，信的开头应该怎么写？", prompt: "正确的格式是？", options: ["亲爱的奶奶：", "奶奶你好", "致奶奶", "Hi奶奶"], correctIndex: 0, explanation: "写信开头要写称呼加冒号" },

  { id: "ch-g2-q5", type: "fill-in", subject: "chinese", grade: 2, prompt: "AABB式词语：高高___（填两个字）", answer: "兴兴", explanation: "高高兴兴是AABB式词语" },
  { id: "ch-g2-q6", type: "choice", subject: "chinese", grade: 2, prompt: "下列哪个不是比喻句？", options: ["小明跑得很快", "月亮像小船", "她的脸红得像苹果", "雪花像鹅毛"], correctIndex: 0, explanation: "「小明跑得很快」是普通句子，没有比喻" },
  { id: "ch-g2-q7", type: "choice", subject: "chinese", grade: 2, prompt: "「举头望明月」的下一句是？", options: ["低头思故乡", "疑是地上霜", "床前明月光", "处处闻啼鸟"], correctIndex: 0, explanation: "举头望明月，低头思故乡——李白《静夜思》" },
  { id: "ch-g2-q8", type: "fill-in", subject: "chinese", grade: 2, prompt: "两岸猿声啼不住，轻舟已过万重___。", answer: "山", explanation: "《早发白帝城》：轻舟已过万重山" },

  { id: "ch-g2-q9", type: "choice", subject: "chinese", grade: 2, prompt: "「日记」应该用第几人称来写？", options: ["第一人称（我）", "第二人称（你）", "第三人称（他）", "都可以"], correctIndex: 0, explanation: "日记是自己写的，用第一人称「我」" },
  { id: "ch-g2-q10", type: "scenario", subject: "chinese", grade: 2, scenario: "图书馆里，小明大声说话，管理员提醒他。", prompt: "管理员可能会说什么？", options: ["请安静，这里是图书馆", "请你出去", "你好吵啊", "快走"], correctIndex: 0, explanation: "在公共场所要用礼貌的方式提醒" },
  { id: "ch-g2-q11", type: "fill-in", subject: "chinese", grade: 2, prompt: "ABB式词语：绿___（填两个相同的字）", answer: "油油", explanation: "绿油油是ABB式词语" },
  { id: "ch-g2-q12", type: "choice", subject: "chinese", grade: 2, prompt: "「龟兔赛跑」告诉我们什么道理？", options: ["坚持不懈才能胜利", "兔子跑得快", "乌龟很聪明", "比赛很有趣"], correctIndex: 0, explanation: "龟兔赛跑告诉我们：不要骄傲，坚持就是胜利" },

  { id: "ch-g2-q13", type: "choice", subject: "chinese", grade: 2, prompt: "下列哪个字的偏旁和「水」有关？", options: ["河", "树", "村", "杯"], correctIndex: 0, explanation: "河字有三点水旁，和水有关" },
  { id: "ch-g2-q14", type: "fill-in", subject: "chinese", grade: 2, prompt: "远看山有色，近听水无___。", answer: "声", explanation: "《画》：远看山有色，近听水无声" },
  { id: "ch-g2-q15", type: "scenario", subject: "chinese", grade: 2, scenario: "小华过生日，收到同学的礼物。", prompt: "小华应该怎么说？", options: ["谢谢你，我很喜欢", "这个不好看", "我不想要", "随便吧"], correctIndex: 0, explanation: "收到礼物要表达感谢" },
  { id: "ch-g2-q16", type: "choice", subject: "chinese", grade: 2, prompt: "「欲穷千里目」的下一句是？", options: ["更上一层楼", "低头思故乡", "春风吹又生", "花落知多少"], correctIndex: 0, explanation: "《登鹳雀楼》：欲穷千里目，更上一层楼" },

  { id: "ch-g2-q17", type: "fill-in", subject: "chinese", grade: 2, prompt: "谁言寸草心，报得三春___。", answer: "晖", explanation: "《游子吟》：谁言寸草心，报得三春晖" },
  { id: "ch-g2-q18", type: "choice", subject: "chinese", grade: 2, prompt: "「亡羊补牢」中「亡」是什么意思？", options: ["丢失", "死亡", "逃跑", "忘记"], correctIndex: 0, explanation: "亡羊补牢的「亡」是丢失的意思" },
  { id: "ch-g2-q19", type: "scenario", subject: "chinese", grade: 2, scenario: "在饭店里，服务员端上了菜。", prompt: "你应该说什么？", options: ["谢谢", "终于来了", "太慢了", "不说话"], correctIndex: 0, explanation: "礼貌用语：别人为你服务时要说谢谢" },
  { id: "ch-g2-q20", type: "choice", subject: "chinese", grade: 2, prompt: "下列哪组是近义词？", options: ["美丽—漂亮", "大—小", "高—矮", "黑—白"], correctIndex: 0, explanation: "美丽和漂亮是近义词，其他都是反义词" },

  // ═══════════════════════════════════════
  //  语文 · 三年级
  // ═══════════════════════════════════════

  { id: "ch-g3-q1", type: "choice", subject: "chinese", grade: 3, prompt: "下列哪个是拟人句？", options: ["小草从地下探出头来", "他跑得像兔子一样快", "天空很蓝", "书桌上有一本书"], correctIndex: 0, explanation: "「探出头来」把小草当作人来写，是拟人句" },
  { id: "ch-g3-q2", type: "fill-in", subject: "chinese", grade: 3, prompt: "独在异乡为异客，每逢佳节倍思___。", answer: "亲", explanation: "《九月九日忆山东兄弟》：每逢佳节倍思亲" },
  { id: "ch-g3-q3", type: "scenario", subject: "chinese", grade: 3, scenario: "老师布置了一篇作文，题目是《我的周末》。", prompt: "作文的开头哪个最好？", options: ["周末的早晨，阳光透过窗帘洒进房间", "我的周末", "周末", "今天是周末我做了很多事"], correctIndex: 0, explanation: "好的开头要有画面感，吸引读者" },
  { id: "ch-g3-q4", type: "choice", subject: "chinese", grade: 3, prompt: "「草长莺飞二月天」描写的是哪个季节？", options: ["春天", "夏天", "秋天", "冬天"], correctIndex: 0, explanation: "草长莺飞是春天的景象" },

  { id: "ch-g3-q5", type: "fill-in", subject: "chinese", grade: 3, prompt: "停车坐爱枫林晚，霜叶红于二月___。", answer: "花", explanation: "《山行》：霜叶红于二月花" },
  { id: "ch-g3-q6", type: "choice", subject: "chinese", grade: 3, prompt: "「不以为然」的「然」是什么意思？", options: ["这样，如此", "然后", "自然", "忽然"], correctIndex: 0, explanation: "「然」在这里是「这样」的意思" },
  { id: "ch-g3-q7", type: "choice", subject: "chinese", grade: 3, prompt: "下列哪个标点使用正确？", options: ["他说：「走吧！」", "他说「走吧！」", "他说：走吧！", "他说，「走吧！」"], correctIndex: 0, explanation: "引用别人的话要用冒号加引号" },
  { id: "ch-g3-q8", type: "scenario", subject: "chinese", grade: 3, scenario: "小明写了一段话：今天天气很好我和妈妈去公园玩了。", prompt: "这段话缺少什么？", options: ["标点符号（逗号和句号）", "形容词", "主语", "动词"], correctIndex: 0, explanation: "要在适当位置加上逗号和句号" },

  { id: "ch-g3-q9", type: "fill-in", subject: "chinese", grade: 3, prompt: "一年之计在于___。", answer: "春", explanation: "一年之计在于春，一日之计在于晨" },
  { id: "ch-g3-q10", type: "choice", subject: "chinese", grade: 3, prompt: "「画龙点睛」的意思是？", options: ["在关键处加上精彩内容", "画一条龙", "给龙画眼睛", "装饰画作"], correctIndex: 0, explanation: "比喻在关键处加上精彩的一笔" },
  { id: "ch-g3-q11", type: "choice", subject: "chinese", grade: 3, prompt: "下面哪个是排比句？", options: ["天空是蓝的，草地是绿的，花儿是红的", "天很蓝", "花很红很好看", "我今天去上学了"], correctIndex: 0, explanation: "三个相同结构的句子并列，构成排比" },
  { id: "ch-g3-q12", type: "fill-in", subject: "chinese", grade: 3, prompt: "千里之行，始于足___。", answer: "下", explanation: "千里之行，始于足下——出自《老子》" },

  { id: "ch-g3-q13", type: "choice", subject: "chinese", grade: 3, prompt: "「桃花潭水深千尺，不及汪伦送我情」用了什么修辞？", options: ["夸张", "比喻", "拟人", "排比"], correctIndex: 0, explanation: "用「深千尺」来夸张水深，衬托友情" },
  { id: "ch-g3-q14", type: "scenario", subject: "chinese", grade: 3, scenario: "阅读短文：小蚂蚁搬家了。它们排着整齐的队伍，一个接一个地往前走。忽然，天下起了大雨。", prompt: "接下来最合理的发展是？", options: ["小蚂蚁们赶紧躲到树叶下面", "小蚂蚁继续走不管大雨", "太阳出来了", "小蚂蚁去游泳了"], correctIndex: 0, explanation: "下雨了动物会本能地找地方躲避" },
  { id: "ch-g3-q15", type: "fill-in", subject: "chinese", grade: 3, prompt: "窗含西岭千秋雪，门泊东吴万里___。", answer: "船", explanation: "《绝句》：门泊东吴万里船" },
  { id: "ch-g3-q16", type: "choice", subject: "chinese", grade: 3, prompt: "写信的结尾「此致敬礼」中，「敬礼」应该怎样写？", options: ["另起一行顶格写", "接在此致后面", "写在信的开头", "不用写"], correctIndex: 0, explanation: "「此致」写在正文后，「敬礼」另起一行顶格" },

  { id: "ch-g3-q17", type: "fill-in", subject: "chinese", grade: 3, prompt: "接天莲叶无穷碧，映日荷花别样___。", answer: "红", explanation: "《晓出净慈寺送林子方》：映日荷花别样红" },
  { id: "ch-g3-q18", type: "choice", subject: "chinese", grade: 3, prompt: "下面哪个成语形容人很多？", options: ["人山人海", "一帆风顺", "画龙点睛", "守株待兔"], correctIndex: 0, explanation: "「人山人海」形容聚集的人很多" },
  { id: "ch-g3-q19", type: "scenario", subject: "chinese", grade: 3, scenario: "同学聚会上，大家玩成语接龙。上一个成语是「一心一意」。", prompt: "下一个成语应该以哪个字开头？", options: ["意", "一", "心", "用"], correctIndex: 0, explanation: "成语接龙：上一个成语末尾的字是下一个成语的开头" },
  { id: "ch-g3-q20", type: "choice", subject: "chinese", grade: 3, prompt: "「一寸光阴一寸金」强调的是什么？", options: ["时间的宝贵", "金子很贵", "光阴很短", "金子很多"], correctIndex: 0, explanation: "强调时间非常宝贵，要珍惜" },

  // ═══════════════════════════════════════
  //  数学 · 一年级
  // ═══════════════════════════════════════

  { id: "ma-g1-q1", type: "fill-in", subject: "math", grade: 1, prompt: "3 + 5 = ?", answer: "8", explanation: "3加5等于8" },
  { id: "ma-g1-q2", type: "choice", subject: "math", grade: 1, prompt: "下面哪个数最大？", options: ["9", "6", "3", "1"], correctIndex: 0, explanation: "9是其中最大的数" },
  { id: "ma-g1-q3", type: "fill-in", subject: "math", grade: 1, prompt: "10 - 4 = ?", answer: "6", explanation: "10减4等于6" },
  { id: "ma-g1-q4", type: "scenario", subject: "math", grade: 1, scenario: "小明有3个苹果，妈妈又给了他2个。", prompt: "小明一共有几个苹果？", options: ["5个", "3个", "2个", "1个"], correctIndex: 0, explanation: "3 + 2 = 5，小明一共有5个苹果" },

  { id: "ma-g1-q5", type: "choice", subject: "math", grade: 1, prompt: "7 + 8 = ?", options: ["15", "14", "16", "13"], correctIndex: 0, explanation: "7加8等于15" },
  { id: "ma-g1-q6", type: "fill-in", subject: "math", grade: 1, prompt: "12 - 5 = ?", answer: "7", explanation: "12减5等于7" },
  { id: "ma-g1-q7", type: "scenario", subject: "math", grade: 1, scenario: "公交车上有8个人，到站后下去了3个人，又上来了2个人。", prompt: "现在车上有几个人？", options: ["7个", "8个", "5个", "10个"], correctIndex: 0, explanation: "8 - 3 + 2 = 7个人" },
  { id: "ma-g1-q8", type: "choice", subject: "math", grade: 1, prompt: "把下面的数从小到大排列：5, 2, 8, 1", options: ["1, 2, 5, 8", "8, 5, 2, 1", "2, 1, 5, 8", "5, 2, 1, 8"], correctIndex: 0, explanation: "从小到大：1 < 2 < 5 < 8" },

  { id: "ma-g1-q9", type: "fill-in", subject: "math", grade: 1, prompt: "6 + ___ = 10，横线上填几？", answer: "4", explanation: "10 - 6 = 4" },
  { id: "ma-g1-q10", type: "choice", subject: "math", grade: 1, prompt: "一个三角形有几条边？", options: ["3条", "4条", "5条", "2条"], correctIndex: 0, explanation: "三角形有3条边" },
  { id: "ma-g1-q11", type: "scenario", subject: "math", grade: 1, scenario: "小红有6颗糖，她给了小华2颗，又给了小明1颗。", prompt: "小红还剩几颗糖？", options: ["3颗", "4颗", "2颗", "5颗"], correctIndex: 0, explanation: "6 - 2 - 1 = 3颗" },
  { id: "ma-g1-q12", type: "fill-in", subject: "math", grade: 1, prompt: "9 + 6 = ?", answer: "15", explanation: "9加6等于15" },

  { id: "ma-g1-q13", type: "choice", subject: "math", grade: 1, prompt: "下面哪个图形是圆形？", options: ["○", "□", "△", "☆"], correctIndex: 0, explanation: "○是圆形" },
  { id: "ma-g1-q14", type: "fill-in", subject: "math", grade: 1, prompt: "16 - 9 = ?", answer: "7", explanation: "16减9等于7" },
  { id: "ma-g1-q15", type: "scenario", subject: "math", grade: 1, scenario: "花园里有12朵红花和8朵黄花。", prompt: "红花比黄花多几朵？", options: ["4朵", "20朵", "3朵", "5朵"], correctIndex: 0, explanation: "12 - 8 = 4，红花比黄花多4朵" },
  { id: "ma-g1-q16", type: "choice", subject: "math", grade: 1, prompt: "11 + 9 = ?", options: ["20", "19", "21", "18"], correctIndex: 0, explanation: "11加9等于20" },

  { id: "ma-g1-q17", type: "fill-in", subject: "math", grade: 1, prompt: "2 + 2 + 2 + 2 = ?", answer: "8", explanation: "4个2相加等于8" },
  { id: "ma-g1-q18", type: "choice", subject: "math", grade: 1, prompt: "钟表上12点时，时针和分针的位置是？", options: ["重合在12上", "成直角", "成一条直线", "分开的"], correctIndex: 0, explanation: "12点时时针和分针都指向12，重合在一起" },
  { id: "ma-g1-q19", type: "scenario", subject: "math", grade: 1, scenario: "妈妈买了一打鸡蛋（12个），做早餐用了3个。", prompt: "还剩多少个鸡蛋？", options: ["9个", "10个", "8个", "15个"], correctIndex: 0, explanation: "12 - 3 = 9个" },
  { id: "ma-g1-q20", type: "fill-in", subject: "math", grade: 1, prompt: "1元 = ___角", answer: "10", explanation: "1元等于10角" },

  // ═══════════════════════════════════════
  //  数学 · 二年级
  // ═══════════════════════════════════════

  { id: "ma-g2-q1", type: "fill-in", subject: "math", grade: 2, prompt: "3 × 4 = ?", answer: "12", explanation: "3乘4等于12" },
  { id: "ma-g2-q2", type: "choice", subject: "math", grade: 2, prompt: "下面哪个是乘法算式？", options: ["3 × 5 = 15", "3 + 5 = 8", "15 - 5 = 10", "15 ÷ 3 = 5"], correctIndex: 0, explanation: "×是乘号，3×5=15是乘法算式" },
  { id: "ma-g2-q3", type: "scenario", subject: "math", grade: 2, scenario: "教室里有4排桌子，每排有6张。", prompt: "教室里一共有多少张桌子？", options: ["24张", "10张", "20张", "18张"], correctIndex: 0, explanation: "4 × 6 = 24张" },
  { id: "ma-g2-q4", type: "fill-in", subject: "math", grade: 2, prompt: "5 × 6 = ?", answer: "30", explanation: "5乘6等于30" },

  { id: "ma-g2-q5", type: "choice", subject: "math", grade: 2, prompt: "36 ÷ 6 = ?", options: ["6", "5", "7", "8"], correctIndex: 0, explanation: "36除以6等于6" },
  { id: "ma-g2-q6", type: "fill-in", subject: "math", grade: 2, prompt: "7 × 8 = ?", answer: "56", explanation: "7乘8等于56（七八五十六）" },
  { id: "ma-g2-q7", type: "scenario", subject: "math", grade: 2, scenario: "小明有24颗糖要分给6个小朋友。", prompt: "每人能分到几颗？", options: ["4颗", "3颗", "5颗", "6颗"], correctIndex: 0, explanation: "24 ÷ 6 = 4颗" },
  { id: "ma-g2-q8", type: "choice", subject: "math", grade: 2, prompt: "1米 = ___厘米？", options: ["100厘米", "10厘米", "1000厘米", "50厘米"], correctIndex: 0, explanation: "1米等于100厘米" },

  { id: "ma-g2-q9", type: "fill-in", subject: "math", grade: 2, prompt: "9 × 9 = ?", answer: "81", explanation: "9乘9等于81（九九八十一）" },
  { id: "ma-g2-q10", type: "choice", subject: "math", grade: 2, prompt: "一个正方形有几条对称轴？", options: ["4条", "2条", "1条", "8条"], correctIndex: 0, explanation: "正方形有4条对称轴" },
  { id: "ma-g2-q11", type: "scenario", subject: "math", grade: 2, scenario: "一本书有56页，小红每天看8页。", prompt: "她几天能看完？", options: ["7天", "6天", "8天", "5天"], correctIndex: 0, explanation: "56 ÷ 8 = 7天" },
  { id: "ma-g2-q12", type: "fill-in", subject: "math", grade: 2, prompt: "45 ÷ 5 = ?", answer: "9", explanation: "45除以5等于9" },

  { id: "ma-g2-q13", type: "choice", subject: "math", grade: 2, prompt: "346中的「4」表示？", options: ["4个十", "4个一", "4个百", "4"], correctIndex: 0, explanation: "346中4在十位，表示4个十" },
  { id: "ma-g2-q14", type: "fill-in", subject: "math", grade: 2, prompt: "1时 = ___分", answer: "60", explanation: "1小时等于60分钟" },
  { id: "ma-g2-q15", type: "scenario", subject: "math", grade: 2, scenario: "商店里铅笔2元一支，橡皮1元一块。小明买了3支铅笔和2块橡皮。", prompt: "一共花了多少钱？", options: ["8元", "7元", "9元", "6元"], correctIndex: 0, explanation: "3×2 + 2×1 = 6+2 = 8元" },
  { id: "ma-g2-q16", type: "choice", subject: "math", grade: 2, prompt: "下面哪个算式结果最大？", options: ["8 × 7", "9 × 5", "6 × 9", "7 × 7"], correctIndex: 0, explanation: "8×7=56, 9×5=45, 6×9=54, 7×7=49，56最大" },

  { id: "ma-g2-q17", type: "fill-in", subject: "math", grade: 2, prompt: "100 - 37 = ?", answer: "63", explanation: "100减37等于63" },
  { id: "ma-g2-q18", type: "choice", subject: "math", grade: 2, prompt: "一个长方形的长是5厘米，宽是3厘米，周长是多少？", options: ["16厘米", "15厘米", "8厘米", "10厘米"], correctIndex: 0, explanation: "周长 = (5+3)×2 = 16厘米" },
  { id: "ma-g2-q19", type: "scenario", subject: "math", grade: 2, scenario: "果园里有苹果树45棵，梨树比苹果树少18棵。", prompt: "梨树有多少棵？", options: ["27棵", "63棵", "30棵", "25棵"], correctIndex: 0, explanation: "45 - 18 = 27棵" },
  { id: "ma-g2-q20", type: "fill-in", subject: "math", grade: 2, prompt: "6 × 7 = ?", answer: "42", explanation: "6乘7等于42（六七四十二）" },

  // ═══════════════════════════════════════
  //  数学 · 三年级
  // ═══════════════════════════════════════

  { id: "ma-g3-q1", type: "fill-in", subject: "math", grade: 3, prompt: "125 × 8 = ?", answer: "1000", explanation: "125×8=1000" },
  { id: "ma-g3-q2", type: "choice", subject: "math", grade: 3, prompt: "1/4 + 2/4 = ?", options: ["3/4", "3/8", "1/2", "1"], correctIndex: 0, explanation: "同分母分数相加：1/4 + 2/4 = 3/4" },
  { id: "ma-g3-q3", type: "scenario", subject: "math", grade: 3, scenario: "一块长方形菜地，长20米，宽12米。", prompt: "面积是多少平方米？", options: ["240平方米", "64平方米", "32平方米", "200平方米"], correctIndex: 0, explanation: "面积 = 20 × 12 = 240平方米" },
  { id: "ma-g3-q4", type: "fill-in", subject: "math", grade: 3, prompt: "504 ÷ 7 = ?", answer: "72", explanation: "504÷7=72" },

  { id: "ma-g3-q5", type: "choice", subject: "math", grade: 3, prompt: "一千克等于多少克？", options: ["1000克", "100克", "10克", "10000克"], correctIndex: 0, explanation: "1千克 = 1000克" },
  { id: "ma-g3-q6", type: "fill-in", subject: "math", grade: 3, prompt: "2/5 + 1/5 = ?（用分数表示）", answer: "3/5", explanation: "同分母相加：2/5 + 1/5 = 3/5" },
  { id: "ma-g3-q7", type: "scenario", subject: "math", grade: 3, scenario: "三年级有4个班，每班42人。学校组织春游，每辆大巴坐50人。", prompt: "至少需要几辆大巴？", options: ["4辆", "3辆", "5辆", "2辆"], correctIndex: 0, explanation: "4×42=168人, 168÷50=3.36, 需要4辆" },
  { id: "ma-g3-q8", type: "choice", subject: "math", grade: 3, prompt: "一个正方形的边长是5厘米，面积是？", options: ["25平方厘米", "20平方厘米", "10平方厘米", "15平方厘米"], correctIndex: 0, explanation: "正方形面积 = 边长×边长 = 5×5 = 25平方厘米" },

  { id: "ma-g3-q9", type: "fill-in", subject: "math", grade: 3, prompt: "360 ÷ 9 = ?", answer: "40", explanation: "360÷9=40" },
  { id: "ma-g3-q10", type: "choice", subject: "math", grade: 3, prompt: "下面哪个分数最大？", options: ["3/4", "1/2", "1/4", "2/5"], correctIndex: 0, explanation: "3/4=0.75是其中最大的分数" },
  { id: "ma-g3-q11", type: "scenario", subject: "math", grade: 3, scenario: "小明8:00出发去学校，8:25到达。", prompt: "小明上学路上花了多少时间？", options: ["25分钟", "15分钟", "35分钟", "20分钟"], correctIndex: 0, explanation: "8:25 - 8:00 = 25分钟" },
  { id: "ma-g3-q12", type: "fill-in", subject: "math", grade: 3, prompt: "23 × 4 = ?", answer: "92", explanation: "23×4=92" },

  { id: "ma-g3-q13", type: "choice", subject: "math", grade: 3, prompt: "下面哪个图形是平行四边形？", options: ["◇", "△", "○", "☆"], correctIndex: 0, explanation: "◇（菱形）是特殊的平行四边形" },
  { id: "ma-g3-q14", type: "fill-in", subject: "math", grade: 3, prompt: "1/2 - 1/4 = ?（用分数表示）", answer: "1/4", explanation: "1/2 = 2/4, 2/4 - 1/4 = 1/4" },
  { id: "ma-g3-q15", type: "scenario", subject: "math", grade: 3, scenario: "超市里苹果每千克6元，妈妈买了3千克，付了20元。", prompt: "应该找回多少钱？", options: ["2元", "3元", "14元", "1元"], correctIndex: 0, explanation: "6×3=18元, 20-18=2元" },
  { id: "ma-g3-q16", type: "choice", subject: "math", grade: 3, prompt: "876中8在什么位上？", options: ["百位", "十位", "千位", "个位"], correctIndex: 0, explanation: "876中8在最高位——百位" },

  { id: "ma-g3-q17", type: "fill-in", subject: "math", grade: 3, prompt: "56 × 10 = ?", answer: "560", explanation: "一个数乘10，在末尾添一个0" },
  { id: "ma-g3-q18", type: "choice", subject: "math", grade: 3, prompt: "用24时计时法，下午3点是几时？", options: ["15时", "3时", "13时", "12时"], correctIndex: 0, explanation: "下午3点 = 12 + 3 = 15时" },
  { id: "ma-g3-q19", type: "scenario", subject: "math", grade: 3, scenario: "一根绳子长2米，剪成同样长的4段。", prompt: "每段长多少？", options: ["50厘米", "2厘米", "200厘米", "25厘米"], correctIndex: 0, explanation: "2米=200厘米, 200÷4=50厘米" },
  { id: "ma-g3-q20", type: "fill-in", subject: "math", grade: 3, prompt: "最小的三位数是？", answer: "100", explanation: "最小的三位数是100" },

  // ═══════════════════════════════════════
  //  英语 · 一年级
  // ═══════════════════════════════════════

  { id: "en-g1-q1", type: "choice", subject: "english", grade: 1, prompt: "\"Apple\" means?", options: ["苹果", "香蕉", "橘子", "葡萄"], correctIndex: 0, explanation: "Apple是苹果的意思" },
  { id: "en-g1-q2", type: "fill-in", subject: "english", grade: 1, prompt: "c_t（补全单词，意思是「猫」）", answer: "cat", explanation: "cat 是猫的意思" },
  { id: "en-g1-q3", type: "choice", subject: "english", grade: 1, prompt: "How do you say \"你好\" in English?", options: ["Hello", "Bye", "Sorry", "Thanks"], correctIndex: 0, explanation: "Hello是你好的意思" },
  { id: "en-g1-q4", type: "scenario", subject: "english", grade: 1, scenario: "早上在学校门口遇到老师。", prompt: "你应该说什么？", options: ["Good morning!", "Good night!", "Goodbye!", "Sorry!"], correctIndex: 0, explanation: "早上见面说 Good morning!" },

  { id: "en-g1-q5", type: "fill-in", subject: "english", grade: 1, prompt: "d_g（补全单词，意思是「狗」）", answer: "dog", explanation: "dog 是狗的意思" },
  { id: "en-g1-q6", type: "choice", subject: "english", grade: 1, prompt: "What color is a banana?", options: ["Yellow", "Red", "Blue", "Green"], correctIndex: 0, explanation: "香蕉是黄色(yellow)的" },
  { id: "en-g1-q7", type: "choice", subject: "english", grade: 1, prompt: "How many letters are in the English alphabet?", options: ["26", "24", "28", "25"], correctIndex: 0, explanation: "英语字母表共有26个字母" },
  { id: "en-g1-q8", type: "scenario", subject: "english", grade: 1, scenario: "Someone gives you a gift.", prompt: "What do you say?", options: ["Thank you!", "I'm sorry.", "Hello!", "Goodbye!"], correctIndex: 0, explanation: "收到礼物要说 Thank you!" },

  { id: "en-g1-q9", type: "fill-in", subject: "english", grade: 1, prompt: "r_d（补全单词，意思是「红色」）", answer: "red", explanation: "red 是红色的意思" },
  { id: "en-g1-q10", type: "choice", subject: "english", grade: 1, prompt: "\"Book\" means?", options: ["书", "笔", "桌子", "椅子"], correctIndex: 0, explanation: "Book是书的意思" },
  { id: "en-g1-q11", type: "scenario", subject: "english", grade: 1, scenario: "It's time to go home after school.", prompt: "What do you say to your teacher?", options: ["Goodbye!", "Good morning!", "Thank you!", "Hello!"], correctIndex: 0, explanation: "放学回家说 Goodbye!" },
  { id: "en-g1-q12", type: "fill-in", subject: "english", grade: 1, prompt: "How do you spell 鱼 in English?", answer: "fish", explanation: "鱼的英文是 fish" },

  { id: "en-g1-q13", type: "choice", subject: "english", grade: 1, prompt: "Which is a fruit?", options: ["Orange", "Dog", "Book", "Chair"], correctIndex: 0, explanation: "Orange(橙子)是水果" },
  { id: "en-g1-q14", type: "fill-in", subject: "english", grade: 1, prompt: "b__e（补全单词，意思是「蓝色」）", answer: "blue", explanation: "blue 是蓝色的意思" },
  { id: "en-g1-q15", type: "choice", subject: "english", grade: 1, prompt: "How many eyes do you have?", options: ["Two", "One", "Three", "Four"], correctIndex: 0, explanation: "我们有2只(two)眼睛" },
  { id: "en-g1-q16", type: "scenario", subject: "english", grade: 1, scenario: "你迷路了，想问路人怎么走。", prompt: "你应该先说什么？", options: ["Excuse me.", "Go away.", "Thank you.", "Goodbye."], correctIndex: 0, explanation: "问路时先说 Excuse me 打扰一下" },

  { id: "en-g1-q17", type: "fill-in", subject: "english", grade: 1, prompt: "How do you spell 星星 in English?", answer: "star", explanation: "星星的英文是 star" },
  { id: "en-g1-q18", type: "choice", subject: "english", grade: 1, prompt: "What animal says \"moo\"?", options: ["Cow", "Cat", "Dog", "Bird"], correctIndex: 0, explanation: "牛(Cow)的叫声是 moo" },
  { id: "en-g1-q19", type: "scenario", subject: "english", grade: 1, scenario: "老师问你 'What's your name?'", prompt: "你应该怎么回答？", options: ["My name is...", "I'm fine.", "How are you?", "Thank you."], correctIndex: 0, explanation: "回答名字用 My name is..." },
  { id: "en-g1-q20", type: "choice", subject: "english", grade: 1, prompt: "\"One, two, three\" — what comes next?", options: ["Four", "Five", "Six", "Seven"], correctIndex: 0, explanation: "One, two, three, four — 1,2,3,4" },

  // ═══════════════════════════════════════
  //  英语 · 二年级
  // ═══════════════════════════════════════

  { id: "en-g2-q1", type: "choice", subject: "english", grade: 2, prompt: "What day comes after Monday?", options: ["Tuesday", "Wednesday", "Sunday", "Friday"], correctIndex: 0, explanation: "Monday之后是Tuesday" },
  { id: "en-g2-q2", type: "fill-in", subject: "english", grade: 2, prompt: "I ___ a student.（填 am/is/are）", answer: "am", explanation: "I am a student. 第一人称用 am" },
  { id: "en-g2-q3", type: "scenario", subject: "english", grade: 2, scenario: "It's raining outside. You want to go out.", prompt: "What do you need?", options: ["An umbrella", "Sunglasses", "A hat", "A scarf"], correctIndex: 0, explanation: "下雨需要 umbrella(雨伞)" },
  { id: "en-g2-q4", type: "choice", subject: "english", grade: 2, prompt: "How many months are in a year?", options: ["12", "10", "7", "24"], correctIndex: 0, explanation: "一年有12个月" },

  { id: "en-g2-q5", type: "fill-in", subject: "english", grade: 2, prompt: "She ___ a teacher.（填 am/is/are）", answer: "is", explanation: "She is a teacher. 第三人称单数用 is" },
  { id: "en-g2-q6", type: "choice", subject: "english", grade: 2, prompt: "Which season is the hottest?", options: ["Summer", "Spring", "Autumn", "Winter"], correctIndex: 0, explanation: "Summer(夏天)是最热的季节" },
  { id: "en-g2-q7", type: "scenario", subject: "english", grade: 2, scenario: "你想知道现在几点了。", prompt: "你应该怎么问？", options: ["What time is it?", "How are you?", "What's your name?", "Where are you?"], correctIndex: 0, explanation: "问时间用 What time is it?" },
  { id: "en-g2-q8", type: "fill-in", subject: "english", grade: 2, prompt: "They ___ happy.（填 am/is/are）", answer: "are", explanation: "They are happy. 复数用 are" },

  { id: "en-g2-q9", type: "choice", subject: "english", grade: 2, prompt: "\"Big\" is the opposite of?", options: ["Small", "Tall", "Long", "Fat"], correctIndex: 0, explanation: "Big(大)的反义词是 Small(小)" },
  { id: "en-g2-q10", type: "scenario", subject: "english", grade: 2, scenario: "你在食堂吃午饭，想要一杯水。", prompt: "你可以说？", options: ["Can I have some water, please?", "Give me water!", "I don't want water.", "Water is good."], correctIndex: 0, explanation: "礼貌地说 Can I have some water, please?" },
  { id: "en-g2-q11", type: "fill-in", subject: "english", grade: 2, prompt: "I have two ___.（手的复数）", answer: "hands", explanation: "hand 的复数是 hands" },
  { id: "en-g2-q12", type: "choice", subject: "english", grade: 2, prompt: "Which is NOT a color?", options: ["Happy", "Red", "Blue", "Green"], correctIndex: 0, explanation: "Happy(开心)不是颜色" },

  { id: "en-g2-q13", type: "fill-in", subject: "english", grade: 2, prompt: "There ___ three cats.（填 is/are）", answer: "are", explanation: "复数名词前用 are" },
  { id: "en-g2-q14", type: "choice", subject: "english", grade: 2, prompt: "\"I like apples.\" — apples is?", options: ["名词复数", "动词", "形容词", "代词"], correctIndex: 0, explanation: "apples 是 apple 的复数形式，属于名词" },
  { id: "en-g2-q15", type: "scenario", subject: "english", grade: 2, scenario: "你的朋友生病了，没来上学。", prompt: "你可以对他说？", options: ["Get well soon!", "Happy birthday!", "Good morning!", "See you!"], correctIndex: 0, explanation: "祝朋友早日康复说 Get well soon!" },
  { id: "en-g2-q16", type: "fill-in", subject: "english", grade: 2, prompt: "How do you spell 家庭 in English?", answer: "family", explanation: "家庭的英文是 family" },

  { id: "en-g2-q17", type: "choice", subject: "english", grade: 2, prompt: "\"He can swim.\" means?", options: ["他会游泳", "他在跑步", "他在吃饭", "他会飞"], correctIndex: 0, explanation: "He can swim 意思是他会游泳" },
  { id: "en-g2-q18", type: "fill-in", subject: "english", grade: 2, prompt: "Monday, Tuesday, ___（填下一天）", answer: "Wednesday", explanation: "星期一二三：Monday, Tuesday, Wednesday" },
  { id: "en-g2-q19", type: "scenario", subject: "english", grade: 2, scenario: "妈妈做了美味的晚餐。", prompt: "你品尝后可以说？", options: ["It's delicious!", "I don't like it.", "It's ugly.", "I'm sorry."], correctIndex: 0, explanation: "好吃的可以说 It's delicious!" },
  { id: "en-g2-q20", type: "choice", subject: "english", grade: 2, prompt: "Which animal can fly?", options: ["Bird", "Fish", "Dog", "Cat"], correctIndex: 0, explanation: "Bird(鸟)可以飞" },

  // ═══════════════════════════════════════
  //  英语 · 三年级
  // ═══════════════════════════════════════

  { id: "en-g3-q1", type: "choice", subject: "english", grade: 3, prompt: "\"She is reading a book.\" — What tense is this?", options: ["现在进行时", "一般现在时", "一般过去时", "将来时"], correctIndex: 0, explanation: "is reading 是现在进行时(be + doing)" },
  { id: "en-g3-q2", type: "fill-in", subject: "english", grade: 3, prompt: "I ___ (go) to school yesterday.（填过去式）", answer: "went", explanation: "go 的过去式是 went" },
  { id: "en-g3-q3", type: "scenario", subject: "english", grade: 3, scenario: "你在图书馆想借一本书。", prompt: "你可以对图书管理员说？", options: ["May I borrow this book?", "Give me this book.", "I want book.", "Book please go."], correctIndex: 0, explanation: "礼貌借书用 May I borrow this book?" },
  { id: "en-g3-q4", type: "choice", subject: "english", grade: 3, prompt: "\"There are five ___ on the table.\" Fill in:", options: ["books", "book", "bookes", "bookies"], correctIndex: 0, explanation: "five后面跟复数 books" },

  { id: "en-g3-q5", type: "fill-in", subject: "english", grade: 3, prompt: "She ___ (like) ice cream.（一般现在时第三人称）", answer: "likes", explanation: "第三人称单数要加s: She likes" },
  { id: "en-g3-q6", type: "choice", subject: "english", grade: 3, prompt: "Which is correct?", options: ["He doesn't like fish.", "He don't like fish.", "He not like fish.", "He no like fish."], correctIndex: 0, explanation: "第三人称否定用 doesn't" },
  { id: "en-g3-q7", type: "scenario", subject: "english", grade: 3, scenario: "Your friend asks: 'What do you want to be when you grow up?'", prompt: "哪个回答最合适？", options: ["I want to be a doctor.", "I am a doctor.", "I was a doctor.", "Doctor is good."], correctIndex: 0, explanation: "用 I want to be... 表达理想" },
  { id: "en-g3-q8", type: "fill-in", subject: "english", grade: 3, prompt: "We ___ (play) football last Sunday.（过去式）", answer: "played", explanation: "play 的过去式是 played" },

  { id: "en-g3-q9", type: "choice", subject: "english", grade: 3, prompt: "\"How much is it?\" is asking about?", options: ["价格", "数量", "时间", "地点"], correctIndex: 0, explanation: "How much is it 是问价格" },
  { id: "en-g3-q10", type: "fill-in", subject: "english", grade: 3, prompt: "The cat is ___ the box.（在箱子里面，填介词）", answer: "in", explanation: "在里面用介词 in" },
  { id: "en-g3-q11", type: "scenario", subject: "english", grade: 3, scenario: "你在电话里和朋友约周末一起去公园。", prompt: "你可以说？", options: ["Let's go to the park this weekend!", "I go park.", "Park is there.", "Go now!"], correctIndex: 0, explanation: "邀请用 Let's + 动词原形" },
  { id: "en-g3-q12", type: "choice", subject: "english", grade: 3, prompt: "\"faster\" is the ___ form of \"fast\".", options: ["比较级", "最高级", "原级", "动词"], correctIndex: 0, explanation: "faster 是 fast 的比较级" },

  { id: "en-g3-q13", type: "fill-in", subject: "english", grade: 3, prompt: "My mother ___ (cook) dinner now.（现在进行时）", answer: "is cooking", explanation: "现在进行时：is cooking" },
  { id: "en-g3-q14", type: "choice", subject: "english", grade: 3, prompt: "Which sentence is a question?", options: ["Do you like music?", "I like music.", "She likes music.", "We like music."], correctIndex: 0, explanation: "疑问句用 Do 开头，句末加问号" },
  { id: "en-g3-q15", type: "scenario", subject: "english", grade: 3, scenario: "考试得了100分，老师表扬了你。", prompt: "老师可能会说什么？", options: ["Well done! I'm proud of you.", "Try again.", "You failed.", "It's OK."], correctIndex: 0, explanation: "表扬用 Well done! 做得好！" },
  { id: "en-g3-q16", type: "fill-in", subject: "english", grade: 3, prompt: "I have ___ (eat的过去分词) breakfast.（现在完成时）", answer: "eaten", explanation: "eat 的过去分词是 eaten" },

  { id: "en-g3-q17", type: "choice", subject: "english", grade: 3, prompt: "\"It's sunny today.\" — It describes?", options: ["天气", "时间", "地点", "心情"], correctIndex: 0, explanation: "sunny 是晴朗的，描述天气" },
  { id: "en-g3-q18", type: "fill-in", subject: "english", grade: 3, prompt: "How do you spell 美丽的 in English?", answer: "beautiful", explanation: "美丽的英文是 beautiful" },
  { id: "en-g3-q19", type: "scenario", subject: "english", grade: 3, scenario: "你在商店看到一件很贵的玩具。", prompt: "你想知道价格，应该问？", options: ["How much is this toy?", "Is this a toy?", "I want toy.", "Toy!"], correctIndex: 0, explanation: "询问价格用 How much is...?" },
  { id: "en-g3-q20", type: "choice", subject: "english", grade: 3, prompt: "\"They went to the zoo yesterday.\" — went is?", options: ["go的过去式", "go的现在式", "go的将来式", "另一个单词"], correctIndex: 0, explanation: "went 是 go 的过去式" },
]

// ── 关卡定义 ──
// 辅助函数：生成某学科某年级的 20 个关卡

const CHINESE_LEVEL_TITLES: Record<number, string[]> = {
  1: ["认识拼音", "基础汉字", "简单词语", "古诗入门", "看图说话", "声母韵母", "笔画练习", "量词使用", "反义词", "儿歌朗读", "偏旁部首", "简单句子", "数字汉字", "常见词语", "简单阅读", "拼音拼读", "识字游戏", "说话练习", "日常用语", "学期总结"],
  2: ["汉字结构", "成语故事", "诗词鉴赏", "书信格式", "词语积累", "修辞入门", "古诗背诵", "古诗理解", "日记写作", "口语交际", "词语搭配", "寓言故事", "偏旁归类", "古诗填空", "礼貌用语", "诗词名句", "古诗赏析", "成语理解", "场景对话", "近义反义"],
  3: ["修辞手法", "古诗默写", "作文开头", "诗词季节", "古诗鉴赏", "词语辨析", "标点符号", "病句修改", "名言警句", "成语运用", "排比句式", "名言积累", "诗歌修辞", "阅读理解", "古诗名句", "书信格式", "古诗描写", "成语辨析", "成语接龙", "珍惜时间"],
}

const MATH_LEVEL_TITLES: Record<number, string[]> = {
  1: ["10以内加法", "10以内减法", "20以内加减", "数的排序", "凑十法", "图形认识", "应用题入门", "数的分解", "认识钟表", "人民币初识", "比多比少", "加减混合", "数学规律", "减法退位", "比较大小", "加法进位", "重复加法", "时间认识", "购物问题", "单元总结"],
  2: ["乘法入门", "乘法口诀", "除法入门", "乘法应用", "除法练习", "乘法表", "除法应用", "长度单位", "九九乘法", "对称图形", "连除问题", "除法巩固", "数位认识", "时间计算", "综合应用", "比较乘积", "退位减法", "周长计算", "减法应用", "乘法巩固"],
  3: ["大数乘法", "分数加法", "面积计算", "除法进阶", "重量单位", "分数认识", "包车问题", "正方形面积", "大数除法", "分数比较", "时间计算", "两位数乘法", "平行四边形", "分数减法", "综合应用", "数位与值", "乘10规律", "24时计时", "单位换算", "三位数认识"],
}

const ENGLISH_LEVEL_TITLES: Record<number, string[]> = {
  1: ["水果单词", "动物拼写", "日常问候", "礼貌用语", "宠物拼写", "颜色认识", "字母表", "感谢表达", "颜色拼写", "学习用品", "告别用语", "动物拼写", "水果分类", "颜色进阶", "数字认识", "礼貌问路", "星星拼写", "动物声音", "自我介绍", "数数1-10"],
  2: ["星期认识", "be动词", "天气物品", "月份认识", "be动词2", "季节认识", "询问时间", "be动词3", "反义词", "点餐用语", "名词复数", "词性认识", "there be", "复数规则", "关心朋友", "家庭单词", "情态动词", "星期拼写", "餐桌用语", "动物分类"],
  3: ["现在进行时", "过去式", "图书馆用语", "名词复数", "三单现", "否定句", "职业理想", "过去式练习", "购物用语", "介词使用", "邀请用语", "比较级", "进行时练习", "疑问句", "表扬用语", "完成时", "描述天气", "形容词拼写", "询问价格", "过去式辨析"],
}

function buildLevels(subject: Subject, titles: Record<number, string[]>, qPrefix: string): LevelDef[] {
  const out: LevelDef[] = []
  for (const grade of [1, 2, 3] as const) {
    const names = titles[grade]
    for (let i = 0; i < 20; i++) {
      const levelNum = i + 1
      const id = `${subject}-${grade}-${levelNum}`
      // 前5关有完整题目，ID 格式：{prefix}-g{grade}-q{startIdx+1} .. q{startIdx+4}
      const startQ = i * 4 + 1
      const qIds = i < 5
        ? Array.from({ length: 4 }, (_, j) => `${qPrefix}-g${grade}-q${startQ + j}`)
        : []
      out.push({
        id, subject, grade, levelNum,
        title: names[i],
        questionIds: qIds,
        xpReward: 3 + Math.floor(levelNum / 5) * 2,
      })
    }
  }
  return out
}

export const LEVEL_DEFS: LevelDef[] = [
  ...buildLevels("chinese", CHINESE_LEVEL_TITLES, "ch"),
  ...buildLevels("math", MATH_LEVEL_TITLES, "ma"),
  ...buildLevels("english", ENGLISH_LEVEL_TITLES, "en"),
]

// ── 查询辅助函数 ──

export function getLevelsForSubject(subject: Subject, grade: 1 | 2 | 3): LevelDef[] {
  return LEVEL_DEFS.filter(l => l.subject === subject && l.grade === grade)
}

export function getLevelById(id: string): LevelDef | undefined {
  return LEVEL_DEFS.find(l => l.id === id)
}

export function getQuestionsForLevel(levelDef: LevelDef): Question[] {
  return levelDef.questionIds
    .map(qid => QUESTION_BANK.find(q => q.id === qid))
    .filter((q): q is Question => q != null)
}

export function getChoiceQuestionsForPvp(subject: Subject, grade: 1 | 2 | 3, count: number): Question[] {
  const pool = QUESTION_BANK.filter(
    q => q.subject === subject && q.grade === grade && (q.type === "choice" || q.type === "scenario")
  )
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
