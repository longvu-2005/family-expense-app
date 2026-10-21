import React, { useState } from 'react';
import axios from 'axios';
import { Upload, CheckCircle, Loader2 } from 'lucide-react';

function App() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [expenseData, setExpenseData] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setExpenseData(null);
        }
    };

    const handleScan = async () => {
        if (!selectedFile) {
            alert('Vui lòng chọn ảnh hóa đơn!');
            return;
        }

        const formData = new FormData();
        formData.append('receipt', selectedFile);

        setLoading(true);
        try {
            // Gọi sang backend Node.js (Port 5000)
            const response = await axios.post('http://localhost:5000/api/scan-receipt', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setExpenseData(response.data.data);
        } catch (error) {
            console.error(error);
            alert('Lỗi khi bóc tách hóa đơn!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '40px auto', padding: '24px', fontFamily: 'Arial, sans-serif', background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: '12px' }}>
            <h2 style={{ textAlign: 'center', color: '#333' }}>🧾 Quét Hóa Đơn Gia Đình bằng AI</h2>

            <div style={{ marginBottom: '20px' }}>
                <input type="file" accept="image/*" onChange={handleFileChange} style={{ marginBottom: '10px' }} />
                {previewUrl && (
                    <div style={{ marginTop: '10px', textAlign: 'center' }}>
                        <img src={previewUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', border: '1px solid #ddd' }} />
                    </div>
                )}
            </div>

            <button
                onClick={handleScan}
                disabled={loading}
                style={{ width: '100%', padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
            >
                {loading ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><Loader2 className="animate-spin" size={18} /> Đang đọc hóa đơn...</span> : 'Bắt đầu Quét'}
            </button>

            {expenseData && (
                <div style={{ marginTop: '24px', background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16a34a', marginTop: 0 }}>
                        <CheckCircle size={20} /> Kết quả trích xuất:
                    </h3>
                    <p><strong>Cửa hàng:</strong> {expenseData.store_name}</p>
                    <p><strong>Tổng tiền:</strong> {Number(expenseData.total_amount).toLocaleString('vi-VN')} VNĐ</p>
                    <p><strong>Danh mục:</strong> {expenseData.category}</p>
                    <p><strong>Ngày:</strong> {expenseData.date}</p>
                </div>
            )}
        </div>
    );
}

export default App;