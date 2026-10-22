import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Receipt,
    Sparkles,
    ChevronLeft,
    ChevronRight,
    ArrowRight,
    PieChart,
    ShoppingCart,
    Zap,
    Camera,
    UploadCloud,
    X,
    Flame,
    ShieldCheck,
    ScanLine,
    Wand2,
    Users,
    CheckCircle2,
    TrendingUp,
    Lock,
    Award,
    Star,
    Mail,
    Phone,
    MapPin,
    ExternalLink,
    Cpu,
    BarChart3,
    Smartphone,
    Layers,
    BadgeCheck
} from 'lucide-react';
import './Home.css';

// Danh sách hình ảnh cho Carousel
const SLIDES = [
    {
        url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80",
        badge: "Công Nghệ AI Gemini",
        badgeColor: "bg-indigo-500/80",
        title: "Quét Hóa Đơn Tự Động Sống Động",
        desc: "Biến mọi hóa đơn giấy thành dữ liệu chi tiêu chuẩn xác tức thì."
    },
    {
        url: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1200&q=80",
        badge: "Quản Lý Ngân Sách",
        badgeColor: "bg-purple-500/80",
        title: "Quỹ Gia Đình Gắn Kết & Rõ Ràng",
        desc: "Đồng bộ chi tiêu giữa vợ chồng & thành viên trong gia đình."
    },
    {
        url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
        badge: "Phân Tích AI",
        badgeColor: "bg-emerald-500/80",
        title: "Báo Cáo Trực Quan & Tối Ưu",
        desc: "Dự báo dòng tiền và cảnh báo khi chi tiêu quá định mức."
    }
];

// Danh sách thông báo toast xoay vòng
const TOAST_MESSAGES = [
    { text: "✨ AI Gemini vừa quét thành công hóa đơn WinMart 450.000đ", time: "Vừa xong" },
    { text: "🎉 Gia đình Anh Minh vừa tham gia sử dụng FamilyExpense AI", time: "1 phút trước" },
    { text: "💡 Mẹo: AI tự nhận diện hóa đơn tiền điện & nước hàng tháng!", time: "3 phút trước" },
    { text: "📊 Ngân sách tháng 10 của bạn đã tiết kiệm được 15%", time: "5 phút trước" }
];

