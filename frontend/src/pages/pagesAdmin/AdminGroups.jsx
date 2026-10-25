import React, { useMemo, useState } from "react";
import { UsersRound, Search, Users, Activity, ShieldCheck, MoreHorizontal, ArrowUpRight } from "lucide-react";
import "./AdminGroups.css";

const demoGroups = [
  { id: "GR-1024", name: "Gia đình Long", owner: "Vũ Văn Gia Long", members: 4, activity: "Hôm nay", status: "Đang hoạt động" },
  { id: "GR-1023", name: "Nhà của Minh Anh", owner: "Trần Minh Anh", members: 3, activity: "Hôm nay", status: "Đang hoạt động" },
  { id: "GR-1022", name: "Gia đình Test", owner: "Nguyễn Văn Test", members: 2, activity: "Hôm qua", status: "Đang hoạt động" },
  { id: "GR-1021", name: "Nhóm bạn cùng nhà", owner: "Lê Hoàng Nam", members: 5, activity: "8 ngày trước", status: "Không hoạt động" },
  { id: "GR-1020", name: "Nhà nhỏ", owner: "Phạm Thu Hà", members: 3, activity: "Hôm nay", status: "Đang hoạt động" },
];

export default function AdminGroups() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [rows, setRows] = useState(demoGroups);
  const filtered = useMemo(() => rows.filter(g => `${g.name} ${g.owner} ${g.id}`.toLowerCase().includes(search.toLowerCase()) && (status === "all" || g.status === status)), [rows, search, status]);
  return <section className="fa-groups-page">
    <div className="fa-groups-heading"><div><div className="fa-groups-eyebrow">GROUP ACTIVITY</div><h1>Nhóm đang <span>sử dụng</span></h1><p>Theo dõi quy mô nhóm và mức độ hoạt động của người dùng trên nền tảng.</p></div><div className="fa-groups-total"><UsersRound size={16}/> {rows.length} nhóm mẫu</div></div>
    <div className="fa-groups-stats">
      <article><div className="fa-groups-stat-icon purple"><UsersRound size={19}/></div><span>Tổng số nhóm</span><strong>684</strong><small><ArrowUpRight size={13}/> +5.4% tháng này</small></article>
      <article><div className="fa-groups-stat-icon green"><Activity size={19}/></div><span>Nhóm đang hoạt động</span><strong>521</strong><small><i/> Có hoạt động gần đây</small></article>
      <article><div className="fa-groups-stat-icon blue"><Users size={19}/></div><span>Tổng thành viên</span><strong>2,164</strong><small>Trung bình 3.2 thành viên/nhóm</small></article>
      <article><div className="fa-groups-stat-icon pink"><ShieldCheck size={19}/></div><span>Nhóm không hoạt động</span><strong>163</strong><small>Trong 30 ngày gần nhất</small></article>
    </div>
    <div className="fa-groups-panel"><div className="fa-groups-panel-head"><div><div className="fa-groups-kicker">GROUP DIRECTORY</div><h3>Danh sách nhóm</h3><p>Thông tin minh họa cho giao diện quản trị.</p></div><span>{filtered.length} kết quả</span></div>
      <div className="fa-groups-toolbar"><label><Search size={15}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Tìm tên nhóm, người tạo, mã nhóm..."/></label><select value={status} onChange={e=>setStatus(e.target.value)}><option value="all">Tất cả trạng thái</option><option>Đang hoạt động</option><option>Không hoạt động</option></select></div>
      <div className="fa-groups-table-wrap"><table className="fa-groups-table"><thead><tr><th>NHÓM</th><th>NGƯỜI TẠO</th><th>THÀNH VIÊN</th><th>HOẠT ĐỘNG GẦN NHẤT</th><th>TRẠNG THÁI</th><th></th></tr></thead><tbody>{filtered.map(g=><tr key={g.id}><td><div className="fa-groups-name"><div>{g.name.split(" ").slice(0,2).map(x=>x[0]).join("")}</div><span><strong>{g.name}</strong><small>{g.id}</small></span></div></td><td>{g.owner}</td><td><span className="fa-groups-members"><Users size={13}/>{g.members} thành viên</span></td><td>{g.activity}</td><td><span className={`fa-groups-status ${g.status==="Đang hoạt động"?"active":"idle"}`}><i/>{g.status}</span></td><td><button className="fa-groups-more" title="Xem thông tin" onClick={()=>window.alert(`Nhóm: ${g.name}\nNgười tạo: ${g.owner}\nThành viên: ${g.members}\n\nThông tin demo, chưa kết nối API.`)}><MoreHorizontal size={17}/></button></td></tr>)}</tbody></table></div>
      {filtered.length===0 && <div className="fa-groups-empty">Không tìm thấy nhóm phù hợp.</div>}
      <div className="fa-groups-footnote">Lưu ý: Trang này chỉ theo dõi thông tin nhóm, không quản lý quỹ hoặc giao dịch của nhóm.</div>
    </div>
  </section>;
}
