const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

/**
 * =========================================================================
 * ROUTES TIN NHẮN & CHAT NHÓM (MESSAGE ROUTES)
 * Prefix tại server.js: /api/messages
 * =========================================================================
 */

// 1. Gửi tin nhắn mới (1-1 hoặc nhóm)
router.post('/', messageController.sendMessage);

// 2. Lấy danh sách liên hệ (User & Admin) kèm tin nhắn cuối
router.get('/contacts/:userId', messageController.getContacts);

// 3. Lấy danh sách nhóm của user
router.get('/groups/:userId', messageController.getUserGroups);

// 4. Tạo nhóm chat mới
router.post('/groups', messageController.createGroup);

// 5. Lấy lịch sử tin nhắn trong nhóm
router.get('/group/:groupId', messageController.getGroupMessages);

// 6. Lấy số lượng thông báo tin nhắn chưa đọc
router.get('/unread/:userId', messageController.getUnreadCount);

// 7. Lấy lịch sử tin nhắn 1-1 giữa 2 người dùng
router.get('/:user1/:user2', messageController.getMessages);

module.exports = router;
