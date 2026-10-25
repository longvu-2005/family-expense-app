import React, { useMemo, useState } from "react";
import { Search, SlidersHorizontal, UserPlus, ShieldCheck, UserRound, Pencil, Trash2, Crown, X, Check, Users, UserCheck, UserX } from "lucide-react";
import "./AdminUsers.css";

const initialUsers = [
  { id: 1, name: "VŨ VĂN GIA LONG", email: "vuvangialong02@gmail.com", role: 1, status: "Hoạt động", joined: "24/10/2026", plan: "Premium" },
  { id: 2, name: "Nguyễn Văn Test", email: "test_demo@gmail.com", role: 2, status: "Hoạt động", joined: "22/10/2026", plan: "Free" },
  { id: 3, name: "Trần Minh Anh", email: "minhanh@example.com", role: 2, status: "Hoạt động", joined: "21/10/2026", plan: "Premium" },
  { id: 4, name: "Lê Hoàng Nam", email: "nam.le@example.com", role: 2, status: "Chưa hoạt động", joined: "19/10/2026", plan: "Free" },
  { id: 5, name: "Phạm Thu Hà", email: "ha.pham@example.com", role: 2, status: "Hoạt động", joined: "17/10/2026", plan: "Free" },
  { id: 6, name: "Đỗ Quang Huy", email: "huy.do@example.com", role: 2, status: "Đã khóa", joined: "15/10/2026", plan: "Premium" },
];

