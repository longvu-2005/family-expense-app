const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * ========================================================
 * DANH SÁCH API XÁC THỰC NGƯỜI DÙNG (AUTH ROUTES)
 * Prefix gốc tại server.js: /api/auth
 * ========================================================
 */
console.log('AUTH CONTROLLER:', {
    register: typeof authController.register,
    login: typeof authController.login,
    forgotPassword: typeof authController.forgotPassword,
    resetPassword: typeof authController.resetPassword,
    verifyOtp: typeof authController.verifyOtp,
    getMe: typeof authController.getMe,
    changePassword: typeof authController.changePassword,
});

console.log('AUTH MIDDLEWARE:', typeof authMiddleware);
// 1. Đăng ký tài khoản mới: POST /api/auth/register
router.post('/register', authController.register);

// 2. Đăng nhập: POST /api/auth/login
router.post('/login', authController.login);

// 3. Yêu cầu khôi phục mật khẩu (Quên mật khẩu): POST /api/auth/forgot-password
router.post('/forgot-password', authController.forgotPassword);

// 4. Đặt lại mật khẩu mới: POST /api/auth/reset-password
router.post('/reset-password', authController.resetPassword);

// 5. Lấy thông tin user hiện tại (Yêu cầu Token): GET /api/auth/me
router.get('/me', authMiddleware, authController.getMe);

// 6. Đổi mật khẩu khi đã đăng nhập (Yêu cầu Token): PUT /api/auth/change-password
router.put('/change-password', authMiddleware, authController.changePassword);
router.post('/verify-otp', authController.verifyOtp);

module.exports = router;
