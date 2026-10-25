import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import các trang từ thư mục pages chính
import Home from './pages/Home';
import ReceiptScanner from './pages/ReceiptScanner';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';

// Import trang Admin từ thư mục con pagesAdmin
import AdminDashboard from './pages/pagesAdmin/AdminDashboard';

// Import component bảo vệ route
import AdminRoute from './components/AdminRoute';

export default function App() {
    return (
        <Router>
            <Routes>
                {/* Trang chủ */}
                <Route path="/" element={<Home />} />

                {/* Quét hóa đơn */}
                <Route path="/scanner" element={<ReceiptScanner />} />

                {/* Xác thực người dùng */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* TRANG QUẢN TRỊ ADMIN (Chỉ tài khoản có role = 1 mới truy cập được) */}
                <Route
                    path="/admin/*"
                    element={
                        <AdminRoute>
                            <AdminDashboard />
                        </AdminRoute>
                    }
                />

                {/* Đường dẫn sau khi login chuyển sang scanner (hoặc tùy chỉnh chuyển sang /admin nếu là admin) */}
                <Route path="/dashboard" element={<Navigate to="/scanner" replace />} />

                {/* Đường dẫn mặc định fallback về trang chủ */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}