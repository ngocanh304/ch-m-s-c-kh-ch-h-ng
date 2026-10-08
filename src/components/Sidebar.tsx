import React from 'react';
import {
  MessageSquare,
  BookOpen,
  Users,
  Smile,
  BarChart3,
  Cpu,
  Settings,
  Sparkles,
  Zap,
  HelpCircle,
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  userRole: UserRole;
  waitingCount: number;
  unreadCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  userRole,
  waitingCount,
  unreadCount,
}) => {
  const menuItems = [
    {
      id: 'conversations',
      label: 'Quản lý Hội thoại',
      desc: 'Live Chat, Handover & Copilot',
      icon: MessageSquare,
      badge: waitingCount > 0 ? `${waitingCount} chờ` : unreadCount > 0 ? `${unreadCount}` : null,
      badgeColor: waitingCount > 0 ? 'bg-amber-500' : 'bg-blue-600',
    },
    {
      id: 'knowledge',
      label: 'Knowledge Base (RAG)',
      desc: 'Sản phẩm, chính sách, FAQ',
      icon: BookOpen,
      adminOnly: false,
    },
    {
      id: 'customers',
      label: 'Quản lý Khách hàng',
      desc: 'CRM & Phân loại Tier',
      icon: Users,
    },
    {
      id: 'sentiment',
      label: 'AI Phân tích Cảm xúc',
      desc: 'Giám sát chỉ số & Cảnh báo',
      icon: Smile,
    },
    {
      id: 'analytics',
      label: 'Báo cáo & Analytics',
      desc: 'Hiệu suất AI, CSAT, Xu hướng',
      icon: BarChart3,
    },
    {
      id: 'agent_lab',
      label: 'Mô phỏng AI Agent',
      desc: 'Khảo sát Chu trình Nhận thức',
      icon: Cpu,
      isNew: true,
    },
    {
      id: 'settings',
      label: 'Cài đặt & Bảo mật',
      desc: 'Phân quyền & Cấu hình AI',
      icon: Settings,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 select-none">
      {/* Brand Subtitle / Autonomous Tag */}
      <div className="p-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
          <Zap className="w-4 h-4 text-amber-400 shrink-0" />
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-slate-200 uppercase tracking-wider truncate">
              Chế độ Tự trị (Autonomous)
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              AI tiếp nhận & xử lý tức thì
            </div>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
          Phân Hệ Chức Năng
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-all group ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/25'
                  : 'hover:bg-slate-800/70 text-slate-300 hover:text-white'
              }`}
            >
              <Icon
                className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                }`}
              />
              <div className="flex-1 min-w-0">
                <div className="text-xs truncate flex items-center justify-between">
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`ml-1.5 px-1.5 py-0.5 text-[10px] font-bold text-white rounded-full ${item.badgeColor} animate-pulse`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {item.isNew && (
                    <span className="ml-1 px-1.5 py-0.2 text-[9px] font-bold bg-indigo-500/30 text-indigo-300 rounded border border-indigo-400/40">
                      AI Loop
                    </span>
                  )}
                </div>
                <div
                  className={`text-[10px] truncate ${
                    isActive ? 'text-blue-100' : 'text-slate-500'
                  }`}
                >
                  {item.desc}
                </div>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Bottom Info Card */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <div className="rounded-xl p-3 bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-900/40 text-xs">
          <div className="flex items-center gap-1.5 text-indigo-300 font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Copilot Active</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            AI liên tục đề xuất câu trả lời thông minh cho nhân viên khi có khách hàng cần hỗ trợ.
          </p>
        </div>
      </div>
    </aside>
  );
};
