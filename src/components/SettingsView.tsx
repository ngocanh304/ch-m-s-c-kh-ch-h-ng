import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Key,
  Users,
  Bot,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Eye,
  EyeOff,
  Server,
  Zap,
} from 'lucide-react';
import { UserAccount } from '../types';

interface SettingsViewProps {
  currentUser: UserAccount;
  allUsers: UserAccount[];
  onSwitchUser: (user: UserAccount) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentUser,
  allUsers,
  onSwitchUser,
}) => {
  const [autoHandoffThreshold, setAutoHandoffThreshold] = useState(-30);
  const [confidenceThreshold, setConfidenceThreshold] = useState(80);
  const [maskCustomerData, setMaskCustomerData] = useState(true);
  const [enableGuardrails, setEnableGuardrails] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const auditLogs = [
    { time: '10:14:22', action: 'Kích hoạt chuyển giao hội thoại sang nhân viên Trần Hải Đăng do cảm xúc tiêu cực (-75)', user: 'AI Agent' },
    { time: '10:12:05', action: 'Tra cứu thành công dữ liệu đơn hàng #ORD-8821 từ hệ thống logistics', user: 'AI Agent' },
    { time: '09:49:12', action: 'Áp dụng mã voucher CAREAI10 giảm 10% cho khách hàng Vũ Đức Thịnh', user: 'AI Agent' },
    { time: '09:30:00', action: 'Đồng bộ 8 tài liệu Knowledge Base mới nhất vào bộ nhớ đệm RAG', user: 'Admin' },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-slate-50 p-4 md:p-6 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading font-extrabold text-xl md:text-2xl text-slate-900 tracking-tight">
              Cài Đặt Hệ Thống & Bảo Mật Phân Quyền
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Chuẩn An Ninh Enterprise
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Quản trị tài khoản, chính sách bảo vệ dữ liệu khách hàng, thiết lập ngưỡng can thiệp của AI Agent.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
        >
          {isSaved ? '✓ Đã Lưu Cấu Hình' : 'Lưu Thay Đổi'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: AI Agent Guardrails & Thresholds */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sliders className="w-5 h-5 text-indigo-600" />
            <h2 className="font-heading font-bold text-sm text-slate-900">
              Cấu Hình Ngưỡng Can Thiệp AI (Agent Guardrails)
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            {/* Auto Handoff threshold */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-bold text-slate-700">
                <span>Ngưỡng Cảnh Báo Cảm Xúc Bắt Buộc Chuyển Người:</span>
                <span className="text-rose-600">{autoHandoffThreshold} điểm</span>
              </div>
              <input
                type="range"
                min={-80}
                max={0}
                step={5}
                value={autoHandoffThreshold}
                onChange={(e) => setAutoHandoffThreshold(Number(e.target.value))}
                className="w-full accent-rose-600"
              />
              <p className="text-[11px] text-slate-400">
                Khi điểm cảm xúc của khách hàng thấp hơn ngưỡng này, AI Agent sẽ tự động chuyển hội thoại cho Nhân viên hỗ trợ và bắn chuông cảnh báo.
              </p>
            </div>

            {/* Confidence threshold */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <div className="flex justify-between font-bold text-slate-700">
                <span>Độ Tự Tin Tối Thiểu Để AI Tự Động Phản Hồi:</span>
                <span className="text-blue-600">{confidenceThreshold}%</span>
              </div>
              <input
                type="range"
                min={60}
                max={95}
                step={5}
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <p className="text-[11px] text-slate-400">
                Nếu độ khớp trong Knowledge Base dưới {confidenceThreshold}%, AI sẽ đưa ra câu trả lời thận trọng hoặc chuyển cho chuyên viên tư vấn.
              </p>
            </div>

            {/* Guardrails switches */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">
                    Kích hoạt hệ thống Guardrails an toàn 24/7
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Ngăn chặn AI tự sinh thông tin sai lệch ngoài Knowledge Base.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={enableGuardrails}
                  onChange={(e) => setEnableGuardrails(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">
                    Tự động tạo câu trả lời gợi ý (AI Copilot)
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Chuẩn bị sẵn 3 phương án phản hồi cho nhân viên khi tiếp quản ca chat.
                  </div>
                </div>
                <input
                  type="checkbox"
                  defaultChecked={true}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Security & Data Protection */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Lock className="w-5 h-5 text-emerald-600" />
            <h2 className="font-heading font-bold text-sm text-slate-900">
              Bảo Mật & Bảo Vệ Dữ Liệu Khách Hàng
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Mã Hóa Dữ Liệu Đầu - Cuối
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  AES-256 / SSL TLS 1.3
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Tất cả các tin nhắn trò chuyện, thông tin thẻ thanh toán và số điện thoại khách hàng đều được mã hóa theo tiêu chuẩn an ninh thông tin ISO 27001.
              </p>
            </div>

            {/* Data Masking */}
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <div>
                <div className="font-bold text-slate-800">
                  Che dữ liệu nhạy cảm (Data Masking)
                </div>
                <div className="text-[11px] text-slate-400">
                  Tự động ẩn 4 số giữa của SĐT và CMND/CCCD trên giao diện nhân viên.
                </div>
              </div>
              <input
                type="checkbox"
                checked={maskCustomerData}
                onChange={(e) => setMaskCustomerData(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </div>

            {/* Engine Status */}
            <div className="space-y-2 pt-1">
              <div className="font-bold text-slate-800">Trạng thái AI Engine:</div>
              <div className="p-3 rounded-xl bg-slate-900 text-slate-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Mô hình AI:</span>
                  <span className="text-indigo-400 font-bold">Gemini 3.8 Flash (Server-Side)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Cơ chế RAG:</span>
                  <span className="text-emerald-400 font-bold">Grounding với Knowledge Base</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Độ khả dụng (Uptime):</span>
                  <span className="text-emerald-400 font-bold">99.98% (24/7 Không gián đoạn)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Role Management Section */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <h2 className="font-heading font-bold text-sm text-slate-900">
              Phân Quyền Vai Trò Người Dùng (Role-Based Access Control)
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            Đang đăng nhập: <strong>{currentUser.name}</strong> ({currentUser.role.toUpperCase()})
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {allUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => onSwitchUser(user)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                currentUser.id === user.id
                  ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/20'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 truncate">
                    {user.name}
                  </span>
                  {currentUser.id === user.id && (
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  )}
                </div>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded inline-block mt-0.5 ${
                    user.role === 'admin'
                      ? 'bg-purple-100 text-purple-700'
                      : user.role === 'staff'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {user.role === 'admin'
                    ? 'Quản trị viên (Toàn quyền)'
                    : user.role === 'staff'
                    ? 'Nhân viên hỗ trợ'
                    : 'Khách hàng thử nghiệm'}
                </span>
                <div className="text-[10px] text-slate-400 mt-1 truncate">
                  {user.department}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Audit Trail */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
        <h3 className="font-heading font-bold text-sm text-slate-900">
          Nhật Ký Bảo Mật & Hoạt Động Hệ Thống (Audit Logs)
        </h3>
        <div className="divide-y divide-slate-100 text-xs">
          {auditLogs.map((log, i) => (
            <div key={i} className="py-2.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono text-slate-400 shrink-0">
                  {log.time}
                </span>
                <span className="text-slate-700 font-medium">{log.action}</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                {log.user}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
