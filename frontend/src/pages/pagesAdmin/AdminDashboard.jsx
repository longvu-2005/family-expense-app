import React, { useState } from "react";
import { NavLink, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, UsersRound, ScanLine, Gem, ShieldCheck,
  Bell, Search, Menu, X, ChevronRight, LogOut, Settings2, MessageSquare
} from "lucide-react";
import AdminOverview from "./AdminOverview";
import AdminUsers from "./AdminUsers";
import AdminGroups from "./AdminGroups";
import AdminAIUsage from "./AdminAIUsage";
import AdminPlans from "./AdminPlans";
import AdminChat from "./AdminChat";
import ThemeToggle from "../../components/ThemeToggle";
import "./AdminDashboard.css";

const menu = [
  { to: "overview", label: "Tổng quan", icon: LayoutDashboard },
  { to: "users", label: "Quản lý tài khoản", icon: Users },
  { to: "groups", label: "Nhóm đang sử dụng", icon: UsersRound },
  { to: "ai-usage", label: "Hoạt động AI", icon: ScanLine },
  { to: "plans", label: "Gói tài khoản", icon: Gem },
  { to: "chat", label: "Tin nhắn & Chat", icon: MessageSquare },
];

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const active = location.pathname.split("/")[2] || "overview";
  const activeMenu = menu.find((item) => item.to === active) || menu[0];

  const handleLogout = () => {
    // UI demo only. Connect this action to your real auth flow later.
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login", { replace: true });
  };

  return (
    <div className="family-admin-shell">
      {sidebarOpen && (
        <button className="family-admin-backdrop" aria-label="Đóng menu" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`family-admin-sidebar ${sidebarOpen ? "is-open" : ""}`}>
        <div className="family-admin-brand-row">
          <div className="family-admin-brand-mark"><ShieldCheck size={22} /></div>
          <div className="family-admin-brand-copy">
            <strong>family<span>.</span></strong>
            <small>EXPENSE MANAGEMENT</small>
          </div>
          <button className="family-admin-close" onClick={() => setSidebarOpen(false)} aria-label="Đóng sidebar"><X size={18} /></button>
        </div>

        <div className="family-admin-workspace">
          <div className="family-admin-workspace-icon">F</div>
          <div><strong>Family Workspace</strong><span><i /> Admin console</span></div>
          <span className="family-admin-workspace-dots">•••</span>
        </div>

        <div className="family-admin-nav-label">WORKSPACE</div>
        <nav className="family-admin-nav">
          {menu.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={`/admin/${to}`}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `family-admin-nav-item ${isActive ? "active" : ""}`}
            >
              <Icon size={17} strokeWidth={1.8} />
              <span>{label}</span>
              {active === to && <i className="family-admin-active-dot" />}
            </NavLink>
          ))}
        </nav>

        <div className="family-admin-sidebar-bottom">
          <div className="family-admin-sidebar-note">
            <div className="family-admin-sidebar-note-icon"><Gem size={16} /></div>
            <strong>Quản trị thông minh</strong>
            <p>Theo dõi người dùng và mức độ sử dụng nền tảng.</p>
            <span><i /> Giao diện bản xem trước</span>
          </div>
          <div className="family-admin-profile">
            <div className="family-admin-avatar">A</div>
            <div className="family-admin-profile-copy"><strong>System Admin</strong><span>Quản trị viên</span></div>
            <button title="Đăng xuất" aria-label="Đăng xuất" onClick={handleLogout}><LogOut size={16} /></button>
          </div>
        </div>
      </aside>

      <main className="family-admin-main">
        <header className="family-admin-topbar">
          <div className="family-admin-topbar-left">
            <button className="family-admin-menu-toggle" onClick={() => setSidebarOpen(true)} aria-label="Mở menu"><Menu size={19} /></button>
            <div className="family-admin-breadcrumb">Admin Console <ChevronRight size={13} /> <strong>{activeMenu.label}</strong></div>
          </div>
          <div className="family-admin-topbar-right">
            <ThemeToggle variant="switch" />
            <div className="family-admin-system-status"><i /> SYSTEM OPERATIONAL</div>
            <button className="family-admin-top-icon" aria-label="Tìm kiếm" onClick={() => navigate("/admin/users")}><Search size={17} /></button>
            <button className="family-admin-top-icon family-admin-bell" aria-label="Thông báo"><Bell size={17} /><i /></button>
            <div className="family-admin-top-divider" />
            <div className="family-admin-top-user"><div className="family-admin-avatar">A</div><div><strong>System Admin</strong><span>Administrator</span></div></div>
          </div>
        </header>

        <div className="family-admin-page-wrap">
          <Routes>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<AdminOverview />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="groups" element={<AdminGroups />} />
            <Route path="ai-usage" element={<AdminAIUsage />} />
            <Route path="plans" element={<AdminPlans />} />
            <Route path="chat" element={<AdminChat />} />
            <Route path="*" element={<Navigate to="overview" replace />} />
          </Routes>
          <footer className="family-admin-footer">
            <span>© 2026 Family Expense Management</span>
            <span><i /> Giao diện quản trị</span>
            <span>Admin Console · v1.0</span>
          </footer>
        </div>
      </main>
    </div>
  );
}
