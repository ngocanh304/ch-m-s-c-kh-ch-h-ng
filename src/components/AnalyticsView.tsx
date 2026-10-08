import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Users,
  Zap,
  Bot,
  UserCheck,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { AnalyticsSummary } from '../types';

interface AnalyticsViewProps {
  analytics: AnalyticsSummary;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ analytics }) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('7d');

  // Daily trend data for visualization
  const weeklyTrends = [
    { day: 'Thứ 2', total: 165, ai: 142, staff: 23 },
    { day: 'Thứ 3', total: 190, ai: 164, staff: 26 },
    { day: 'Thứ 4', total: 180, ai: 152, staff: 28 },
    { day: 'Thứ 5', total: 215, ai: 185, staff: 30 },
    { day: 'Thứ 6', total: 240, ai: 205, staff: 35 },
    { day: 'Thứ 7', total: 210, ai: 178, staff: 32 },
    { day: 'Chủ Nhật', total: 175, ai: 148, staff: 27 },
  ];

  const topTopics = [
    { name: 'Chính sách bảo hành 1 đổi 1 30 ngày', count: 382, pct: 31 },
    { name: 'Mã giảm giá & Khuyến mãi hiện hành', count: 295, pct: 24 },
    { name: 'Tra cứu trạng thái đơn hàng (#ORD)', count: 245, pct: 20 },
    { name: 'Thông số tai nghe CarePods Pro Max', count: 180, pct: 14 },
    { name: 'Hướng dẫn reset & khắc phục sự cố', count: 146, pct: 11 },
  ];

  const channels = [
    { name: 'Web Chat Widget', share: 64, color: 'bg-blue-600' },
    { name: 'Zalo OA', share: 22, color: 'bg-indigo-600' },
    { name: 'Facebook Messenger', share: 14, color: 'bg-purple-600' },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-slate-50 p-4 md:p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading font-extrabold text-xl md:text-2xl text-slate-900 tracking-tight">
              Báo Cáo & Thống Kê Vận Hành (Analytics)
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800">
              Live Telemetry
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Đo lường độ chính xác của AI Agent, tốc độ phản hồi và sự hài lòng của khách hàng theo thời gian thực.
          </p>
        </div>

        {/* Time Filter */}
        <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 text-xs shrink-0">
          <button
            onClick={() => setTimeRange('7d')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              timeRange === '7d' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            7 ngày qua
          </button>
          <button
            onClick={() => setTimeRange('30d')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              timeRange === '30d' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            30 ngày qua
          </button>
          <button
            onClick={() => setTimeRange('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              timeRange === 'all' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Toàn thời gian
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Conversations */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tổng Số Hội Thoại</span>
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Layers className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="font-heading font-extrabold text-2xl text-slate-900">
              {analytics.totalConversations.toLocaleString('vi-VN')}
            </div>
            <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +18.4% so với tuần trước
            </div>
          </div>
        </div>

        {/* AI Resolution Rate */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tỷ Lệ AI Tự Động Xử Lý</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Bot className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="font-heading font-extrabold text-2xl text-emerald-600">
              {analytics.aiResolutionRate}%
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              Khách hàng thỏa mãn không cần nhân viên
            </div>
          </div>
        </div>

        {/* Average Response Time */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Thời Gian Phản Hồi TB</span>
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="font-heading font-extrabold text-2xl text-indigo-600">
              {analytics.avgResponseTimeSec}s
            </div>
            <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
              <Zap className="w-3.5 h-3.5" /> Tức thì 24/7 (Không độ trễ)
            </div>
          </div>
        </div>

        {/* CSAT Score */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Độ Hài Lòng (CSAT)</span>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Star className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="font-heading font-extrabold text-2xl text-amber-500 flex items-center gap-1">
              <span>{analytics.csatScore}</span>
              <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              Tiết kiệm ~{analytics.savedHoursEstimate} giờ làm việc cho đội ngũ
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Trend Bar Chart (2 columns) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading font-bold text-sm text-slate-900">
                Xu Hướng Hội Thoại: AI Xử Lý vs Nhân Viên Can Thiệp
              </h2>
              <div className="text-xs text-slate-400 mt-0.5">
                Thống kê theo 7 ngày gần nhất
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-blue-600 inline-block"></span>
                <span className="text-slate-600 font-medium">AI Tự động</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-amber-500 inline-block"></span>
                <span className="text-slate-600 font-medium">Nhân viên hỗ trợ</span>
              </div>
            </div>
          </div>

          {/* SVG Visual Bars */}
          <div className="h-64 pt-6 flex items-end justify-between gap-3 px-2 border-b border-slate-100">
            {weeklyTrends.map((t, idx) => {
              const maxVal = 260;
              const aiHeight = Math.round((t.ai / maxVal) * 100);
              const staffHeight = Math.round((t.staff / maxVal) * 100);

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="w-full max-w-[36px] flex flex-col gap-1 items-center">
                    <div className="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      {t.total}
                    </div>
                    {/* Staff stacked bar */}
                    <div
                      className="w-full bg-amber-500 rounded-t-sm transition-all group-hover:brightness-110"
                      style={{ height: `${staffHeight * 1.8}px` }}
                      title={`Nhân viên: ${t.staff} cuộc`}
                    />
                    {/* AI bar */}
                    <div
                      className="w-full bg-blue-600 rounded-b-md transition-all group-hover:brightness-110"
                      style={{ height: `${aiHeight * 1.8}px` }}
                      title={`AI Tự động: ${t.ai} cuộc`}
                    />
                  </div>
                  <span className="text-[11px] font-medium text-slate-500">
                    {t.day}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
            <span>Tỷ lệ tự động hóa duy trì ổn định trên 84% mỗi ngày.</span>
            <span className="font-bold text-blue-600">Khối lượng công việc giảm 5.4 lần</span>
          </div>
        </div>

        {/* Channel Share & Handover Rate (1 column) */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5 flex flex-col justify-between">
          <div>
            <h2 className="font-heading font-bold text-sm text-slate-900">
              Phân Phối Theo Kênh Tiếp Nhận
            </h2>
            <div className="text-xs text-slate-400 mt-0.5">
              Tỷ lệ tin nhắn đổ về hệ thống
            </div>

            <div className="mt-4 space-y-3">
              {channels.map((ch, idx) => (
                <div key={idx} className="space-y-1.5 text-xs">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-700">{ch.name}</span>
                    <span className="font-bold text-slate-900">{ch.share}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${ch.color}`} style={{ width: `${ch.share}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="text-xs font-bold text-slate-800">
              Tỷ lệ bàn giao (Escalation Rate):
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Được chuyển cho nhân viên:</span>
              <span className="font-bold text-amber-600">{analytics.escalationRate}%</span>
            </div>
            <div className="text-[11px] text-slate-400 leading-relaxed">
              Các cuộc trò chuyện được chuyển phần lớn do yêu cầu khiếu nại đổi trả và lỗi phần cứng phức tạp.
            </div>
          </div>
        </div>
      </div>

      {/* Top Topics in Knowledge Base */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-bold text-sm text-slate-900">
            Top 5 Chủ Đề Khách Hàng Hỏi Nhiều Nhất (Knowledge Base Analytics)
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Tự động đồng bộ với Cơ sở tri thức
          </span>
        </div>

        <div className="space-y-3">
          {topTopics.map((topic, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[11px]">
                  {i + 1}
                </span>
                <span className="font-medium text-slate-800">{topic.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-slate-500">{topic.count} lượt hỏi</span>
                <span className="font-bold text-blue-600 w-12 text-right">{topic.pct}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
