import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
    Send,
    Bell,
    User,
    Users,
    UsersRound,
    MessageSquare,
    Search,
    Plus,
    X,
    ArrowLeft,
    Check,
    Shield,
    Sparkles,
    CheckCheck,
    Smile,
    RefreshCw,
    UserCheck,
    MessageCircle
} from 'lucide-react';
import ThemeToggle from '../../components/ThemeToggle';
import './ChatPage.css';

const API_BASE = 'http://localhost:5000/api/messages';

export default function ChatPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Lấy thông tin user hiện tại từ localStorage
    const currentUser = useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem('user') || '{}');
        } catch {
            return {};
        }
    }, []);

    const myUserId = currentUser.user_id || currentUser.id;
    const myRole = Number(currentUser.role ?? currentUser.role_id ?? 2);

    // Tab đang chọn: 'direct' (1-1) hoặc 'groups' (nhóm)
    const initialTab = searchParams.get('tab') === 'groups' ? 'groups' : 'direct';
    const [activeTab, setActiveTab] = useState(initialTab);

    // Danh sách liên hệ và nhóm
    const [contacts, setContacts] = useState([]);
    const [groups, setGroups] = useState([]);
    const [activeChat, setActiveChat] = useState(null); // { type: 'direct'|'group', data: user|group }

    // Tin nhắn trong hội thoại hiện tại
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loadingChat, setLoadingChat] = useState(false);
    const [sending, setSending] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    // Tìm kiếm trong danh bạ
    const [searchTerm, setSearchTerm] = useState('');

    // Modal tạo nhóm
    const [showCreateGroup, setShowCreateGroup] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [creatingGroup, setCreatingGroup] = useState(false);

    const messagesEndRef = useRef(null);

    // Tự động cuộn xuống tin nhắn cuối cùng
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // 1. Tải danh sách liên hệ (1-1) và nhóm
    const fetchContactsAndGroups = async () => {
        if (!myUserId) return;
        try {
            // Lấy danh bạ người dùng & admin
            const contactRes = await axios.get(`${API_BASE}/contacts/${myUserId}`);
            if (contactRes.data.success) {
                setContacts(contactRes.data.data);
            }

            // Lấy danh sách nhóm
            const groupRes = await axios.get(`${API_BASE}/groups/${myUserId}`);
            if (groupRes.data.success) {
                setGroups(groupRes.data.data);
            }

            // Lấy tổng thông báo tin chưa đọc
            const unreadRes = await axios.get(`${API_BASE}/unread/${myUserId}`);
            if (unreadRes.data.success) {
                setUnreadCount(unreadRes.data.unreadCount || 0);
            }
        } catch (err) {
            console.error('Lỗi tải danh bạ/nhóm:', err);
        }
    };

    // 2. Tải tin nhắn của hội thoại đang chọn
    const fetchMessages = async () => {
        if (!activeChat || !myUserId) return;

        try {
            if (activeChat.type === 'direct') {
                const targetUserId = activeChat.data.user_id;
                const res = await axios.get(`${API_BASE}/${myUserId}/${targetUserId}`);
                if (res.data.success) {
                    setMessages(res.data.data);
                }
            } else if (activeChat.type === 'group') {
                const groupId = activeChat.data.group_id;
                const res = await axios.get(`${API_BASE}/group/${groupId}`);
                if (res.data.success) {
                    setMessages(res.data.data);
                }
            }
        } catch (err) {
            console.error('Lỗi tải tin nhắn:', err);
        }
    };

    // Khi khởi động component
    useEffect(() => {
        if (!myUserId) {
            navigate('/login');
            return;
        }

        fetchContactsAndGroups().then(() => {
            // Mặc định chọn hội thoại đầu tiên nếu chưa chọn
            if (!activeChat && contacts.length > 0) {
                setActiveChat({ type: 'direct', data: contacts[0] });
            }
        });
    }, [myUserId]);

    // Mặc định chọn người nhận đầu tiên nếu chưa chọn
    useEffect(() => {
        if (!activeChat) {
            if (activeTab === 'direct' && contacts.length > 0) {
                setActiveChat({ type: 'direct', data: contacts[0] });
            } else if (activeTab === 'groups' && groups.length > 0) {
                setActiveChat({ type: 'group', data: groups[0] });
            }
        }
    }, [activeTab, contacts, groups]);

    // Tự động tải tin nhắn khi đổi người/nhóm chat
    useEffect(() => {
        setLoadingChat(true);
        fetchMessages().finally(() => {
            setLoadingChat(false);
            scrollToBottom();
        });
    }, [activeChat]);

    // Polling định kỳ mỗi 2.5s để cập nhật tin nhắn theo thời gian thực
    useEffect(() => {
        const interval = setInterval(() => {
            fetchMessages();
            fetchContactsAndGroups();
        }, 2500);

        return () => clearInterval(interval);
    }, [activeChat]);

    // Cuộn xuống khi tin nhắn thay đổi
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // 3. Gửi tin nhắn mới
    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeChat || sending) return;

        const content = newMessage.trim();
        setNewMessage('');
        setSending(true);

        try {
            const payload = {
                sender_id: myUserId,
                content
            };

            if (activeChat.type === 'direct') {
                payload.receiver_id = activeChat.data.user_id;
            } else if (activeChat.type === 'group') {
                payload.group_id = activeChat.data.group_id;
            }

            const res = await axios.post(API_BASE, payload);
            if (res.data.success) {
                await fetchMessages();
                await fetchContactsAndGroups();
                scrollToBottom();
            }
        } catch (err) {
            console.error('Gửi tin nhắn thất bại:', err);
        } finally {
            setSending(false);
        }
    };

    // 4. Tạo nhóm chat mới
    const handleCreateGroup = async (e) => {
        e.preventDefault();
        if (!groupName.trim() || creatingGroup) return;

        setCreatingGroup(true);
        try {
            const res = await axios.post(`${API_BASE}/groups`, {
                group_name: groupName.trim(),
                created_by: myUserId,
                member_ids: selectedMembers
            });

            if (res.data.success) {
                setGroupName('');
                setSelectedMembers([]);
                setShowCreateGroup(false);
                await fetchContactsAndGroups();

                // Chọn ngay nhóm vừa tạo
                setActiveTab('groups');
                if (res.data.group) {
                    setActiveChat({ type: 'group', data: res.data.group });
                }
            }
        } catch (err) {
            console.error('Tạo nhóm lỗi:', err);
        } finally {
            setCreatingGroup(false);
        }
    };

    // Toggle chọn thành viên nhóm
    const toggleSelectMember = (userId) => {
        if (selectedMembers.includes(userId)) {
            setSelectedMembers(selectedMembers.filter(id => id !== userId));
        } else {
            setSelectedMembers([...selectedMembers, userId]);
        }
    };

    // Lọc danh bạ theo từ khóa tìm kiếm
    const filteredContacts = useMemo(() => {
        const kw = searchTerm.trim().toLowerCase();
        if (!kw) return contacts;
        return contacts.filter(c =>
            (c.full_name || '').toLowerCase().includes(kw) ||
            (c.email || '').toLowerCase().includes(kw)
        );
    }, [contacts, searchTerm]);

    const filteredGroups = useMemo(() => {
        const kw = searchTerm.trim().toLowerCase();
        if (!kw) return groups;
        return groups.filter(g =>
            (g.group_name || '').toLowerCase().includes(kw)
        );
    }, [groups, searchTerm]);

    return (
        <div className="uc-page">
            {/* Topbar điều hướng */}
            <header className="uc-header">
                <div className="uc-header-left">
                    <Link
                        to={myRole === 1 ? "/admin" : "/user"}
                        className="uc-back-btn"
                    >
                        <ArrowLeft size={15} />
                        <span>{myRole === 1 ? "Quay lại Admin" : "Quay lại Bảng tin"}</span>
                    </Link>

                    <div className="uc-header-divider hidden sm:block" />

                    <div className="uc-brand">
                        <div className="uc-brand-icon">
                            <MessageSquare size={17} />
                        </div>
                        <div>
                            <h1 className="uc-brand-title">
                                Tin nhắn gia đình & Hỗ trợ
                                <span className="uc-role-badge">
                                    {myRole === 1 ? "Admin Console" : "Thành viên"}
                                </span>
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Unread notification badge & Theme Toggle */}
                <div className="uc-header-right">
                    <ThemeToggle variant="switch" />
                    <div className="uc-unread-badge">
                        <Bell size={15} className="text-amber-500" />
                        <span className="hidden sm:inline">Chưa đọc:</span>
                        <span className={`uc-unread-count ${unreadCount === 0 ? "zero" : ""}`}>
                            {unreadCount}
                        </span>
                    </div>
                </div>
            </header>

            {/* Khung chat chính (Chia 2 cột: Danh bạ bên trái + Cửa sổ chat bên phải) */}
            <div className="uc-main-grid">
                {/* ========================================================= */}
                {/* CỘT TRÁI: Danh sách Người dùng & Nhóm                     */}
                {/* ========================================================= */}
                <div className="uc-sidebar-card">
                    {/* Header Tabs: Trực tiếp / Nhóm */}
                    <div className="uc-sidebar-head">
                        <div className="uc-tabs">
                            <button
                                onClick={() => setActiveTab('direct')}
                                className={`uc-tab-btn ${activeTab === 'direct' ? 'active' : ''}`}
                            >
                                <User size={13} />
                                <span>Thành viên & Admin</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('groups')}
                                className={`uc-tab-btn ${activeTab === 'groups' ? 'active' : ''}`}
                            >
                                <UsersRound size={13} />
                                <span>Nhóm ({groups.length})</span>
                            </button>
                        </div>

                        {/* Thanh tìm kiếm */}
                        <div className="uc-search">
                            <Search size={14} className="uc-search-icon" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder={activeTab === 'direct' ? "Tìm theo tên hoặc email..." : "Tìm tên nhóm..."}
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="uc-search-clear"
                                >
                                    <X size={13} />
                                </button>
                            )}
                        </div>

                        {/* Nút Tạo nhóm mới khi đang ở tab Nhóm */}
                        {activeTab === 'groups' && (
                            <button
                                onClick={() => setShowCreateGroup(true)}
                                className="uc-btn-create-group"
                            >
                                <Plus size={15} />
                                <span>Tạo nhóm gia đình mới</span>
                            </button>
                        )}
                    </div>

                    {/* Danh sách người chat / nhóm */}
                    <div className="uc-contact-list">
                        {/* TAB 1: NGƯỜI DÙNG 1-1 */}
                        {activeTab === 'direct' && (
                            filteredContacts.length === 0 ? (
                                <div className="uc-empty-contacts">
                                    Không tìm thấy liên hệ nào.
                                </div>
                            ) : (
                                filteredContacts.map((contact) => {
                                    const isSelected = activeChat?.type === 'direct' && activeChat.data.user_id === contact.user_id;
                                    const isAdmin = Number(contact.role) === 1;

                                    return (
                                        <button
                                            key={contact.user_id}
                                            onClick={() => setActiveChat({ type: 'direct', data: contact })}
                                            className={`uc-item ${isSelected ? 'active' : ''}`}
                                        >
                                            <div className="uc-item-avatar-wrap">
                                                <div className={`uc-item-avatar ${isAdmin ? 'admin' : ''}`}>
                                                    {(contact.full_name || 'U').charAt(0).toUpperCase()}
                                                </div>
                                                <span className="uc-online-dot" />
                                            </div>

                                            <div className="uc-item-content">
                                                <div className="uc-item-row-top">
                                                    <span className="uc-item-name">
                                                        {contact.full_name}
                                                        {isAdmin && (
                                                            <span className="uc-badge-admin">
                                                                Admin
                                                            </span>
                                                        )}
                                                    </span>
                                                    {contact.unread_count > 0 && (
                                                        <span className="uc-unread-count">
                                                            {contact.unread_count}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="uc-item-preview">
                                                    {contact.last_message || contact.email || "Bắt đầu cuộc trò chuyện..."}
                                                </p>
                                            </div>
                                        </button>
                                    );
                                })
                            )
                        )}

                        {/* TAB 2: NHÓM GIA ĐÌNH */}
                        {activeTab === 'groups' && (
                            filteredGroups.length === 0 ? (
                                <div className="uc-empty-contacts">
                                    Chưa tham gia nhóm nào. Hãy bấm <strong>Tạo nhóm mới</strong> ở trên!
                                </div>
                            ) : (
                                filteredGroups.map((group) => {
                                    const isSelected = activeChat?.type === 'group' && activeChat.data.group_id === group.group_id;

                                    return (
                                        <button
                                            key={group.group_id}
                                            onClick={() => setActiveChat({ type: 'group', data: group })}
                                            className={`uc-item ${isSelected ? 'active' : ''}`}
                                        >
                                            <div className="uc-item-avatar-wrap">
                                                <div className="uc-item-avatar">
                                                    <UsersRound size={17} />
                                                </div>
                                            </div>

                                            <div className="uc-item-content">
                                                <div className="uc-item-row-top">
                                                    <span className="uc-item-name">
                                                        {group.group_name}
                                                    </span>
                                                    <span style={{ fontSize: '10px', color: 'var(--uc-muted)' }}>
                                                        {group.member_count} tv
                                                    </span>
                                                </div>
                                                <p className="uc-item-preview">
                                                    {group.last_message || "Chưa có tin nhắn trong nhóm"}
                                                </p>
                                            </div>
                                        </button>
                                    );
                                })
                            )
                        )}
                    </div>
                </div>

                {/* ========================================================= */}
                {/* CỘT PHẢI: Khung chat đang hoạt động                       */}
                {/* ========================================================= */}
                <div className="uc-chat-card">
                    {activeChat ? (
                        <>
                            {/* Header cuộc trò chuyện */}
                            <div className="uc-chat-head">
                                <div className="uc-chat-head-user">
                                    <div className="uc-chat-head-avatar">
                                        {activeChat.type === 'direct' ? (
                                            (activeChat.data.full_name || 'U').charAt(0).toUpperCase()
                                        ) : (
                                            <UsersRound size={18} />
                                        )}
                                    </div>
                                    <div className="uc-chat-head-copy">
                                        <strong>
                                            {activeChat.type === 'direct' ? activeChat.data.full_name : activeChat.data.group_name}
                                            {activeChat.type === 'direct' && Number(activeChat.data.role) === 1 && (
                                                <span className="uc-badge-admin">
                                                    Admin Hệ Thống
                                                </span>
                                            )}
                                            {activeChat.type === 'group' && (
                                                <span className="uc-role-badge">
                                                    Nhóm gia đình
                                                </span>
                                            )}
                                        </strong>
                                        <span>
                                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                                            {activeChat.type === 'direct' ? (activeChat.data.email || 'Đang hoạt động') : `${activeChat.data.member_count || ''} thành viên gia đình`}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={fetchMessages}
                                    title="Tải lại tin nhắn"
                                    className="uc-btn-reload"
                                >
                                    <RefreshCw size={15} />
                                </button>
                            </div>

                            {/* Danh sách tin nhắn cuộn */}
                            <div className="uc-messages">
                                {loadingChat ? (
                                    <div style={{ textAlign: 'center', padding: '30px', color: 'var(--uc-muted)', fontSize: '11px' }}>
                                        Đang tải tin nhắn...
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="uc-empty-state">
                                        <div className="uc-empty-state-icon">
                                            <MessageCircle size={24} />
                                        </div>
                                        <h3>Chưa có tin nhắn nào trong cuộc trò chuyện</h3>
                                        <p>Hãy gửi lời chào đầu tiên để cùng nhau kết nối và quản lý chi tiêu gia đình!</p>
                                    </div>
                                ) : (
                                    messages.map((msg, index) => {
                                        const isMe = msg.sender_id === myUserId;

                                        return (
                                            <div key={msg.message_id || index} className={`uc-bubble-wrap ${isMe ? 'me' : 'other'}`}>
                                                {!isMe && activeChat.type === 'group' && (
                                                    <span className="uc-sender-name">
                                                        {msg.sender_name || `Thành viên #${msg.sender_id}`}
                                                    </span>
                                                )}

                                                <div className={`uc-bubble ${isMe ? 'me' : 'other'}`}>
                                                    <p style={{ margin: 0 }}>{msg.content}</p>
                                                    <span className={`uc-time ${isMe ? 'me' : 'other'}`}>
                                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Ô nhập và gửi tin nhắn */}
                            <form onSubmit={handleSend} className="uc-input-bar">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder={activeChat.type === 'group' ? `Gửi tin nhắn vào nhóm ${activeChat.data.group_name}...` : `Nhắn tin cho ${activeChat.data.full_name}...`}
                                />
                                <button
                                    type="submit"
                                    disabled={sending || !newMessage.trim()}
                                    className="uc-send-btn"
                                >
                                    <Send size={15} />
                                    <span className="hidden sm:inline">Gửi</span>
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="uc-empty-state">
                            <div className="uc-empty-state-icon">
                                <MessageSquare size={32} />
                            </div>
                            <h3>Hộp thư trò chuyện</h3>
                            <p>Chọn một người liên hệ hoặc nhóm từ danh sách bên trái để bắt đầu nhắn tin.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ========================================================= */}
            {/* MODAL TẠO NHÓM MỚI                                        */}
            {/* ========================================================= */}
            {showCreateGroup && (
                <div
                    className="uc-modal-backdrop"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) setShowCreateGroup(false);
                    }}
                >
                    <div className="uc-modal">
                        <div className="uc-modal-head">
                            <h3>
                                <UsersRound size={18} style={{ color: 'var(--uc-primary)' }} />
                                Tạo nhóm gia đình mới
                            </h3>
                            <button
                                onClick={() => setShowCreateGroup(false)}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateGroup} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div>
                                <label>
                                    Tên nhóm
                                    <input
                                        type="text"
                                        required
                                        value={groupName}
                                        onChange={(e) => setGroupName(e.target.value)}
                                        placeholder="VD: Gia đình nhỏ, Chi tiêu chung..."
                                    />
                                </label>
                            </div>

                            <div>
                                <label>
                                    Chọn thành viên tham gia ({selectedMembers.length} đã chọn)
                                    <div className="uc-modal-members">
                                        {contacts.map((contact) => {
                                            const isSelected = selectedMembers.includes(contact.user_id);

                                            return (
                                                <div
                                                    key={contact.user_id}
                                                    onClick={() => toggleSelectMember(contact.user_id)}
                                                    className={`uc-member-item ${isSelected ? 'selected' : ''}`}
                                                >
                                                    <div className="uc-member-info">
                                                        <div className="uc-member-avatar">
                                                            {(contact.full_name || 'U').charAt(0)}
                                                        </div>
                                                        <div>
                                                            <span className="uc-member-name">{contact.full_name}</span>
                                                            <span className="uc-member-email">{contact.email}</span>
                                                        </div>
                                                    </div>

                                                    <div className={`uc-member-checkbox ${isSelected ? 'checked' : ''}`}>
                                                        {isSelected && <Check size={12} />}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </label>
                            </div>

                            <div className="uc-modal-actions">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateGroup(false)}
                                    className="uc-btn-cancel"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={creatingGroup || !groupName.trim()}
                                    className="uc-btn-submit"
                                >
                                    {creatingGroup ? "Đang tạo nhóm..." : "Xác nhận tạo nhóm"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

