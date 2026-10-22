import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import các trang từ thư mục pages
import Home from './pages/Home';
import ReceiptScanner from './pages/ReceiptScanner';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';

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

                {/* Đường dẫn sau khi login chuyển sang scanner */}
                <Route path="/dashboard" element={<Navigate to="/scanner" replace />} />

                {/* Đường dẫn mặc định fallback về trang chủ */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}