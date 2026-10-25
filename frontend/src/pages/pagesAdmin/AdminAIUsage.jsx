import React, { useState } from "react";
import { ScanLine, ReceiptText, CheckCircle2, AlertTriangle, CalendarDays, ArrowUpRight, Download, Sparkles } from "lucide-react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js";
import "./AdminAIUsage.css";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const labels = ["17/10","18/10","19/10","20/10","21/10","22/10","23/10","24/10"];
const data = { labels, datasets: [
 { label:"Quét thành công", data:[184,220,197,265,244,301,287,326], borderColor:"#4bd6ad", backgroundColor:"rgba(75,214,173,.08)", tension:.4, fill:true, pointRadius:3 },
 { label:"Quét thất bại", data:[12,18,14,22,17,11,20,13], borderColor:"#f59ac2", backgroundColor:"rgba(245,154,194,.04)", tension:.4, fill:true, pointRadius:2 },
]};
const options = { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:"bottom", labels:{ color:"#9aa7c3", usePointStyle:true, boxWidth:7, padding:18, font:{size:10} } } }, scales:{ x:{ grid:{display:false}, ticks:{color:"#7583a2",font:{size:9}}, border:{display:false} }, y:{ grid:{color:"rgba(148,163,184,.08)"}, ticks:{color:"#7583a2",font:{size:9}}, border:{display:false} } } };
const scans = [
 {id:"AI-83412", file:"hoa-don-sieu-thi.jpg", user:"Vũ Văn Gia Long", time:"24/10/2026 · 21:42", result:"Thành công", confidence:"98.4%"},
 {id:"AI-83411", file:"bill-coffee.png", user:"Nguyễn Văn Test", time:"24/10/2026 · 21:35", result:"Thành công", confidence:"96.1%"},
 {id:"AI-83410", file:"receipt-market.jpg", user:"Trần Minh Anh", time:"24/10/2026 · 21:29", result:"Thất bại", confidence:"—"},
 {id:"AI-83409", file:"supermarket-bill.jpg", user:"Lê Hoàng Nam", time:"24/10/2026 · 21:16", result:"Thành công", confidence:"97.2%"},
 {id:"AI-83408", file:"food-receipt.png", user:"Phạm Thu Hà", time:"24/10/2026 · 20:58", result:"Thành công", confidence:"95.7%"},
];

export default function AdminAIUsage() {
 const [period,setPeriod] = useState("7 ngày gần nhất");
 return <section className="fa-ai-page">
  <div className="fa-ai-page-heading"><div><div className="fa-ai-eyebrow">AI RECEIPT INTELLIGENCE</div><h1>Hoạt động <span>AI Scanner</span></h1><p>Theo dõi số lượng hóa đơn được quét và hiệu suất xử lý AI.</p></div><div className="fa-ai-date-chip"><CalendarDays size={15}/><select value={period} onChange={e=>setPeriod(e.target.value)}><option>7 ngày gần nhất</option><option>30 ngày gần nhất</option><option>90 ngày gần nhất</option></select></div></div>
  <div className="fa-ai-stats">
   <article><div className="fa-ai-stat-icon purple"><ScanLine size={19}/></div><span>Tổng lượt quét</span><strong>18,392</strong><small><ArrowUpRight size={13}/> +18.6% so với kỳ trước</small></article>
   <article><div className="fa-ai-stat-icon green"><CheckCircle2 size={19}/></div><span>Quét thành công</span><strong>17,804</strong><small>96.8% tỷ lệ thành công</small></article>
   <article><div className="fa-ai-stat-icon pink"><AlertTriangle size={19}/></div><span>Quét thất bại</span><strong>588</strong><small>3.2% tổng lượt quét</small></article>
   <article><div className="fa-ai-stat-icon blue"><ReceiptText size={19}/></div><span>Hôm nay</span><strong>326</strong><small><i/> Lượt quét ghi nhận</small></article>
  </div>
  <div className="fa-ai-chart-panel"><div className="fa-ai-panel-head"><div><div className="fa-ai-kicker">SCANNING PERFORMANCE</div><h3>Lưu lượng quét hóa đơn</h3><p>So sánh lượt quét thành công và thất bại theo ngày.</p></div><div className="fa-ai-chart-badge"><Sparkles size={14}/> AI analytics</div></div><div className="fa-ai-chart"><Line data={data} options={options}/></div></div>
  <div className="fa-ai-table-panel"><div className="fa-ai-panel-head"><div><div className="fa-ai-kicker">RECENT SCANS</div><h3>Lịch sử hoạt động gần đây</h3><p>Danh sách minh họa các lượt quét gần nhất.</p></div><button className="fa-ai-export" onClick={()=>window.alert("Chức năng xuất báo cáo sẽ được kết nối sau.")}><Download size={14}/> Xuất báo cáo</button></div>
   <div className="fa-ai-table-wrap"><table className="fa-ai-table"><thead><tr><th>MÃ LƯỢT QUÉT</th><th>TÊN TỆP</th><th>NGƯỜI DÙNG</th><th>THỜI GIAN</th><th>ĐỘ TIN CẬY</th><th>KẾT QUẢ</th></tr></thead><tbody>{scans.map(s=><tr key={s.id}><td><strong>{s.id}</strong></td><td><span className="fa-ai-file"><ReceiptText size={15}/>{s.file}</span></td><td>{s.user}</td><td>{s.time}</td><td>{s.confidence}</td><td><span className={`fa-ai-result ${s.result==="Thành công"?"success":"failed"}`}><i/>{s.result}</span></td></tr>)}</tbody></table></div>
  </div>
  <div className="fa-ai-disclaimer">DỮ LIỆU DEMO <span>·</span> Thống kê AI hiện là dữ liệu mẫu, chưa lấy từ dịch vụ quét hóa đơn thực tế.</div>
 </section>;
}
