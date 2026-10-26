import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * UserRoute - Bảo vệ các route chỉ dành cho người dùng thông thường (role = 2)
 * Nếu chưa đăng nhập -> chuyển về /login
 * Nếu là Admin (role = 1) -> chuyển về /admin
 * Nếu là User (role = 2) -> cho phép truy cập
 */
export default function UserRoute({ children }) {
    const token = localStorage.getItem('token');
    const savedRole = localStorage.getItem('role');

    let userRole = savedRole;

    if (!userRole) {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            userRole = user.role ?? user.role_id;
        } catch {
            userRole = null;
        }
    }

    // Chưa đăng nhập -> chuyển hướng về Login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    const numRole = Number(userRole);

    // Nếu tài khoản là Admin (role = 1) -> chuyển sang trang quản trị Admin
    if (numRole === 1) {
        return <Navigate to="/admin" replace />;
    }

    // Cho phép role = 2 (User) truy cập
    if (numRole === 2) {
        return children;
    }

    // Nếu role không hợp lệ -> về Login
    return <Navigate to="/login" replace />;
}
