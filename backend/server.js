const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { poolPromise } = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. Test route kiểm tra server và kết nối database
app.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;
        if (pool) {
            res.json({
                status: 'online',
                message: '🚀 Server và SQL Server (FamilyExpenseDB) đã kết nối thành công!',
                timestamp: new Date()
            });
        } else {
            res.json({
                status: 'warning',
                message: '⚠️ Server Node.js đang chạy, nhưng chưa kết nối được tới SQL Server.',
                tip: 'Kiểm tra SQL Server service và file .env (thử DB_SERVER=localhost\\SQLEXPRESS)'
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Lỗi kiểm tra Database: ' + err.message });
    }
});

// 2. Khai báo các đường dẫn API
const authRoutes = require('./routes/authRoutes');
const receiptRoutes = require('./routes/receiptRoutes');

app.use('/api/auth', authRoutes);
app.use('/api', receiptRoutes);

// 3. Xử lý 404 và Error Handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Đường dẫn API không tồn tại.' });
});

app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ: ' + err.message });
});

// 4. Khởi chạy Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🔥 Server đang chạy tại: http://localhost:${PORT}`);
});