import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent header as required
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI client:', err);
  }
}

// API Health
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    geminiEnabled: !!aiClient,
    timestamp: new Date().toISOString(),
  });
});

// Server-side AI Agent endpoint
app.post('/api/ai/agent', async (req: Request, res: Response) => {
  const { query, customerName, knowledgeBase, conversationHistory } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Missing query parameter' });
  }

  // If Gemini client is active, call gemini-3.8-flash for deep reasoning & generation
  if (aiClient) {
    try {
      const kbSummary = Array.isArray(knowledgeBase)
        ? knowledgeBase.slice(0, 10).map((kb: any) => `[${kb.category}] ${kb.title}: ${kb.content}`).join('\n')
        : '';

      const prompt = `Bạn là "CareAI Agent" - AI Agent chuyên viên chăm sóc khách hàng tự động thông minh 24/7 của nền tảng CareAI Store.
Nhiệm vụ của bạn:
1. Tiếp nhận câu hỏi của khách hàng: "${query}" (Khách hàng: ${customerName || 'Quý khách'}).
2. Tra cứu Knowledge Base dưới đây:
${kbSummary}
3. Đánh giá cảm xúc của khách hàng (Tích cực, Trung lập, Tiêu cực) và điểm cảm xúc (-100 đến 100).
4. Phân tích xem có cần chuyển cho nhân viên (escalate) không. Nếu khách hàng quá bức xúc, khiếu nại gay gắt hoặc yêu cầu gặp người thật -> Cần chuyển nhân viên!
5. Trả lời bằng tiếng Việt lịch sự, thân thiện, chuyên nghiệp, giải quyết dứt điểm vấn đề dựa vào Knowledge Base.
6. Trả về kết quả JSON ĐÚNG THEO ĐỊNH DẠNG sau (chỉ trả về JSON thuần):
{
  "replyText": "Nội dung câu trả lời cho khách hàng",
  "intent": "Ý định khách hàng",
  "confidence": 95,
  "sentiment": "Tích cực | Trung lập | Tiêu cực",
  "sentimentScore": 50,
  "emotion": "Hài lòng | Thắc mắc | Giận dữ | Thất vọng",
  "shouldEscalate": false,
  "actionTaken": "AUTONOMOUS_RESOLVED | ESCALATED_TO_HUMAN | INFO_PROVIDED | ORDER_LOOKUP_SUCCESS",
  "retrievedDocTitles": ["Tên tài liệu phù hợp"],
  "staffCopilotOptions": ["Gợi ý phản hồi 1 cho nhân viên nếu cần", "Gợi ý 2", "Gợi ý 3"]
}`;

      const aiResponse = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      const responseText = aiResponse.text;
      if (responseText) {
        try {
          const parsed = JSON.parse(responseText.trim());
          return res.json({
            success: true,
            source: 'gemini-3.8-flash',
            data: parsed,
          });
        } catch (parseError) {
          console.warn('JSON parsing failed from Gemini response, fallback will be used');
        }
      }
    } catch (apiError) {
      console.warn('Gemini API call failed, falling back to local reasoning:', apiError);
    }
  }

  // Graceful fallback response marker
  return res.json({
    success: false,
    source: 'fallback',
    message: 'Local agent engine will handle request.',
  });
});

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CareAI Server is actively running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start CareAI server:', err);
});
