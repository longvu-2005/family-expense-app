import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
    Mail,
    ArrowLeft,
    Loader2,
    CheckCircle2,
    ShieldCheck,
    KeyRound,
    LockKeyhole,
    Eye,
    EyeOff,
    RefreshCw
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api/auth';

export default function ForgotPassword() {
    const [step, setStep] = useState(1);

    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendCountdown, setResendCountdown] = useState(0);

    const clearAlerts = () => {
        setMessage('');
        setError('');
    };

    // Đếm ngược thời gian gửi lại mã OTP
    useEffect(() => {
        let timer = null;
        if (resendCountdown > 0) {
            timer = setTimeout(() => {
                setResendCountdown((prev) => prev - 1);
            }, 1000);
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [resendCountdown]);

    // Bước 1: Gửi OTP qua email
    const handleForgot = async (e) => {
        e.preventDefault();
        clearAlerts();

        const cleanEmail = email.trim().toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!cleanEmail || !emailRegex.test(cleanEmail)) {
            setError('Vui lòng nhập địa chỉ email hợp lệ!');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                `${API_URL}/forgot-password`,
                { email: cleanEmail }
            );

            if (response.data.success) {
                setStep(2);
                setResendCountdown(60);
                setMessage('Mã OTP 6 chữ số đã được gửi tới Gmail của bạn. Vui lòng kiểm tra hộp thư (kể cả mục Thư rác/Spam).');
            } else {
                setError(response.data.message || 'Không thể gửi mã OTP.');
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Có lỗi xảy ra khi gửi email xác nhận. Vui lòng thử lại sau.'
            );
        } finally {
            setLoading(false);
        }
    };

    // Gửi lại mã OTP
    const handleResendOtp = async () => {
        if (resendCountdown > 0 || resendLoading) return;
        clearAlerts();
        setResendLoading(true);

        try {
            const cleanEmail = email.trim().toLowerCase();
            const response = await axios.post(
                `${API_URL}/forgot-password`,
                { email: cleanEmail }
            );

            if (response.data.success) {
                setResendCountdown(60);
                setMessage('Mã OTP mới đã được gửi lại vào email của bạn! Mã có hiệu lực trong 10 phút.');
            } else {
                setError(response.data.message || 'Không thể gửi lại mã OTP.');
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Có lỗi xảy ra khi gửi lại OTP. Vui lòng kiểm tra kết nối mạng.'
            );
        } finally {
            setResendLoading(false);
        }
    };

    // Bước 2: Xác minh OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        clearAlerts();

        const cleanOtp = otp.trim();
        if (!/^\d{6}$/.test(cleanOtp)) {
            setError('Vui lòng nhập mã OTP gồm đúng 6 chữ số.');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                `${API_URL}/verify-otp`,
                {
                    email: email.trim().toLowerCase(),
                    otp: cleanOtp
                }
            );

            if (response.data.success) {
                setStep(3);
                setMessage('Xác minh OTP thành công! Bây giờ hãy đặt lại mật khẩu mới cho tài khoản.');
            } else {
                setError(response.data.message || 'Mã OTP không hợp lệ.');
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Mã OTP không đúng hoặc đã hết hạn.'
            );
        } finally {
            setLoading(false);
        }
    };

    // Bước 3: Đặt mật khẩu mới
    const handleResetPassword = async (e) => {
        e.preventDefault();
        clearAlerts();

        if (password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Mật khẩu xác nhận không trùng khớp.');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                `${API_URL}/reset-password`,
                {
                    email: email.trim().toLowerCase(),
                    otp: otp.trim(),
                    new_password: password
                }
            );

            if (response.data.success) {
                setMessage('Đổi mật khẩu thành công! Bạn có thể đăng nhập ngay với mật khẩu mới.');
                setPassword('');
                setConfirmPassword('');
                setOtp('');
                setStep(4);
            } else {
                setError(response.data.message || 'Không thể đặt lại mật khẩu.');
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Không thể đặt lại mật khẩu. Vui lòng thử lại.'
            );
        } finally {
            setLoading(false);
        }
    };

    const goBackToEmail = () => {
        clearAlerts();
        setOtp('');
        setStep(1);
    };

    const inputClass =
        'block w-full px-4 py-3 bg-slate-950/70 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all';

    const stepLabels = ['Nhập Email', 'Xác minh OTP', 'Mật khẩu mới'];

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans flex items-center justify-center px-4 py-12 relative overflow-hidden selection:bg-indigo-500 selection:text-white">

            {/* Background effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl animate-pulse-glow" />
                <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl animate-float" />
            </div>

            {/* Back home */}
            <div className="absolute top-6 left-6 z-20">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md transition-all hover:bg-white/10 hover:scale-105"
                >
                    <ArrowLeft size={16} />
                    Về trang chủ
                </Link>
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur-2xl opacity-25" />

                <div className="relative bg-slate-900/85 backdrop-blur-2xl p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl shadow-indigo-500/10 space-y-6">

                    {/* Header */}
                    <div className="text-center space-y-3">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/30 border border-indigo-400/30">
                            {step === 1 && <Mail size={26} className="text-white" />}
                            {step === 2 && <ShieldCheck size={26} className="text-white" />}
                            {step === 3 && <LockKeyhole size={26} className="text-white" />}
                            {step === 4 && <CheckCircle2 size={26} className="text-emerald-400" />}
                        </div>

                        <div>
                            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                                {step === 1 && 'Khôi phục mật khẩu'}
                                {step === 2 && 'Xác minh OTP'}
                                {step === 3 && 'Tạo mật khẩu mới'}
                                {step === 4 && 'Hoàn tất đổi mật khẩu'}
                            </h1>

                            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                                {step === 1 && 'Nhập email tài khoản của bạn để nhận mã xác minh OTP 6 chữ số qua Gmail.'}
                                {step === 2 && (
                                    <>
                                        Mã OTP đã được gửi tới <span className="text-indigo-300 font-semibold">{email}</span>. Mã có hiệu lực trong 10 phút.
                                    </>
                                )}
                                {step === 3 && 'Tạo mật khẩu mới mạnh và an toàn để bảo vệ tài khoản.'}
                                {step === 4 && 'Mật khẩu đã được cập nhật thành công! Bạn có thể đăng nhập ngay.'}
                            </p>
                        </div>
                    </div>

                    {/* Progress */}
                    {step !== 4 && (
                        <div className="flex items-center gap-2">
                            {stepLabels.map((label, index) => {
                                const number = index + 1;
                                const active = step >= number;

                                return (
                                    <div key={label} className="flex-1 space-y-2">
                                        <div
                                            className={`h-1.5 rounded-full transition-colors ${active ? 'bg-indigo-500' : 'bg-white/10'
                                                }`}
                                        />
                                        <p className={`text-[10px] text-center font-medium ${active ? 'text-indigo-300' : 'text-slate-600'
                                            }`}>
                                            {label}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div role="alert" className="bg-red-500/10 border border-red-500/30 p-3.5 text-xs text-red-300 rounded-xl flex items-start gap-2.5">
                            <span className="shrink-0 text-base">⚠️</span>
                            <span className="leading-relaxed">{error}</span>
                        </div>
                    )}

                    {/* Success */}
                    {message && (
                        <div role="status" className="bg-emerald-500/10 border border-emerald-500/30 p-3.5 text-xs text-emerald-300 rounded-xl flex items-start gap-2.5">
                            <CheckCircle2 size={18} className="shrink-0 text-emerald-400 mt-0.5" />
                            <span className="leading-relaxed">{message}</span>
                        </div>
                    )}

                    {/* Step 1: Email */}
                    {step === 1 && (
                        <form className="space-y-4" onSubmit={handleForgot}>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                                    Địa chỉ Gmail đăng ký
                                </label>

                                <div className="relative">
                                    <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />

                                    <input
                                        type="email"
                                        required
                                        autoComplete="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={`${inputClass} pl-10`}
                                        placeholder="vidu@gmail.com"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 border border-indigo-400/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
                            >
                                {loading ? (
                                    <><Loader2 className="animate-spin" size={18} /> Đang gửi mã xác nhận...</>
                                ) : (
                                    <><Mail size={18} /> Gửi mã OTP xác nhận</>
                                )}
                            </button>
                        </form>
                    )}

                    {/* Step 2: OTP */}
                    {step === 2 && (
                        <form className="space-y-4" onSubmit={handleVerifyOtp}>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                                    Mã OTP gồm 6 chữ số
                                </label>

                                <input
                                    type="text"
                                    inputMode="numeric"
                                    autoComplete="one-time-code"
                                    maxLength={6}
                                    required
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    className={`${inputClass} text-center text-2xl tracking-[0.4em] font-bold`}
                                    placeholder="000000"
                                />

                                <p className="text-xs text-slate-400 mt-2">
                                    💡 Kiểm tra cả thư mục <strong className="text-slate-300">Spam / Thư rác</strong> nếu chưa thấy trong hộp thư chính.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || otp.trim().length !== 6}
                                className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 font-bold text-sm rounded-xl border border-indigo-400/30 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/25"
                            >
                                {loading ? (
                                    <><Loader2 className="animate-spin" size={18} /> Đang xác minh...</>
                                ) : (
                                    <><ShieldCheck size={18} /> Xác minh mã OTP</>
                                )}
                            </button>

                            {/* Resend & Change email controls */}
                            <div className="flex items-center justify-between pt-2">
                                <button
                                    type="button"
                                    onClick={goBackToEmail}
                                    className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1"
                                >
                                    <ArrowLeft size={13} />
                                    Đổi email khác
                                </button>

                                <button
                                    type="button"
                                    disabled={resendCountdown > 0 || resendLoading}
                                    onClick={handleResendOtp}
                                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
                                >
                                    {resendLoading ? (
                                        <><Loader2 size={13} className="animate-spin" /> Đang gửi lại...</>
                                    ) : resendCountdown > 0 ? (
                                        <>Gửi lại mã sau ({resendCountdown}s)</>
                                    ) : (
                                        <><RefreshCw size={12} /> Gửi lại mã OTP</>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Step 3: New password */}
                    {step === 3 && (
                        <form className="space-y-4" onSubmit={handleResetPassword}>
                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-2">
                                    Mật khẩu mới (tối thiểu 6 ký tự)
                                </label>

                                <div className="relative">
                                    <KeyRound size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />

                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        minLength={6}
                                        autoComplete="new-password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={`${inputClass} pl-10 pr-12`}
                                        placeholder="Nhập ít nhất 6 ký tự"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                        aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-2">
                                    Xác nhận lại mật khẩu mới
                                </label>

                                <div className="relative">
                                    <LockKeyhole size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />

                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        required
                                        minLength={6}
                                        autoComplete="new-password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className={`${inputClass} pl-10 pr-12`}
                                        placeholder="Nhập lại chính xác mật khẩu mới"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                        aria-label={showConfirmPassword ? 'Ẩn mật khẩu xác nhận' : 'Hiện mật khẩu xác nhận'}
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 font-bold text-sm rounded-xl border border-indigo-400/30 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.01]"
                            >
                                {loading ? (
                                    <><Loader2 className="animate-spin" size={18} /> Đang cập nhật mật khẩu...</>
                                ) : (
                                    <><LockKeyhole size={18} /> Đặt lại mật khẩu</>
                                )}
                            </button>
                        </form>
                    )}

                    {/* Step 4: Done */}
                    {step === 4 && (
                        <div className="space-y-4">
                            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                                <p className="text-sm text-emerald-300 font-medium">
                                    Mật khẩu của bạn đã được thay đổi an toàn! Bạn có thể sử dụng mật khẩu mới này để đăng nhập vào tài khoản ngay bây giờ.
                                </p>
                            </div>

                            <Link
                                to="/login"
                                className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.01]"
                            >
                                Đăng nhập ngay <ArrowLeft size={17} className="rotate-180" />
                            </Link>
                        </div>
                    )}

                    <div className="pt-4 border-t border-white/10 text-center">
                        {step !== 4 && (
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                            >
                                <ArrowLeft size={16} />
                                Quay lại đăng nhập
                            </Link>
                        )}
                    </div>

                    <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                        <ShieldCheck size={14} className="text-emerald-400" />
                        <span>Bảo vệ tài khoản an toàn 24/7 với Family Management</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
