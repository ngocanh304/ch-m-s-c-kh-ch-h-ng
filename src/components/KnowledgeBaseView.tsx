import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Sparkles,
  Eye,
  ThumbsUp,
  Tag,
  CheckCircle,
  X,
  ExternalLink,
  Bot,
  Zap,
} from 'lucide-react';
import { KnowledgeItem, KBCategory } from '../types';
import { retrieveKnowledge } from '../services/aiAgentEngine';

interface KnowledgeBaseViewProps {
  knowledgeBase: KnowledgeItem[];
  onAddKnowledge: (item: Omit<KnowledgeItem, 'id' | 'viewsCount' | 'helpfulCount' | 'updatedAt'>) => void;
  onUpdateKnowledge: (id: string, updates: Partial<KnowledgeItem>) => void;
  onDeleteKnowledge: (id: string) => void;
  userRole: string;
}

export const KnowledgeBaseView: React.FC<KnowledgeBaseViewProps> = ({
  knowledgeBase,
  onAddKnowledge,
  onUpdateKnowledge,
  onDeleteKnowledge,
  userRole,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<KnowledgeItem | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<KBCategory>('Sản phẩm');
  const [formContent, setFormContent] = useState('');
  const [formTags, setFormTags] = useState('');
  const [formActive, setFormActive] = useState(true);

  // RAG Live Simulator inside KB
  const [testQuery, setTestQuery] = useState('bảo hành 1 đổi 1 thế nào?');
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isTesting, setIsTesting] = useState(false);

  const categories: KBCategory[] = [
    'Sản phẩm',
    'Giá & Ưu đãi',
    'Chính sách & Bảo hành',
    'FAQ',
    'Tài liệu hướng dẫn',
  ];

  const filteredItems = knowledgeBase.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormTitle('');
    setFormCategory('Sản phẩm');
    setFormContent('');
    setFormTags('');
    setFormActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: KnowledgeItem) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormCategory(item.category);
    setFormContent(item.content);
    setFormTags(item.tags.join(', '));
    setFormActive(item.active);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;

    const tagsArray = formTags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (editingItem) {
      onUpdateKnowledge(editingItem.id, {
        title: formTitle.trim(),
        category: formCategory,
        content: formContent.trim(),
        tags: tagsArray,
        active: formActive,
        updatedAt: new Date().toISOString().split('T')[0],
      });
    } else {
      onAddKnowledge({
        title: formTitle.trim(),
        category: formCategory,
        content: formContent.trim(),
        tags: tagsArray,
        active: formActive,
      });
    }

    setIsModalOpen(false);
  };

  const handleRunRAGTest = () => {
    if (!testQuery.trim()) return;
    setIsTesting(true);
    setTimeout(() => {
      const results = retrieveKnowledge(testQuery, knowledgeBase);
      setTestResults(results);
      setIsTesting(false);
    }, 250);
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-slate-50 p-4 md:p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading font-extrabold text-xl md:text-2xl text-slate-900 tracking-tight">
              Knowledge Base (Cơ Sở Tri Thức)
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-indigo-100 text-indigo-700">
              RAG Grounding
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Dữ liệu tri thức cốt lõi để AI Agent tra cứu, trích xuất và trả lời khách hàng 24/7.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Tri Thức Mới</span>
        </button>
      </div>

      {/* RAG Live Inspector Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-900 to-slate-900 text-white shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-indigo-400" />
            <span className="font-heading font-bold text-sm text-white">
              Thử Nghiệm Tra Cứu Ngữ Nghĩa (RAG Testing Tool)
            </span>
          </div>
          <span className="text-[11px] text-indigo-200">
            Kiểm tra xem AI Agent sẽ truy xuất tài liệu nào với câu hỏi bất kỳ
          </span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={testQuery}
            onChange={(e) => setTestQuery(e.target.value)}
            placeholder="Nhập câu hỏi test (ví dụ: tai nghe có chống ồn không, mã voucher...)"
            className="flex-1 px-4 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleRunRAGTest}
            disabled={isTesting}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isTesting ? 'Đang truy vấn...' : 'Chạy Thử Tra Cứu'}</span>
          </button>
        </div>

        {testResults.length > 0 && (
          <div className="p-3 bg-slate-800/80 rounded-xl text-xs space-y-2 border border-slate-700">
            <div className="font-bold text-indigo-300 text-[11px]">
              Tài liệu được AI lựa chọn ({testResults.length} kết quả khớp điểm tương đồng):
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {testResults.slice(0, 2).map((res, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-700/80 text-[11px]"
                >
                  <div className="flex items-center justify-between text-indigo-400 font-semibold mb-1">
                    <span>{res.item.title}</span>
                    <span className="text-emerald-400 font-bold">Điểm: {res.score}</span>
                  </div>
                  <p className="text-slate-300 line-clamp-2 text-[10px]">
                    {res.item.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tất cả ({knowledgeBase.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat} ({knowledgeBase.filter((k) => k.category === cat).length})
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Tìm theo tiêu đề, thẻ, nội dung..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Knowledge Base Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-2xl bg-white border transition-all flex flex-col justify-between shadow-xs hover:shadow-md ${
              item.active ? 'border-slate-200' : 'border-slate-200 opacity-60 bg-slate-50'
            }`}
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60">
                  {item.category}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onUpdateKnowledge(item.id, { active: !item.active })}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                      item.active
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                    title="Bật/Tắt sử dụng trong AI"
                  >
                    {item.active ? 'Đang kích hoạt' : 'Tạm tắt'}
                  </button>
                </div>
              </div>

              <h3 className="font-heading font-bold text-sm text-slate-900 leading-snug">
                {item.title}
              </h3>

              <p className="text-xs text-slate-600 line-clamp-4 leading-relaxed whitespace-pre-wrap">
                {item.content}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 pt-1">
                {item.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded-md"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Meta & Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> {item.viewsCount}
                </span>
                <span className="flex items-center gap-1 text-emerald-600 font-medium">
                  <ThumbsUp className="w-3.5 h-3.5" /> {item.helpfulCount}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-blue-600 transition-colors"
                  title="Chỉnh sửa"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Bạn chắc chắn muốn xóa tài liệu "${item.title}"?`)) {
                      onDeleteKnowledge(item.id);
                    }
                  }}
                  className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                  title="Xóa tài liệu"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95">
            <div className="p-4 md:p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-heading font-bold text-base text-slate-900">
                {editingItem ? 'Chỉnh Sửa Tài Liệu Tri Thức' : 'Thêm Tri Thức Mới Cho AI Agent'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tiêu đề tài liệu / Câu hỏi:
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Ví dụ: Chính sách bảo hành 1 đổi 1 trong 30 ngày..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phân loại:</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as KBCategory)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Trạng thái:</label>
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      id="activeCheck"
                      checked={formActive}
                      onChange={(e) => setFormActive(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <label htmlFor="activeCheck" className="text-slate-700 font-medium">
                      Kích hoạt cho AI tra cứu
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nội dung chi tiết (Sản phẩm, giá bán, chính sách, hướng dẫn):
                </label>
                <textarea
                  required
                  rows={6}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Nhập thông tin chi tiết mà bạn muốn AI Agent nắm rõ để phản hồi cho khách hàng..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-sans"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Thẻ từ khóa (Cách nhau bằng dấu phẩy):
                </label>
                <input
                  type="text"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  placeholder="bảo hành, 30 ngày, đổi mới, lỗi kỹ thuật..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm"
                >
                  {editingItem ? 'Lưu Cập Nhật' : 'Tạo Tài Liệu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
