import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, X, Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function MiniChatWidget() {
    const { isDark } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'ai', text: 'Xin chào! Tôi là trợ lý AI gia đình. Tôi có thể giúp gì cho bạn hôm nay?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Tự động cuộn xuống tin nhắn mới nhất
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isOpen]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
        setLoading(true);

        try {
            // Gọi API Backend Node.js đã kết nối Gemini
            const res = await axios.post('http://localhost:5000/api/ai/chat', { message: userMsg });
            if (res.data.success) {
                setMessages(prev => [...prev, { sender: 'ai', text: res.data.reply }]);
            } else {
                setMessages(prev => [...prev, { sender: 'ai', text: res.data.message || 'Xin lỗi, tôi đang gặp sự cố nhỏ. Thử lại sau nhé!' }]);
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Không thể kết nối đến máy chủ AI.';
            setMessages(prev => [...prev, { sender: 'ai', text: errorMsg }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            {/* KHUNG CHAT MỞ RỘNG */}
            {isOpen ? (
                <div className={`w-80 sm:w-96 rounded-2xl shadow-2xl flex flex-col h-[490px] overflow-hidden animate-in fade-in zoom-in-95 duration-200 border transition-colors ${
                    isDark
                        ? "bg-[#0d142b] border-slate-700/80 text-slate-100 shadow-purple-950/40"
                        : "bg-white border-slate-200/90 text-slate-800 shadow-sky-500/10"
                }`}>

                    {/* Header Khung Chat */}
                    <div className={`p-4 text-white flex items-center justify-between shadow-sm transition-colors ${
                        isDark
                            ? "bg-gradient-to-r from-indigo-600 to-purple-600"
                            : "bg-gradient-to-r from-sky-600 to-blue-600"
                    }`}>
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                                <Sparkles size={18} className="text-amber-200" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm tracking-tight">Trợ lý AI Gia Đình</h3>
                                <p className="text-[10px] text-sky-100 flex items-center gap-1.5 font-medium">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                    Luôn sẵn sàng hỗ trợ bạn
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1.5 rounded-lg hover:bg-white/20 text-white/90 hover:text-white transition-colors cursor-pointer"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Danh sách tin nhắn */}
                    <div className={`flex-1 p-4 overflow-y-auto space-y-3 transition-colors ${
                        isDark ? "bg-[#080d1b]" : "bg-slate-50"
                    }`}>
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                                    msg.sender === 'user'
                                        ? (isDark ? "bg-purple-600 text-white" : "bg-sky-600 text-white")
                                        : (isDark ? "bg-indigo-600 text-white" : "bg-blue-600 text-white")
                                }`}>
                                    {msg.sender === 'user' ? <User size={13} /> : <Bot size={13} />}
                                </div>
                                <div className={`max-w-[75%] p-3 rounded-2xl text-xs leading-relaxed ${
                                    msg.sender === 'user'
                                        ? (isDark
                                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-none shadow-md shadow-purple-600/30"
                                            : "bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-tr-none shadow-sm shadow-sky-600/20")
                                        : (isDark
                                            ? "bg-[#162248] text-slate-100 rounded-tl-none border border-slate-700/60 shadow-sm"
                                            : "bg-white text-slate-800 rounded-tl-none border border-slate-200 shadow-sm")
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className={`flex items-center gap-2 text-xs italic p-2.5 rounded-xl border w-fit ${
                                isDark ? "bg-[#162248] text-slate-300 border-slate-700" : "bg-white text-slate-500 border-slate-200/80"
                            }`}>
                                <Loader2 className={`animate-spin ${isDark ? "text-purple-400" : "text-sky-600"}`} size={14} /> AI đang suy nghĩ câu trả lời...
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Ô nhập tin nhắn */}
                    <form onSubmit={handleSendMessage} className={`p-3 border-t flex items-center gap-2 transition-colors ${
                        isDark ? "bg-[#0d142b] border-slate-700/80" : "bg-white border-slate-200"
                    }`}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Nhập câu hỏi chi tiêu của bạn..."
                            className={`flex-1 border rounded-xl px-3.5 py-2 text-xs outline-none transition-all ${
                                isDark
                                    ? "bg-white/5 border-slate-700 text-white placeholder-slate-400 focus:border-purple-500 focus:bg-white/10"
                                    : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-sky-500 focus:bg-white"
                            }`}
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className={`p-2.5 text-white rounded-xl transition-all disabled:opacity-50 shadow-md cursor-pointer ${
                                isDark
                                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-purple-600/30"
                                    : "bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 shadow-sky-600/20"
                            }`}
                        >
                            <Send size={15} />
                        </button>
                    </form>
                </div>
            ) : (
                /* NÚT TRÒN BONG BÓNG */
                <button
                    onClick={() => setIsOpen(true)}
                    className={`relative w-14 h-14 rounded-full text-white shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 group cursor-pointer border border-white/40 ${
                        isDark
                            ? "bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-purple-600/40"
                            : "bg-gradient-to-tr from-sky-500 to-blue-600 shadow-sky-500/30"
                    }`}
                    title="Trò chuyện với AI Gia Đình"
                >
                    <div className={`absolute inset-0 rounded-full blur-lg group-hover:scale-125 transition-transform animate-pulse ${
                        isDark ? "bg-purple-500/40" : "bg-sky-400/40"
                    }`} />
                    <MessageCircle size={26} className="relative z-10 transition-transform group-hover:rotate-12" />
                    <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full z-20" />
                </button>
            )}
        </div>
    );
}