import React from "react";
import { Users, UserCheck, UsersRound, ScanLine, ArrowUpRight, ArrowDownRight, MoreHorizontal, CalendarDays, Activity, Sparkles, ReceiptText } from "lucide-react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from "chart.js";
import "./AdminOverview.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const stats = [
  { label: "Tổng tài khoản", value: "2,840", trend: "+12.8%", note: "so với tháng trước", icon: Users, color: "purple", up: true },
  { label: "Tài khoản hoạt động", value: "2,164", trend: "+8.2%", note: "30 ngày gần nhất", icon: UserCheck, color: "green", up: true },
  { label: "Nhóm đang sử dụng", value: "684", trend: "+5.4%", note: "nhóm có hoạt động", icon: UsersRound, color: "blue", up: true },
  { label: "Hóa đơn AI đã quét", value: "18,392", trend: "+18.6%", note: "lượt quét tích lũy", icon: ScanLine, color: "pink", up: true },
];

const chartData = {
  labels: ["T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"],
  datasets: [
    { label: "Tài khoản mới", data: [120, 180, 165, 245, 220, 310, 355, 420], borderColor: "#9b8cff", backgroundColor: "rgba(155,140,255,.12)", fill: true, tension: .4, pointRadius: 3, pointBackgroundColor: "#b8aaff" },
    { label: "Tài khoản hoạt động", data: [640, 720, 790, 860, 950, 1080, 1190, 1320], borderColor: "#4bd6ad", backgroundColor: "rgba(75,214,173,.04)", fill: true, tension: .4, pointRadius: 2, pointBackgroundColor: "#4bd6ad" },
  ],
};

const chartOptions = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { position: "bottom", labels: { color: "#9aa7c3", usePointStyle: true, boxWidth: 7, boxHeight: 7, padding: 18, font: { size: 10 } } }, tooltip: { backgroundColor: "#111a30", borderColor: "rgba(148,163,184,.2)", borderWidth: 1, titleColor: "#fff", bodyColor: "#cbd5e1", padding: 10 } },
  scales: {
    x: { grid: { display: false }, ticks: { color: "#7583a2", font: { size: 9 } }, border: { display: false } },
    y: { grid: { color: "rgba(148,163,184,.08)" }, ticks: { color: "#7583a2", font: { size: 9 }, maxTicksLimit: 5 }, border: { display: false } },
  },
};

const recentUsers = [
  { initials: "GL", name: "Vũ Văn Gia Long", email: "vuvangialong02@gmail.com", role: "Admin", date: "24/10/2026", state: "Hoạt động" },
  { initials: "NT", name: "Nguyễn Văn Test", email: "test_demo@gmail.com", role: "User", date: "22/10/2026", state: "Hoạt động" },
  { initials: "MA", name: "Minh Anh", email: "minhanh@example.com", role: "User", date: "21/10/2026", state: "Chưa hoạt động" },
];

