import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Receipt,
    Sparkles,
    TrendingUp,
    PieChart,
    ShieldCheck,
    ArrowRight,
    ArrowUpRight,
    Lock,
    CheckCircle2,
    ScanLine,
    Users,
    Smartphone,
    Bell,
    ChevronRight,
    Menu,
    X,
    FileText,
    Check
} from 'lucide-react';

import './Home.css';
import MiniChatWidget from '../components/MiniChatWidget';

// Dữ liệu mẫu tương tác cho mục Demo Trợ lý AI
const SAMPLE_RECEIPTS = [
    {
        id: 'supermarket',
        tabName: '🛒 Siêu thị WinMart',
        store: 'Siêu thị WinMart+ (VinCommerce)',
        total: 450000,
        category: 'Thực phẩm & Tiêu dùng gia đình',
        date: '22/10/2026',
        items: ['Sữa tươi tiệt trùng Vinamilk 1L (x2)', 'Trứng gà Ba Huân hộp 10 quả', 'Gạo thơm ST25 túi 5kg', 'Rau củ sạch Đà Lạt'],
        timeTaken: '1.8 giây'
    },
    {
        id: 'coffee',
        tabName: '☕ Highlands Coffee',
        store: 'Highlands Coffee - Chi nhánh Landmark',
        total: 115000,
        category: 'Ăn uống & Cà phê',
        date: '22/10/2026',
        items: ['Phin Sữa Đá cỡ lớn (x1)', 'Trà sen vàng cỡ vừa (x1)', 'Bánh mì que pate giòn'],
        timeTaken: '1.4 giây'
    },
    {
        id: 'utility',
        tabName: '⚡ Hóa đơn Tiền Điện EVN',
        store: 'Tổng Công Ty Điện Lực EVN HCMC',
        total: 1200000,
        category: 'Hóa đơn & Dịch vụ sinh hoạt cố định',
        date: '20/10/2026',
        items: ['Tiền điện sinh hoạt kỳ 10/2026', 'Sản lượng tiêu thụ: 382 kWh', 'Thuế GTGT 8%'],
        timeTaken: '2.1 giây'
    }
];

