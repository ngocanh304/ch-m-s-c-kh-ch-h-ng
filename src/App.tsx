import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ConversationView } from './components/ConversationView';
import { KnowledgeBaseView } from './components/KnowledgeBaseView';
import { CustomersView } from './components/CustomersView';
import { SentimentView } from './components/SentimentView';
import { AnalyticsView } from './components/AnalyticsView';
import { AgentLabView } from './components/AgentLabView';
import { SettingsView } from './components/SettingsView';
import { CustomerChatWidget } from './components/CustomerChatWidget';

import {
  INITIAL_USERS,
  INITIAL_KNOWLEDGE_BASE,
  INITIAL_CUSTOMERS,
  INITIAL_CONVERSATIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ANALYTICS,
} from './data/mockData';

import {
  UserAccount,
  KnowledgeItem,
  Customer,
  Conversation,
  AppNotification,
  AssignedHandler,
  ConversationStatus,
  Message,
} from './types';

import { processWithCareAgent } from './services/aiAgentEngine';

export default function App() {
  // Global State
  const [allUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<UserAccount>(INITIAL_USERS[0]); // Default Admin
  const [activeTab, setActiveTab] = useState<string>('conversations');

  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeItem[]>(INITIAL_KNOWLEDGE_BASE);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeConversationId, setActiveConversationId] = useState<string>(INITIAL_CONVERSATIONS[0].id);

  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [analytics, setAnalytics] = useState(INITIAL_ANALYTICS);

  // Customer Chat Widget Modal state
  const [isCustomerWidgetOpen, setIsCustomerWidgetOpen] = useState(false);
  const [widgetCustomer, setWidgetCustomer] = useState<Customer>(INITIAL_CUSTOMERS[0]);

  // Derived counts
  const waitingCount = conversations.filter((c) => c.status === 'Chờ nhân viên').length;
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Notification actions
  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Knowledge Base CRUD
  const handleAddKnowledge = (
    itemData: Omit<KnowledgeItem, 'id' | 'viewsCount' | 'helpfulCount' | 'updatedAt'>
  ) => {
    const newItem: KnowledgeItem = {
      ...itemData,
      id: `kb_${Date.now()}`,
      viewsCount: 1,
      helpfulCount: 0,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setKnowledgeBase((prev) => [newItem, ...prev]);
  };

  const handleUpdateKnowledge = (id: string, updates: Partial<KnowledgeItem>) => {
    setKnowledgeBase((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const handleDeleteKnowledge = (id: string) => {
    setKnowledgeBase((prev) => prev.filter((item) => item.id !== id));
  };

  // Customers CRM CRUD
  const handleAddCustomer = (customerData: Omit<Customer, 'id' | 'lastActive'>) => {
    const newCust: Customer = {
      ...customerData,
      id: `cust_${Date.now()}`,
      lastActive: 'Vừa xong',
    };
    setCustomers((prev) => [newCust, ...prev]);
  };

  const handleUpdateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const handleDeleteCustomer = (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  };

  // Conversation Handoff & Status
  const handleToggleHandoff = (conversationId: string, targetHandler: AssignedHandler) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          const isStaff = targetHandler === 'STAFF';
          return {
            ...c,
            assignedTo: targetHandler,
            staffName: isStaff ? currentUser.name : undefined,
            status: isStaff ? 'Đang xử lý' : c.status,
          };
        }
        return c;
      })
    );
  };

  const handleUpdateConversationStatus = (
    conversationId: string,
    newStatus: ConversationStatus
  ) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, status: newStatus } : c))
    );
  };

  // Send message in existing conversation (from staff or testing as customer)
  const handleSendMessage = (
    conversationId: string,
    text: string,
    sender: 'staff' | 'customer'
  ) => {
    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      sender,
      senderName: sender === 'staff' ? currentUser.name : undefined,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          return {
            ...c,
            lastMessage: text,
            updatedAt: 'Vừa xong',
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );
  };

  // Live interaction from Customer Chat Widget
  const handleCustomerWidgetMessage = async (userText: string) => {
    // Process with the AI Agent engine
    const agentResult = processWithCareAgent(userText, knowledgeBase, widgetCustomer.name);

    // Find or create conversation for this widget customer
    let targetConv = conversations.find((c) => c.customerId === widgetCustomer.id);
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const customerMsg: Message = {
      id: `msg_cust_${Date.now()}`,
      sender: 'customer',
      senderName: widgetCustomer.name,
      text: userText,
      timestamp: timeStr,
    };

    const aiMsg: Message = {
      id: `msg_ai_${Date.now()}`,
      sender: 'ai',
      senderName: 'CareAI Agent',
      text: agentResult.replyText,
      timestamp: timeStr,
      reasoningTrace: agentResult.reasoningTrace,
      retrievedSources: agentResult.retrievedSources,
      staffCopilotOptions: agentResult.staffCopilotOptions,
    };

    if (targetConv) {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === targetConv!.id) {
            return {
              ...c,
              lastMessage: userText,
              sentiment: agentResult.sentiment,
              sentimentScore: agentResult.sentimentScore,
              status: agentResult.shouldEscalate ? 'Chờ nhân viên' : c.status,
              assignedTo: agentResult.shouldEscalate ? 'STAFF' : c.assignedTo,
              urgency: agentResult.shouldEscalate ? 'Khẩn cấp' : c.urgency,
              messages: [...c.messages, customerMsg, aiMsg],
              updatedAt: 'Vừa xong',
            };
          }
          return c;
        })
      );
    } else {
      // Create new conversation
      const newConv: Conversation = {
        id: `conv_${Date.now()}`,
        customerId: widgetCustomer.id,
        customerName: widgetCustomer.name,
        customerAvatar: widgetCustomer.avatar,
        customerPhone: widgetCustomer.phone,
        customerTier: widgetCustomer.tier,
        status: agentResult.shouldEscalate ? 'Chờ nhân viên' : 'Đang xử lý',
        assignedTo: agentResult.shouldEscalate ? 'STAFF' : 'AI_AGENT',
        sentiment: agentResult.sentiment,
        sentimentScore: agentResult.sentimentScore,
        urgency: agentResult.shouldEscalate ? 'Khẩn cấp' : 'Thấp',
        lastMessage: userText,
        updatedAt: 'Vừa xong',
        unreadCount: 1,
        channel: 'Web Chat',
        tags: [agentResult.reasoningTrace.intent],
        messages: [customerMsg, aiMsg],
      };
      setConversations((prev) => [newConv, ...prev]);
    }

    // Trigger notification if customer is angry or escalation happens
    if (agentResult.shouldEscalate || agentResult.sentiment === 'Tiêu cực') {
      const newNotif: AppNotification = {
        id: `notif_${Date.now()}`,
        type: agentResult.sentiment === 'Tiêu cực' ? 'negative_sentiment' : 'escalation_requested',
        title: agentResult.sentiment === 'Tiêu cực' ? '🚨 Cảnh báo cảm xúc tiêu cực!' : '⚡ AI Agent yêu cầu can thiệp',
        message: `Khách hàng ${widgetCustomer.name} phản ánh: "${userText.slice(0, 70)}...". Điểm cảm xúc: ${agentResult.sentimentScore}/100.`,
        conversationId: targetConv?.id || `conv_${Date.now()}`,
        timestamp: timeStr,
        read: false,
        urgency: 'Khẩn cấp',
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }

    return {
      replyText: agentResult.replyText,
      reasoningTrace: agentResult.reasoningTrace,
      retrievedSources: agentResult.retrievedSources,
      shouldEscalate: agentResult.shouldEscalate,
    };
  };

  const handleOpenChatWithCustomer = (customerId: string) => {
    let conv = conversations.find((c) => c.customerId === customerId);
    if (!conv) {
      const cust = customers.find((c) => c.id === customerId);
      if (cust) {
        const newConv: Conversation = {
          id: `conv_${Date.now()}`,
          customerId: cust.id,
          customerName: cust.name,
          customerAvatar: cust.avatar,
          customerPhone: cust.phone,
          customerTier: cust.tier,
          status: 'Đang xử lý',
          assignedTo: 'AI_AGENT',
          sentiment: 'Trung lập',
          sentimentScore: 10,
          urgency: 'Thấp',
          lastMessage: 'Bắt đầu cuộc trò chuyện mới.',
          updatedAt: 'Vừa xong',
          unreadCount: 0,
          channel: 'Web Chat',
          tags: ['Mới tạo'],
          messages: [
            {
              id: `m_${Date.now()}`,
              sender: 'ai',
              text: `Chào ${cust.name}! Em là CareAI Agent sẵn sàng hỗ trợ anh/chị 24/7 ạ.`,
              timestamp: 'Vừa xong',
            },
          ],
        };
        setConversations((prev) => [newConv, ...prev]);
        setActiveConversationId(newConv.id);
      }
    } else {
      setActiveConversationId(conv.id);
    }
    setActiveTab('conversations');
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 font-sans">
      {/* Top Header */}
      <Header
        currentUser={currentUser}
        allUsers={allUsers}
        onSwitchUser={setCurrentUser}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
        onSelectConversation={(convId) => {
          setActiveConversationId(convId);
          setActiveTab('conversations');
        }}
        onOpenCustomerWidget={() => setIsCustomerWidgetOpen(true)}
        activeTab={activeTab}
      />

      {/* Main Split Layout: Sidebar + Active View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          userRole={currentUser.role}
          waitingCount={waitingCount}
          unreadCount={unreadCount}
        />

        {/* View Routing */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          {activeTab === 'conversations' && (
            <ConversationView
              conversations={conversations}
              activeConversationId={activeConversationId}
              onSelectConversation={setActiveConversationId}
              onSendMessage={handleSendMessage}
              onToggleHandoff={handleToggleHandoff}
              onUpdateStatus={handleUpdateConversationStatus}
              customers={customers}
              userRole={currentUser.role}
            />
          )}

          {activeTab === 'knowledge' && (
            <KnowledgeBaseView
              knowledgeBase={knowledgeBase}
              onAddKnowledge={handleAddKnowledge}
              onUpdateKnowledge={handleUpdateKnowledge}
              onDeleteKnowledge={handleDeleteKnowledge}
              userRole={currentUser.role}
            />
          )}

          {activeTab === 'customers' && (
            <CustomersView
              customers={customers}
              onAddCustomer={handleAddCustomer}
              onUpdateCustomer={handleUpdateCustomer}
              onDeleteCustomer={handleDeleteCustomer}
              onOpenChatWithCustomer={handleOpenChatWithCustomer}
              userRole={currentUser.role}
            />
          )}

          {activeTab === 'sentiment' && (
            <SentimentView conversations={conversations} />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView analytics={analytics} />
          )}

          {activeTab === 'agent_lab' && (
            <AgentLabView knowledgeBase={knowledgeBase} />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              currentUser={currentUser}
              allUsers={allUsers}
              onSwitchUser={setCurrentUser}
            />
          )}
        </main>
      </div>

      {/* Floating Customer Demo Live Chat Widget */}
      <CustomerChatWidget
        isOpen={isCustomerWidgetOpen}
        onClose={() => setIsCustomerWidgetOpen(false)}
        knowledgeBase={knowledgeBase}
        currentCustomer={widgetCustomer}
        allCustomers={customers}
        onSelectCustomer={setWidgetCustomer}
        onSendMessageFromCustomer={handleCustomerWidgetMessage}
      />
    </div>
  );
}
