import React, { useState } from 'react';
import {
  Cpu,
  Bot,
  Sparkles,
  ArrowRight,
  Database,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Zap,
  BookOpen,
  UserCheck,
  Flame,
  Search,
} from 'lucide-react';
import { KnowledgeItem } from '../types';
import { processWithCareAgent } from '../services/aiAgentEngine';

interface AgentLabViewProps {
  knowledgeBase: KnowledgeItem[];
}

export const AgentLabView: React.FC<AgentLabViewProps> = ({ knowledgeBase }) => {
  const [query, setQuery] = useState('Tai nghe CarePods Pro Max có chống ồn không và giá bao nhiêu?');
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [result, setResult] = useState<any>(null);

  const presets = [
    {
      label: 'Hỏi sản phẩm & giá',
      text: 'Tai nghe CarePods Pro Max có chống ồn không và giá bao nhiêu?',
    },
    {
      label: 'Tra cứu đơn hàng #ORD',
      text: 'Đơn hàng #ORD-8821 của mình đến đâu rồi shop?',
    },
    {
      label: 'Khiếu nại gay gắt (Trigger Handoff)',
      text: 'Tai nghe tôi mới nhận bị rè một bên, giao trễ 1 ngày! Cho tôi gặp nhân viên giải quyết ngay đi!',
    },
    {
      label: 'Hỏi chính sách bảo hành',
      text: 'Bảo hành 1 đổi 1 trong 30 ngày có áp dụng nếu máy bị trầy xước không?',
    },
  ];

  const handleRunSimulation = () => {
    setIsRunning(true);
    setCurrentStep(1);
    setResult(null);

    // Animate the cognitive loop step by step
    setTimeout(() => {
      setCurrentStep(2);
    }, 400);

    setTimeout(() => {
      setCurrentStep(3);
    }, 800);

    setTimeout(() => {
      setCurrentStep(4);
      const res = processWithCareAgent(query, knowledgeBase, 'Nguyễn Khách Hàng');
      setResult(res);
      setIsRunning(false);
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-slate-50 p-4 md:p-6 space-y-6">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="font-heading font-extrabold text-xl md:text-2xl text-slate-900 tracking-tight">
            Mô Phỏng Chu Trình Nhận Thức AI Agent (Cognitive Loop)
          </h1>
          <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-indigo-100 text-indigo-700">
            Autonomous Pipeline
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Khảo sát cách AI Agent tư duy: từ tiếp nhận ngôn ngữ tự nhiên, tra cứu Knowledge Base đến quyết định hành động và chuyển giao nhân viên.
        </p>
      </div>

      {/* Interactive Flow Architecture Diagram */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl space-y-6 border border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <h2 className="font-heading font-bold text-sm text-white">
              Kiến Trúc Chu Trình Ra Quyết Định (Agent Reasoning Architecture)
            </h2>
          </div>
          <span className="text-[11px] text-slate-400">
            Khách hàng → NLP & Sentiment → Knowledge Base (RAG) → Guardrails & Confidence → Quyết định
          </span>
        </div>

        {/* 5-step visual flow pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {/* Step 1 */}
          <div
            className={`p-3.5 rounded-2xl border transition-all ${
              currentStep === 1
                ? 'bg-indigo-600/30 border-indigo-400 ring-2 ring-indigo-400 shadow-lg'
                : currentStep > 1
                ? 'bg-slate-800/90 border-emerald-500/50'
                : 'bg-slate-800/40 border-slate-700/60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-300">
                BƯỚC 1
              </span>
              {currentStep > 1 && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            </div>
            <div className="font-heading font-bold text-xs text-slate-200">
              Tiếp Nhận & NLP
            </div>
            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
              Phân tích cú pháp, trích xuất thực thể, tính điểm cảm xúc (-100..+100).
            </p>
          </div>

          {/* Step 2 */}
          <div
            className={`p-3.5 rounded-2xl border transition-all ${
              currentStep === 2
                ? 'bg-indigo-600/30 border-indigo-400 ring-2 ring-indigo-400 shadow-lg'
                : currentStep > 2
                ? 'bg-slate-800/90 border-emerald-500/50'
                : 'bg-slate-800/40 border-slate-700/60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/30 text-blue-300">
                BƯỚC 2
              </span>
              {currentStep > 2 && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            </div>
            <div className="font-heading font-bold text-xs text-slate-200">
              Truy Vấn RAG
            </div>
            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
              So khớp từ khóa & ngữ nghĩa với toàn bộ Knowledge Base thời gian thực.
            </p>
          </div>

          {/* Step 3 */}
          <div
            className={`p-3.5 rounded-2xl border transition-all ${
              currentStep === 3
                ? 'bg-indigo-600/30 border-indigo-400 ring-2 ring-indigo-400 shadow-lg'
                : currentStep > 3
                ? 'bg-slate-800/90 border-emerald-500/50'
                : 'bg-slate-800/40 border-slate-700/60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/30 text-amber-300">
                BƯỚC 3
              </span>
              {currentStep > 3 && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            </div>
            <div className="font-heading font-bold text-xs text-slate-200">
              Đánh Giá Guardrails
            </div>
            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
              Tính điểm tự tin (Confidence %). Kiểm tra tiêu chí an toàn & khiếu nại.
            </p>
          </div>

          {/* Step 4 */}
          <div
            className={`p-3.5 rounded-2xl border transition-all ${
              currentStep === 4
                ? 'bg-indigo-600/30 border-indigo-400 ring-2 ring-indigo-400 shadow-lg'
                : currentStep > 4
                ? 'bg-slate-800/90 border-emerald-500/50'
                : 'bg-slate-800/40 border-slate-700/60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-300">
                BƯỚC 4
              </span>
              {currentStep >= 4 && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            </div>
            <div className="font-heading font-bold text-xs text-slate-200">
              Quyết Định Hành Động
            </div>
            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
              Tự động giải quyết hoặc chuyển giao (Handoff) cho nhân viên con người.
            </p>
          </div>

          {/* Step 5 */}
          <div
            className={`p-3.5 rounded-2xl border transition-all ${
              currentStep === 4
                ? 'bg-purple-600/30 border-purple-400 shadow-lg'
                : 'bg-slate-800/40 border-slate-700/60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/30 text-purple-300">
                BƯỚC 5
              </span>
              {currentStep >= 4 && <Sparkles className="w-4 h-4 text-purple-400" />}
            </div>
            <div className="font-heading font-bold text-xs text-slate-200">
              Phản Hồi & Copilot
            </div>
            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
              Tạo câu trả lời tự nhiên + chuẩn bị sẵn 3 phương án Copilot cho nhân viên.
            </p>
          </div>
        </div>
      </div>

      {/* Simulator Controller Box */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-heading font-bold text-sm text-slate-900">
          Chọn kịch bản hoặc nhập câu hỏi bất kỳ:
        </h3>

        {/* Presets */}
        <div className="flex flex-wrap gap-2">
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => setQuery(p.text)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                query === p.text
                  ? 'bg-blue-50 border-blue-400 text-blue-700 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Query Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nhập câu hỏi để thử nghiệm AI Agent..."
            className="flex-1 px-4 py-2.5 text-xs md:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-sans"
          />
          <button
            onClick={handleRunSimulation}
            disabled={isRunning || !query.trim()}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Play className="w-4 h-4" />
            <span>{isRunning ? 'Đang suy luận...' : 'Chạy Mô Phỏng'}</span>
          </button>
        </div>
      </div>

      {/* Simulation Result Output */}
      {result && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-indigo-600" />
              <h3 className="font-heading font-bold text-sm text-slate-900">
                Báo Cáo Thực Thi Của AI Agent (Execution Trace)
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                Độ tự tin: {result.reasoningTrace.confidence}%
              </span>
              <span className="text-slate-500">
                Độ trễ: {result.reasoningTrace.latencyMs}ms
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Action Decision */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="text-[11px] text-slate-500 font-medium">Hành động AI quyết định:</div>
              <div className="font-heading font-bold text-sm text-slate-900 mt-1 flex items-center gap-1.5">
                {result.shouldEscalate ? (
                  <span className="text-amber-600 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" /> CHUYỂN GIAO NHÂN VIÊN
                  </span>
                ) : (
                  <span className="text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> TỰ ĐỘNG GIẢI QUYẾT (AUTONOMOUS)
                  </span>
                )}
              </div>
            </div>

            {/* Sentiment */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="text-[11px] text-slate-500 font-medium">Cảm xúc khách hàng:</div>
              <div className="font-heading font-bold text-sm text-slate-900 mt-1">
                {result.sentiment} ({result.sentimentScore > 0 ? `+${result.sentimentScore}` : result.sentimentScore}/100)
              </div>
            </div>

            {/* Intent */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="text-[11px] text-slate-500 font-medium">Ý định nhận diện:</div>
              <div className="font-heading font-bold text-xs text-indigo-700 mt-1 truncate">
                {result.reasoningTrace.intent}
              </div>
            </div>
          </div>

          {/* Generated Response */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-700">
              Câu trả lời AI Agent gửi cho khách hàng:
            </span>
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs md:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
              {result.replyText}
            </div>
          </div>

          {/* Retrieved Knowledge Base Articles */}
          {result.retrievedSources.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-700">
                Tài liệu trích xuất từ Knowledge Base:
              </span>
              <div className="flex flex-wrap gap-2">
                {result.retrievedSources.map((src: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200 flex items-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                    <span>{src}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Staff Copilot Suggestions */}
          {result.staffCopilotOptions.length > 0 && (
            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-2">
              <div className="flex items-center gap-1.5 font-heading font-bold text-xs text-purple-900">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Gợi ý Copilot tự động sinh cho nhân viên hỗ trợ:</span>
              </div>
              <div className="space-y-1.5">
                {result.staffCopilotOptions.map((opt: string, i: number) => (
                  <div key={i} className="p-2.5 bg-white rounded-xl text-xs text-slate-700 border border-purple-100">
                    <span className="font-bold text-purple-700 mr-1.5">Phương án {i + 1}:</span>
                    {opt}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
