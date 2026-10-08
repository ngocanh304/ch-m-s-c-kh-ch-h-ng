import { AgentReasoningTrace, KnowledgeItem, SentimentType, ReasoningStep } from '../types';

export interface AgentProcessResult {
  replyText: string;
  reasoningTrace: AgentReasoningTrace;
  retrievedSources: string[];
  shouldEscalate: boolean;
  staffCopilotOptions: string[];
  sentiment: SentimentType;
  sentimentScore: number;
}

// Helper to calculate sentiment
export function analyzeSentiment(text: string): {
  sentiment: SentimentType;
  score: number;
  emotion: string;
  isNegativeAlert: boolean;
} {
  const lower = text.toLowerCase();
  let score = 0;
  let emotion = 'Thắc mắc / Bình thường';

  const negativeKeywords: Record<string, number> = {
    'tệ': -30,
    'kém': -25,
    'rè': -35,
    'hỏng': -35,
    'lỗi': -30,
    'bực mình': -45,
    'thất vọng': -40,
    'chậm': -20,
    'trễ': -25,
    'lừa đảo': -60,
    'vỡ': -35,
    'hư': -30,
    'không nghe được': -35,
    'mất tiền': -40,
    'khiếu nại': -35,
    'tẩy chay': -50,
    'vô trách nhiệm': -45,
    'bực': -30,
    'ghét': -30,
    'tệ hại': -45,
  };

  const positiveKeywords: Record<string, number> = {
    'tuyệt vời': 40,
    'tốt': 25,
    'nhanh': 25,
    'hài lòng': 35,
    'cảm ơn': 30,
    'thanks': 25,
    'thích': 25,
    'đẹp': 20,
    'ok': 15,
    'chu đáo': 30,
    'nhiệt tình': 30,
    'uy tín': 35,
    'xịn': 25,
    'được rồi': 20,
    'chất lượng': 25,
  };

  for (const [kw, val] of Object.entries(negativeKeywords)) {
    if (lower.includes(kw)) {
      score += val;
    }
  }

  for (const [kw, val] of Object.entries(positiveKeywords)) {
    if (lower.includes(kw)) {
      score += val;
    }
  }

  // Check urgent words
  const isUrgent = lower.includes('ngay') || lower.includes('khẩn cấp') || lower.includes('liền') || lower.includes('gấp');

  // Clamp score
  score = Math.max(-100, Math.min(100, score));

  let sentiment: SentimentType = 'Trung lập';
  if (score <= -25) {
    sentiment = 'Tiêu cực';
    emotion = isUrgent || score <= -50 ? 'Giận dữ / Khẩn cấp' : 'Thất vọng / Khó chịu';
  } else if (score >= 20) {
    sentiment = 'Tích cực';
    emotion = score > 50 ? 'Rất hài lòng / Khen ngợi' : 'Hài lòng / Tích cực';
  } else {
    sentiment = 'Trung lập';
    emotion = isUrgent ? 'Cần hỗ trợ gấp' : 'Thắc mắc thông thường';
  }

  const isNegativeAlert = score <= -30 || lower.includes('gặp nhân viên') || lower.includes('khiếu nại');

  return { sentiment, score, emotion, isNegativeAlert };
}

// Retrieve relevant Knowledge Base items
export function retrieveKnowledge(query: string, knowledgeBase: KnowledgeItem[]): {
  item: KnowledgeItem;
  score: number;
}[] {
  const queryTokens = query
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1);

  const scored = knowledgeBase
    .filter((kb) => kb.active)
    .map((kb) => {
      let score = 0;
      const titleLower = kb.title.toLowerCase();
      const contentLower = kb.content.toLowerCase();
      const tagsJoined = kb.tags.join(' ').toLowerCase();

      // Tag exact match has highest weight
      for (const tag of kb.tags) {
        if (query.toLowerCase().includes(tag.toLowerCase())) {
          score += 35;
        }
      }

      for (const token of queryTokens) {
        if (titleLower.includes(token)) score += 15;
        if (tagsJoined.includes(token)) score += 12;
        if (contentLower.includes(token)) score += 5;
      }

      return { item: kb, score };
    });

  return scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score);
}