export default function Home() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isToastVisible, setIsToastVisible] = useState(true);
    const [toastIndex, setToastIndex] = useState(0);
    const [toastFading, setToastFading] = useState(false);
    const [isScanModalOpen, setIsScanModalOpen] = useState(false);
    const navigate = useNavigate();

    // Tự động chuyển Slide mỗi 4.5 giây
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
        }, 4500);
        return () => clearInterval(timer);
    }, []);

    // Tự động đổi nội dung Toast mỗi 5 giây
    useEffect(() => {
        const timer = setInterval(() => {
            setToastFading(true);
            setTimeout(() => {
                setToastIndex((prev) => (prev + 1) % TOAST_MESSAGES.length);
                setToastFading(false);
            }, 400);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);

    return (
        <div className="relative min-h-screen bg-slate-950 text-slate-100 font-sans overflow-x-hidden selection:bg-indigo-500 selection:text-white">

            {/* Glowing Background Ambient Spheres */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/25 rounded-full blur-3xl animate-pulse-glow"></div>
                <div className="absolute top-1/3 -right-20 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1.5s' }}></div>
                <div className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '3s' }}></div>
            </div>

            {/* MAIN WRAPPER */}
            <div className="relative z-10 flex flex-col justify-between">

                {/* ========================================================
                    1. HEADER / NAVIGATION BAR
                ======================================================== */}
                <header className="sticky top-0 z-50 glass-nav transition-all duration-300">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-20">

                            {/* Logo & Brand Name */}
                            <Link to="/" className="flex items-center space-x-3 cursor-pointer group">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-300">
                                    <Receipt size={24} />
                                </div>
                                <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 tracking-tight">
                                    FamilyExpense <span className="text-indigo-600 font-black">AI</span>
                                </span>
                            </Link>

                            {/* Navigation Links */}
                            <nav className="hidden md:flex items-center space-x-6 text-sm font-semibold text-slate-700">
                                <a href="#features" className="hover:text-indigo-600 transition-colors">Tính năng</a>
                                <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">Cách hoạt động</a>
                                <a href="#security" className="hover:text-indigo-600 transition-colors">Bảo mật & Uy tín</a>
                                <a href="#stats" className="hover:text-indigo-600 transition-colors">Thống kê</a>
                            </nav>

                            {/* Right Navigation Actions */}
                            <div className="flex items-center space-x-3 sm:space-x-4">
                                <button
                                    onClick={() => setIsScanModalOpen(true)}
                                    className="hidden sm:flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-50 text-indigo-700 font-semibold hover:bg-indigo-100 transition-all duration-200 border border-indigo-100/80 shadow-sm hover:shadow active:scale-95"
                                >
                                    <ScanLine size={18} className="text-indigo-600" />
                                    <span>Quét Hóa Đơn</span>
                                </button>

                                <Link
                                    to="/login"
                                    className="px-4 py-2.5 rounded-xl text-slate-700 hover:text-indigo-600 font-semibold transition-colors duration-200"
                                >
                                    Đăng nhập
                                </Link>

                                <Link
                                    to="/register"
                                    className="relative group overflow-hidden px-6 py-2.5 rounded-xl font-bold text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300 active:scale-95 inline-flex items-center"
                                >
                                    <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] group-hover:bg-right transition-all duration-500"></span>
                                    <span className="relative flex items-center space-x-2">
                                        <span>Đăng ký ngay</span>
                                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </Link>
                            </div>

                        </div>
                    </div>
                </header>

                {/* ========================================================
                    2. VIBRANT FLOATING TICKER BANNER
                ======================================================== */}
                <div className="w-full bg-slate-900/90 backdrop-blur-md border-y border-indigo-500/20 py-2.5 overflow-hidden relative z-20">
                    <div className="animate-ticker text-sm text-indigo-200 font-medium">
                        <div className="flex items-center space-x-8 pr-8">
                            <span className="inline-flex items-center space-x-2">
                                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
                                <span className="text-emerald-400 font-bold">✨ OCR AI Gemini 2.5:</span>
                                <span>Tự động nhận diện và phân loại hóa đơn siêu tốc trong 0.5s!</span>
                            </span>
                            <span className="text-slate-600">•</span>
                            <span className="inline-flex items-center space-x-2">
                                <Flame size={16} className="text-amber-400" />
                                <span>Hơn <strong>12,400+</strong> gia đình đã tin dùng trong tháng này!</span>
                            </span>
                            <span className="text-slate-600">•</span>
                            <span className="inline-flex items-center space-x-2">
                                <ShieldCheck size={16} className="text-cyan-400" />
                                <span>Bảo mật chuẩn ngân hàng - Đồng bộ thời gian thực tất cả thành viên</span>
                            </span>
                            <span className="text-slate-600">•</span>
                            <span className="inline-flex items-center space-x-2">
                                <Zap size={16} className="text-purple-400" />
                                <span>Báo cáo chi tiêu thông minh bằng biểu đồ sinh động</span>
                            </span>
                            <span className="text-slate-600">•</span>
                        </div>

                        <div className="flex items-center space-x-8 pr-8">
                            <span className="inline-flex items-center space-x-2">
                                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
                                <span className="text-emerald-400 font-bold">✨ OCR AI Gemini 2.5:</span>
                                <span>Tự động nhận diện và phân loại hóa đơn siêu tốc trong 0.5s!</span>
                            </span>
                            <span className="text-slate-600">•</span>
                            <span className="inline-flex items-center space-x-2">
                                <Flame size={16} className="text-amber-400" />
                                <span>Hơn <strong>12,400+</strong> gia đình đã tin dùng trong tháng này!</span>
                            </span>
                            <span className="text-slate-600">•</span>
                            <span className="inline-flex items-center space-x-2">
                                <ShieldCheck size={16} className="text-cyan-400" />
                                <span>Bảo mật chuẩn ngân hàng - Đồng bộ thời gian thực tất cả thành viên</span>
                            </span>
                            <span className="text-slate-600">•</span>
                            <span className="inline-flex items-center space-x-2">
                                <Zap size={16} className="text-purple-400" />
                                <span>Báo cáo chi tiêu thông minh bằng biểu đồ sinh động</span>
                            </span>
                            <span className="text-slate-600">•</span>
                        </div>
                    </div>
                </div>

                {/* ========================================================
                    3. MAIN HERO SHOWCASE (Carousel & Floating Widgets)
                ======================================================== */}
                <section className="relative flex items-center justify-center py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                    <div className="relative w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

                        {/* Left Column: Visual Carousel (7 cols) */}
                        <div className="lg:col-span-7 relative w-full h-[380px] sm:h-[480px] lg:h-[540px] rounded-3xl overflow-hidden shadow-2xl border border-white/20 group">
                            <div className="relative w-full h-full">
                                {SLIDES.map((slide, index) => (
                                    <div
                                        key={index}
                                        className={`carousel-slide absolute inset-0 ${
                                            index === currentSlide
                                                ? 'opacity-100 scale-100 z-10'
                                                : 'opacity-0 scale-105 z-0'
                                        }`}
                                    >
                                        <img
                                            src={slide.url}
                                            alt={slide.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                                        <div className="absolute bottom-8 left-8 right-8 text-white z-10">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${slide.badgeColor} backdrop-blur-md uppercase tracking-wider mb-2 inline-block`}>
                                                {slide.badge}
                                            </span>
                                            <h2 className="text-2xl sm:text-3xl font-bold">{slide.title}</h2>
                                            <p className="text-slate-300 text-sm mt-1">{slide.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Carousel Controls */}
                            <div className="absolute top-6 right-6 flex items-center space-x-2 z-20">
                                <button
                                    onClick={prevSlide}
                                    className="w-10 h-10 rounded-full bg-slate-900/60 hover:bg-indigo-600 text-white backdrop-blur-md flex items-center justify-center transition-colors border border-white/10"
                                    aria-label="Previous slide"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={nextSlide}
                                    className="w-10 h-10 rounded-full bg-slate-900/60 hover:bg-indigo-600 text-white backdrop-blur-md flex items-center justify-center transition-colors border border-white/10"
                                    aria-label="Next slide"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>

                            {/* Carousel Dots */}
                            <div className="absolute bottom-6 right-8 flex space-x-2 z-20">
                                {SLIDES.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentSlide(index)}
                                        className={`h-3 rounded-full transition-all duration-300 ${
                                            index === currentSlide ? 'bg-white w-8' : 'bg-white/40 w-3 hover:bg-white/70'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Right Column: Live Interactive Widgets (5 cols) */}
                        <div className="lg:col-span-5 flex flex-col space-y-5 relative">

                            {/* Card 1: Quỹ Gia Đình Live Status */}
                            <div className="glass-card rounded-3xl p-6 sm:p-7 animate-float-slow transform hover:scale-[1.02] transition-transform duration-300 relative overflow-hidden text-slate-800">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-indigo-500/30">
                                            FE
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 text-lg leading-tight">Quỹ Gia Đình - 2026</h3>
                                            <p className="text-xs text-slate-500">Admin: Long Vũ (Role = Admin)</p>
                                        </div>
                                    </div>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                                        Đang hoạt động
                                    </span>
                                </div>

                                <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/5 rounded-2xl p-5 border border-indigo-100 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng chi tiêu tháng này</p>
                                        <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                                            12.450.000 <span className="text-indigo-600 font-bold text-xl">đ</span>
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl shadow-lg shadow-indigo-500/30">
                                        <PieChart size={24} />
                                    </div>
                                </div>

                                <div className="mt-4 space-y-2.5">
                                    <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm">
                                                <ShoppingCart size={16} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-800">
                                                    Siêu thị WinMart <span className="text-[10px] font-normal px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 ml-1">AI Quét</span>
                                                </p>
                                                <p className="text-[10px] text-slate-400">Vừa xong • Mua thực phẩm</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold text-rose-500">-450.000 đ</span>
                                    </div>

                                    <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center text-sm">
                                                <Zap size={16} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-800">Tiền điện tháng 10</p>
                                                <p className="text-[10px] text-slate-400">Hôm qua • Hóa đơn cố định</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold text-rose-500">-1.200.000 đ</span>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Quick Action AI Scan */}
                            <div className="glass-card rounded-2xl p-5 animate-float-delayed transform hover:scale-[1.02] transition-transform duration-300 flex items-center justify-between bg-gradient-to-r from-white/90 to-indigo-50/80 border-indigo-100 text-slate-800">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center text-xl shadow-md shadow-purple-500/30">
                                        <Camera size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-sm">Trải nghiệm Quét AI ngay</h4>
                                        <p className="text-xs text-slate-500">Tải ảnh hóa đơn để AI xử lý tức thì</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsScanModalOpen(true)}
                                    className="px-4 py-2 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold rounded-xl shadow transition-colors active:scale-95"
                                >
                                    Thử Quét
                                </button>
                            </div>

                        </div>
                    </div>
                </section>

                {/* ========================================================
                    4. STATS COUNTER BAR (Băng chỉ số ấn tượng & Uy tín)
                ======================================================== */}
                <section id="stats" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        <div className="glass-dark-card rounded-2xl p-6 text-center hover-glow">
                            <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
                                12,400+
                            </div>
                            <p className="text-sm font-semibold text-slate-300 mt-2">Gia đình tin dùng</p>
                            <p className="text-xs text-slate-500 mt-1">Đồng hành quản lý tài chính</p>
                        </div>

                        <div className="glass-dark-card rounded-2xl p-6 text-center hover-glow">
                            <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                                99.8%
                            </div>
                            <p className="text-sm font-semibold text-slate-300 mt-2">Độ chính xác AI OCR</p>
                            <p className="text-xs text-slate-500 mt-1">Chuẩn hóa dữ liệu tự động</p>
                        </div>

                        <div className="glass-dark-card rounded-2xl p-6 text-center hover-glow">
                            <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                500,000+
                            </div>
                            <p className="text-sm font-semibold text-slate-300 mt-2">Hóa đơn đã số hóa</p>
                            <p className="text-xs text-slate-500 mt-1">Tiết kiệm 85% thời gian nhập</p>
                        </div>

                        <div className="glass-dark-card rounded-2xl p-6 text-center hover-glow">
                            <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent flex items-center justify-center gap-1">
                                4.9 <Star size={24} className="fill-amber-400 text-amber-400 inline" />
                            </div>
                            <p className="text-sm font-semibold text-slate-300 mt-2">Đánh giá hài lòng</p>
                            <p className="text-xs text-slate-500 mt-1">Từ hơn 8,500 lượt bình chọn</p>
                        </div>
                    </div>
                </section>

                {/* ========================================================
                    5. CORE FEATURES SECTION (Tính năng vượt trội)
                ======================================================== */}
                <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                    <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                        <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 inline-block">
                            Tính Năng Đột Phá
                        </span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                            Công nghệ tiên phong cho <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Gia đình hiện đại</span>
                        </h2>
                        <p className="text-slate-400 text-base sm:text-lg">
                            Không còn nỗi lo ghi chép thủ công từng tờ hóa đơn giấy. FamilyExpense AI mang đến sự minh bạch, tiện lợi và gắn kết cho mọi thành viên.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Feature 1 */}
                        <div className="glass-dark-card rounded-3xl p-7 hover-glow flex flex-col justify-between">
                            <div>
                                <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/10">
                                    <Cpu size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">AI Quét Hóa Đơn Tự Động</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    Chụp ảnh hóa đơn mua sắm siêu thị, nhà hàng, điện nước. Trí tuệ nhân tạo Gemini tự bóc tách số tiền, danh mục và ngày tháng trong chớp mắt.
                                </p>
                            </div>
                            <div className="pt-6 mt-6 border-t border-white/5 flex items-center text-xs font-semibold text-indigo-400">
                                <span>OCR 0.5s Siêu tốc</span>
                                <CheckCircle2 size={16} className="ml-auto text-emerald-400" />
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="glass-dark-card rounded-3xl p-7 hover-glow flex flex-col justify-between">
                            <div>
                                <div className="w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-500/30 text-purple-400 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/10">
                                    <Users size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Phân Quyền Nhóm Đa Cấp</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    Chủ hộ (Admin role = 1) quản lý thành viên, đặt hạn mức quỹ. Các thành viên (Member role = 2) cùng tham gia ghi nhận chi tiêu minh bạch.
                                </p>
                            </div>
                            <div className="pt-6 mt-6 border-t border-white/5 flex items-center text-xs font-semibold text-purple-400">
                                <span>Role-based Access</span>
                                <CheckCircle2 size={16} className="ml-auto text-emerald-400" />
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="glass-dark-card rounded-3xl p-7 hover-glow flex flex-col justify-between">
                            <div>
                                <div className="w-14 h-14 rounded-2xl bg-pink-600/20 border border-pink-500/30 text-pink-400 flex items-center justify-center mb-6 shadow-lg shadow-pink-500/10">
                                    <BarChart3 size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Báo Cáo Phân Tích Thông Minh</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    Biểu đồ trực quan sinh động theo từng danh mục: Ăn uống, Siêu thị, Học tập, Điện nước, Y tế. Dễ dàng nắm bắt cơ cấu chi tiêu của gia đình.
                                </p>
                            </div>
                            <div className="pt-6 mt-6 border-t border-white/5 flex items-center text-xs font-semibold text-pink-400">
                                <span>Thống kê thời gian thực</span>
                                <CheckCircle2 size={16} className="ml-auto text-emerald-400" />
                            </div>
                        </div>

                        {/* Feature 4 */}
                        <div className="glass-dark-card rounded-3xl p-7 hover-glow flex flex-col justify-between">
                            <div>
                                <div className="w-14 h-14 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/10">
                                    <ShieldCheck size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Bảo Mật Chuẩn Ngân Hàng</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    Mật khẩu mã hóa Bcrypt một chiều, xác thực mã JWT an toàn, cơ sở dữ liệu Microsoft SQL Server lưu trữ chuẩn doanh nghiệp.
                                </p>
                            </div>
                            <div className="pt-6 mt-6 border-t border-white/5 flex items-center text-xs font-semibold text-emerald-400">
                                <span>Mã hóa SSL 256-bit</span>
                                <CheckCircle2 size={16} className="ml-auto text-emerald-400" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ========================================================
                    6. HOW IT WORKS SECTION (Quy trình 3 bước)
                ======================================================== */}
                <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-white/10">
                    <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                        <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-purple-500/10 text-purple-400 border border-purple-500/20 inline-block">
                            Quy Trình Hoạt Động
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black text-white">
                            Quản lý chi tiêu chỉ với <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">3 bước đơn giản</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        {/* Step 1 */}
                        <div className="glass-dark-card rounded-3xl p-8 text-center relative hover-glow">
                            <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white mx-auto flex items-center justify-center text-2xl font-black mb-6 shadow-lg shadow-indigo-600/30">
                                01
                            </div>
                            <h4 className="text-xl font-bold text-white mb-2">Chụp hoặc Tải Ảnh Hóa Đơn</h4>
                            <p className="text-sm text-slate-400">
                                Chụp ảnh hóa đơn mua sắm từ camera điện thoại hoặc tải file ảnh từ máy tính (JPG, PNG).
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="glass-dark-card rounded-3xl p-8 text-center relative hover-glow">
                            <div className="w-16 h-16 rounded-2xl bg-purple-600 text-white mx-auto flex items-center justify-center text-2xl font-black mb-6 shadow-lg shadow-purple-600/30">
                                02
                            </div>
                            <h4 className="text-xl font-bold text-white mb-2">AI Gemini Trích Xuất Siêu Tốc</h4>
                            <p className="text-sm text-slate-400">
                                Công nghệ AI đọc chuẩn xác tổng tiền, tên cửa hàng và tự phân loại vào danh mục thích hợp.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="glass-dark-card rounded-3xl p-8 text-center relative hover-glow">
                            <div className="w-16 h-16 rounded-2xl bg-pink-600 text-white mx-auto flex items-center justify-center text-2xl font-black mb-6 shadow-lg shadow-pink-600/30">
                                03
                            </div>
                            <h4 className="text-xl font-bold text-white mb-2">Đồng Bộ & Xem Báo Cáo</h4>
                            <p className="text-sm text-slate-400">
                                Khoản chi được ghi nhận vào Quỹ Gia Đình, cập nhật số dư tức thì cho tất cả thành viên cùng xem.
                            </p>
                        </div>
                    </div>
                </section>

                {/* ========================================================
                    7. TRUST, SECURITY & CERTIFICATES (Chứng chỉ uy tín)
                ======================================================== */}
                <section id="security" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                    <div className="glass-dark-card rounded-3xl p-8 sm:p-12 border border-indigo-500/20 relative overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                            <div className="lg:col-span-8 space-y-4">
                                <div className="inline-flex items-center space-x-2 text-xs font-bold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                                    <Award size={14} />
                                    <span>Cam Kết Bảo Mật & Bản Quyền Uy Tín</span>
                                </div>
                                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
                                    Dữ liệu tài chính gia đình bạn luôn được bảo vệ tuyệt đối
                                </h3>
                                <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                                    Chúng tôi tuân thủ các tiêu chuẩn an toàn bảo mật thông tin quốc tế. Mọi dữ liệu hóa đơn, số tiền và thông tin cá nhân đều được mã hóa và bảo vệ nghiêm ngặt, không bao giờ được chia sẻ với bất kỳ bên thứ ba nào.
                                </p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
                                    <div className="flex items-center space-x-2 text-xs text-slate-300 font-semibold">
                                        <BadgeCheck size={18} className="text-indigo-400 shrink-0" />
                                        <span>Mã hóa SSL 256-Bit</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-xs text-slate-300 font-semibold">
                                        <BadgeCheck size={18} className="text-indigo-400 shrink-0" />
                                        <span>Chuẩn ISO/IEC 27001</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-xs text-slate-300 font-semibold">
                                        <BadgeCheck size={18} className="text-indigo-400 shrink-0" />
                                        <span>SQL Server Enterprise</span>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-4 flex flex-col items-center justify-center space-y-4 p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-emerald-500/20">
                                    <Lock size={32} />
                                </div>
                                <div>
                                    <h5 className="font-bold text-white text-base">Hệ Thống Đã Được Chứng Nhận</h5>
                                    <p className="text-xs text-slate-400 mt-1">Bản quyền số © 2026 FamilyExpense AI</p>
                                </div>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                    ✓ Verified Trustmark
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ========================================================
                    8. CTA SECTION (Kêu gọi hành động)
                ======================================================== */}
                <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                    <div className="relative rounded-3xl p-8 sm:p-14 overflow-hidden text-center bg-gradient-to-r from-indigo-900/80 via-purple-900/80 to-slate-900/90 border border-indigo-500/30 shadow-2xl">
                        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
                            <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-white/10 text-white border border-white/20 inline-block">
                                Khởi Đầu Tài Chính Thông Minh
                            </span>
                            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                                Sẵn sàng nâng cấp cách quản lý chi tiêu gia đình bạn?
                            </h2>
                            <p className="text-slate-300 text-base sm:text-lg">
                                Tham gia cùng hàng chục ngàn gia đình Việt đang tiết kiệm hàng giờ mỗi tuần với công nghệ AI Gemini 2.5!
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                                <Link
                                    to="/register"
                                    className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/40 border border-indigo-400/30 transition-all duration-300 hover:scale-105 inline-flex items-center justify-center gap-2"
                                >
                                    <span>Tạo Tài Khoản Miễn Phí</span>
                                    <ArrowRight size={18} />
                                </Link>
                                <button
                                    onClick={() => setIsScanModalOpen(true)}
                                    className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-slate-200 hover:text-white bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md transition-all duration-300 inline-flex items-center justify-center gap-2"
                                >
                                    <ScanLine size={18} />
                                    <span>Thử Quét Hóa Đơn Ngay</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ========================================================
                    9. FULL MODERN FOOTER (Footer Bản Quyền & Uy Tín Chuẩn Web Hiện Đại)
                ======================================================== */}
                <footer className="bg-slate-950 border-t border-white/10 pt-16 pb-12 text-slate-400">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">

                            {/* Cột 1: Thông tin thương hiệu (2 cols trên desktop) */}
                            <div className="lg:col-span-2 space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
                                        <Receipt size={20} />
                                    </div>
                                    <span className="text-xl font-black text-white tracking-tight">
                                        FamilyExpense <span className="text-indigo-500">AI</span>
                                    </span>
                                </div>
                                <p className="text-sm text-slate-400 leading-relaxed pr-4">
                                    Nền tảng quản lý tài chính gia đình và quỹ nhóm số một ứng dụng trí tuệ nhân tạo Gemini AI. Giúp gia đình kiểm soát thu chi minh bạch, gắn kết và tự động hóa toàn bộ việc quét hóa đơn.
                                </p>
                                <div className="space-y-2 text-xs pt-2">
                                    <p className="flex items-center gap-2 text-slate-400">
                                        <MapPin size={14} className="text-indigo-400 shrink-0" />
                                        <span>Tòa nhà Công nghệ số, TP. Hà Nội & TP. Hồ Chí Minh, Việt Nam</span>
                                    </p>
                                    <p className="flex items-center gap-2 text-slate-400">
                                        <Mail size={14} className="text-indigo-400 shrink-0" />
                                        <span>support@familyexpense.ai • contact@familyexpense.vn</span>
                                    </p>
                                    <p className="flex items-center gap-2 text-slate-400">
                                        <Phone size={14} className="text-indigo-400 shrink-0" />
                                        <span>Hotline hỗ trợ kỹ thuật: 1900 8888 (24/7)</span>
                                    </p>
                                </div>
                            </div>

                            {/* Cột 2: Sản phẩm & Tính năng */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Sản Phẩm</h4>
                                <ul className="space-y-2 text-sm">
                                    <li>
                                        <Link to="/scanner" className="hover:text-indigo-400 transition-colors">Quét Hóa Đơn AI Gemini</Link>
                                    </li>
                                    <li>
                                        <a href="#features" className="hover:text-indigo-400 transition-colors">Quản Lý Quỹ Gia Đình</a>
                                    </li>
                                    <li>
                                        <a href="#features" className="hover:text-indigo-400 transition-colors">Phân Quyền Admin & Member</a>
                                    </li>
                                    <li>
                                        <a href="#features" className="hover:text-indigo-400 transition-colors">Báo Cáo Biểu Đồ Trực Quan</a>
                                    </li>
                                    <li>
                                        <a href="#features" className="hover:text-indigo-400 transition-colors">Tích Hợp SQL Server 2026</a>
                                    </li>
                                </ul>
                            </div>

                            {/* Cột 3: Chính sách & Uy tín */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Uy Tín & Pháp Lý</h4>
                                <ul className="space-y-2 text-sm">
                                    <li>
                                        <a href="#security" className="hover:text-indigo-400 transition-colors">Chính Sách Bảo Mật</a>
                                    </li>
                                    <li>
                                        <a href="#security" className="hover:text-indigo-400 transition-colors">Điều Khoản Dịch Vụ</a>
                                    </li>
                                    <li>
                                        <a href="#security" className="hover:text-indigo-400 transition-colors">Cam Kết Quyền Riêng Tư</a>
                                    </li>
                                    <li>
                                        <a href="#security" className="hover:text-indigo-400 transition-colors">Tiêu Chuẩn ISO/IEC 27001</a>
                                    </li>
                                    <li>
                                        <a href="#security" className="hover:text-indigo-400 transition-colors">Chứng Chỉ Mã Hóa SSL</a>
                                    </li>
                                </ul>
                            </div>

                            {/* Cột 4: Hỗ trợ & Khách hàng */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Hỗ Trợ</h4>
                                <ul className="space-y-2 text-sm">
                                    <li>
                                        <Link to="/login" className="hover:text-indigo-400 transition-colors">Đăng Nhập Tài Khoản</Link>
                                    </li>
                                    <li>
                                        <Link to="/register" className="hover:text-indigo-400 transition-colors">Đăng Ký Thành Viên</Link>
                                    </li>
                                    <li>
                                        <Link to="/forgot-password" className="hover:text-indigo-400 transition-colors">Khôi Phục Mật Khẩu</Link>
                                    </li>
                                    <li>
                                        <a href="#how-it-works" className="hover:text-indigo-400 transition-colors">Hướng Dẫn Bóc Tách Hóa Đơn</a>
                                    </li>
                                    <li>
                                        <a href="#stats" className="hover:text-indigo-400 transition-colors">Câu Hỏi Thường Gặp (FAQ)</a>
                                    </li>
                                </ul>
                            </div>

                        </div>

                        {/* Thanh Bản Quyền & Giấy Phép Dưới Cùng */}
                        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
                            <div className="flex flex-wrap items-center gap-2">
                                <span>© 2026 <strong>FamilyExpense AI Corporation</strong>. Toàn bộ bản quyền được bảo hộ.</span>
                                <span className="hidden sm:inline">•</span>
                                <span>Phát triển bằng Google Gemini AI & React</span>
                            </div>

                            <div className="flex items-center space-x-6">
                                <span className="text-slate-400 font-medium">Bản quyền phần mềm số: <strong>VN-2026-FE-AI</strong></span>
                                <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-indigo-400 font-mono text-[11px]">
                                    v2.5.0-Release
                                </span>
                            </div>
                        </div>

                    </div>
                </footer>

                {/* 4. FLOATING NOTIFICATION TOAST (Cố định góc dưới phải) */}
                {isToastVisible && (
                    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full px-4 transition-all duration-500 transform">
                        <div className={`glass-notification rounded-2xl p-4 text-white shadow-2xl relative overflow-hidden group transition-all duration-400 ${
                            toastFading ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'
                        }`}>
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

                            <div className="flex items-start space-x-3.5">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-500/40">
                                    <Wand2 size={20} className="animate-wiggle" />
                                </div>
                                <div className="flex-1 pr-4">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Thông báo AI</span>
                                        <span className="text-[10px] text-slate-400">{TOAST_MESSAGES[toastIndex].time}</span>
                                    </div>
                                    <p className="text-sm font-semibold text-slate-100 mt-0.5">
                                        {TOAST_MESSAGES[toastIndex].text}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsToastVisible(false)}
                                    className="text-slate-400 hover:text-white transition-colors text-sm p-1"
                                    aria-label="Close notification"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>

            {/* 5. AI SCAN MODAL POPUP */}
            {isScanModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="glass-card max-w-lg w-full rounded-3xl p-6 sm:p-8 relative text-slate-800 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => setIsScanModalOpen(false)}
                            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
                        >
                            <X size={18} />
                        </button>

                        <div className="text-center">
                            <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 mx-auto flex items-center justify-center text-2xl mb-4 shadow-sm">
                                <UploadCloud size={32} />
                            </div>
                            <h3 className="text-xl font-extrabold text-slate-900">Quét Hóa Đơn AI Gemini</h3>
                            <p className="text-sm text-slate-500 mt-1">
                                Tải lên hóa đơn hoặc chuyển sang trang Quét Hóa Đơn chuyên sâu để AI tự phân tích
                            </p>
                        </div>

                        <div
                            onClick={() => {
                                setIsScanModalOpen(false);
                                navigate('/scanner');
                            }}
                            className="mt-6 border-2 border-dashed border-indigo-200 hover:border-indigo-500 rounded-2xl p-8 text-center cursor-pointer bg-indigo-50/50 hover:bg-indigo-50 transition-all group"
                        >
                            <Receipt size={36} className="text-indigo-400 group-hover:text-indigo-600 mx-auto mb-2 transition-colors" />
                            <p className="text-xs font-semibold text-indigo-600">Bấm để mở Trợ lý Quét Hóa Đơn AI</p>
                            <p className="text-[10px] text-slate-400 mt-1">Hỗ trợ JPG, PNG, WEBP (Tối đa 10MB) với nhận diện tự động</p>
                        </div>

                        <div className="mt-6 flex space-x-3">
                            <button
                                onClick={() => setIsScanModalOpen(false)}
                                className="w-1/2 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={() => {
                                    setIsScanModalOpen(false);
                                    navigate('/scanner');
                                }}
                                className="w-1/2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold text-white shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-1.5"
                            >
                                <Sparkles size={16} /> Bắt đầu quét AI
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
