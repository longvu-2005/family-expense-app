
import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const savedRole = localStorage.getItem('role');

    let userRole = savedRole;

    // Nếu chưa có role riêng, thử đọc từ thông tin user
    if (!userRole) {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            userRole = user.role;
        } catch (error) {
            userRole = null;
        }
    }

    // Chưa đăng nhập thì về trang Login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Chỉ role = 1 được vào Admin
    if (Number(userRole) !== 1) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminRoute;
