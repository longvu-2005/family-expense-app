import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, Loader2, ArrowLeft } from 'lucide-react';

export default function ReceiptScanner() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [expenseData, setExpenseData] = useState(null);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setExpenseData(null);
            setError('');
        }
    };

    const handleScan = async () => {
        if (!selectedFile) {
            setError('Vui lòng chọn ảnh hóa đơn trước khi quét!');
            return;
        }

        const formData = new FormData();
        formData.append('receipt', selectedFile);

        setLoading(true);
        setError('');
        try {
            const response = await axios.post('http://localhost:5000/api/scan-receipt', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (response.data.success) {
                setExpenseData(response.data.data);
            } else {
                setError(response.data.message || 'Lỗi khi bóc tách hóa đơn!');
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Không thể kết nối đến máy chủ backend (port 5000)! Vui lòng kiểm tra backend.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 py-10 px-4 text-white">
            <div className="max-w-2xl mx-auto mb-6 flex items-center justify-between">
                <Link to="/" className="text-indigo-400 font-semibold hover:text-indigo-300 flex items-center gap-2 transition">
                    <ArrowLeft size={18} /> Quay lại Trang chủ
                </Link>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-300 to-white bg-clip-text text-transparent">
                    🧾 Trợ lý AI Quét Hóa Đơn
                </h1>
            </div>

            <div className="max-w-2xl mx-auto bg-slate-900/80 backdrop-blur-xl shadow-2xl rounded-3xl p-6 sm:p-8 border border-white/10">
                {error && (
                    <div className="mb-6 bg-red-500/10 border border-red-500/30 p-4 text-sm text-red-300 rounded-2xl flex items-center gap-2">
                        <span>⚠️</span>
                        <span>{error}</span>
                    </div>
                )}

                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-300 mb-2">Tải lên hình ảnh hóa đơn</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-600/20 file:text-indigo-300 hover:file:bg-indigo-600/30 cursor-pointer"
                    />
                    {previewUrl && (
                        <div className="mt-4 text-center">
                            <img src={previewUrl} alt="Preview" className="max-h-64 mx-auto rounded-2xl border border-white/10 shadow-lg object-contain" />
                        </div>
                    )}
                </div>

                <button
                    onClick={handleScan}
                    disabled={loading}
                    className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" size={20} /> Đang phân tích hóa đơn bằng AI...
                        </>
                    ) : (
                        'Bắt đầu Quét Hóa Đơn'
                    )}
                </button>

                {expenseData && (
                    <div className="mt-8 bg-slate-800/60 p-6 rounded-2xl border border-white/10 space-y-4">
                        <h3 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
                            <CheckCircle size={22} /> Kết quả trích xuất thành công:
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <div className="bg-white/5 p-3.5 rounded-xl border border-white/5">
                                <span className="text-slate-400 block text-xs">Cửa hàng / Dịch vụ</span>
                                <strong className="text-white text-base">{expenseData.store_name || 'Không xác định'}</strong>
                            </div>
                            <div className="bg-white/5 p-3.5 rounded-xl border border-white/5">
                                <span className="text-slate-400 block text-xs">Tổng chi phí</span>
                                <strong className="text-indigo-400 text-base">
                                    {Number(expenseData.total_amount || 0).toLocaleString('vi-VN')} đ
                                </strong>
                            </div>
                            <div className="bg-white/5 p-3.5 rounded-xl border border-white/5">
                                <span className="text-slate-400 block text-xs">Danh mục</span>
                                <strong className="text-emerald-400">{expenseData.category || 'Khác'}</strong>
                            </div>
                            <div className="bg-white/5 p-3.5 rounded-xl border border-white/5">
                                <span className="text-slate-400 block text-xs">Ngày ghi nhận</span>
                                <strong className="text-slate-200">{expenseData.date || 'Hôm nay'}</strong>
                            </div>
                        </div>
                        {expenseData.note && (
                            <div className="text-xs text-amber-300 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                                💡 {expenseData.note}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}