export default function Home() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeDemoTab, setActiveDemoTab] = useState(SAMPLE_RECEIPTS[0]);

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">

            {/* Ambient Background Light Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl animate-pulse-glow" />
                <div className="absolute top-1/3 right-10 w-[30rem] h-[30rem] bg-purple-600/15 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-1/4 left-10 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl animate-float-delayed" />
            </div>

            {/* 1. HEADER / NAVIGATION */}
            <header className="sticky top-0 z-50 glass-nav border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    
                    {/* Brand Logo */}
                    <Link to="/" className="flex items-center space-x-3 group">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 border border-indigo-400/30 group-hover:scale-105 transition duration-200">
                            <Receipt size={22} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black bg-gradient-to-r from-indigo-200 via-white to-blue-300 bg-clip-text text-transparent tracking-tight">
                                FamilyExpense AI
                            </span>
                            <span className="text-[10px] text-indigo-400 font-medium uppercase tracking-wider -mt-0.5">
                                Quản Lý Chi Tiêu Gia Đình
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium text-slate-300">
                        <a href="#features" className="hover:text-indigo-400 transition-colors">Tính năng nổi bật</a>
                        <a href="#how-it-works" className="hover:text-indigo-400 transition-colors">Cách hoạt động</a>
                        <a href="#ai-demo" className="hover:text-indigo-400 transition-colors">Trải nghiệm AI</a>
                        <a href="#security" className="hover:text-indigo-400 transition-colors">Bảo mật</a>
                    </nav>

                    {/* Desktop Action Buttons */}
                    <div className="hidden sm:flex items-center space-x-3">
                        <Link
                            to="/scanner"
                            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-indigo-300 hover:text-white bg-indigo-500/10 hover:bg-indigo-500/20 rounded-xl border border-indigo-500/30 transition-all duration-200 hover:scale-105"
                        >
                            <Sparkles size={16} className="text-indigo-400" />
                            Quét hóa đơn AI
                        </Link>
                        <Link
                            to="/login"
                            className="px-4 py-2.5 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                        >
                            Đăng nhập
                        </Link>
                        <Link
                            to="/register"
                            className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl shadow-lg shadow-indigo-600/30 border border-indigo-400/30 transition-all duration-200 hover:scale-105"
                        >
                            Bắt đầu miễn phí
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle Button */}
                    <div className="sm:hidden flex items-center">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 border border-white/10"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Dropdown Menu */}
                {mobileMenuOpen && (
                    <div className="sm:hidden px-4 pt-3 pb-6 bg-slate-900/95 backdrop-blur-2xl border-b border-white/10 space-y-3">
                        <a
                            href="#features"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white"
                        >
                            Tính năng nổi bật
                        </a>
                        <a
                            href="#how-it-works"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white"
                        >
                            Cách hoạt động
                        </a>
                        <a
                            href="#ai-demo"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white"
                        >
                            Trải nghiệm AI
                        </a>
                        <a
                            href="#security"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white"
                        >
                            Bảo mật
                        </a>
                        <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
                            <Link
                                to="/scanner"
                                onClick={() => setMobileMenuOpen(false)}
                                className="w-full py-2.5 text-center font-semibold text-indigo-300 bg-indigo-500/10 rounded-xl border border-indigo-500/30 flex items-center justify-center gap-2"
                            >
                                <Sparkles size={16} /> Quét hóa đơn AI
                            </Link>
                            <Link
                                to="/login"
                                onClick={() => setMobileMenuOpen(false)}
                                className="w-full py-2.5 text-center font-semibold text-slate-200 bg-white/5 rounded-xl border border-white/10"
                            >
                                Đăng nhập
                            </Link>
                            <Link
                                to="/register"
                                onClick={() => setMobileMenuOpen(false)}
                                className="w-full py-2.5 text-center font-semibold text-white bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/30"
                            >
                                Bắt đầu miễn phí
                            </Link>
                        </div>
                    </div>
                )}
            </header>

            {/* 2. HERO SECTION */}
            <section className="relative z-10 pt-16 sm:pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
                
                {/* Version & AI Announcement Pill */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 backdrop-blur-xl mb-8 transition-transform hover:scale-105">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs sm:text-sm font-semibold text-indigo-300">
                        ✨ Thế hệ mới: Gemini 2.5 Flash AI • Bóc tách tự động hóa đơn trong 2s
                    </span>
                    <ChevronRight size={14} className="text-indigo-400" />
                </div>

                {/* Big Impact Headline */}
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.15] max-w-5xl mx-auto">
                    Quản Lý Tài Chính Gia Đình <br className="hidden sm:inline" />
                    <span className="bg-gradient-to-r from-indigo-300 via-indigo-200 to-purple-400 bg-clip-text text-transparent">
                        Thông Minh Bằng Trí Tuệ Nhân Tạo
                    </span>
                </h1>

                {/* Subtitle / Value Proposition */}
                <p className="mt-6 sm:mt-8 text-base sm:text-xl text-slate-400 max-w-3xl mx-auto font-normal leading-relaxed">
                    Tạm biệt ghi chép sổ sách thủ công hay nhập Excel phức tạp. Chỉ cần một bức ảnh chụp hóa đơn, 
                    AI tự động đọc số tiền, phân loại danh mục và đồng bộ chi tiêu cho cả gia đình trong tích tắc.
                </p>

                {/* CTA Action Buttons */}
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        to="/register"
                        className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-base rounded-2xl shadow-xl shadow-indigo-600/30 border border-indigo-400/30 transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
                    >
                        Bắt đầu dùng thử miễn phí
                        <ArrowRight size={18} />
                    </Link>

                    <Link
                        to="/scanner"
                        className="w-full sm:w-auto px-8 py-4 bg-slate-900/80 hover:bg-slate-800 text-indigo-300 hover:text-white font-semibold text-base rounded-2xl border border-indigo-500/30 backdrop-blur-xl transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
                    >
                        <Sparkles size={18} className="text-indigo-400" />
                        Trải nghiệm Quét Hóa Đơn AI
                    </Link>
                </div>

                {/* Trust & Key Metrics */}
                <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-white/5">
                    <div className="p-3">
                        <p className="text-2xl sm:text-3xl font-black text-white">99.8%</p>
                        <p className="text-xs sm:text-sm text-slate-400 mt-1">Độ chính xác bóc tách OCR</p>
                    </div>
                    <div className="p-3">
                        <p className="text-2xl sm:text-3xl font-black text-indigo-400">&lt; 2 Giây</p>
                        <p className="text-xs sm:text-sm text-slate-400 mt-1">Thời gian đọc hóa đơn bằng AI</p>
                    </div>
                    <div className="p-3">
                        <p className="text-2xl sm:text-3xl font-black text-white">100%</p>
                        <p className="text-xs sm:text-sm text-slate-400 mt-1">Đồng bộ cả gia đình Realtime</p>
                    </div>
                    <div className="p-3">
                        <p className="text-2xl sm:text-3xl font-black text-emerald-400">AES-256</p>
                        <p className="text-xs sm:text-sm text-slate-400 mt-1">Bảo mật chuẩn mã hóa cao cấp</p>
                    </div>
                </div>

                {/* 3. HERO PRODUCT SHOWCASE MOCKUP (MINH HỌA GIAO DIỆN SẢN PHẨM TRỰC QUAN) */}
                <div className="mt-16 relative max-w-5xl mx-auto">
                    {/* Glowing Aura Behind Mockup */}
                    <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 via-purple-600 to-blue-500 rounded-3xl blur-2xl opacity-30 animate-pulse-glow" />

                    {/* Window Container */}
                    <div className="relative rounded-3xl border border-white/15 bg-slate-900/90 backdrop-blur-2xl shadow-2xl overflow-hidden p-4 sm:p-8">
                        
                        {/* Mock Window Header Bar */}
                        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                            <div className="flex items-center space-x-2">
                                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                                <span className="text-xs text-slate-400 ml-3 font-mono hidden sm:inline">
                                    family-expense-ai // Live Dashboard Preview
                                </span>
                            </div>
                            <div className="flex items-center space-x-2 text-xs">
                                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                                    AI Engine Đang Sẵn Sàng
                                </span>
                            </div>
                        </div>

                        {/* Showcase Grid: Left (Receipt Scanning Laser) & Right (Extracted Structured Data) */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left items-center">
                            
                            {/* Left Side: Simulated Receipt with Laser Scan */}
                            <div className="lg:col-span-5 bg-slate-950/80 rounded-2xl border border-white/10 p-5 relative overflow-hidden shadow-inner">
                                <div className="flex items-center justify-between text-xs text-slate-400 mb-3 border-b border-white/5 pb-2">
                                    <span className="flex items-center gap-1.5 font-semibold text-indigo-300">
                                        <ScanLine size={16} /> Ảnh hóa đơn đầu vào
                                    </span>
                                    <span className="text-emerald-400 font-mono text-[10px]">Đang quét OCR</span>
                                </div>

                                {/* Bill Preview with Animated Laser Line */}
                                <div className="relative bg-white text-slate-800 p-4 rounded-xl font-mono text-[11px] leading-relaxed shadow-lg overflow-hidden">
                                    {/* Laser scan line effect */}
                                    <div className="animate-scan-line" />

                                    <div className="text-center border-b border-dashed border-slate-300 pb-2 mb-2">
                                        <p className="font-bold text-sm tracking-wider">SIÊU THỊ WINMART+</p>
                                        <p className="text-[9px] text-slate-500">Hóa Đơn Bán Lẻ • 22/10/2026</p>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between">
                                            <span>1. Sữa tươi Vinamilk 1L</span>
                                            <span className="font-semibold">78.000 đ</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>2. Trứng gà sạch 10Q</span>
                                            <span className="font-semibold">36.000 đ</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>3. Gạo thơm ST25 5kg</span>
                                            <span className="font-semibold">195.000 đ</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>4. Rau củ quả tổng hợp</span>
                                            <span className="font-semibold">141.000 đ</span>
                                        </div>
                                    </div>
                                    <div className="mt-3 pt-2 border-t border-dashed border-slate-300 flex justify-between font-bold text-xs text-indigo-900">
                                        <span>TỔNG CỘNG:</span>
                                        <span>450.000 đ</span>
                                    </div>
                                </div>

                                <p className="text-[11px] text-slate-400 text-center mt-3">
                                    ⚡ Gemini AI tự nhận diện bố cục hóa đơn không cần cắt xén
                                </p>
                            </div>

                            {/* Middle Arrow Connector (Desktop) */}
                            <div className="lg:col-span-1 hidden lg:flex items-center justify-center">
                                <div className="w-10 h-10 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400 animate-pulse">
                                    <ArrowRight size={20} />
                                </div>
                            </div>

                            {/* Right Side: Structured AI Results & Family Fund Sync */}
                            <div className="lg:col-span-6 space-y-4">
                                <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-purple-950/40 border border-indigo-500/30">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                                            <CheckCircle2 size={16} /> AI bóc tách tức thì
                                        </span>
                                        <span className="text-[11px] text-slate-400 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
                                            Hoàn tất trong 1.8s
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                            <span className="text-[11px] text-slate-400 block">Cửa hàng</span>
                                            <strong className="text-white">Siêu thị WinMart+</strong>
                                        </div>
                                        <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                            <span className="text-[11px] text-slate-400 block">Tổng tiền</span>
                                            <strong className="text-indigo-300 text-base font-black">450.000 đ</strong>
                                        </div>
                                        <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                            <span className="text-[11px] text-slate-400 block">Danh mục</span>
                                            <strong className="text-emerald-400">Thực phẩm & Đi chợ</strong>
                                        </div>
                                        <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                            <span className="text-[11px] text-slate-400 block">Ngày ghi nhận</span>
                                            <strong className="text-slate-300">22/10/2026</strong>
                                        </div>
                                    </div>
                                </div>

                                {/* Sync Status Card */}
                                <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                                            <Users size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-white">Đã tự động cộng vào Quỹ Gia Đình</p>
                                            <p className="text-[11px] text-slate-400">Tất cả thành viên trong nhà đều nhận thông báo realtime</p>
                                        </div>
                                    </div>
                                    <Link
                                        to="/scanner"
                                        className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 shrink-0 ml-2"
                                    >
                                        Thử ngay <ArrowUpRight size={14} />
                                    </Link>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </section>

            {/* 4. HIGH-TECH GLOWING MARQUEE TICKER (DÒNG CHỮ CHẠY CÔNG NGHỆ) */}
            <div className="relative z-20 py-4 bg-slate-900/60 border-y border-indigo-500/20 backdrop-blur-md overflow-hidden">
                <div className="animate-ticker space-x-8 text-xs font-mono uppercase tracking-widest text-indigo-200">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                        <Sparkles size={14} className="text-indigo-400" /> Bóc tách hóa đơn tự động bằng Gemini AI
                    </span>
                    <span className="text-indigo-500">•</span>
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
                        <Users size={14} className="text-purple-400" /> Đồng bộ ngân sách cả gia đình realtime
                    </span>
                    <span className="text-indigo-500">•</span>
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <TrendingUp size={14} className="text-emerald-400" /> Báo cáo trực quan & Biểu đồ chi tiêu thông minh
                    </span>
                    <span className="text-indigo-500">•</span>
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                        <ShieldCheck size={14} className="text-blue-400" /> Bảo mật an toàn chuẩn End-to-End
                    </span>
                    <span className="text-indigo-500">•</span>
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                        <Bell size={14} className="text-amber-400" /> Cảnh báo vượt hạn mức tháng tức thời
                    </span>
                    <span className="text-indigo-500">•</span>

                    {/* Duplicate list for smooth seamless loop */}
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                        <Sparkles size={14} className="text-indigo-400" /> Bóc tách hóa đơn tự động bằng Gemini AI
                    </span>
                    <span className="text-indigo-500">•</span>
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
                        <Users size={14} className="text-purple-400" /> Đồng bộ ngân sách cả gia đình realtime
                    </span>
                    <span className="text-indigo-500">•</span>
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <TrendingUp size={14} className="text-emerald-400" /> Báo cáo trực quan & Biểu đồ chi tiêu thông minh
                    </span>
                    <span className="text-indigo-500">•</span>
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                        <ShieldCheck size={14} className="text-blue-400" /> Bảo mật an toàn chuẩn End-to-End
                    </span>
                    <span className="text-indigo-500">•</span>
                </div>
            </div>

            {/* 5. CORE FEATURES SECTION (TÍNH NĂNG VƯỢT TRỘI) */}
            <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                        Tính năng thế hệ mới
                    </span>
                    <h2 className="text-3xl sm:text-5xl font-black mt-4 tracking-tight">
                        Mọi Công Cụ Bạn Cần Để <br />
                        <span className="bg-gradient-to-r from-indigo-300 to-purple-400 bg-clip-text text-transparent">
                            Làm Chủ Tài Chính Gia Đình
                        </span>
                    </h2>
                    <p className="mt-4 text-slate-400 text-base sm:text-lg">
                        Không còn rắc rối về các khoản chi tiêu thất lạc, ai chi bao nhiêu tiền và quỹ gia đình còn lại bao nhiêu.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    
                    {/* Feature 1 */}
                    <div className="glass-card glass-card-hover p-8 rounded-3xl border border-white/10 space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
                            <Sparkles size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white">Quét Hóa Đơn AI Đỉnh Cao</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Ứng dụng mô hình Gemini 2.5 Flash đa phương thức, nhận diện chính xác từng dòng chữ, số tiền và tên cửa hàng từ ảnh chụp bất kỳ.
                        </p>
                        <div className="pt-2 text-xs font-semibold text-indigo-400 flex items-center gap-1">
                            Hỗ trợ mọi loại hóa đơn <ChevronRight size={14} />
                        </div>
                    </div>

                    {/* Feature 2 */}
                    <div className="glass-card glass-card-hover p-8 rounded-3xl border border-white/10 space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 text-purple-400 flex items-center justify-center">
                            <Users size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white">Quỹ Gia Đình Đa Thành Viên</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Phân quyền khoa học giữa Admin (chủ gia đình) và các thành viên. Mọi người đều có thể đóng góp và kiểm tra ngân sách chung minh bạch.
                        </p>
                        <div className="pt-2 text-xs font-semibold text-purple-400 flex items-center gap-1">
                            Phân quyền vai trò chi tiết <ChevronRight size={14} />
                        </div>
                    </div>

                    {/* Feature 3 */}
                    <div className="glass-card glass-card-hover p-8 rounded-3xl border border-white/10 space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                            <PieChart size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white">Biểu Đồ Trực Quan 360°</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Trực quan hóa cơ cấu chi tiêu thành biểu đồ tròn, biểu đồ cột dễ hiểu. Biết ngay tháng này đang chi nhiều cho ăn uống, mua sắm hay tiền điện.
                        </p>
                        <div className="pt-2 text-xs font-semibold text-emerald-400 flex items-center gap-1">
                            Báo cáo theo tuần, tháng & năm <ChevronRight size={14} />
                        </div>
                    </div>

                    {/* Feature 4 */}
                    <div className="glass-card glass-card-hover p-8 rounded-3xl border border-white/10 space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-600/20 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                            <Bell size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white">Cảnh Báo Vượt Hạn Mức</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Tự động gửi cảnh báo khi một danh mục chi tiêu chạm mốc 80% ngân sách kế hoạch, giúp gia đình chủ động điều chỉnh chi tiêu kịp thời.
                        </p>
                        <div className="pt-2 text-xs font-semibold text-amber-400 flex items-center gap-1">
                            Kiểm soát rủi ro bội chi <ChevronRight size={14} />
                        </div>
                    </div>

                    {/* Feature 5 */}
                    <div className="glass-card glass-card-hover p-8 rounded-3xl border border-white/10 space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                            <ShieldCheck size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white">Bảo Mật Cấp Ngân Hàng</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Dữ liệu tài chính được mã hóa End-to-End, xác thực bảo mật với JWT và cam kết bảo vệ tuyệt đối thông tin riêng tư của gia đình bạn.
                        </p>
                        <div className="pt-2 text-xs font-semibold text-blue-400 flex items-center gap-1">
                            An tâm tuyệt đối về dữ liệu <ChevronRight size={14} />
                        </div>
                    </div>

                    {/* Feature 6 */}
                    <div className="glass-card glass-card-hover p-8 rounded-3xl border border-white/10 space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-rose-600/20 border border-rose-500/30 text-rose-400 flex items-center justify-center">
                            <Smartphone size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white">Mượt Mà Mọi Thiết Bị</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Thiết kế Responsive hoàn hảo trên iPhone, Android, iPad và Máy tính bàn. Quét hóa đơn ngay tại siêu thị chỉ với vài chạm trên điện thoại.
                        </p>
                        <div className="pt-2 text-xs font-semibold text-rose-400 flex items-center gap-1">
                            Tối ưu tốc độ tải siêu tốc <ChevronRight size={14} />
                        </div>
                    </div>

                </div>
            </section>

            {/* 6. HOW IT WORKS SECTION (3 BƯỚC ĐƠN GIẢN) */}
            <section id="how-it-works" className="py-20 bg-slate-900/40 border-y border-white/5 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                            Quy trình đơn giản
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black mt-4 tracking-tight">
                            Bắt Đầu Quản Lý Chi Tiêu Trong 3 Bước
                        </h2>
                        <p className="mt-3 text-slate-400">
                            Không cần cài đặt phức tạp, gia đình bạn có thể bắt đầu sử dụng chỉ sau chưa đầy 1 phút.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Step 1 */}
                        <div className="bg-slate-900/80 p-8 rounded-3xl border border-white/10 relative">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black text-xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-600/40">
                                1
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Đăng Ký & Tạo Quỹ</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Tạo tài khoản miễn phí và thiết lập quỹ chi tiêu gia đình. Mời người thân cùng tham gia theo dõi.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="bg-slate-900/80 p-8 rounded-3xl border border-indigo-500/30 relative shadow-xl shadow-indigo-500/5">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-black text-xl flex items-center justify-center mb-6 shadow-lg shadow-purple-600/40">
                                2
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Chụp & Quét Hóa Đơn</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Chụp bất kỳ hóa đơn mua sắm nào. AI tự động đọc và trích xuất số tiền, tên quán và danh mục mà không cần gõ phím.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="bg-slate-900/80 p-8 rounded-3xl border border-white/10 relative">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black text-xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-600/40">
                                3
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Tận Hưởng Tài Chính Minh Bạch</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Theo dõi báo cáo chi tiêu thời gian thực, nhận đề xuất tiết kiệm và luôn an tâm về quỹ dự phòng gia đình.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. INTERACTIVE AI DEMO PREVIEW (MỤC TRẢI NGHIỆM AI TƯƠNG TÁC) */}
            <section id="ai-demo" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                        Thử nghiệm trực tiếp
                    </span>
                    <h2 className="text-3xl sm:text-5xl font-black mt-4 tracking-tight">
                        Xem Trí Tuệ Nhân Tạo Xử Lý Hóa Đơn
                    </h2>
                    <p className="mt-3 text-slate-400 text-base sm:text-lg">
                        Bấm vào các mẫu hóa đơn thực tế bên dưới để khám phá khả năng bóc tách siêu việt:
                    </p>
                </div>

                {/* Tab Selectors */}
                <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
                    {SAMPLE_RECEIPTS.map((receipt) => (
                        <button
                            key={receipt.id}
                            onClick={() => setActiveDemoTab(receipt)}
                            className={`px-5 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
                                activeDemoTab.id === receipt.id
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/40 scale-105'
                                    : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-white/10'
                            }`}
                        >
                            {receipt.tabName}
                        </button>
                    ))}
                </div>

                {/* Active Receipt Preview Box */}
                <div className="max-w-4xl mx-auto bg-slate-900/80 backdrop-blur-2xl p-6 sm:p-10 rounded-3xl border border-indigo-500/30 shadow-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        
                        {/* Summary Info */}
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                                <Check size={14} /> AI Trích xuất thành công trong {activeDemoTab.timeTaken}
                            </div>
                            <h3 className="text-2xl font-black text-white">{activeDemoTab.store}</h3>
                            
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                <span className="text-xs text-slate-400 block mb-1">Tổng tiền thanh toán</span>
                                <span className="text-3xl font-black text-indigo-400">
                                    {activeDemoTab.total.toLocaleString('vi-VN')} đ
                                </span>
                            </div>

                            <div className="space-y-2 text-sm text-slate-300">
                                <p className="flex justify-between py-1 border-b border-white/5">
                                    <span className="text-slate-400">Phân loại danh mục:</span>
                                    <span className="font-semibold text-white">{activeDemoTab.category}</span>
                                </p>
                                <p className="flex justify-between py-1 border-b border-white/5">
                                    <span className="text-slate-400">Ngày hóa đơn:</span>
                                    <span className="font-semibold text-white">{activeDemoTab.date}</span>
                                </p>
                            </div>
                        </div>

                        {/* Extracted Line Items */}
                        <div className="bg-slate-950/80 p-5 rounded-2xl border border-white/10 space-y-3">
                            <p className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                                <FileText size={14} /> Các món hàng được AI đọc chi tiết:
                            </p>
                            <ul className="space-y-2">
                                {activeDemoTab.items.map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-2 text-xs text-slate-200 bg-white/5 p-2.5 rounded-xl border border-white/5">
                                        <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="pt-4">
                                <Link
                                    to="/scanner"
                                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all duration-200"
                                >
                                    <Sparkles size={16} /> Thử quét hóa đơn thật của bạn ngay
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* 8. SECURITY & ENCRYPTION SECTION */}
            <section id="security" className="py-20 bg-slate-900/30 border-t border-white/5 relative z-10">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto">
                        <Lock size={28} />
                    </div>
                    <h2 className="text-3xl font-black text-white">An Toàn & Bảo Mật Dữ Liệu Tối Đa</h2>
                    <p className="text-slate-400 text-base max-w-2xl mx-auto">
                        Thông tin tài chính của gia đình bạn là điều tuyệt mật. Chúng tôi cam kết không chia sẻ dữ liệu cho bên thứ ba và áp dụng công nghệ mã hóa tiên tiến nhất.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4 pt-4 text-xs font-semibold text-slate-300">
                        <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                            <ShieldCheck size={16} className="text-emerald-400" /> Mã hóa dữ liệu End-to-End
                        </span>
                        <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                            <Lock size={16} className="text-indigo-400" /> Xác thực phân quyền JWT an toàn
                        </span>
                        <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-purple-400" /> Sao lưu dữ liệu đám mây định kỳ
                        </span>
                    </div>
                </div>
            </section>

            {/* 9. BOTTOM CALL TO ACTION BANNER */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
                <div className="relative rounded-3xl bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900/80 border border-indigo-500/30 p-8 sm:p-14 text-center overflow-hidden shadow-2xl">
                    <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="relative z-10 max-w-3xl mx-auto space-y-6">
                        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                            Bắt Đầu Quản Lý Chi Tiêu Cho Tổ Ấm Ngay Hôm Nay
                        </h2>
                        <p className="text-slate-300 text-base sm:text-lg">
                            Đăng ký hoàn toàn miễn phí • Không cần thẻ tín dụng • Sẵn sàng sử dụng trong 1 phút.
                        </p>
                        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to="/register"
                                className="w-full sm:w-auto px-8 py-4 bg-white text-indigo-950 hover:bg-slate-100 font-extrabold text-base rounded-2xl shadow-xl transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
                            >
                                Tạo tài khoản miễn phí <ArrowRight size={18} />
                            </Link>
                            <Link
                                to="/scanner"
                                className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/15 text-white font-semibold text-base rounded-2xl border border-white/20 backdrop-blur-xl transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
                            >
                                <Sparkles size={18} /> Quét thử hóa đơn ngay
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* 10. COMPREHENSIVE MODERN FOOTER (CHÂN TRANG ĐẦY ĐỦ) */}
            <footer className="border-t border-white/10 bg-slate-950/90 text-slate-400 relative z-10 pt-16 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
                        
                        {/* Col 1: Brand Info */}
                        <div className="lg:col-span-2 space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                                    <Receipt size={20} />
                                </div>
                                <span className="text-xl font-black text-white tracking-tight">
                                    FamilyExpense AI
                                </span>
                            </div>
                            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
                                Nền tảng quản lý tài chính gia đình thông minh thế hệ mới, tiên phong ứng dụng trí tuệ nhân tạo Gemini để tự động hóa bóc tách hóa đơn và kiểm soát ngân sách.
                            </p>
                            <div className="pt-2 flex items-center space-x-3 text-xs text-indigo-400 font-medium">
                                <span>Phát triển bởi Long Vũ</span>
                                <span>•</span>
                                <span>Phiên bản 2026</span>
                            </div>
                        </div>

                        {/* Col 2: Sản phẩm */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Sản Phẩm</h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <Link to="/scanner" className="hover:text-indigo-400 transition-colors">Quét hóa đơn AI</Link>
                                </li>
                                <li>
                                    <a href="#features" className="hover:text-indigo-400 transition-colors">Quỹ gia đình</a>
                                </li>
                                <li>
                                    <a href="#features" className="hover:text-indigo-400 transition-colors">Báo cáo thu chi</a>
                                </li>
                                <li>
                                    <a href="#features" className="hover:text-indigo-400 transition-colors">Cảnh báo hạn mức</a>
                                </li>
                            </ul>
                        </div>

                        {/* Col 3: Hướng dẫn & Trợ giúp */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Khám Phá</h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <a href="#how-it-works" className="hover:text-indigo-400 transition-colors">Cách thức hoạt động</a>
                                </li>
                                <li>
                                    <a href="#ai-demo" className="hover:text-indigo-400 transition-colors">Trải nghiệm OCR mẫu</a>
                                </li>
                                <li>
                                    <Link to="/login" className="hover:text-indigo-400 transition-colors">Đăng nhập tài khoản</Link>
                                </li>
                                <li>
                                    <Link to="/register" className="hover:text-indigo-400 transition-colors">Đăng ký mới</Link>
                                </li>
                            </ul>
                        </div>

                        {/* Col 4: Bảo mật & Pháp lý */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Pháp Lý & Bảo Mật</h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <a href="#security" className="hover:text-indigo-400 transition-colors">Chính sách bảo mật</a>
                                </li>
                                <li>
                                    <a href="#security" className="hover:text-indigo-400 transition-colors">Điều khoản dịch vụ</a>
                                </li>
                                <li>
                                    <a href="#security" className="hover:text-indigo-400 transition-colors">Tiêu chuẩn mã hóa</a>
                                </li>
                                <li>
                                    <span className="text-xs text-slate-500">API Gemini 2.5 Ready</span>
                                </li>
                            </ul>
                        </div>

                    </div>

                    {/* Bottom Copyright & System Status */}
                    <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
                        <p>© 2026 FamilyExpense AI. Nền tảng quản lý tài chính gia đình thông minh. All rights reserved.</p>
                        <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                            <span className="text-slate-400 font-medium">Hệ thống AI hoạt động ổn định 99.99%</span>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Trợ lý AI Mini Chat Widget (Nổi ở góc dưới màn hình) */}
            <MiniChatWidget />

        </div>
    );
}