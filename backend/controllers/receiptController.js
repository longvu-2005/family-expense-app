const { GoogleGenAI } = require('@google/genai');

exports.scanReceipt = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng tải lên ảnh hóa đơn (receipt).'
            });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        const isKeyConfigured = apiKey && apiKey !== 'API_Key_Gemini_Cua_Ban' && apiKey.trim().length > 10;

        let parsedData = null;

        if (isKeyConfigured) {
            try {
                const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
                const base64Image = req.file.buffer.toString('base64');

                const prompt = `Bạn là trợ lý AI chuyên bóc tách thông tin hóa đơn mua sắm bằng tiếng Việt.
Hãy phân tích hình ảnh hóa đơn này và trích xuất các thông tin sau.
Chỉ trả về DUY NHẤT một chuỗi JSON thuần túy (không kèm định dạng markdown như \`\`\`json hay \`\`\`), đúng cấu trúc:
{
  "store_name": "Tên siêu thị hoặc cửa hàng (VD: WinMart, Bách Hóa Xanh, Highlands Coffee,...)",
  "total_amount": 125000,
  "category": "Danh mục chi tiêu chính (chọn một trong: Ăn uống, Siêu thị & Tạp hóa, Mua sắm, Di chuyển, Hóa đơn điện nước, Y tế & Sức khỏe, Giáo dục, Khác)",
  "date": "YYYY-MM-DD"
}
Lưu ý: "total_amount" phải là một số nguyên (number), không chứa ký tự chữ hay dấu chấm/phẩy.`;

                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: [
                        {
                            role: 'user',
                            parts: [
                                { text: prompt },
                                {
                                    inlineData: {
                                        data: base64Image,
                                        mimeType: req.file.mimetype || 'image/jpeg'
                                    }
                                }
                            ]
                        }
                    ]
                });

                let responseText = response.text || '';
                // Xóa markdown code block nếu có
                responseText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
                parsedData = JSON.parse(responseText);
            } catch (aiError) {
                console.warn('⚠️ Lỗi khi gọi Gemini API:', aiError.message);
            }
        }

        // Nếu chưa cấu hình Key hoặc AI không khả dụng, trả về dữ liệu mẫu thực tế để frontend trải nghiệm mượt mà
        if (!parsedData) {
            console.log('ℹ️ Dùng dữ liệu bóc tách mẫu (Do chưa cấu hình GEMINI_API_KEY hợp lệ trong .env)');
            const today = new Date().toISOString().split('T')[0];
            parsedData = {
                store_name: 'WinMart+ (Dữ liệu thử nghiệm)',
                total_amount: 158000,
                category: 'Siêu thị & Tạp hóa',
                date: today,
                note: isKeyConfigured
                    ? 'AI gặp trục trặc, hệ thống trả về dữ liệu mẫu tạm thời.'
                    : 'Hãy điền GEMINI_API_KEY thật vào file backend/.env để AI bóc tách thực tế từ ảnh.'
            };
        }

        return res.json({
            success: true,
            data: parsedData
        });

    } catch (err) {
        console.error('Lỗi khi bóc tách hóa đơn:', err);
        return res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi quét hóa đơn: ' + err.message
        });
    }
};
