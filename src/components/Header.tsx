import React, { useState } from 'react';
import {
  Bot,
  Bell,
  ShieldCheck,
  User,
  Sparkles,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  LogOut,
  Sliders,
  ExternalLink
} from 'lucide-react';
import { UserAccount, AppNotification, UserRole } from '../types';

interface HeaderProps {
  currentUser: UserAccount;
  allUsers: UserAccount[];
  onSwitchUser: (user: UserAccount) => void;
  notifications: AppNotification[];
  onMarkNotificationRead: (id: string) => void;
  onMarkAllNotificationsRead: () => void;
  onSelectConversation: (convId: string) => void;
  onOpenCustomerWidget: () => void;
  activeTab: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  allUsers,
  onSwitchUser,
  notifications,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
  onSelectConversation,
  onOpenCustomerWidget,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Brand & System Status */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center shadow-md shadow-blue-500/20 text-white">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-lg tracking-tight bg-gradient-to-r from-blue-700 via-indigo-600 to-violet-700 bg-clip-text text-transparent">
                CareAI
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-full bg-blue-100 text-blue-700 border border-blue-200/60">
                Agent 2.5
              </span>
            </div>
            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              <span>Hệ thống Tự động hóa 24/7</span>
            </div>
          </div>
        </div>

        {/* Live Status Pill */}
        <div className="hidden lg:flex items-center gap-2 ml-4 px-3 py-1 bg-slate-100/90 rounded-full text-xs text-slate-600 border border-slate-200/60">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Gemini 3.8 Flash + Knowledge Grounding</span>
          <span className="text-emerald-600 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Online
          </span>
        </div>
      </div>

      {/* Right Action Bar */}
      <div className="flex items-center gap-2.5">
        {/* Customer Widget Launcher Button */}
        <button
          onClick={onOpenCustomerWidget}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-sm transition-all active:scale-95"
          title="Mở giao diện khách hàng thử nghiệm"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Khách hàng Chat Widget</span>
          <ExternalLink className="w-3 h-3 opacity-80" />
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Thông báo hệ thống"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce shadow-sm">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-0 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
              <div className="p-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-sm text-slate-800">Thông Báo AI & Khẩn Cấp</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-rose-100 text-rose-700 rounded-full">
                      {unreadCount} mới
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllNotificationsRead}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline"
                  >
                    Đọc tất cả
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500">
                    Không có thông báo mới nào
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        onMarkNotificationRead(notif.id);
                        if (notif.conversationId) {
                          onSelectConversation(notif.conversationId);
                          setShowNotifications(false);
                        }
                      }}
                      className={`p-3.5 text-xs transition-colors cursor-pointer hover:bg-slate-50 flex items-start gap-3 ${
                        !notif.read ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                          notif.type === 'negative_sentiment' || notif.type === 'complaint'
                            ? 'bg-rose-100 text-rose-600'
                            : notif.type === 'escalation_requested'
                            ? 'bg-amber-100 text-amber-600'
                            : 'bg-blue-100 text-blue-600'
                        }`}
                      >
                        {notif.type === 'negative_sentiment' || notif.type === 'complaint' ? (
                          <AlertTriangle className="w-4 h-4" />
                        ) : notif.type === 'escalation_requested' ? (
                          <Sliders className="w-4 h-4" />
                        ) : (
                          <MessageSquare className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className="font-semibold text-slate-800 truncate">{notif.title}</span>
                          <span className="text-[10px] text-slate-400 shrink-0">{notif.timestamp}</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed text-[11px] line-clamp-2">{notif.message}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                              notif.urgency === 'Khẩn cấp'
                                ? 'bg-rose-100 text-rose-700'
                                : notif.urgency === 'Cao'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {notif.urgency}
                          </span>
                          {notif.conversationId && (
                            <span className="text-[10px] text-blue-600 font-medium hover:underline">
                              Xem hội thoại →
                            </span>
                          )}
                        </div>
                      </div>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-2" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Switcher / Role Selector */}
        <div className="relative">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl border border-slate-200/90 bg-slate-50 hover:bg-slate-100/80 transition-all text-left"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-300"
            />
            <div className="hidden md:block leading-tight">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                <span>{currentUser.name}</span>
                <span
                  className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                    currentUser.role === 'admin'
                      ? 'bg-purple-100 text-purple-700'
                      : currentUser.role === 'staff'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {currentUser.role === 'admin'
                    ? 'ADMIN'
                    : currentUser.role === 'staff'
                    ? 'NHÂN VIÊN'
                    : 'KHÁCH HÀNG'}
                </span>
              </div>
              <div className="text-[10px] text-slate-500 truncate max-w-[130px]">
                {currentUser.department}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50">
              <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Chuyển đổi Tài khoản Phân quyền
              </div>
              <div className="space-y-1">
                {allUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => {
                      onSwitchUser(user);
                      setShowUserDropdown(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs transition-colors ${
                      currentUser.id === user.id
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-6 h-6 rounded-md object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="truncate font-medium">{user.name}</div>
                      <div className="text-[10px] text-slate-400">
                        {user.role === 'admin'
                          ? 'Toàn quyền Quản trị & Cấu hình'
                          : user.role === 'staff'
                          ? 'Trực ca & Xử lý Copilot'
                          : 'Giao diện khách hàng demo'}
                      </div>
                    </div>
                    {currentUser.id === user.id && (
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100 px-3 py-1.5 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1 text-emerald-600 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" /> Bảo mật Role-Based
                </span>
                <span className="text-[10px] text-slate-400">SSL 256-bit</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
