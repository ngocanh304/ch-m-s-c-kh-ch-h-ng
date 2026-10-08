import { Customer, KnowledgeItem, Conversation, AppNotification, UserAccount, AnalyticsSummary } from '../types';

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'usr_admin',
    name: 'Nguyễn Minh Tuấn (Admin)',
    email: 'admin@careai.vn',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    department: 'Ban Giám Đốc / Vận Hành',
  },
  {
    id: 'usr_staff_1',
    name: 'Trần Hải Đăng (Support Staff)',
    email: 'dang.th@careai.vn',
    role: 'staff',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    department: 'Chăm Sóc Khách Hàng (Tầng 2)',
  },
  {
    id: 'usr_customer_demo',
    name: 'Lê Hoàng Yến (Demo Khách hàng)',
    email: 'hoangyen.le@gmail.com',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    department: 'Khách hàng thử nghiệm Widget',
  },
];

export const INITIAL_KNOWLEDGE_BASE: KnowledgeItem[] = [
  {
    id: 'kb_01',
    title: 'Chính sách bảo hành sản phẩm 1 đổi 1 trong 30 ngày',
    category: 'Chính sách & Bảo hành',
    content: 'Tất cả các thiết bị phần cứng chính hãng do CareAI Store phân phối được áp dụng chính sách 1 đổi 1 mới hoàn toàn trong vòng 30 ngày đầu tiên nếu phát sinh lỗi phần cứng từ nhà sản xuất. Sau 30 ngày, sản phẩm được tiếp nhận bảo hành chính hãng từ 12 đến 24 tháng theo đúng tiêu chuẩn linh kiện. Khách hàng chỉ cần cung cấp số điện thoại mua hàng hoặc mã hóa đơn.',
    tags: ['bảo hành', 'đổi trả', '1 đổi 1', '30 ngày', 'lỗi phần cứng'],
    updatedAt: '2026-10-01',
    viewsCount: 1420,
    helpfulCount: 389,
    active: true,
  },
  {
    id: 'kb_02',
    title: 'Chính sách vận chuyển & Giao hàng hỏa tốc 2 giờ',
    category: 'Chính sách & Bảo hành',
    content: 'Chúng tôi hỗ trợ giao hàng hỏa tốc trong 2 giờ tại nội thành Hà Nội và TP. Hồ Chí Minh với đơn hàng đặt trước 17h00 hàng ngày. Đơn hàng tiêu chuẩn toàn quốc giao từ 1-3 ngày làm việc qua bưu tá Viettel Post/GHTK. Miễn phí vận chuyển cho tất cả đơn hàng từ 500.000 VNĐ. Khách hàng được quyền kiểm tra hàng trước khi thanh toán (đồng kiểm).',
    tags: ['giao hàng', 'vận chuyển', 'hỏa tốc', 'phí ship', 'đồng kiểm'],
    updatedAt: '2026-09-28',
    viewsCount: 980,
    helpfulCount: 245,
    active: true,
  },
  {
    id: 'kb_03',
    title: 'Sản phẩm: Tai nghe chống ồn CarePods Pro Max Gen 3',
    category: 'Sản phẩm',
    content: 'Tai nghe chụp tai chống ồn chủ động ANC thế hệ 3. Giá niêm yết: 4.890.000 VNĐ. Giá ưu đãi tuần lễ CareAI: 3.990.000 VNĐ. Thời lượng pin 45 giờ liên tục, hỗ trợ sạc nhanh Type-C 10 phút dùng 5 giờ, kết nối đa điểm Bluetooth 5.4, micro khử ồn AI lọc gió 98%. Màu sắc: Bạc Titan, Đen Phantom, Xanh Midnight.',
    tags: ['tai nghe', 'carepods pro', 'anc', 'chống ồn', 'giá bán', 'pin 45h'],
    updatedAt: '2026-10-05',
    viewsCount: 2310,
    helpfulCount: 612,
    active: true,
  },
  {
    id: 'kb_04',
    title: 'Sản phẩm: Đồng hồ thông minh CareWatch Ultra GPS',
    category: 'Sản phẩm',
    content: 'Đồng hồ thông minh mặt kính Sapphire và khung Titan cấp hàng không vũ trụ. Giá bán: 6.290.000 VNĐ. Tính năng: Đo điện tâm đồ ECG, SpO2 24/7, định vị GPS băng tần kép L1+L5, chống nước 5ATM 50m, pin 7 ngày, tương thích cả iOS và Android.',
    tags: ['carewatch', 'đồng hồ', 'gps', 'ecg', 'titan', 'giá bán'],
    updatedAt: '2026-10-04',
    viewsCount: 1850,
    helpfulCount: 420,
    active: true,
  },
  {
    id: 'kb_05',
    title: 'Chương trình khuyến mãi & Mã giảm giá hiện hành',
    category: 'Giá & Ưu đãi',
    content: 'Mã "CAREAI10": Giảm ngay 10% tối đa 300.000 VNĐ cho khách hàng mới khi mua sắm lần đầu trên website. Mã "VIPCARE20": Giảm 20% phụ kiện đi kèm khi mua kèm thân máy. Giảm thêm 5% khi thanh toán chuyển khoản qua QR MoMo/VNPAY.',
    tags: ['mã giảm giá', 'voucher', 'khuyến mãi', 'CAREAI10', 'ưu đãi', 'giảm giá'],
    updatedAt: '2026-10-06',
    viewsCount: 3120,
    helpfulCount: 880,
    active: true,
  },
  {
    id: 'kb_06',
    title: 'FAQ: Hướng dẫn tra cứu tình trạng đơn hàng bằng Mã đơn hàng',
    category: 'FAQ',
    content: 'Để kiểm tra đơn hàng, quý khách có thể gửi trực tiếp mã đơn hàng định dạng "#ORD-xxxx" cho AI Agent trong hộp chat hoặc truy cập mục Tra cứu đơn hàng trên website. Hệ thống sẽ trả về tức thì: vị trí kiện hàng, đơn vị vận chuyển, số điện thoại shipper và ngày dự kiến nhận hàng.',
    tags: ['tra cứu đơn hàng', 'mã đơn', 'vận đơn', 'shipper', 'tình trạng'],
    updatedAt: '2026-09-20',
    viewsCount: 4100,
    helpfulCount: 1250,
    active: true,
  },
  {
    id: 'kb_07',
    title: 'FAQ: Cách xử lý khi tai nghe bị mất kết nối hoặc reset',
    category: 'Tài liệu hướng dẫn',
    content: 'Nếu tai nghe CarePods mất kết nối hoặc 1 bên không nghe được: Bước 1: Cho cả 2 tai nghe vào dock sạc. Bước 2: Nhấn và giữ nút tròn sau dock trong 10 giây cho đến khi đèn LED nháy đỏ 3 lần. Bước 3: Mở nắp dock gần điện thoại và kết nối lại Bluetooth.',
    tags: ['reset', 'mất kết nối', 'lỗi tai nghe', 'hướng dẫn', 'sound'],
    updatedAt: '2026-09-15',
    viewsCount: 1650,
    helpfulCount: 512,
    active: true,
  },
  {
    id: 'kb_08',
    title: 'Quy trình tiếp nhận khiếu nại và đền bù khách hàng',
    category: 'Chính sách & Bảo hành',
    content: 'Trường hợp khách hàng không hài lòng hoặc nhận sản phẩm bị vỡ méo do vận chuyển: AI Agent tự động ghi nhận và chuyển ngay hồ sơ cho Trưởng ca Hỗ trợ khách hàng trong vòng 3 phút. Chúng tôi cam kết gửi hàng mới thay thế ngay lập tức và tặng kèm voucher bồi thường 15% cho đơn tiếp theo.',
    tags: ['khiếu nại', 'đền bù', 'bể vỡ', 'không hài lòng', 'chuyển nhân viên'],
    updatedAt: '2026-10-02',
    viewsCount: 890,
    helpfulCount: 320,
    active: true,
  },
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust_01',
    name: 'Vũ Đức Thịnh',
    email: 'thinh.vu@techcorp.vn',
    phone: '0912 345 678',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    tier: 'Trung thành',
    totalSpent: 28500000,
    ordersCount: 5,
    sentimentScore: 85,
    lastActive: '5 phút trước',
    notes: 'Khách hàng VIP, hay mua phụ kiện công nghệ cao cấp, thích giao hàng hỏa tốc.',
    tags: ['VIP', 'Thanh toán nhanh', 'Tech Enthusiast'],
  },
  {
    id: 'cust_02',
    name: 'Trần Thị Thu Hà',
    email: 'thuha.tran91@gmail.com',
    phone: '0988 765 432',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    tier: 'Cần chăm sóc',
    totalSpent: 4890000,
    ordersCount: 1,
    sentimentScore: -65,
    lastActive: '2 phút trước',
    notes: 'Đang phản ánh tai nghe nhận được bị rè và giao trễ 1 ngày so với cam kết.',
    tags: ['Khiếu nại', 'Cần ưu tiên', 'Lỗi âm thanh'],
  },
  {
    id: 'cust_03',
    name: 'Phạm Quang Minh',
    email: 'minh.pq@creative.io',
    phone: '0903 888 999',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    tier: 'Tiềm năng',
    totalSpent: 0,
    ordersCount: 0,
    sentimentScore: 20,
    lastActive: '15 phút trước',
    notes: 'Đang hỏi chi tiết về CareWatch Ultra và xin mã giảm giá cho sinh viên.',
    tags: ['Khách hỏi mua', 'Cần tư vấn sale'],
  },
  {
    id: 'cust_04',
    name: 'Đặng Ngọc Lan',
    email: 'lan.dang@hospitality.vn',
    phone: '0977 112 233',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    tier: 'Khách mới',
    totalSpent: 1250000,
    ordersCount: 1,
    sentimentScore: 60,
    lastActive: '1 giờ trước',
    notes: 'Vừa đặt đơn hàng đầu tiên, hỏi cách kích hoạt gói bảo hành mở rộng.',
    tags: ['Mới mua hàng', 'Hỏi bảo hành'],
  },
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_01',
    customerId: 'cust_02',
    customerName: 'Trần Thị Thu Hà',
    customerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    customerPhone: '0988 765 432',
    customerTier: 'Cần chăm sóc',
    status: 'Chờ nhân viên',
    assignedTo: 'STAFF',
    staffName: 'Trần Hải Đăng',
    sentiment: 'Tiêu cực',
    sentimentScore: -75,
    urgency: 'Khẩn cấp',
    lastMessage: 'Tai nghe tôi mới nhận bị rè một bên, giao thì trễ 1 ngày! Cho tôi gặp nhân viên giải quyết ngay đi!',
    updatedAt: '10:14',
    unreadCount: 2,
    channel: 'Web Chat',
    tags: ['Khiếu nại sản phẩm', 'Cảm xúc tiêu cực', 'Đổi trả hàng'],
    messages: [
      {
        id: 'msg_01',
        sender: 'customer',
        text: 'Alo, tôi vừa nhận được chiếc CarePods Pro đặt hôm kia mã đơn #ORD-8821.',
        timestamp: '10:12',
      },
      {
        id: 'msg_02',
        sender: 'ai',
        text: 'Chào chị Thu Hà! CareAI xin chào mừng chị. Em đã kiểm tra đơn hàng #ORD-8821 của chị gồm Tai nghe CarePods Pro Max. Không biết sản phẩm chị nhận được đã kích hoạt thuận lợi chưa ạ?',
        timestamp: '10:12',
        reasoningTrace: {
          intent: 'Tra cứu đơn hàng #ORD-8821',
          confidence: 98,
          sentiment: 'Trung lập',
          sentimentScore: 10,
          emotion: 'Bình thường',
          retrievedDocs: [
            { id: 'kb_06', title: 'FAQ: Hướng dẫn tra cứu tình trạng đơn hàng', category: 'FAQ' },
            { id: 'kb_03', title: 'Sản phẩm: CarePods Pro Max', category: 'Sản phẩm' }
          ],
          actionTaken: 'ORDER_LOOKUP_SUCCESS',
          reasoningSteps: [
            { step: 1, title: 'Nhận dạng Entity', detail: 'Phát hiện mã đơn #ORD-8821 khớp hồ sơ khách hàng Trần Thị Thu Hà', status: 'completed' },
            { step: 2, title: 'Tra cứu CSDL Đơn hàng', detail: 'Trạng thái: Đã giao thành công lúc 09:30 sáng nay', status: 'completed' },
            { step: 3, title: 'Tự động phản hồi', detail: 'Chào cá nhân hóa và đề nghị hỗ trợ trải nghiệm', status: 'completed' }
          ],
          latencyMs: 310,
        },
      },
      {
        id: 'msg_03',
        sender: 'customer',
        text: 'Tai nghe tôi mới nhận bị rè một bên, giao thì trễ 1 ngày! Cho tôi gặp nhân viên giải quyết ngay đi!',
        timestamp: '10:14',
      },
      {
        id: 'msg_04',
        sender: 'ai',
        text: 'Dạ em vô cùng xin lỗi chị Hà vì trải nghiệm không trọn vẹn này ạ! 🚨 AI Agent nhận thấy lỗi âm thanh và giao trễ làm chị phiền lòng. Theo chính sách của CareAI, chị được quyền 1 ĐỔI 1 MỚI 100% trong 30 ngày. Em đã chuyển ngay cuộc trò chuyện này lên cho chuyên viên Trần Hải Đăng (Trưởng ca) để tiếp nhận và tạo đơn đổi hàng tận nhà ngay trong 2 phút tới.',
        timestamp: '10:14',
        reasoningTrace: {
          intent: 'Khiếu nại sản phẩm lỗi + Yêu cầu gặp nhân viên trực tiếp',
          confidence: 99,
          sentiment: 'Tiêu cực',
          sentimentScore: -88,
          emotion: 'Giận dữ / Thất vọng',
          retrievedDocs: [
            { id: 'kb_01', title: 'Chính sách bảo hành 1 đổi 1 trong 30 ngày', category: 'Chính sách & Bảo hành' },
            { id: 'kb_08', title: 'Quy trình tiếp nhận khiếu nại và đền bù', category: 'Chính sách & Bảo hành' }
          ],
          actionTaken: 'ESCALATED_TO_HUMAN',
          reasoningSteps: [
            { step: 1, title: 'Phân tích cảm xúc & Ngữ nghĩa', detail: 'Sentiment score: -88/100 (Khách hàng giận dữ). Trigger cụm từ "rè một bên", "gặp nhân viên ngay"', status: 'completed' },
            { step: 2, title: 'Quy chuẩn an toàn (Guardrails)', detail: 'Tự động kích hoạt cơ chế Handoff sang nhân viên hỗ trợ con người', status: 'completed' },
            { step: 3, title: 'Tạo cảnh báo khẩn', detail: 'Gửi Notification ưu tiên Cao tới bảng điều khiển của nhân viên trực ca', status: 'completed' },
            { step: 4, title: 'Gợi ý phản hồi Copilot', detail: 'Chuẩn bị 3 phương án bồi thường cho nhân viên lựa chọn', status: 'completed' }
          ],
          latencyMs: 420,
        },
        staffCopilotOptions: [
          'Dạ em là Hải Đăng phụ trách hỗ trợ chị Hà. Em đã tạo ngay đơn hàng đổi mới 100% giao tận nhà trong chiều nay, đồng thời xin gửi tặng chị voucher giảm 20% đơn tiếp theo ạ.',
          'Dạ chào chị Hà, em xin kiểm tra số serial và cho shipper mang tai nghe mới qua đổi tận tay chị, chị không cần gửi hàng cũ trước đâu ạ.',
          'Dạ chào chị Hà, em gọi điện trực tiếp qua số 0988 765 432 để hỗ trợ chị được nhanh nhất nhé ạ?'
        ]
      }
    ]
  },
  {
    id: 'conv_02',
    customerId: 'cust_01',
    customerName: 'Vũ Đức Thịnh',
    customerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    customerPhone: '0912 345 678',
    customerTier: 'Trung thành',
    status: 'Đang xử lý',
    assignedTo: 'AI_AGENT',
    sentiment: 'Tích cực',
    sentimentScore: 90,
    urgency: 'Thấp',
    lastMessage: 'Dạ mã CAREAI10 áp dụng được rồi, cảm ơn shop!',
    updatedAt: '09:50',
    unreadCount: 0,
    channel: 'Web Chat',
    tags: ['Hỏi giá', 'Khuyến mãi', 'Tự động giải quyết'],
    messages: [
      {
        id: 'msg_21',
        sender: 'customer',
        text: 'Shop ơi có mã giảm giá nào cho tai nghe CarePods Pro Max không?',
        timestamp: '09:48',
      },
      {
        id: 'msg_22',
        sender: 'ai',
        text: 'Chào anh Thịnh ạ! 🎉 Hiện tại tai nghe CarePods Pro Max đang được ưu đãi giảm trực tiếp từ 4.890.000 VNĐ xuống còn 3.990.000 VNĐ. Đặc biệt, anh có thể áp dụng thêm mã "CAREAI10" để giảm thêm 10% (tối đa 300.000 VNĐ) và được miễn phí vận chuyển hỏa tốc 2 giờ tại nội thành ạ!',
        timestamp: '09:49',
        reasoningTrace: {
          intent: 'Hỏi giá khuyến mãi & Voucher',
          confidence: 96,
          sentiment: 'Tích cực',
          sentimentScore: 70,
          emotion: 'Quan tâm mua sắm',
          retrievedDocs: [
            { id: 'kb_03', title: 'Sản phẩm: CarePods Pro Max Gen 3', category: 'Sản phẩm' },
            { id: 'kb_05', title: 'Chương trình khuyến mãi & Mã giảm giá', category: 'Giá & Ưu đãi' },
            { id: 'kb_02', title: 'Chính sách vận chuyển & Giao hàng hỏa tốc', category: 'Chính sách & Bảo hành' }
          ],
          actionTaken: 'AUTONOMOUS_RESOLVED',
          reasoningSteps: [
            { step: 1, title: 'Truy vấn Knowledge Base', detail: 'Khớp 3 tài liệu: Giá CarePods, Voucher CAREAI10, Ship hỏa tốc', status: 'completed' },
            { step: 2, title: 'Tính toán biểu phí tự động', detail: 'Giá gốc 4.89tr -> Giá sale 3.99tr + Coupon -10%', status: 'completed' },
            { step: 3, title: 'Tự động phản hồi AI', detail: 'Độ tự tin 96%, hoàn tất không cần nhân viên can thiệp', status: 'completed' }
          ],
          latencyMs: 290,
        }
      },
      {
        id: 'msg_23',
        sender: 'customer',
        text: 'Dạ mã CAREAI10 áp dụng được rồi, cảm ơn shop!',
        timestamp: '09:50',
      },
      {
        id: 'msg_24',
        sender: 'ai',
        text: 'Tuyệt vời ạ! Đơn hàng của anh sẽ được đóng gói chống sốc chuẩn 3 lớp và giao trong 2 giờ. Nếu cần thêm hỗ trợ trong lúc sử dụng, anh cứ nhắn em bất cứ lúc nào nhé!',
        timestamp: '09:50',
      }
    ]
  },
  {
    id: 'conv_03',
    customerId: 'cust_03',
    customerName: 'Phạm Quang Minh',
    customerAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    customerPhone: '0903 888 999',
    customerTier: 'Tiềm năng',
    status: 'Đã hoàn thành',
    assignedTo: 'AI_AGENT',
    sentiment: 'Tích cực',
    sentimentScore: 65,
    urgency: 'Thấp',
    lastMessage: 'Đồng hồ CareWatch Ultra có đo được ECG tim mạch không?',
    updatedAt: 'Hôm qua',
    unreadCount: 0,
    channel: 'Zalo',
    tags: ['Tư vấn kỹ thuật', 'CareWatch Ultra'],
    messages: [
      {
        id: 'msg_31',
        sender: 'customer',
        text: 'Đồng hồ CareWatch Ultra có đo được ECG tim mạch không shop?',
        timestamp: '16:20',
      },
      {
        id: 'msg_32',
        sender: 'ai',
        text: 'Dạ có ạ anh Minh! CareWatch Ultra trang bị cảm biến điện tâm đồ ECG đạt chuẩn y tế, đo nhịp tim & cảnh báo rung tâm nhĩ 24/7. Ngoài ra máy còn đo nồng độ oxy máu SpO2, chuẩn chống nước 5ATM lặn sâu 50m và pin bền 7 ngày liên tục ạ.',
        timestamp: '16:21',
      }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_01',
    type: 'negative_sentiment',
    title: 'Cảnh báo cảm xúc tiêu cực!',
    message: 'Khách hàng Trần Thị Thu Hà phản ánh tai nghe bị rè (Chỉ số: -75/100). Đã tự động kích hoạt chuyển tiếp nhân viên.',
    conversationId: 'conv_01',
    timestamp: '10:14',
    read: false,
    urgency: 'Khẩn cấp',
  },
  {
    id: 'notif_02',
    type: 'escalation_requested',
    title: 'Yêu cầu hỗ trợ từ AI Agent',
    message: 'Hội thoại #conv_01 được AI Agent chuyển giao cho Nhân viên trực ca giải quyết đổi hàng 1-1.',
    conversationId: 'conv_01',
    timestamp: '10:14',
    read: false,
    urgency: 'Cao',
  },
  {
    id: 'notif_03',
    type: 'new_chat',
    title: 'Hội thoại mới bắt đầu',
    message: 'Khách hàng Vũ Đức Thịnh vừa bắt đầu hỏi thông tin voucher qua Web Widget.',
    conversationId: 'conv_02',
    timestamp: '09:48',
    read: true,
    urgency: 'Thấp',
  },
];

export const INITIAL_ANALYTICS: AnalyticsSummary = {
  totalConversations: 1248,
  aiResolutionRate: 84.6, // 84.6% tự động xử lý
  escalationRate: 15.4,   // 15.4% chuyển nhân viên
  avgResponseTimeSec: 1.8, // 1.8 giây trung bình
  csatScore: 4.85,        // 4.85/5 sao
  positiveSentimentRate: 78.2,
  negativeSentimentRate: 5.6,
  savedHoursEstimate: 412,
};
