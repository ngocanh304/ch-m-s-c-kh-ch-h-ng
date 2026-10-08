export type CustomerTier = 'Khách mới' | 'Tiềm năng' | 'Trung thành' | 'Cần chăm sóc';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  tier: CustomerTier;
  totalSpent: number; // VND
  ordersCount: number;
  sentimentScore: number; // -100 to 100
  lastActive: string;
  notes: string;
  tags: string[];
}

export type KBCategory = 'Sản phẩm' | 'Giá & Ưu đãi' | 'Chính sách & Bảo hành' | 'FAQ' | 'Tài liệu hướng dẫn';

export interface KnowledgeItem {
  id: string;
  title: string;
  category: KBCategory;
  content: string;
  tags: string[];
  updatedAt: string;
  viewsCount: number;
  helpfulCount: number;
  active: boolean;
}

export type ConversationStatus = 'Đang xử lý' | 'Chờ nhân viên' | 'Đã hoàn thành';
export type AssignedHandler = 'AI_AGENT' | 'STAFF';
export type SentimentType = 'Tích cực' | 'Trung lập' | 'Tiêu cực';
export type UrgencyLevel = 'Thấp' | 'Trung bình' | 'Cao' | 'Khẩn cấp';

export interface ReasoningStep {
  step: number;
  title: string;
  detail: string;
  status: 'completed' | 'processing' | 'skipped';
}

export interface AgentReasoningTrace {
  intent: string;
  confidence: number; // 0-100%
  sentiment: SentimentType;
  sentimentScore: number; // -100 to 100
  emotion: string; // e.g. "Hài lòng", "Khó chịu", "Thắc mắc", "Khẩn cấp"
  retrievedDocs: { id: string; title: string; category: string }[];
  actionTaken: 'AUTONOMOUS_RESOLVED' | 'ESCALATED_TO_HUMAN' | 'INFO_PROVIDED' | 'ORDER_LOOKUP_SUCCESS';
  reasoningSteps: ReasoningStep[];
  latencyMs: number;
}

export interface Message {
  id: string;
  sender: 'customer' | 'ai' | 'staff';
  senderName?: string;
  text: string;
  timestamp: string;
  reasoningTrace?: AgentReasoningTrace;
  retrievedSources?: string[];
  staffCopilotOptions?: string[];
}

export interface Conversation {
  id: string;
  customerId: string;
  customerName: string;
  customerAvatar: string;
  customerPhone?: string;
  customerTier: CustomerTier;
  status: ConversationStatus;
  assignedTo: AssignedHandler;
  staffName?: string;
  sentiment: SentimentType;
  sentimentScore: number;
  urgency: UrgencyLevel;
  lastMessage: string;
  updatedAt: string;
  unreadCount: number;
  channel: 'Web Chat' | 'Facebook' | 'Zalo' | 'Hotline';
  messages: Message[];
  tags: string[];
}

export type NotificationType = 'new_chat' | 'negative_sentiment' | 'escalation_requested' | 'complaint' | 'system_alert';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  conversationId?: string;
  timestamp: string;
  read: boolean;
  urgency: UrgencyLevel;
}

export type UserRole = 'admin' | 'staff' | 'customer';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  department: string;
}

export interface AnalyticsSummary {
  totalConversations: number;
  aiResolutionRate: number; // %
  escalationRate: number; // %
  avgResponseTimeSec: number; // seconds
  csatScore: number; // 1.0 - 5.0
  positiveSentimentRate: number; // %
  negativeSentimentRate: number; // %
  savedHoursEstimate: number; // hours saved by AI
}
