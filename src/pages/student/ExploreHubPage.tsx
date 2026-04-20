import { Link } from "react-router-dom"
import { Compass, Swords, Map, ChevronRight } from "lucide-react"
import { getStudentGrade } from "@/lib/exploreStore"

export default function ExploreHubPage() {
  const grade = getStudentGrade()
  const gradeLabel = ["", "一", "二", "三"][grade] + "年级"

  // 模块数据配置，以后加玩法直接在这里加对象
  const moduleList = [
    {
      title: "冒险模式",
      desc: "探索语数英三大学科的知识关卡",
      tag: "闯关探索",
      tagColor: "bg-emerald-500/20 text-emerald-300",
      icon: <Map className="w-8 h-8 text-white" />,
      iconBg: "bg-gradient-to-br from-emerald-400 to-teal-600",
      link: "/student/explore/adventure",
      tags: [
        { text: "闯关挑战", color: "bg-emerald-500/20 text-emerald-300" },
        { text: "获取积分", color: "bg-blue-500/20 text-blue-300" },
        { text: "星级评定", color: "bg-purple-500/20 text-purple-300" },
      ]
    },
    {
      title: "PVP 对战",
      desc: "匹配对手，限时答题竞技比拼",
      tag: "实时竞技",
      tagColor: "bg-red-500/20 text-red-300",
      icon: <Swords className="w-8 h-8 text-white" />,
      iconBg: "bg-gradient-to-br from-amber-400 via-red-500 to-purple-600",
      link: "/student/explore/pvp",
      tags: [
        { text: "实时对战", color: "bg-amber-500/20 text-amber-300" },
        { text: "限时挑战", color: "bg-red-500/20 text-red-300" },
        { text: "积分奖励", color: "bg-purple-500/20 text-purple-300" },
      ]
    }
  ]

  return (
    <div className="animate-fade-in">
      {/* 顶部世界探索栏 完全不动原生样式 */}
      <header className="gradient-magic px-5 pt-10 pb-5 md:pt-8 md:rounded-b-2xl">
        <div className="flex items-center gap-2 mb-1">
          <Compass className="w-5 h-5 text-white/80" />
          <h1 className="text-xl font-bold text-white">世界探索</h1>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-white/70 text-sm">选择你的冒险方式</span>
          <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-medium">{gradeLabel}</span>
        </div>
      </header>

      {/* 双卡片网格布局：移动端单列，电脑端左右并排 */}
      <div className="px-4 md:px-6 -mt-4 pb-4 mt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {moduleList.map((item) => (
            <Link
              key={item.title}
              to={item.link}
              className="block rounded-2xl bg-[#242155] p-6 hover:shadow-xl hover:shadow-purple-900/30 transition-all duration-300 group relative"
            >
              {/* 右上角标签角标（对标参考图：实时 / AI增强） */}
              <div className="absolute top-6 right-6">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${item.tagColor}`}>
                  {item.tag}
                </span>
              </div>

              {/* 左上角渐变图标 */}
              <div className={`w-16 h-16 rounded-2xl ${item.iconBg} flex items-center justify-center shadow-lg mb-5 group-hover:scale-105 transition-transform duration-300`}>
                {item.icon}
              </div>

              {/* 模块大标题 */}
              <h3 className="text-xl font-bold text-white mb-2">
                {item.title}
              </h3>

              {/* 模块描述文案 */}
              <p className="text-white/60 text-sm mb-4">
                {item.desc}
              </p>

              {/* 原本的小标签全部保留 */}
              <div className="flex flex-wrap gap-2 mb-6">
                {item.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`text-[10px] px-2 py-0.5 rounded-full ${tag.color}`}
                  >
                    {tag.text}
                  </span>
                ))}
              </div>

              {/* 底部：进入模块 + 箭头 */}
              <div className="flex items-center gap-1.5 text-white/80 group-hover:text-white transition-colors">
                <span className="text-sm font-medium">进入模块</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}