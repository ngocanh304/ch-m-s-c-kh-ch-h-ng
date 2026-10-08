import React, { useState } from 'react';
import {
  Search,
  Filter,
  Bot,
  User,
  Send,
  Sparkles,
  ArrowRightLeft,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Tag,
  Phone,
  Mail,
  ChevronRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Flame,
  ThumbsUp,
  MessageCircle,
  Copy,
  Info,
} from 'lucide-react';
import {
  Conversation,
  ConversationStatus,
  AssignedHandler,
  Message,
  Customer,
  SentimentType,
} from '../types';

interface ConversationViewProps {
  conversations: Conversation[];
  activeConversationId: string;
  onSelectConversation: (id: string) => void;
  onSendMessage: (conversationId: string, text: string, sender: 'staff' | 'customer') => void;
  onToggleHandoff: (conversationId: string, targetHandler: AssignedHandler) => void;
  onUpdateStatus: (conversationId: string, status: ConversationStatus) => void;
  customers: Customer[];
  userRole: string;
}

export const ConversationView: React.FC<ConversationViewProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onSendMessage,
  onToggleHandoff,
  onUpdateStatus,
  customers,
  userRole,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ConversationStatus>('all');
  const [handlerFilter, setHandlerFilter] = useState<'all' | AssignedHandler>('all');
  const [inputText, setInputText] = useState('');
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [expandedTraceId, setExpandedTraceId] = useState<string | null>(null);

  // Filter conversations
  const filteredConversations = conversations.filter((c) => {
    const matchesSearch =
      c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesHandler = handlerFilter === 'all' || c.assignedTo === handlerFilter;
    return matchesSearch && matchesStatus && matchesHandler;
  });

  const activeConv = conversations.find((c) => c.id === activeConversationId) || conversations[0];
  const activeCustomer = customers.find((c) => c.id === activeConv?.customerId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConv) return;
    onSendMessage(activeConv.id, inputText.trim(), 'staff');
    setInputText('');
  };

  const handleApplyCopilot = (optionText: string) => {
    setInputText(optionText);
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-slate-50">
      {/* 1. Left List of Conversations */}
      <div className="w-80 md:w-96 bg-white border-r border-slate-200 flex flex-col shrink-0">
        {/* Header & Search */}
        <div className="p-4 border-b border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-base text-slate-800">
              Hộp Thư Hội Thoại
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
              {filteredConversations.length} hội thoại
            </span>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Tìm khách hàng, tin nhắn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                statusFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setStatusFilter('Chờ nhân viên')}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                statusFilter === 'Chờ nhân viên'
                  ? 'bg-amber-500 text-white'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              Chờ nhân viên
            </button>
            <button
              onClick={() => setStatusFilter('Đang xử lý')}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                statusFilter === 'Đang xử lý'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Đang xử lý
            </button>
            <button
              onClick={() => setStatusFilter('Đã hoàn thành')}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                statusFilter === 'Đã hoàn thành'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Đã xong
            </button>
          </div>
        </div>

        {/* Conversation Items Feed */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              Không tìm thấy hội thoại phù hợp
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isSelected = conv.id === activeConv?.id;
              return (
                <div
                  key={conv.id}
                  onClick={() => onSelectConversation(conv.id)}
                  className={`p-3.5 transition-colors cursor-pointer text-left relative ${
                    isSelected
                      ? 'bg-blue-50/70 border-l-4 border-blue-600'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={conv.customerAvatar}
                      alt={conv.customerName}
                      className="w-10 h-10 rounded-xl object-cover shrink-0 ring-1 ring-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-heading font-semibold text-xs text-slate-900 truncate">
                          {conv.customerName}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                          {conv.updatedAt}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 truncate mb-2 leading-relaxed">
                        {conv.lastMessage}
                      </p>

                      <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                        {/* Handler Badge */}
                        <span
                          className={`px-2 py-0.5 rounded font-bold flex items-center gap-1 ${
                            conv.assignedTo === 'AI_AGENT'
                              ? 'bg-indigo-100 text-indigo-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {conv.assignedTo === 'AI_AGENT' ? (
                            <>
                              <Bot className="w-3 h-3" /> AI Agent
                            </>
                          ) : (
                            <>
                              <User className="w-3 h-3" /> Nhân viên
                            </>
                          )}
                        </span>

                        {/* Status Badge */}
                        <span
                          className={`px-2 py-0.5 rounded font-medium ${
                            conv.status === 'Chờ nhân viên'
                              ? 'bg-amber-100 text-amber-700 font-bold'
                              : conv.status === 'Đã hoàn thành'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {conv.status}
                        </span>

                        {/* Sentiment Pill */}
                        <span
                          className={`px-1.5 py-0.5 rounded font-semibold ${
                            conv.sentiment === 'Tiêu cực'
                              ? 'bg-rose-100 text-rose-700'
                              : conv.sentiment === 'Tích cực'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {conv.sentiment === 'Tiêu cực' ? '🚨 Tiêu cực' : conv.sentiment === 'Tích cực' ? '😊 Tích cực' : '😐 Trung lập'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 2. Middle Chat Transcript & Cognitive Inspector */}
      {activeConv ? (
        <div className="flex-1 flex flex-col bg-slate-50 min-w-0">
          {/* Conversation Header */}
          <div className="h-16 px-4 md:px-6 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={activeConv.customerAvatar}
                alt={activeConv.customerName}
                className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-bold text-sm text-slate-900 truncate">
                    {activeConv.customerName}
                  </h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      activeConv.customerTier === 'Trung thành'
                        ? 'bg-amber-100 text-amber-800'
                        : activeConv.customerTier === 'Cần chăm sóc'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {activeConv.customerTier}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-2">
                  <span>Kênh: {activeConv.channel}</span>
                  <span>•</span>
                  <span>Cảm xúc: {activeConv.sentimentScore > 0 ? `+${activeConv.sentimentScore}` : activeConv.sentimentScore}/100</span>
                </div>
              </div>
            </div>

            {/* Quick Handover Controller */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200">
                <span className="text-xs text-slate-600 font-medium hidden sm:inline">
                  Điều phối:
                </span>
                <button
                  onClick={() =>
                    onToggleHandoff(
                      activeConv.id,
                      activeConv.assignedTo === 'AI_AGENT' ? 'STAFF' : 'AI_AGENT'
                    )
                  }
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeConv.assignedTo === 'AI_AGENT'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-blue-600 text-white shadow-sm'
                  }`}
                  title="Chuyển đổi quyền xử lý giữa AI và Nhân viên"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  <span>
                    {activeConv.assignedTo === 'AI_AGENT'
                      ? 'AI Tự Động (Chuyển người)'
                      : 'Nhân Viên (Bàn giao AI)'}
                  </span>
                </button>
              </div>

              <button
                onClick={() => setShowRightPanel(!showRightPanel)}
                className={`p-2 rounded-xl border transition-colors ${
                  showRightPanel
                    ? 'bg-slate-200/80 border-slate-300 text-slate-800'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
                title="Thông tin chi tiết"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4">
            {/* Banner when conversation is waiting for human staff */}
            {activeConv.status === 'Chờ nhân viên' && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-900 shadow-sm animate-in fade-in">
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <span className="font-bold">Cảnh báo: Khách hàng yêu cầu hỗ trợ trực tiếp.</span>
                    <span className="ml-1 text-amber-800">
                      AI đã chuẩn bị sẵn gợi ý phản hồi bên dưới.
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onUpdateStatus(activeConv.id, 'Đang xử lý')}
                  className="px-3 py-1 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 transition-colors shrink-0"
                >
                  Tiếp nhận ngay
                </button>
              </div>
            )}

            {activeConv.messages.map((msg) => {
              const isCustomer = msg.sender === 'customer';
              const isAI = msg.sender === 'ai';
              const isStaff = msg.sender === 'staff';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isCustomer ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`flex items-start gap-2.5 max-w-[85%] md:max-w-[75%] ${
                      isCustomer ? 'flex-row' : 'flex-row-reverse'
                    }`}
                  >
                    {/* Avatar Icon */}
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                        isCustomer
                          ? 'bg-slate-200 text-slate-700'
                          : isAI
                          ? 'bg-gradient-to-tr from-indigo-600 to-blue-600 text-white shadow-sm'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {isCustomer ? (
                        <User className="w-4 h-4" />
                      ) : isAI ? (
                        <Bot className="w-4 h-4" />
                      ) : (
                        <span>NV</span>
                      )}
                    </div>

                    {/* Bubble Content */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span className="font-bold text-slate-700">
                          {isCustomer
                            ? activeConv.customerName
                            : isAI
                            ? 'CareAI Agent'
                            : activeConv.staffName || 'Nhân viên hỗ trợ'}
                        </span>
                        <span>{msg.timestamp}</span>
                      </div>

                      <div
                        className={`p-3.5 rounded-2xl text-xs md:text-sm leading-relaxed whitespace-pre-wrap ${
                          isCustomer
                            ? 'bg-white text-slate-800 rounded-tl-sm border border-slate-200/80 shadow-sm'
                            : isAI
                            ? 'bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-tr-sm shadow-md'
                            : 'bg-blue-600 text-white rounded-tr-sm shadow-md'
                        }`}
                      >
                        {msg.text}
                      </div>

                      {/* AI Transparent Reasoning Inspector Accordion */}
                      {isAI && msg.reasoningTrace && (
                        <div className="mt-1.5 pt-1">
                          <button
                            onClick={() =>
                              setExpandedTraceId(
                                expandedTraceId === msg.id ? null : msg.id
                              )
                            }
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200/80 transition-colors"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                            <span>
                              Chu trình nhận thức AI ({msg.reasoningTrace.confidence}% tự tin •{' '}
                              {msg.reasoningTrace.latencyMs}ms)
                            </span>
                            {expandedTraceId === msg.id ? (
                              <ChevronUp className="w-3 h-3" />
                            ) : (
                              <ChevronDown className="w-3 h-3" />
                            )}
                          </button>

                          {expandedTraceId === msg.id && (
                            <div className="mt-2 p-3.5 rounded-xl bg-slate-900 text-slate-200 border border-indigo-900 text-xs space-y-2.5 shadow-xl animate-in fade-in">
                              <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[11px]">
                                <span className="font-bold text-indigo-400">
                                  Ý định: {msg.reasoningTrace.intent}
                                </span>
                                <span className="text-emerald-400 font-semibold">
                                  Hành động: {msg.reasoningTrace.actionTaken}
                                </span>
                              </div>

                              {/* Steps Breakdown */}
                              <div className="space-y-1.5">
                                {msg.reasoningTrace.reasoningSteps.map((step) => (
                                  <div
                                    key={step.step}
                                    className="flex items-start gap-2 text-[11px] bg-slate-800/60 p-2 rounded-lg"
                                  >
                                    <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] shrink-0 font-bold">
                                      {step.step}
                                    </span>
                                    <div>
                                      <div className="font-semibold text-slate-200">
                                        {step.title}
                                      </div>
                                      <div className="text-slate-400 text-[10px] mt-0.5">
                                        {step.detail}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Retrieved Sources */}
                              {msg.reasoningTrace.retrievedDocs.length > 0 && (
                                <div className="pt-2 border-t border-slate-800 text-[11px]">
                                  <div className="text-slate-400 font-semibold mb-1">
                                    Nguồn trích xuất từ Knowledge Base:
                                  </div>
                                  <div className="flex flex-wrap gap-1.5">
                                    {msg.reasoningTrace.retrievedDocs.map((doc) => (
                                      <span
                                        key={doc.id}
                                        className="px-2 py-0.5 rounded bg-slate-800 text-indigo-300 text-[10px] border border-slate-700"
                                      >
                                        [{doc.category}] {doc.title}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* AI Copilot Suggestions for Staff (Module 8) */}
            {activeConv.messages.some((m) => m.staffCopilotOptions && m.staffCopilotOptions.length > 0) && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 via-blue-50 to-purple-50 border border-indigo-200 shadow-sm space-y-2 mt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span className="font-heading font-bold text-xs text-indigo-950">
                      AI Copilot: Đề xuất câu trả lời cho nhân viên
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                    3 phương án
                  </span>
                </div>

                <div className="space-y-2">
                  {activeConv.messages
                    .filter((m) => m.staffCopilotOptions)
                    .slice(-1)[0]
                    ?.staffCopilotOptions?.map((opt, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-white border border-indigo-100 hover:border-indigo-300 transition-all flex items-start justify-between gap-3 shadow-xs"
                      >
                        <div className="text-xs text-slate-700 leading-relaxed flex-1">
                          <span className="font-bold text-indigo-600 mr-1.5">
                            Phương án {idx + 1}:
                          </span>
                          {opt}
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleApplyCopilot(opt)}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs"
                          >
                            Sử dụng đề xuất
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Message Input Box */}
          <div className="p-3 md:p-4 bg-white border-t border-slate-200 shrink-0">
            <form onSubmit={handleSend} className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                <span className="flex items-center gap-1 font-medium">
                  {activeConv.assignedTo === 'AI_AGENT' ? (
                    <span className="text-indigo-600 flex items-center gap-1">
                      <Bot className="w-3.5 h-3.5" /> AI đang tự động phản hồi khách hàng. Bạn có thể gửi tin nhắn với tư cách Nhân viên can thiệp.
                    </span>
                  ) : (
                    <span className="text-blue-600 flex items-center gap-1">
                      <User className="w-3.5 h-3.5" /> Bạn đang tiếp quản hội thoại này.
                    </span>
                  )}
                </span>
                <span className="text-slate-400">Enter để gửi</span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Nhập phản hồi cho khách hàng..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 px-4 py-2.5 text-xs md:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Gửi tin</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
          Chọn một cuộc trò chuyện để bắt đầu
        </div>
      )}

      {/* 3. Right Customer Dossier & AI Sentiment Drawer */}
      {showRightPanel && activeCustomer && activeConv && (
        <div className="w-80 bg-white border-l border-slate-200 flex flex-col shrink-0 overflow-y-auto">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-heading font-bold text-xs text-slate-800 uppercase tracking-wider">
              Hồ Sơ Khách Hàng (CRM)
            </h3>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                activeCustomer.tier === 'Trung thành'
                  ? 'bg-amber-100 text-amber-800'
                  : activeCustomer.tier === 'Cần chăm sóc'
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {activeCustomer.tier}
            </span>
          </div>

          <div className="p-4 space-y-4 text-xs">
            {/* Customer Avatar & Bio */}
            <div className="text-center pb-2 border-b border-slate-100">
              <img
                src={activeCustomer.avatar}
                alt={activeCustomer.name}
                className="w-16 h-16 rounded-2xl mx-auto object-cover ring-2 ring-blue-500/20 mb-2 shadow-sm"
              />
              <div className="font-heading font-bold text-sm text-slate-900">
                {activeCustomer.name}
              </div>
              <div className="text-slate-500 text-[11px]">{activeCustomer.phone}</div>
              <div className="text-slate-400 text-[10px]">{activeCustomer.email}</div>
            </div>

            {/* AI Sentiment Meter */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-[11px] text-slate-700">
                  Chỉ Số Cảm Xúc (Sentiment)
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    activeConv.sentiment === 'Tiêu cực'
                      ? 'bg-rose-100 text-rose-700'
                      : activeConv.sentiment === 'Tích cực'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {activeConv.sentiment}
                </span>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden flex">
                  <div
                    className={`h-full transition-all duration-500 ${
                      activeConv.sentimentScore < -20
                        ? 'bg-rose-500'
                        : activeConv.sentimentScore > 20
                        ? 'bg-emerald-500'
                        : 'bg-blue-500'
                    }`}
                    style={{
                      width: `${Math.max(10, (activeConv.sentimentScore + 100) / 2)}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>-100 Tiêu cực</span>
                  <span className="font-bold text-slate-700">
                    {activeConv.sentimentScore > 0 ? `+${activeConv.sentimentScore}` : activeConv.sentimentScore}/100
                  </span>
                  <span>+100 Hài lòng</span>
                </div>
              </div>
            </div>

            {/* Customer Metrics */}
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                <div className="text-[10px] text-slate-400">Tổng chi tiêu</div>
                <div className="font-heading font-bold text-slate-900 text-xs mt-0.5">
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(activeCustomer.totalSpent)}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                <div className="text-[10px] text-slate-400">Số đơn hàng</div>
                <div className="font-heading font-bold text-slate-900 text-xs mt-0.5">
                  {activeCustomer.ordersCount} đơn
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1">
              <div className="text-[11px] font-bold text-slate-700">Ghi chú chăm sóc:</div>
              <p className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200 leading-relaxed">
                {activeCustomer.notes}
              </p>
            </div>

            {/* Customer Tags */}
            <div className="space-y-1">
              <div className="text-[11px] font-bold text-slate-700">Thẻ phân loại:</div>
              <div className="flex flex-wrap gap-1.5">
                {activeCustomer.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-medium border border-blue-100"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Change Status Action */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="text-[11px] font-bold text-slate-700">Trạng thái hội thoại:</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onUpdateStatus(activeConv.id, 'Đang xử lý')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-colors ${
                    activeConv.status === 'Đang xử lý'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Đang xử lý
                </button>
                <button
                  onClick={() => onUpdateStatus(activeConv.id, 'Đã hoàn thành')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-colors ${
                    activeConv.status === 'Đã hoàn thành'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Hoàn tất
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
