const express = require('express');
const router = express.Router();
const { GoogleGenAI } = require('@google/genai');

/**
 * API Chat AI - Sử dụng model Gemini tiết kiệm token nhất (gemini-1.5-flash-8b)
 * Endpoint: POST /api/ai/chat
 * Body: { message: string }
 */
router.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || typeof message !== 'string' || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập nội dung tin nhắn!'
            });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        const isKeyConfigured = apiKey && apiKey !== 'API_Key_Gemini_Cua_Ban' && apiKey.trim().length > 10;

        // Nếu chưa cấu hình Key Gemini thật vào file .env
        if (!isKeyConfigured) {
            return res.json({
                success: true,
                reply: 'Xin chào! Tôi là trợ lý AI gia đình. Để tôi có thể trả lời trực tiếp bằng trí tuệ nhân tạo Gemini, bạn hãy nhập GEMINI_API_KEY vào file backend/.env nhé!'
            });
        }

        const ai = new GoogleGenAI({ apiKey: apiKey.trim() });

        // Dùng gemini-1.5-flash-8b: dòng model nhẹ nhất, nhanh nhất và tiêu tốn ít token nhất của Google
        let response;
        try {
            response = await ai.models.generateContent({
                model: 'gemini-1.5-flash-8b',
                contents: message.trim(),
                config: {
                    systemInstruction: 'Bạn là trợ lý ảo thông minh cho ứng dụng Quản lý Chi tiêu Gia đình (Family Management). Hãy trả lời bằng tiếng Việt cực kỳ ngắn gọn, súc tích (1 đến 3 câu), thân thiện và tiết kiệm token tối đa.',
                    maxOutputTokens: 250,
                    temperature: 0.7
                }
            });
        } catch (modelError) {
            // Dự phòng chuyển sang gemini-1.5-flash nếu model 8b gặp lỗi
            console.warn('Fallback sang gemini-1.5-flash:', modelError.message);
            response = await ai.models.generateContent({
                model: 'gemini-1.5-flash',
                contents: message.trim(),
                config: {
                    systemInstruction: 'Bạn là trợ lý ảo chi tiêu gia đình. Hãy trả lời ngắn gọn (1-3 câu), thân thiện và tiết kiệm token.',
                    maxOutputTokens: 250,
                    temperature: 0.7
                }
            });
        }

        return res.json({
            success: true,
            reply: response.text ? response.text.trim() : 'Tôi đã nhận được câu hỏi của bạn!'
        });

    } catch (error) {
        console.error('Lỗi gọi Gemini API:', error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi kết nối tới trợ lý AI: ' + (error.message || 'Không xác định')
        });
    }
});

module.exports = router;