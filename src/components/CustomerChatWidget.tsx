import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  ChevronDown,
  RotateCcw,
  Zap,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  BookOpen,
} from 'lucide-react';
import { Customer, KnowledgeItem, Message, AgentReasoningTrace } from '../types';

interface CustomerChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  knowledgeBase: KnowledgeItem[];
  currentCustomer: Customer;
  allCustomers: Customer[];
  onSelectCustomer: (cust: Customer) => void;
  onSendMessageFromCustomer: (text: string) => Promise<{
    replyText: string;
    reasoningTrace?: AgentReasoningTrace;
    retrievedSources?: string[];
    shouldEscalate?: boolean;
  }>;
}

export const CustomerChatWidget: React.FC<CustomerChatWidgetProps> = ({
  isOpen,
  onClose,
  knowledgeBase,
  currentCustomer,
  allCustomers,
  onSelectCustomer,
  onSendMessageFromCustomer,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome_msg',
      sender: 'ai',
      text: `Xin chào ${currentCustomer.name}! 👋 Em là CareAI Agent - Trợ lý chăm sóc khách hàng thông minh 24/7.
Em có thể hỗ trợ anh/chị:
• Tra cứu tình trạng đơn hàng hỏa tốc
• Tư vấn tính năng & giá bán sản phẩm
• Chính sách bảo hành 1 đổi 1 trong 30 ngày
• Nhận mã giảm giá & ưu đãi mới nhất
Anh/chị cần em hỗ trợ vấn đề gì hôm nay ạ?`,
      timestamp: 'Vừa xong',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [activeThinkingStep, setActiveThinkingStep] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    'Bảo hành 1 đổi 1 trong 30 ngày thế nào?',
    'Cho tôi xin mã giảm giá hiện hành',
    'Tra cứu đơn hàng #ORD-8821',
    'Giá tai nghe CarePods Pro Max bao nhiêu?',
    'Tai nghe bị rè, tôi muốn gặp nhân viên gấp!',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isAiThinking]);

  const handleSend = async (textToSend: string) => {
    const text = textToSend.trim();
    if (!text || isAiThinking) return;

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      sender: 'customer',
      senderName: currentCustomer.name,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsAiThinking(true);
    setActiveThinkingStep('Phân tích ngữ nghĩa & truy vấn Knowledge Base...');

    try {
      const res = await onSendMessageFromCustomer(text);

      const aiMsg: Message = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        senderName: 'CareAI Agent',
        text: res.replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        reasoningTrace: res.reasoningTrace,
        retrievedSources: res.retrievedSources,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg: Message = {
        id: `err_${Date.now()}`,
        sender: 'ai',
        senderName: 'CareAI Agent',
        text: 'Dạ hệ thống đang xử lý, em đã nhận được yêu cầu và sẽ hỗ trợ ngay ạ!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsAiThinking(false);
      setActiveThinkingStep('');
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome_${Date.now()}`,
        sender: 'ai',
        text: `Xin chào ${currentCustomer.name}! Em là CareAI Agent sẵn sàng giải đáp mọi thắc mắc 24/7.`,
        timestamp: 'Vừa xong',
      },
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-xl h-[88vh] max-h-[720px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Widget Top Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-violet-700 text-white p-4 shrink-0 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
              <Bot className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-extrabold text-sm tracking-tight">
                  CareAI Live Assistant
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-400 text-emerald-950 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-950 animate-ping"></span> Online
                </span>
              </div>
              <div className="text-[11px] text-blue-100 flex items-center gap-1.5 mt-0.5">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Trí tuệ nhân tạo thế hệ mới • Phản hồi tức thì</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetChat}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Đặt lại phiên hội thoại"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Đóng widget"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Persona Switcher Bar */}
        <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium text-[11px]">Đang chat với vai trò:</span>
            <select
              value={currentCustomer.id}
              onChange={(e) => {
                const found = allCustomers.find((c) => c.id === e.target.value);
                if (found) onSelectCustomer(found);
              }}
              className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              {allCustomers.map((cust) => (
                <option key={cust.id} value={cust.id}>
                  {cust.name} ({cust.tier})
                </option>
              ))}
            </select>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Demo Khách Hàng</span>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50 text-xs">
          {messages.map((msg) => {
            const isCustomer = msg.sender === 'customer';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isCustomer ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`flex items-start gap-2 max-w-[88%] ${
                    isCustomer ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs ${
                      isCustomer
                        ? 'bg-blue-600 shadow-sm'
                        : 'bg-gradient-to-tr from-indigo-600 to-violet-600 shadow-sm'
                    }`}
                  >
                    {isCustomer ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div className="space-y-1">
                    <div
                      className={`p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                        isCustomer
                          ? 'bg-blue-600 text-white rounded-tr-xs shadow-sm font-normal'
                          : 'bg-white text-slate-800 rounded-tl-xs border border-slate-200/80 shadow-sm'
                      }`}
                    >
                      {msg.text}
                    </div>

                    {/* Sources Badge */}
                    {!isCustomer && msg.retrievedSources && msg.retrievedSources.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1 pt-0.5 text-[10px] text-slate-500">
                        <BookOpen className="w-3 h-3 text-indigo-600" />
                        <span>Trích dẫn từ:</span>
                        {msg.retrievedSources.map((src, i) => (
                          <span
                            key={i}
                            className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-100 font-medium"
                          >
                            {src}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="text-[10px] text-slate-400 px-1">{msg.timestamp}</div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* AI Thinking Animation */}
          {isAiThinking && (
            <div className="flex items-start gap-2">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3 bg-white rounded-2xl rounded-tl-xs border border-slate-200/80 shadow-sm space-y-1">
                <div className="flex items-center gap-1.5 text-indigo-600 font-bold text-[11px]">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  <span>AI Agent đang suy luận...</span>
                </div>
                <div className="text-[10px] text-slate-500">{activeThinkingStep}</div>
                <div className="flex gap-1 pt-1">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce delay-150"></span>
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce delay-300"></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick FAQ Chips */}
        <div className="px-4 py-2 bg-slate-100/90 border-t border-slate-200 overflow-x-auto flex items-center gap-1.5 scrollbar-none">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Gợi ý:
          </span>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={isAiThinking}
              className="px-2.5 py-1 rounded-full bg-white border border-slate-300 hover:border-blue-500 text-slate-700 hover:text-blue-700 text-[11px] font-medium whitespace-nowrap shadow-xs transition-colors shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Message Input Form */}
        <div className="p-3 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputText);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Nhập câu hỏi hoặc yêu cầu cần hỗ trợ..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isAiThinking}
              className="flex-1 px-4 py-2.5 text-xs md:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isAiThinking}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Gửi</span>
            </button>
          </form>
          <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 mt-1.5">
            <span>Được bảo vệ bởi CareAI Guardrails</span>
            <span>Tự động chuyển nhân viên khi cần</span>
          </div>
        </div>
      </div>
    </div>
  );
};
