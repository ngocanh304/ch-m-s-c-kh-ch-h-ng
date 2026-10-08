import React, { useState } from 'react';
import {
  Smile,
  Frown,
  Meh,
  AlertTriangle,
  Sparkles,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
  Sliders,
  CheckCircle2,
  Bot,
  Zap,
} from 'lucide-react';
import { analyzeSentiment } from '../services/aiAgentEngine';
import { Conversation } from '../types';

interface SentimentViewProps {
  conversations: Conversation[];
}

export const SentimentView: React.FC<SentimentViewProps> = ({ conversations }) => {
  const [testInput, setTestInput] = useState(
    'Tai nghe tôi mới nhận bị rè một bên, giao trễ 1 ngày! Cho tôi gặp nhân viên giải quyết ngay đi!'
  );
  const [analysisResult, setAnalysisResult] = useState(() => analyzeSentiment(testInput));
  const [alertThreshold, setAlertThreshold] = useState(-30);

  const samplePhrases = [
    'Sản phẩm dùng rất mượt, âm bass sâu, giao hàng nhanh 2 tiếng tuyệt vời!',
    'Tai nghe tôi mới nhận bị rè một bên, giao trễ 1 ngày! Cho tôi gặp nhân viên giải quyết ngay đi!',
    'Cho mình hỏi mã CAREAI10 áp dụng được cho đơn phụ kiện không shop?',
    'Shop lừa đảo à? Tôi nhắn tin cả tiếng không ai trả lời, đòi bồi thường gấp!',
    'Chất lượng tốt, dịch vụ chu đáo, sẽ tiếp tục ủng hộ shop lâu dài.',
  ];

  const handleTest = (phrase: string) => {
    setTestInput(phrase);
    setAnalysisResult(analyzeSentiment(phrase));
  };

  // Aggregated sentiment stats from real active conversations
  const total = conversations.length;
  const positiveCount = conversations.filter((c) => c.sentiment === 'Tích cực').length;
  const neutralCount = conversations.filter((c) => c.sentiment === 'Trung lập').length;
  const negativeCount = conversations.filter((c) => c.sentiment === 'Tiêu cực').length;

  const positivePercent = total ? Math.round((positiveCount / total) * 100) : 0;
  const neutralPercent = total ? Math.round((neutralCount / total) * 100) : 0;
  const negativePercent = total ? Math.round((negativeCount / total) * 100) : 0;

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-slate-50 p-4 md:p-6 space-y-6">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="font-heading font-extrabold text-xl md:text-2xl text-slate-900 tracking-tight">
            AI Phân Tích Cảm Xúc & Cảnh Báo Sớm
          </h1>
          <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-rose-100 text-rose-700">
            Real-time Sentiment Guard
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Hệ thống AI tự động phân tích giọng điệu, sắc thái cảm xúc và kích hoạt báo động khi khách hàng không hài lòng.
        </p>
      </div>

      {/* Top Sentiment Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Positive */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Smile className="w-7 h-7" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Tích cực / Hài lòng</div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="font-heading font-extrabold text-2xl text-slate-900">
                {positivePercent}%
              </span>
              <span className="text-xs text-emerald-600 font-bold flex items-center">
                <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> {positiveCount} cuộc
              </span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Khách hàng khen ngợi & mua sắm</div>
          </div>
        </div>

        {/* Neutral */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Meh className="w-7 h-7" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Trung lập / Thắc mắc</div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="font-heading font-extrabold text-2xl text-slate-900">
                {neutralPercent}%
              </span>
              <span className="text-xs text-blue-600 font-bold">{neutralCount} cuộc</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Hỏi thông số, giá, tra cứu đơn</div>
          </div>
        </div>

        {/* Negative */}
        <div className="p-5 rounded-2xl bg-white border border-rose-200 bg-rose-50/20 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <Frown className="w-7 h-7" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Tiêu cực / Cần can thiệp</div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="font-heading font-extrabold text-2xl text-rose-600">
                {negativePercent}%
              </span>
              <span className="text-xs text-rose-600 font-bold flex items-center">
                <AlertTriangle className="w-3.5 h-3.5 mr-0.5" /> {negativeCount} cảnh báo
              </span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Đã tự động chuyển nhân viên</div>
          </div>
        </div>
      </div>

      {/* Interactive Live Sentiment Simulator */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h2 className="font-heading font-bold text-base text-slate-900">
              Công Cụ Thử Nghiệm Phân Tích Cảm Xúc AI Tức Thì
            </h2>
          </div>
          <span className="text-xs text-indigo-600 bg-indigo-50 font-bold px-2.5 py-1 rounded-full border border-indigo-100">
            Mô hình Phân loại Đa Chiều
          </span>
        </div>

        {/* Sample phrases */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-slate-600">Chọn mẫu câu thực tế để thử nghiệm:</span>
          <div className="flex flex-wrap gap-2">
            {samplePhrases.map((phrase, idx) => (
              <button
                key={idx}
                onClick={() => handleTest(phrase)}
                className={`p-2 rounded-xl text-xs text-left transition-all border ${
                  testInput === phrase
                    ? 'bg-blue-50 border-blue-400 text-blue-900 font-medium shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                "{phrase.slice(0, 48)}..."
              </button>
            ))}
          </div>
        </div>

        {/* Input box */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700">
            Hoặc tự gõ nội dung tin nhắn của khách hàng:
          </label>
          <div className="flex gap-2">
            <textarea
              rows={3}
              value={testInput}
              onChange={(e) => {
                setTestInput(e.target.value);
                setAnalysisResult(analyzeSentiment(e.target.value));
              }}
              placeholder="Nhập bất kỳ câu nói tiếng Việt của khách hàng..."
              className="flex-1 p-3 text-xs md:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-sans"
            />
          </div>
        </div>

        {/* Live Analysis Output Card */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            analysisResult.sentiment === 'Tiêu cực'
              ? 'bg-rose-50/60 border-rose-300'
              : analysisResult.sentiment === 'Tích cực'
              ? 'bg-emerald-50/60 border-emerald-300'
              : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center md:text-left">
            <div>
              <div className="text-[11px] text-slate-500 font-medium">Phân loại cảm xúc:</div>
              <div
                className={`font-heading font-extrabold text-lg mt-0.5 flex items-center gap-1.5 justify-center md:justify-start ${
                  analysisResult.sentiment === 'Tiêu cực'
                    ? 'text-rose-600'
                    : analysisResult.sentiment === 'Tích cực'
                    ? 'text-emerald-600'
                    : 'text-slate-700'
                }`}
              >
                {analysisResult.sentiment === 'Tiêu cực' ? (
                  <Frown className="w-5 h-5" />
                ) : analysisResult.sentiment === 'Tích cực' ? (
                  <Smile className="w-5 h-5" />
                ) : (
                  <Meh className="w-5 h-5" />
                )}
                <span>{analysisResult.sentiment}</span>
              </div>
            </div>

            <div>
              <div className="text-[11px] text-slate-500 font-medium">Điểm số (-100 đến +100):</div>
              <div className="font-heading font-extrabold text-lg text-slate-900 mt-0.5">
                {analysisResult.score > 0 ? `+${analysisResult.score}` : analysisResult.score} / 100
              </div>
            </div>

            <div>
              <div className="text-[11px] text-slate-500 font-medium">Trạng thái tâm lý cụ thể:</div>
              <div className="font-heading font-bold text-sm text-indigo-900 mt-1">
                {analysisResult.emotion}
              </div>
            </div>

            <div>
              <div className="text-[11px] text-slate-500 font-medium">Cảnh báo tự động:</div>
              <div className="mt-1">
                {analysisResult.isNegativeAlert ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-600 text-white shadow-xs animate-pulse">
                    <AlertTriangle className="w-3.5 h-3.5" /> BẬT CẢNH BÁO
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5" /> An toàn
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Visual bar */}
          <div className="mt-4 pt-4 border-t border-slate-200/60 space-y-1.5">
            <div className="flex justify-between text-[11px] text-slate-500 font-medium">
              <span>Rất giận dữ (-100)</span>
              <span>Trung lập (0)</span>
              <span>Cực kỳ hài lòng (+100)</span>
            </div>
            <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden flex">
              <div
                className={`h-full transition-all duration-300 ${
                  analysisResult.score < -20
                    ? 'bg-rose-500'
                    : analysisResult.score > 20
                    ? 'bg-emerald-500'
                    : 'bg-blue-500'
                }`}
                style={{ width: `${Math.max(5, (analysisResult.score + 100) / 2)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Alerts from Current Conversations */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h2 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-600" />
          <span>Danh Sách Hội Thoại Cần Can Thiệp Khẩn Cấp</span>
        </h2>

        <div className="space-y-3">
          {conversations
            .filter((c) => c.sentiment === 'Tiêu cực' || c.status === 'Chờ nhân viên')
            .map((conv) => (
              <div
                key={conv.id}
                className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={conv.customerAvatar}
                    alt={conv.customerName}
                    className="w-10 h-10 rounded-xl object-cover shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      <span>{conv.customerName}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                        Điểm: {conv.sentimentScore}/100
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        {conv.status}
                      </span>
                    </div>
                    <p className="text-slate-600 mt-1 line-clamp-1">
                      "{conv.lastMessage}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] text-rose-700 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> AI đã cảnh báo
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
