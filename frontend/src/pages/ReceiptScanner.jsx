import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, Loader2, ArrowLeft, Upload, Receipt, Sparkles } from 'lucide-react';

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
                setError(response.data.message || 'Không thể bóc tách hóa đơn.');
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Lỗi kết nối tới máy chủ bóc tách hóa đơn!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-blue-50 py-10 px-4">
            <div className="max-w-2xl mx-auto mb-6 flex items-center justify-between">
                <Link to="/" className="text-indigo-600 font-semibold hover:underline flex items-center gap-2 text-sm">
                    <ArrowLeft size={18} /> Về Trang chủ
                </Link>
                <div className="flex items-center gap-2 text-indigo-700 font-bold bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100">
                    <Sparkles size={18} /> Gemini AI OCR
                </div>
            </div>

            <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
                <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-indigo-200">
                        <Receipt size={24} />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900">Quét Hóa Đơn Tự Động</h2>
                    <p className="text-sm text-gray-500 mt-1">Hệ thống AI sẽ tự động đọc số tiền, tên cửa hàng, ngày và phân loại danh mục</p>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 text-sm text-red-700 rounded-r-lg">
                        {error}
                    </div>
                )}

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tải lên hình ảnh hóa đơn</label>
                    <div className="border-2 border-dashed border-gray-300 hover:border-indigo-500 rounded-2xl p-6 text-center transition cursor-pointer bg-slate-50/50">
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileChange} 
                            id="receipt-upload"
                            className="hidden" 
                        />
                        <label htmlFor="receipt-upload" className="cursor-pointer block">
                            <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                            <span className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                                Bấm vào đây để chọn ảnh
                            </span>
                            <span className="text-xs text-gray-500 block mt-1">Hỗ trợ JPG, PNG, WEBP (Tối đa 10MB)</span>
                        </label>
                    </div>

                    {previewUrl && (
                        <div className="mt-4 text-center">
                            <p className="text-xs text-gray-500 mb-2 font-medium">Ảnh hóa đơn đã chọn:</p>
                            <img src={previewUrl} alt="Preview" className="max-h-64 mx-auto rounded-xl border border-gray-200 shadow-md" />
                        </div>
                    )}
                </div>

                <button
                    onClick={handleScan}
                    disabled={loading || !selectedFile}
                    className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" size={20} /> Đang phân tích hóa đơn bằng AI...
                        </>
                    ) : (
                        <>
                            <Sparkles size={18} /> Bắt đầu Quét Hóa Đơn
                        </>
                    )}
                </button>

                {expenseData && (
                    <div className="mt-8 bg-slate-50 p-6 rounded-2xl border border-indigo-100 shadow-sm space-y-3">
                        <h3 className="text-lg font-bold text-green-600 flex items-center gap-2">
                            <CheckCircle size={22} /> Kết quả trích xuất thành công:
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm pt-2">
                            <div className="bg-white p-3 rounded-xl border border-gray-100">
                                <span className="text-gray-500 block text-xs">Cửa hàng / Địa điểm</span>
                                <strong className="text-gray-900 text-base">{expenseData.store_name}</strong>
                            </div>
                            <div className="bg-white p-3 rounded-xl border border-gray-100">
                                <span className="text-gray-500 block text-xs">Tổng số tiền</span>
                                <strong className="text-indigo-600 text-base">
                                    {Number(expenseData.total_amount).toLocaleString('vi-VN')} VNĐ
                                </strong>
                            </div>
                            <div className="bg-white p-3 rounded-xl border border-gray-100">
                                <span className="text-gray-500 block text-xs">Danh mục chi tiêu</span>
                                <strong className="text-gray-800">{expenseData.category}</strong>
                            </div>
                            <div className="bg-white p-3 rounded-xl border border-gray-100">
                                <span className="text-gray-500 block text-xs">Ngày trên hóa đơn</span>
                                <strong className="text-gray-800">{expenseData.date}</strong>
                            </div>
                        </div>

                        {expenseData.note && (
                            <p className="text-xs text-amber-600 bg-amber-50 p-2.5 rounded-lg border border-amber-200 mt-2">
                                💡 {expenseData.note}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