export default function AdminUsers() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState("");

  const notify = (message) => { setToast(message); window.setTimeout(() => setToast(""), 2500); };
  const filtered = useMemo(() => users.filter((u) =>
    `${u.name} ${u.email} ${u.id}`.toLowerCase().includes(search.toLowerCase()) &&
    (roleFilter === "all" || String(u.role) === roleFilter) &&
    (statusFilter === "all" || u.status === statusFilter)
  ), [users, search, roleFilter, statusFilter]);

  const toggleRole = (id) => {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, role: u.role === 1 ? 2 : 1 } : u));
    notify("Đã cập nhật vai trò trong bản demo.");
  };
  const toggleStatus = (id) => {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, status: u.status === "Đã khóa" ? "Hoạt động" : "Đã khóa" } : u));
    notify("Đã cập nhật trạng thái trong bản demo.");
  };
  const deleteUser = (u) => {
    if (window.confirm(`Xóa tài khoản ${u.name} khỏi danh sách demo?`)) {
      setUsers((prev) => prev.filter((item) => item.id !== u.id));
      notify("Đã xóa khỏi danh sách demo.");
    }
  };
  const saveEdit = (event) => {
    event.preventDefault();
    setUsers((prev) => prev.map((u) => u.id === editing.id ? editing : u));
    setEditing(null);
    notify("Đã lưu chỉnh sửa trong bản demo.");
  };

  return <section className="fa-users-page">
    <div className="fa-users-heading"><div><div className="fa-users-eyebrow">ACCOUNT MANAGEMENT</div><h1>Quản lý <span>tài khoản</span></h1><p>Kiểm soát người dùng, vai trò và trạng thái truy cập hệ thống.</p></div><button className="fa-users-primary" onClick={() => { setEditing({ id: Math.max(0, ...users.map(u => u.id)) + 1, name: "", email: "", role: 2, status: "Hoạt động", joined: new Date().toLocaleDateString("vi-VN"), plan: "Free" }); }}><UserPlus size={16} /> Thêm tài khoản demo</button></div>
    <div className="fa-users-metrics">
      <div><span className="fa-users-metric-icon violet"><Users size={18}/></span><span>Tổng tài khoản</span><strong>{users.length.toLocaleString("vi-VN")}</strong></div>
      <div><span className="fa-users-metric-icon green"><UserCheck size={18}/></span><span>Đang hoạt động</span><strong>{users.filter(u => u.status === "Hoạt động").length}</strong></div>
      <div><span className="fa-users-metric-icon pink"><ShieldCheck size={18}/></span><span>Quản trị viên</span><strong>{users.filter(u => u.role === 1).length}</strong></div>
      <div><span className="fa-users-metric-icon blue"><UserX size={18}/></span><span>Đã khóa</span><strong>{users.filter(u => u.status === "Đã khóa").length}</strong></div>
    </div>
    <div className="fa-users-panel">
      <div className="fa-users-panel-heading"><div><div className="fa-users-kicker">USER DIRECTORY</div><h3>Danh sách tài khoản</h3><p>Dữ liệu minh họa — thao tác chưa cập nhật lên server.</p></div><span className="fa-users-count">{filtered.length} kết quả</span></div>
      <div className="fa-users-toolbar"><label className="fa-users-search"><Search size={16}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm theo tên, email hoặc ID..." /></label><label className="fa-users-filter"><SlidersHorizontal size={15}/><select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}><option value="all">Tất cả vai trò</option><option value="1">Admin</option><option value="2">User</option></select></label><label className="fa-users-filter"><select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}><option value="all">Tất cả trạng thái</option><option>Hoạt động</option><option>Chưa hoạt động</option><option>Đã khóa</option></select></label></div>
      <div className="fa-users-table-wrap"><table className="fa-users-table"><thead><tr><th>TÀI KHOẢN</th><th>VAI TRÒ</th><th>GÓI</th><th>TRẠNG THÁI</th><th>NGÀY TẠO</th><th>THAO TÁC</th></tr></thead><tbody>
        {filtered.map(u => <tr key={u.id}><td><div className="fa-users-identity"><div className="fa-users-avatar">{u.name.split(" ").slice(-2).map(x => x[0]).join("").slice(-2)}</div><div><strong>{u.name || "Chưa có tên"}</strong><span>{u.email}</span><small>ID #{u.id}</small></div></div></td><td><span className={`fa-users-role ${u.role === 1 ? "admin" : ""}`}>{u.role === 1 ? <><ShieldCheck size={12}/> Admin</> : <><UserRound size={12}/> User</>}</span></td><td><span className={`fa-users-plan ${u.plan === "Premium" ? "premium" : ""}`}>{u.plan === "Premium" ? <Crown size={12}/> : null}{u.plan}</span></td><td><span className={`fa-users-status ${u.status === "Hoạt động" ? "active" : u.status === "Đã khóa" ? "locked" : "idle"}`}><i/>{u.status}</span></td><td>{u.joined}</td><td><div className="fa-users-actions"><button title="Chỉnh sửa" onClick={() => setEditing({...u})}><Pencil size={14}/></button><button title={u.role === 1 ? "Hạ quyền User" : "Nâng quyền Admin"} onClick={() => toggleRole(u.id)}><ShieldCheck size={14}/></button><button title={u.status === "Đã khóa" ? "Mở khóa" : "Khóa tài khoản"} onClick={() => toggleStatus(u.id)}><UserX size={14}/></button><button className="danger" title="Xóa demo" onClick={() => deleteUser(u)}><Trash2 size={14}/></button></div></td></tr>)}
        {filtered.length === 0 && <tr><td colSpan="6" className="fa-users-empty">Không tìm thấy tài khoản phù hợp.</td></tr>}
      </tbody></table></div>
      <div className="fa-users-table-footer"><span>Hiển thị <strong>{filtered.length}</strong> / {users.length} tài khoản</span><span>Trang 1 / 1 <button disabled>←</button><button disabled>→</button></span></div>
    </div>
    <div className="fa-users-disclaimer">LƯU Ý <span>·</span> Các thao tác sửa, xóa, khóa và đổi vai trò chỉ thay đổi dữ liệu mẫu trên giao diện.</div>
    {editing && <div className="fa-users-modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setEditing(null); }}><form className="fa-users-modal" onSubmit={saveEdit}><div className="fa-users-modal-head"><div><div className="fa-users-kicker">ACCOUNT DETAILS</div><h3>{users.some(u => u.id === editing.id) ? "Chỉnh sửa tài khoản" : "Tạo tài khoản demo"}</h3></div><button type="button" onClick={() => setEditing(null)}><X size={18}/></button></div><label>Họ và tên<input required value={editing.name} onChange={e => setEditing({...editing, name:e.target.value})} placeholder="Nhập họ và tên"/></label><label>Email<input required type="email" value={editing.email} onChange={e => setEditing({...editing, email:e.target.value})} placeholder="name@example.com"/></label><div className="fa-users-modal-row"><label>Vai trò<select value={editing.role} onChange={e => setEditing({...editing, role:Number(e.target.value)})}><option value={2}>User</option><option value={1}>Admin</option></select></label><label>Gói tài khoản<select value={editing.plan} onChange={e => setEditing({...editing, plan:e.target.value})}><option>Free</option><option>Premium</option></select></label></div><label>Trạng thái<select value={editing.status} onChange={e => setEditing({...editing, status:e.target.value})}><option>Hoạt động</option><option>Chưa hoạt động</option><option>Đã khóa</option></select></label><div className="fa-users-modal-actions"><button type="button" onClick={() => setEditing(null)}>Hủy</button><button type="submit"><Check size={15}/> Lưu thay đổi</button></div></form></div>}
    {toast && <div className="fa-users-toast"><Check size={16}/>{toast}</div>}
  </section>;
}
