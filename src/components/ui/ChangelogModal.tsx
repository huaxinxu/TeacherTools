import { useState } from 'react';
import { Modal } from './shared'; // 复用你项目已有的全局Modal弹窗组件
import { VERSION_CHANGE_LOG, VersionLog } from '@/lib/changelog';
import { Card } from './card';
import { Button } from './button';

interface ChangelogModalProps {
  open: boolean;
  onClose: () => void;
}

export const ChangelogModal = ({ open, onClose }: ChangelogModalProps) => {
  // 默认选中展示最新版本（数组第一个）
  const [activeVersion, setActiveVersion] = useState<VersionLog>(VERSION_CHANGE_LOG[0]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="📜版本更新日志"
      // width={700}
      wide
    >
      <div className="flex gap-4 h-[500px]">
        {/* 左侧版本列表栏 */}
        <div className="w-40 shrink-0 border-r pr-2 overflow-y-auto">
          {VERSION_CHANGE_LOG.map((log) => (
            <Button
              key={log.version}
              variant={activeVersion.version === log.version ? 'default' : 'ghost'}
              className="w-full justify-start mb-2"
              onClick={() => setActiveVersion(log)}
            >
              {log.version}
            </Button>
          ))}
        </div>

        {/* 右侧版本详情内容区 */}
        <div className="flex-1 overflow-y-auto pr-2">
          <Card>
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">{activeVersion.title}</h3>
                <span className="text-sm text-gray-500">更新时间：{activeVersion.updateTime}</span>
              </div>

              <div className="space-y-3">
                {activeVersion.changes.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    {/* 类型标签自动区分颜色 */}
                    <span
                      className={`shrink-0 px-2 py-0.5 rounded text-xs font-medium
                        ${item.type === '新增' ? 'bg-green-100 text-green-700' :
                          item.type === '优化' ? 'bg-blue-100 text-blue-700' :
                          item.type === '修复' ? 'bg-orange-100 text-orange-700' :
                          'bg-gray-100 text-gray-700'
                        }
                      `}
                    >
                      {item.type}
                    </span>
                    <p className="text-sm">{item.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Modal>
  );
};