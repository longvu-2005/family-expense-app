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

// Import trang User từ thư mục con pagesUser
import UserHome from './pages/pagesUser/UserHome';
import ChatPage from './pages/pagesUser/ChatPage';

// Import component bảo vệ route
import AdminRoute from './components/AdminRoute';
import UserRoute from './components/UserRoute';

// Import Theme Context
import { ThemeProvider } from './context/ThemeContext';

export default function App() {
    return (
        <ThemeProvider>
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

                {/* TRANG CHAT & NHẮN TIN (Cả User và Admin đều dùng được) */}
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/user/chat" element={<ChatPage />} />

                {/* TRANG DÀNH CHO USER (Chỉ tài khoản có role = 2 mới truy cập được) */}
                <Route
                    path="/user"
                    element={
                        <UserRoute>
                            <UserHome />
                        </UserRoute>
                    }
                />
                <Route
                    path="/user/*"
                    element={
                        <UserRoute>
                            <UserHome />
                        </UserRoute>
                    }
                />

                {/* TRANG QUẢN TRỊ ADMIN (Chỉ tài khoản có role = 1 mới truy cập được) */}
                <Route
                    path="/admin/*"
                    element={
                        <AdminRoute>
                            <AdminDashboard />
                        </AdminRoute>
                    }
                />

                {/* Đường dẫn sau khi login chuyển sang user home */}
                <Route path="/dashboard" element={<Navigate to="/user" replace />} />

                {/* Đường dẫn mặc định fallback về trang chủ */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
        </ThemeProvider>
    );
}