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
    Wand2
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
        <div className="relative min-h-screen bg-slate-900 text-slate-800 font-sans overflow-x-hidden selection:bg-indigo-500 selection:text-white">

            {/* Glowing Background Ambient Spheres */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl animate-pulse-glow"></div>
                <div className="absolute top-1/3 -right-20 w-[500px] h-[500px] bg-purple-500/25 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1.5s' }}></div>
                <div className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '3s' }}></div>
            </div>

            {/* MAIN CONTAINER */}
            <div className="relative min-h-screen flex flex-col justify-between z-10 bg-slate-950/40">

                {/* 1. HEADER / NAVIGATION BAR */}
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

                            {/* Right Navigation Actions */}
                            <div className="flex items-center space-x-3 sm:space-x-5">
                                {/* Quét Hóa Đơn AI Button */}
                                <button
                                    onClick={() => setIsScanModalOpen(true)}
                                    className="hidden sm:flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-50 text-indigo-700 font-semibold hover:bg-indigo-100 transition-all duration-200 border border-indigo-100/80 shadow-sm hover:shadow active:scale-95"
                                >
                                    <ScanLine size={18} className="text-indigo-600" />
                                    <span>Quét Hóa Đơn</span>
                                </button>

                                {/* Đăng Nhập */}
                                <Link
                                    to="/login"
                                    className="px-4 py-2.5 rounded-xl text-slate-700 hover:text-indigo-600 font-semibold transition-colors duration-200"
                                >
                                    Đăng nhập
                                </Link>

                                {/* Đăng Ký Ngay */}
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

                {/* 2. VIBRANT FLOATING TICKER BANNER (Dòng thông báo chạy sống động) */}
                <div className="w-full bg-slate-900/90 backdrop-blur-md border-y border-indigo-500/20 py-2.5 overflow-hidden relative z-20">
                    <div className="animate-ticker text-sm text-indigo-200 font-medium">
                        {/* Sequence 1 */}
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

                        {/* Sequence 2 (for continuous smooth infinite loop) */}
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

                {/* 3. MAIN HERO SHOWCASE (Vibrant Image Carousel & Dynamic Floating Cards) */}
                <main className="relative flex-1 flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                    <div className="relative w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

                        {/* Left Column: Dynamic Visual Carousel Container (60% width on Desktop) */}
                        <div className="lg:col-span-7 relative w-full h-[380px] sm:h-[480px] lg:h-[540px] rounded-3xl overflow-hidden shadow-2xl border border-white/20 group">

                            {/* BACKGROUND CAROUSEL IMAGES */}
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

                            {/* Carousel Controls (Top Right) */}
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

                            {/* Carousel Dots (Bottom Right) */}
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

                        {/* Right Column: Interactive Floating Live UI Widgets (40% width on Desktop) */}
                        <div className="lg:col-span-5 flex flex-col space-y-5 relative">

                            {/* FLOATING CARD 1: MAIN FINANCIAL STATUS */}
                            <div className="glass-card rounded-3xl p-6 sm:p-7 animate-float-slow transform hover:scale-[1.02] transition-transform duration-300 relative overflow-hidden">
                                {/* Top Active Pill */}
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

                                {/* Expense Total Box */}
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

                                {/* Recent AI Expense Stream */}
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

                            {/* FLOATING CARD 2: QUICK ACTION SCANNER */}
                            <div className="glass-card rounded-2xl p-5 animate-float-delayed transform hover:scale-[1.02] transition-transform duration-300 flex items-center justify-between bg-gradient-to-r from-white/90 to-indigo-50/80 border-indigo-100">
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
                </main>

                {/* 4. FLOATING NOTIFICATION TOAST (Dòng thông báo nổi góc màn hình) */}
                {isToastVisible && (
                    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full px-4 transition-all duration-500 transform">
                        <div className={`glass-notification rounded-2xl p-4 text-white shadow-2xl relative overflow-hidden group transition-all duration-400 ${
                            toastFading ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'
                        }`}>
                            {/* Glowing Accent Line */}
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
                        {/* Close button */}
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
