const express = require('express');
const router = express.Router();
const multer = require('multer');
const receiptController = require('../controllers/receiptController');

// Cấu hình Multer lưu file tạm trong Memory (Buffer)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024 // Giới hạn 10MB
    }
});

// Tuyến đường quét hóa đơn (hỗ trợ cả /scan-receipt và /receipts/scan)
router.post('/scan-receipt', upload.single('receipt'), receiptController.scanReceipt);
router.post('/receipts/scan', upload.single('receipt'), receiptController.scanReceipt);

module.exports = router;