// Local Autonomous Agent Processor (always works, fast, transparent reasoning)
export function processWithCareAgent(
  userQuery: string,
  knowledgeBase: KnowledgeItem[],
  customerName?: string
): AgentProcessResult {
  const startTime = Date.now();
  const lower = userQuery.toLowerCase();
  const { sentiment, score: sentimentScore, emotion, isNegativeAlert } = analyzeSentiment(userQuery);

  const matchedDocs = retrieveKnowledge(userQuery, knowledgeBase);
  const topDocs = matchedDocs.slice(0, 3).map((d) => d.item);

  // Check specific intent patterns
  const isOrderLookup = /#ord-\d+/i.test(userQuery) || lower.includes('đơn hàng') || lower.includes('tra cứu đơn');
  const isDemandingHuman =
    lower.includes('gặp nhân viên') ||
    lower.includes('gặp người thật') ||
    lower.includes('tổng đài viên') ||
    lower.includes('chuyển người') ||
    (isNegativeAlert && (lower.includes('rè') || lower.includes('hỏng') || lower.includes('vỡ') || lower.includes('lỗi')));

  const orderMatch = userQuery.match(/#ord-\d+/i);
  const orderId = orderMatch ? orderMatch[0].toUpperCase() : null;

  const reasoningSteps: ReasoningStep[] = [];

  // Step 1: NLP
  reasoningSteps.push({
    step: 1,
    title: 'Phân tích Ngữ nghĩa & Cảm xúc (NLP)',
    detail: `Nhận diện câu hỏi. Cảm xúc: ${sentiment} (${sentimentScore}/100, ${emotion}). Từ khóa nổi bật: "${userQuery.slice(0, 45)}..."`,
    status: 'completed',
  });

  // Step 2: Knowledge retrieval
  reasoningSteps.push({
    step: 2,
    title: 'Truy vấn Knowledge Base (RAG)',
    detail:
      topDocs.length > 0
        ? `Đã truy xuất ${topDocs.length} tài liệu phù hợp nhất: ${topDocs.map((d) => `"${d.title}"`).join(', ')}`
        : 'Không tìm thấy tài liệu phù hợp trong Knowledge Base. Kích hoạt suy luận ngữ cảnh tổng quát.',
    status: 'completed',
  });

  let shouldEscalate = false;
  let actionTaken: AgentReasoningTrace['actionTaken'] = 'AUTONOMOUS_RESOLVED';
  let intent = 'Hỏi đáp thông tin tổng quát';
  let confidence = 92;
  let replyText = '';
  const staffCopilotOptions: string[] = [];

  // Branch 1: Needs escalation to human staff
  if (isDemandingHuman || (sentimentScore <= -40 && topDocs.length === 0)) {
    shouldEscalate = true;
    actionTaken = 'ESCALATED_TO_HUMAN';
    intent = 'Khiếu nại / Khách hàng cần hỗ trợ trực tiếp từ nhân viên';
    confidence = 98;

    reasoningSteps.push({
      step: 3,
      title: 'Đánh giá Guardrails & Chuyển giao',
      detail:
        'Phát hiện tín hiệu bức xúc hoặc yêu cầu gặp người thật. Tự động chuyển quyền xử lý cho Nhân viên Chăm sóc Khách hàng.',
      status: 'completed',
    });

    reasoningSteps.push({
      step: 4,
      title: 'Tạo Copilot Suggestions cho nhân viên',
      detail: 'Tạo sẵn 3 kịch bản trả lời đồng cảm & phương án bồi thường để nhân viên phản hồi ngay trong 30 giây.',
      status: 'completed',
    });

    replyText = `Dạ em xin lỗi ${customerName || 'quý khách'} rất nhiều vì trải nghiệm chưa được như mong đợi! 🙏 AI Agent nhận thấy vấn đề này cần được xử lý cẩn thận nhất. Em đã chuyển ngay hội thoại đến Chuyên viên Hỗ trợ (Trưởng ca trực) để tiếp nhận và giải quyết trực tiếp cho ${customerName || 'quý khách'} trong vòng 1-2 phút tới. Xin quý khách giữ máy trong giây lát ạ!`;

    staffCopilotOptions.push(
      `Chào ${customerName || 'anh/chị'}, em là nhân viên hỗ trợ trực tiếp. Em đã nắm được thông tin phản ánh và sẽ xử lý ngay phương án đổi mới/hoàn phí cho mình ạ.`,
      `Dạ em chào ${customerName || 'anh/chị'}, em xin phép gọi điện trực tiếp để hỗ trợ cụ thể và gửi tặng voucher bồi thường 15% cho mình nhé ạ?`,
      `Chào ${customerName || 'anh/chị'}, bên em đã lập phiếu bảo hành ưu tiên 1 đổi 1 tận nơi, shipper sẽ qua nhận lại máy cũ và giao máy mới ngay hôm nay ạ.`
    );
  }
  // Branch 2: Order Lookup tool action
  else if (isOrderLookup) {
    actionTaken = 'ORDER_LOOKUP_SUCCESS';
    intent = `Tra cứu trạng thái đơn hàng ${orderId || ''}`;
    confidence = 96;

    reasoningSteps.push({
      step: 3,
      title: 'Thực thi Action: Tra cứu API Đơn hàng',
      detail: `Đã kết nối Mock Logistics API. Đơn hàng ${orderId || '#ORD-8821'}: Đang được điều phối giao hỏa tốc.`,
      status: 'completed',
    });

    reasoningSteps.push({
      step: 4,
      title: 'Tạo phản hồi tự động',
      detail: 'Tích hợp đầy đủ thông tin shipper, mã vận đơn và dự kiến giao hàng.',
      status: 'completed',
    });

    replyText = `Dạ em đã kiểm tra thông tin đơn hàng ${orderId || '#ORD-8821'} của ${customerName || 'quý khách'}:
📦 Trạng thái: Đang trên đường giao hàng (Đơn vị: Viettel Post Hỏa tốc).
🛵 Shipper: Nguyễn Văn Hưng (SĐT: 0918.xxx.921).
⏱️ Dự kiến giao: Trong buổi chiều hôm nay trước 17h00.
Quý khách được quyền đồng kiểm (kiểm tra ngoại quan sản phẩm) trước khi ký nhận nhé ạ!`;

    staffCopilotOptions.push(
      `Dạ em vừa kiểm tra với bưu tá, kiện hàng của mình dự kiến đến trước 16h30 hôm nay ạ.`,
      `Nếu bưu tá đến lúc mình không có nhà, báo em để hẹn lại khung giờ giao thuận tiện nhé ạ!`
    );
  }
  // Branch 3: Direct Knowledge Base match
  else if (topDocs.length > 0) {
    actionTaken = 'AUTONOMOUS_RESOLVED';
    const primary = topDocs[0];
    intent = `Tư vấn thông tin: ${primary.category} (${primary.title})`;
    confidence = Math.min(99, 85 + primary.helpfulCount % 14);

    reasoningSteps.push({
      step: 3,
      title: 'Trích xuất nội dung Knowledge Base',
      detail: `Áp dụng tài liệu: [${primary.category}] "${primary.title}".`,
      status: 'completed',
    });

    reasoningSteps.push({
      step: 4,
      title: 'Tự động tạo phản hồi chuẩn xác',
      detail: 'Độ tin cậy cao, tự động giải quyết không cần nhân viên hỗ trợ.',
      status: 'completed',
    });

    // Synthesize clean response
    if (primary.category === 'Sản phẩm') {
      replyText = `Dạ thông tin về ${primary.title} như sau ạ:
✨ ${primary.content}
🎁 Chính sách đi kèm: Bảo hành 1 đổi 1 trong 30 ngày nếu lỗi từ nhà sản xuất, miễn phí giao hỏa tốc 2 giờ nội thành. Anh/chị cần em hỗ trợ tư vấn màu sắc hay hướng dẫn đặt hàng nhận voucher giảm giá không ạ?`;
    } else if (primary.category === 'Giá & Ưu đãi') {
      replyText = `Dạ hiện tại CareAI đang áp dụng các chương trình ưu đãi rất hấp dẫn ạ:
🎟️ ${primary.content}
Quý khách có thể nhập trực tiếp mã vào giỏ hàng hoặc gửi em thông tin sản phẩm để em áp dụng mã tốt nhất cho mình nhé!`;
    } else if (primary.category === 'Chính sách & Bảo hành') {
      replyText = `Dạ chính sách của CareAI về vấn đề này rất rõ ràng và đảm bảo quyền lợi khách hàng ạ:
🛡️ ${primary.content}
Quý khách hoàn toàn yên tâm khi mua sắm và sử dụng sản phẩm tại hệ thống của CareAI ạ!`;
    } else {
      replyText = `Dạ CareAI xin giải đáp thông tin tới quý khách như sau:
📌 ${primary.content}
Nếu cần hướng dẫn thêm từng bước, quý khách cứ nhắn tiếp cho em nhé!`;
    }

    staffCopilotOptions.push(
      `Dạ bên em đang có thêm quà tặng bao da/dán cường lực cho sản phẩm này, anh/chị có muốn em gửi thêm không ạ?`,
      `Em xin hỗ trợ giữ hàng tại showroom gần nhất để anh/chị ghé trải nghiệm trực tiếp nhé ạ.`
    );
  }
  // Branch 4: General greeting / FAQ fallback
  else {
    actionTaken = 'INFO_PROVIDED';
    intent = 'Chào hỏi & Hướng dẫn bắt đầu';
    confidence = 88;

    reasoningSteps.push({
      step: 3,
      title: 'Kích hoạt kịch bản hỗ trợ thông minh',
      detail: 'Cung cấp menu câu hỏi thường gặp và đề xuất các chủ đề hỗ trợ chính.',
      status: 'completed',
    });

    replyText = `Dạ xin chào ${customerName || 'quý khách'}! Em là CareAI Agent - Trợ lý chăm sóc khách hàng thông minh 24/7.
Em có thể hỗ trợ anh/chị ngay lập tức các nội dung sau:
1️⃣ Tra cứu trạng thái đơn hàng (Ví dụ: #ORD-8821).
2️⃣ Tư vấn tính năng & giá sản phẩm (Tai nghe CarePods Pro, Đồng hồ CareWatch Ultra).
3️⃣ Lấy mã giảm giá & voucher khuyến mãi ("CAREAI10").
4️⃣ Chính sách bảo hành 1 đổi 1 trong 30 ngày & hướng dẫn đổi trả.
5️⃣ Hướng dẫn kỹ thuật & reset thiết bị.

Anh/chị đang quan tâm đến mục nào ạ?`;

    staffCopilotOptions.push(
      `Chào anh/chị, em có thể hỗ trợ tư vấn trực tiếp cho mình nội dung nào ạ?`,
      `Dạ em gửi anh/chị bảng giá khuyến mãi mới nhất trong tuần này nhé ạ.`
    );
  }

  const latencyMs = Date.now() - startTime + Math.floor(Math.random() * 80 + 120);

  const reasoningTrace: AgentReasoningTrace = {
    intent,
    confidence,
    sentiment,
    sentimentScore,
    emotion,
    retrievedDocs: topDocs.map((d) => ({ id: d.id, title: d.title, category: d.category })),
    actionTaken,
    reasoningSteps,
    latencyMs,
  };

  return {
    replyText,
    reasoningTrace,
    retrievedSources: topDocs.map((d) => `${d.title} (${d.category})`),
    shouldEscalate,
    staffCopilotOptions,
    sentiment,
    sentimentScore,
  };
}
