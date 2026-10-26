
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import {
    Lock,
    Mail,
    ArrowRight,
    ArrowLeft,
    Receipt,
    Eye,
    EyeOff,
    Loader2,
    ShieldCheck
} from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post(
                'http://localhost:5000/api/auth/login',
                {
                    email: email.trim(),
                    password
                }
            );

            const data = response.data;

            console.log('TOÀN BỘ API:', JSON.stringify(data, null, 2));
            console.log('USER:', data.user);
            console.log('DATA.USER:', data.data?.user);

            // Đọc thông tin user và token từ API
            const user = data.user || data.data?.user;
            const token = data.token || data.data?.token;

            if (data.success === false || !user || !token) {
                setError(
                    data.message ||
                    'Đăng nhập thất bại: dữ liệu trả về từ API không hợp lệ.'
                );
                return;
            }

            const rawRole =
                user.role ??
                user.roleId ??
                user.role_id ??
                user.Role ??
                user.rolename;

            const role =
                typeof rawRole === 'string' && rawRole.trim().toLowerCase() === 'admin'
                    ? 1
                    : Number(rawRole);

            console.log('API response:', response.data);
            console.log('User object:', user);
            console.log('Raw role:', rawRole);
            console.log('Converted role:', role);

            if (![1, 2].includes(role)) {
                setError('Không đọc được quyền tài khoản. Hãy kiểm tra Console.');
                return;
            }

            // Lưu thông tin đăng nhập
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('role', String(role));

            console.log('Login response:', data);
            console.log('User:', user);
            console.log('Role:', role);
            console.log('Saved role:', localStorage.getItem('role'));

            // Điều hướng theo quyền: role = 1 vào Admin, role = 2 vào UserHome
            if (role === 1) {
                navigate('/admin', { replace: true });
            } else {
                navigate('/user', { replace: true });
            }
        } catch (err) {
            console.error('Login error:', err);

            setError(
                err.response?.data?.message ||
                (err.response
                    ? `Lỗi đăng nhập: HTTP ${err.response.status}`
                    : 'Không kết nối được backend. Hãy kiểm tra server và port 5000.')
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans flex items-center justify-center px-4 py-12 relative overflow-hidden selection:bg-indigo-500 selection:text-white">

            {/* Background effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl animate-pulse-glow" />
                <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl animate-float" />
            </div>

            {/* Back to home */}
            <div className="absolute top-6 left-6 z-20">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md transition-all duration-200 hover:bg-white/10 hover:scale-105"
                >
                    <ArrowLeft size={16} />
                    Về Trang chủ
                </Link>
            </div>

            {/* Login card */}
            <div className="w-full max-w-md relative z-10">

                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur-2xl opacity-25" />

                <div className="relative bg-slate-900/85 backdrop-blur-2xl p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl shadow-indigo-500/10 space-y-6">

                    {/* Header */}
                    <div className="text-center space-y-3">
                        <Link to="/" className="inline-block">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-500/30 border border-indigo-400/30 transition-transform hover:scale-105">
                                <Receipt size={26} />
                            </div>
                        </Link>

                        <div>
                            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                                Chào mừng trở lại
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-400 mt-1">
                                Đăng nhập để quản lý quỹ chi tiêu gia đình thông minh
                            </p>
                        </div>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div
                            role="alert"
                            className="bg-red-500/10 border border-red-500/30 p-3.5 text-xs text-red-300 rounded-xl flex items-start gap-2.5"
                        >
                            <span className="shrink-0 text-base">⚠️</span>
                            <span className="leading-relaxed">{error}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form className="space-y-4" onSubmit={handleLogin}>

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="login-email"
                                className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5"
                            >
                                Địa chỉ Email
                            </label>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <Mail size={18} />
                                </div>

                                <input
                                    id="login-email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-4 py-3 bg-slate-950/70 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label
                                    htmlFor="login-password"
                                    className="block text-xs font-bold uppercase tracking-wider text-slate-300"
                                >
                                    Mật khẩu
                                </label>

                                <Link
                                    to="/forgot-password"
                                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                                >
                                    Quên mật khẩu?
                                </Link>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <Lock size={18} />
                                </div>

                                <input
                                    id="login-password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-11 py-3 bg-slate-950/70 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                    placeholder="••••••••"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                                    aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                                    aria-pressed={showPassword}
                                >
                                    {showPassword
                                        ? <EyeOff size={18} />
                                        : <Eye size={18} />
                                    }
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 border border-indigo-400/30 transition-all duration-200 hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} />
                                        Đang đăng nhập...
                                    </>
                                ) : (
                                    <>
                                        Đăng nhập ngay
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Register */}
                    <div className="pt-4 border-t border-white/10 text-center">
                        <p className="text-xs sm:text-sm text-slate-400">
                            Chưa có tài khoản?{' '}
                            <Link
                                to="/register"
                                className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                            >
                                Đăng ký miễn phí
                            </Link>
                        </p>
                    </div>

                    {/* Security badge */}
                    <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                        <ShieldCheck size={14} className="text-emerald-400" />
                        <span>Mã hóa bảo mật 256-bit • Tiêu chuẩn ngân hàng</span>
                    </div>

                </div>
            </div>
        </div>
    );
}
