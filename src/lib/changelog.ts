/**
 * 版本更新日志总文档
 * 【维护规则】后续所有版本更新，仅修改当前文件即可，组件无需改动
 * 数组越靠前 = 版本越新，默认展示最新版本置顶
 */

// 统一更新项类型约束
export type ChangeItem = {
  type: '新增' | '优化' | '修复' | '调整'; // 更新类型，可自定义扩展
  content: string; // 更新详情文案
};

// 单版本完整日志类型
export type VersionLog = {
  version: string; // 版本号 例：1.0.0
  updateTime: string; // 更新日期 例：2026-04-20
  title: string; // 版本标题 例：班级世界 1.0 正式版
  changes: ChangeItem[]; // 该版本所有更新明细
};

// ===================== 所有版本日志在这里维护 =====================
export const VERSION_CHANGE_LOG: VersionLog[] = [
  // 最新版本放数组最前面！！！
  {
    version: '2.0.1',
    updateTime: '2026-04-20',
    title: '我的班级世界 2.0.1 版本更新',
    changes: [
      { type: '优化', content: '上线版本更新日志弹窗查看功能' },
      { type: '新增', content: '课时作业标签' },
      { type: '调整', content: '探索入口调整为卡片式'},
      { type: '优化', content: '优化冒险地图' },
    ],
  },{
    version: '2.0.0',
    updateTime: '2026-04-15',
    title: '我的班级世界 2.0.0 版本更新',
    changes: [
      { type: '新增', content: '学生端上线' },
      { type: '新增', content: '全局权限校验'},
      { type: '新增', content: '学生端关卡冒险、探索枢纽、对战匹配核心玩法' },
    ],
  },
    {
    version: '1.0.0',
    updateTime: '2026-04-1',
    title: '我的班级世界 1.0.0 首发版本',
    changes: [
      { type: '新增', content: '教师端功能上线声音检测、座位表功能' }
    ],
  },
  // 后续你直接在这里复制对象，新增版本即可！
];