export default function AdminOverview() {
  const participation = 76.2;
  return (
    <section className="fa-overview">
      <div className="fa-overview-heading">
        <div><div className="fa-eyebrow"><span /> CONTROL CENTER</div><h1>Tổng quan <span>hệ thống</span></h1><p>Theo dõi tài khoản và mức độ sử dụng Family trong một giao diện.</p></div>
        <div className="fa-date-chip"><CalendarDays size={15} />  Tháng 10, 2026</div>
      </div>

      <div className="fa-welcome">
        <div><div className="fa-welcome-label"><Sparkles size={13} /> FAMILY ADMIN INTELLIGENCE</div><h2>Chào mừng trở lại, <span>Admin.</span></h2><p>Đây là bức tranh tổng thể về hoạt động của nền tảng hôm nay.</p></div>
        <div className="fa-welcome-orb"><Activity size={42} /></div>
        <div className="fa-welcome-decoration">FAMILY / 2026</div>
      </div>

      <div className="fa-overview-stats">
        {stats.map((item) => {
          const Icon = item.icon;
          return <article className="fa-overview-stat" key={item.label}>
            <div className="fa-stat-top"><div className={`fa-stat-icon ${item.color}`}><Icon size={19} /></div><button aria-label="Tùy chọn"><MoreHorizontal size={18} /></button></div>
            <div className="fa-stat-label">{item.label}</div><div className="fa-stat-value">{item.value}</div>
            <div className="fa-stat-foot"><span className="fa-stat-trend"><ArrowUpRight size={13} />{item.trend}</span><span>{item.note}</span></div>
          </article>;
        })}
      </div>

      <div className="fa-overview-grid">
        <article className="fa-overview-panel fa-growth-panel">
          <div className="fa-panel-head"><div><div className="fa-panel-kicker">USER ANALYTICS</div><h3>Tăng trưởng tài khoản</h3><p>Lượng tài khoản mới và tài khoản hoạt động theo tháng.</p></div><select defaultValue="8 tháng"><option>8 tháng</option><option>30 ngày</option><option>12 tháng</option></select></div>
          <div className="fa-overview-chart"><Line data={chartData} options={chartOptions} /></div>
        </article>

        <article className="fa-overview-panel fa-participation-panel">
          <div className="fa-panel-head"><div><div className="fa-panel-kicker">ENGAGEMENT</div><h3>Tỷ lệ tham gia</h3><p>Tài khoản có hoạt động trong 30 ngày.</p></div><Activity size={17} /></div>
          <div className="fa-participation-ring" style={{ "--participation": `${participation}%` }}><div><strong>{participation}%</strong><span>TỶ LỆ HOẠT ĐỘNG</span></div></div>
          <div className="fa-participation-legend"><span><i className="active" /> Đang hoạt động <strong>2,164</strong></span><span><i className="inactive" /> Chưa hoạt động <strong>676</strong></span></div>
          <div className="fa-participation-note"><ArrowUpRight size={14} /> Tăng 4.6% so với tháng trước</div>
        </article>
      </div>

      <div className="fa-overview-bottom-grid">
        <article className="fa-overview-panel fa-recent-panel">
          <div className="fa-panel-head"><div><div className="fa-panel-kicker">RECENT ACCOUNTS</div><h3>Tài khoản mới tham gia</h3></div><span className="fa-count-pill">3 gần đây</span></div>
          <div className="fa-recent-list">{recentUsers.map((user) => <div className="fa-recent-user" key={user.email}><div className="fa-user-avatar">{user.initials}</div><div className="fa-recent-user-copy"><strong>{user.name}</strong><span>{user.email}</span></div><span className={`fa-mini-role ${user.role === "Admin" ? "admin" : ""}`}>{user.role}</span><div className="fa-recent-date">{user.date}</div></div>)}</div>
        </article>
        <article className="fa-overview-panel fa-ai-summary">
          <div className="fa-panel-head"><div><div className="fa-panel-kicker">AI RECEIPT SCANNER</div><h3>Hoạt động AI</h3></div><div className="fa-ai-icon"><ReceiptText size={18} /></div></div>
          <div className="fa-ai-total">18,392 <span>lượt quét</span></div><div className="fa-ai-success"><span>Thành công</span><strong>96.8%</strong></div><div className="fa-ai-progress"><span style={{ width: "96.8%" }} /></div>
          <div className="fa-ai-meta"><span>Hôm nay <strong>246 lượt</strong></span><span><ArrowUpRight size={13} /> +18.6%</span></div>
          <div className="fa-ai-footnote">Số liệu minh họa cho giao diện, chưa kết nối dữ liệu backend.</div>
        </article>
      </div>
      <div className="fa-demo-disclaimer">DỮ LIỆU DEMO <span>·</span> Các chỉ số hiện là dữ liệu mẫu để hoàn thiện giao diện.</div>
    </section>
  );
}
