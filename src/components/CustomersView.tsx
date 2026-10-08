import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Filter,
  Edit2,
  Trash2,
  MessageSquare,
  Phone,
  Mail,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  X,
  Tag,
} from 'lucide-react';
import { Customer, CustomerTier } from '../types';

interface CustomersViewProps {
  customers: Customer[];
  onAddCustomer: (customer: Omit<Customer, 'id' | 'lastActive'>) => void;
  onUpdateCustomer: (id: string, updates: Partial<Customer>) => void;
  onDeleteCustomer: (id: string) => void;
  onOpenChatWithCustomer: (customerId: string) => void;
  userRole: string;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  onAddCustomer,
  onUpdateCustomer,
  onDeleteCustomer,
  onOpenChatWithCustomer,
  userRole,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formAvatar, setFormAvatar] = useState('');
  const [formTier, setFormTier] = useState<CustomerTier>('Khách mới');
  const [formTotalSpent, setFormTotalSpent] = useState<number>(0);
  const [formOrdersCount, setFormOrdersCount] = useState<number>(0);
  const [formSentimentScore, setFormSentimentScore] = useState<number>(50);
  const [formNotes, setFormNotes] = useState('');
  const [formTags, setFormTags] = useState('');

  const tiers: CustomerTier[] = ['Khách mới', 'Tiềm năng', 'Trung thành', 'Cần chăm sóc'];

  const filteredCustomers = customers.filter((cust) => {
    const matchesTier = selectedTier === 'all' || cust.tier === selectedTier;
    const matchesSearch =
      cust.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cust.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cust.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cust.notes.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTier && matchesSearch;
  });

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setFormName('');
    setFormEmail('');
    setFormPhone('');
    setFormAvatar('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80');
    setFormTier('Khách mới');
    setFormTotalSpent(0);
    setFormOrdersCount(0);
    setFormSentimentScore(50);
    setFormNotes('');
    setFormTags('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Customer) => {
    setEditingCustomer(c);
    setFormName(c.name);
    setFormEmail(c.email);
    setFormPhone(c.phone);
    setFormAvatar(c.avatar);
    setFormTier(c.tier);
    setFormTotalSpent(c.totalSpent);
    setFormOrdersCount(c.ordersCount);
    setFormSentimentScore(c.sentimentScore);
    setFormNotes(c.notes);
    setFormTags(c.tags.join(', '));
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const tagsArray = formTags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (editingCustomer) {
      onUpdateCustomer(editingCustomer.id, {
        name: formName.trim(),
        email: formEmail.trim(),
        phone: formPhone.trim(),
        avatar: formAvatar.trim() || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        tier: formTier,
        totalSpent: Number(formTotalSpent),
        ordersCount: Number(formOrdersCount),
        sentimentScore: Number(formSentimentScore),
        notes: formNotes.trim(),
        tags: tagsArray,
      });
    } else {
      onAddCustomer({
        name: formName.trim(),
        email: formEmail.trim(),
        phone: formPhone.trim(),
        avatar: formAvatar.trim() || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        tier: formTier,
        totalSpent: Number(formTotalSpent),
        ordersCount: Number(formOrdersCount),
        sentimentScore: Number(formSentimentScore),
        notes: formNotes.trim(),
        tags: tagsArray,
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-slate-50 p-4 md:p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading font-extrabold text-xl md:text-2xl text-slate-900 tracking-tight">
              Quản Lý Khách Hàng (CRM 360°)
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-blue-100 text-blue-700">
              {customers.length} khách hàng
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Lưu trữ thông tin liên hệ, lịch sử đơn hàng, chỉ số hài lòng và phân loại đối tượng chăm sóc.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Khách Hàng</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
          <button
            onClick={() => setSelectedTier('all')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors whitespace-nowrap ${
              selectedTier === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tất cả ({customers.length})
          </button>
          {tiers.map((tier) => (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-colors whitespace-nowrap ${
                selectedTier === tier
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tier} ({customers.filter((c) => c.tier === tier).length})
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Tìm theo tên, SĐT, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Customer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((cust) => (
          <div
            key={cust.id}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header profile */}
              <div className="flex items-start gap-3 mb-3">
                <img
                  src={cust.avatar}
                  alt={cust.name}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="font-heading font-bold text-sm text-slate-900 truncate">
                      {cust.name}
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        cust.tier === 'Trung thành'
                          ? 'bg-amber-100 text-amber-800'
                          : cust.tier === 'Cần chăm sóc'
                          ? 'bg-rose-100 text-rose-800'
                          : cust.tier === 'Tiềm năng'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {cust.tier}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{cust.phone}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1.5 truncate">
                    <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{cust.email}</span>
                  </div>
                </div>
              </div>

              {/* Sentiment Gauge */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 mb-3 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">Chỉ số cảm xúc:</span>
                  <span
                    className={`font-bold ${
                      cust.sentimentScore < -20
                        ? 'text-rose-600'
                        : cust.sentimentScore > 20
                        ? 'text-emerald-600'
                        : 'text-slate-600'
                    }`}
                  >
                    {cust.sentimentScore > 0 ? `+${cust.sentimentScore}` : cust.sentimentScore}/100
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden flex">
                  <div
                    className={`h-full ${
                      cust.sentimentScore < -20
                        ? 'bg-rose-500'
                        : cust.sentimentScore > 20
                        ? 'bg-emerald-500'
                        : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.max(10, (cust.sentimentScore + 100) / 2)}%` }}
                  />
                </div>
              </div>

              {/* Financial metrics */}
              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div className="p-2 bg-slate-50 rounded-lg">
                  <div className="text-[10px] text-slate-400">Tổng chi tiêu:</div>
                  <div className="font-heading font-bold text-slate-800 text-[11px]">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(cust.totalSpent)}
                  </div>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg">
                  <div className="text-[10px] text-slate-400">Đơn hàng:</div>
                  <div className="font-heading font-bold text-slate-800 text-[11px]">
                    {cust.ordersCount} đơn
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="text-[11px] text-slate-600 bg-slate-50/70 p-2 rounded-lg border border-slate-100 line-clamp-2 mb-3">
                {cust.notes || 'Chưa có ghi chú đặc biệt.'}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {cust.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => onOpenChatWithCustomer(cust.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Mở Hội Thoại</span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(cust)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-blue-600"
                  title="Chỉnh sửa thông tin"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Bạn chắc chắn muốn xóa hồ sơ "${cust.name}"?`)) {
                      onDeleteCustomer(cust.id);
                    }
                  }}
                  className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600"
                  title="Xóa hồ sơ"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95">
            <div className="p-4 md:p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-heading font-bold text-base text-slate-900">
                {editingCustomer ? 'Cập Nhật Hồ Sơ Khách Hàng' : 'Thêm Khách Hàng Mới'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Họ và tên:</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Số điện thoại:</label>
                  <input
                    type="text"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="0912 345 678"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email:</label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phân loại Tier:</label>
                  <select
                    value={formTier}
                    onChange={(e) => setFormTier(e.target.value as CustomerTier)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    {tiers.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tổng chi tiêu (VNĐ):</label>
                  <input
                    type="number"
                    value={formTotalSpent}
                    onChange={(e) => setFormTotalSpent(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Số đơn hàng:</label>
                  <input
                    type="number"
                    value={formOrdersCount}
                    onChange={(e) => setFormOrdersCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Điểm cảm xúc (-100..100):</label>
                  <input
                    type="number"
                    min={-100}
                    max={100}
                    value={formSentimentScore}
                    onChange={(e) => setFormSentimentScore(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ghi chú chăm sóc:</label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Khách thích giao hàng hỏa tốc, hay quan tâm tai nghe..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Thẻ phân loại (Cách nhau bằng dấu phẩy):
                </label>
                <input
                  type="text"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  placeholder="VIP, Mua nhiều, Khiếu nại..."
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
                  {editingCustomer ? 'Cập Nhật' : 'Lưu Khách Hàng'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
