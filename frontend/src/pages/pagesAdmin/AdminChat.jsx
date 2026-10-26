import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import {
    MessageSquare,
    Send,
    Users,
    UsersRound,
    User,
    Search,
    Plus,
    X,
    Check,
    RefreshCw,
    ShieldCheck,
    Bell,
    MessageCircle,
    CheckCheck,
    Clock
} from 'lucide-react';
import './AdminChat.css';

const API_BASE = 'http://localhost:5000/api/messages';

export default function AdminChat() {
    // Lấy thông tin Admin hiện tại từ localStorage
    const currentUser = useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem('user') || '{}');
        } catch {
            return {};
        }
    }, []);

    const myUserId = currentUser.user_id || currentUser.id || 1;

    // Tabs: 'direct' (1-1) hoặc 'groups' (nhóm)
    const [activeTab, setActiveTab] = useState('direct');

    // Dữ liệu danh bạ & nhóm
    const [contacts, setContacts] = useState([]);
    const [groups, setGroups] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // Hội thoại đang chọn: { type: 'direct'|'group', data: contact|group }
    const [activeChat, setActiveChat] = useState(null);

    // Tin nhắn & ô nhập
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loadingChat, setLoadingChat] = useState(false);
    const [sending, setSending] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Tìm kiếm
    const [search, setSearch] = useState('');

    // Modal tạo nhóm mới
    const [showCreateGroup, setShowCreateGroup] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [creatingGroup, setCreatingGroup] = useState(false);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // 1. Tải danh bạ và nhóm
    const fetchContactsAndGroups = async () => {
        if (!myUserId) return;
        setRefreshing(true);
        try {
            const [contactsRes, groupsRes, unreadRes] = await Promise.all([
                axios.get(`${API_BASE}/contacts/${myUserId}`),
                axios.get(`${API_BASE}/groups/${myUserId}`),
                axios.get(`${API_BASE}/unread/${myUserId}`)
            ]);

            if (contactsRes.data.success) {
                setContacts(contactsRes.data.data);
            }
            if (groupsRes.data.success) {
                setGroups(groupsRes.data.data);
            }
            if (unreadRes.data.success) {
                setUnreadCount(unreadRes.data.unreadCount || 0);
            }
        } catch (err) {
            console.error('Lỗi khi tải danh bạ Admin:', err);
        } finally {
            setRefreshing(false);
        }
    };

    // 2. Tải tin nhắn của hội thoại đang chọn
    const fetchMessages = async (silent = false) => {
        if (!activeChat || !myUserId) return;

        if (!silent) setLoadingChat(true);
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
        } finally {
            if (!silent) setLoadingChat(false);
        }
    };

    // Tự động tải ban đầu
    useEffect(() => {
        fetchContactsAndGroups();
    }, [myUserId]);

    // Khi đổi activeChat
    useEffect(() => {
        if (activeChat) {
            fetchMessages(false);
        } else {
            setMessages([]);
        }
    }, [activeChat]);

    // Tự động cuộn xuống khi có tin nhắn mới
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Polling định kỳ mỗi 3.5 giây để cập nhật tin nhắn mới
    useEffect(() => {
        const interval = setInterval(() => {
            if (activeChat) {
                fetchMessages(true);
            }
        }, 3500);

        return () => clearInterval(interval);
    }, [activeChat]);

    // 3. Gửi tin nhắn
    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeChat || sending) return;

        const content = newMessage.trim();
        setNewMessage('');
        setSending(true);

        try {
            const payload = {
                sender_id: myUserId,
                content: content
            };

            if (activeChat.type === 'direct') {
                payload.receiver_id = activeChat.data.user_id;
            } else {
                payload.group_id = activeChat.data.group_id;
            }

            const res = await axios.post(API_BASE, payload);
            if (res.data.success) {
                // Tải lại tin nhắn ngay lập tức
                await fetchMessages(true);
                // Cập nhật lại danh bạ
                fetchContactsAndGroups();
            }
        } catch (err) {
            console.error('Lỗi gửi tin nhắn:', err);
            alert('Không thể gửi tin nhắn. Vui lòng kiểm tra lại kết nối!');
        } finally {
            setSending(false);
        }
    };

    // 4. Tạo nhóm mới
    const handleCreateGroup = async (e) => {
        e.preventDefault();
        if (!groupName.trim() || creatingGroup) return;

        setCreatingGroup(true);
        try {
            const res = await axios.post(`${API_BASE}/group`, {
                group_name: groupName.trim(),
                created_by: myUserId,
                members: selectedMembers
            });

            if (res.data.success) {
                setShowCreateGroup(false);
                setGroupName('');
                setSelectedMembers([]);
                // Tải lại danh sách nhóm
                await fetchContactsAndGroups();
                setActiveTab('groups');
                // Tự động chọn nhóm vừa tạo
                if (res.data.group_id) {
                    setActiveChat({
                        type: 'group',
                        data: {
                            group_id: res.data.group_id,
                            group_name: groupName.trim(),
                            member_count: selectedMembers.length + 1
                        }
                    });
                }
            }
        } catch (err) {
            console.error('Lỗi tạo nhóm:', err);
            alert('Không thể tạo nhóm: ' + (err.response?.data?.message || err.message));
        } finally {
            setCreatingGroup(false);
        }
    };

    // Chọn / Bỏ chọn thành viên cho nhóm
    const toggleSelectMember = (userId) => {
        setSelectedMembers((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        );
    };

    // Danh bạ lọc theo tìm kiếm
    const filteredContacts = useMemo(() => {
        if (!search.trim()) return contacts;
        const q = search.toLowerCase();
        return contacts.filter(
            (c) =>
                (c.full_name && c.full_name.toLowerCase().includes(q)) ||
                (c.email && c.email.toLowerCase().includes(q))
        );
    }, [contacts, search]);

    // Nhóm lọc theo tìm kiếm
    const filteredGroups = useMemo(() => {
        if (!search.trim()) return groups;
        const q = search.toLowerCase();
        return groups.filter(
            (g) => g.group_name && g.group_name.toLowerCase().includes(q)
        );
    }, [groups, search]);

    return (
        <section className="fa-chat-page">
            {/* Tiêu đề & Nút thao tác nhanh */}
            <div className="fa-chat-heading">
                <div>
                    <div className="fa-eyebrow">COMMUNICATION CENTER</div>
                    <h1>
                        Tin nhắn <span>& Hỗ trợ</span>
                    </h1>
                    <p>
                        Trung tâm kết nối, nhắn tin trực tiếp với người dùng và quản trị các nhóm trò chuyện.
                    </p>
                </div>
                <div className="fa-chat-actions">
                    <button
                        className="fa-chat-btn-refresh"
                        onClick={fetchContactsAndGroups}
                        disabled={refreshing}
                    >
                        <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
                        Làm mới
                    </button>
                    <button
                        className="fa-chat-btn-primary"
                        onClick={() => setShowCreateGroup(true)}
                    >
                        <Plus size={15} />
                        Tạo nhóm mới
                    </button>
                </div>
            </div>

            {/* Thống kê nhanh */}
            <div className="fa-chat-metrics">
                <div className="fa-chat-metric-card">
                    <div className="fa-chat-metric-icon blue">
                        <User size={20} />
                    </div>
                    <div className="fa-chat-metric-info">
                        <span>Tổng người dùng liên hệ</span>
                        <strong>{contacts.length}</strong>
                    </div>
                </div>
                <div className="fa-chat-metric-card">
                    <div className="fa-chat-metric-icon green">
                        <UsersRound size={20} />
                    </div>
                    <div className="fa-chat-metric-info">
                        <span>Nhóm đang hoạt động</span>
                        <strong>{groups.length}</strong>
                    </div>
                </div>
                <div className="fa-chat-metric-card">
                    <div className="fa-chat-metric-icon amber">
                        <Bell size={20} />
                    </div>
                    <div className="fa-chat-metric-info">
                        <span>Tin nhắn chưa đọc</span>
                        <strong>{unreadCount}</strong>
                    </div>
                </div>
            </div>

            {/* Khung chat chính 2 cột */}
            <div className="fa-chat-container">
                {/* Cột trái: Danh bạ liên hệ & Nhóm */}
                <aside className="fa-chat-sidebar">
                    <div className="fa-chat-sidebar-header">
                        {/* Tabs chuyển đổi */}
                        <div className="fa-chat-tabs">
                            <button
                                className={`fa-chat-tab-btn ${activeTab === 'direct' ? 'active' : ''}`}
                                onClick={() => setActiveTab('direct')}
                            >
                                <User size={13} />
                                Người dùng ({contacts.length})
                            </button>
                            <button
                                className={`fa-chat-tab-btn ${activeTab === 'groups' ? 'active' : ''}`}
                                onClick={() => setActiveTab('groups')}
                            >
                                <UsersRound size={13} />
                                Nhóm ({groups.length})
                            </button>
                        </div>

                        {/* Ô tìm kiếm */}
                        <div className="fa-chat-search">
                            <Search size={14} />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder={
                                    activeTab === 'direct'
                                        ? 'Tìm theo tên hoặc email...'
                                        : 'Tìm theo tên nhóm...'
                                }
                            />
                            {search && (
                                <button
                                    onClick={() => setSearch('')}
                                    style={{ border: 0, background: 'transparent', cursor: 'pointer', color: '#94a3b8' }}
                                >
                                    <X size={13} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Danh sách cuộn */}
                    <div className="fa-chat-list">
                        {activeTab === 'direct' ? (
                            filteredContacts.length === 0 ? (
                                <div className="fa-chat-sidebar-empty">
                                    Không tìm thấy người dùng nào phù hợp.
                                </div>
                            ) : (
                                filteredContacts.map((contact) => {
                                    const isSelected =
                                        activeChat?.type === 'direct' &&
                                        activeChat.data.user_id === contact.user_id;
                                    const isAdmin = Number(contact.role) === 1;

                                    return (
                                        <button
                                            key={contact.user_id}
                                            onClick={() =>
                                                setActiveChat({ type: 'direct', data: contact })
                                            }
                                            className={`fa-chat-item ${isSelected ? 'active' : ''}`}
                                        >
                                            <div
                                                className={`fa-chat-item-avatar ${isAdmin ? 'admin-user' : ''}`}
                                            >
                                                {(contact.full_name || 'U').charAt(0).toUpperCase()}
                                                <span className="fa-chat-online-dot" />
                                            </div>

                                            <div className="fa-chat-item-body">
                                                <div className="fa-chat-item-name-row">
                                                    <span className="fa-chat-item-name">
                                                        {contact.full_name || 'Người dùng #' + contact.user_id}
                                                        {isAdmin && (
                                                            <span className="fa-chat-badge-admin">
                                                                Admin
                                                            </span>
                                                        )}
                                                    </span>
                                                    {contact.unread_count > 0 && (
                                                        <span className="fa-chat-badge-unread">
                                                            {contact.unread_count}
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="fa-chat-item-preview">
                                                    {contact.last_message || contact.email || 'Chưa có tin nhắn...'}
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })
                            )
                        ) : (
                            filteredGroups.length === 0 ? (
                                <div className="fa-chat-sidebar-empty">
                                    Chưa có nhóm nào. Nhấn <strong>Tạo nhóm mới</strong> để bắt đầu!
                                </div>
                            ) : (
                                filteredGroups.map((group) => {
                                    const isSelected =
                                        activeChat?.type === 'group' &&
                                        activeChat.data.group_id === group.group_id;

                                    return (
                                        <button
                                            key={group.group_id}
                                            onClick={() =>
                                                setActiveChat({ type: 'group', data: group })
                                            }
                                            className={`fa-chat-item ${isSelected ? 'active' : ''}`}
                                        >
                                            <div className="fa-chat-item-avatar group">
                                                <UsersRound size={17} />
                                            </div>

                                            <div className="fa-chat-item-body">
                                                <div className="fa-chat-item-name-row">
                                                    <span className="fa-chat-item-name">
                                                        {group.group_name}
                                                    </span>
                                                    <span style={{ fontSize: '9px', color: '#94a3b8' }}>
                                                        {group.member_count} tv
                                                    </span>
                                                </div>
                                                <span className="fa-chat-item-preview">
                                                    {group.last_message || 'Bấm để vào phòng chat'}
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })
                            )
                        )}
                    </div>
                </aside>

                {/* Cột phải: Cửa sổ hội thoại */}
                <main className="fa-chat-main">
                    {activeChat ? (
                        <>
                            {/* Header cuộc hội thoại */}
                            <div className="fa-chat-main-header">
                                <div className="fa-chat-main-user-info">
                                    <div
                                        className={`fa-chat-header-avatar ${activeChat.type === 'group' ? 'group' : ''}`}
                                    >
                                        {activeChat.type === 'direct'
                                            ? (activeChat.data.full_name || 'U').charAt(0).toUpperCase()
                                            : <UsersRound size={18} />}
                                    </div>
                                    <div className="fa-chat-header-copy">
                                        <strong>
                                            {activeChat.type === 'direct'
                                                ? activeChat.data.full_name
                                                : activeChat.data.group_name}
                                            {activeChat.type === 'direct' && Number(activeChat.data.role) === 1 && (
                                                <span className="fa-chat-badge-admin">Admin</span>
                                            )}
                                        </strong>
                                        <span>
                                            {activeChat.type === 'direct'
                                                ? activeChat.data.email || 'Hội thoại trực tiếp 1-1'
                                                : `${activeChat.data.member_count || 'Nhiều'} thành viên trong nhóm`}
                                        </span>
                                    </div>
                                </div>

                                <div className="fa-chat-header-actions">
                                    <button
                                        className="fa-chat-icon-btn"
                                        title="Làm mới tin nhắn"
                                        onClick={() => fetchMessages(false)}
                                    >
                                        <RefreshCw size={14} className={loadingChat ? 'animate-spin' : ''} />
                                    </button>
                                </div>
                            </div>

                            {/* Danh sách tin nhắn */}
                            <div className="fa-chat-messages-area">
                                {loadingChat ? (
                                    <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8', fontSize: '11px' }}>
                                        Đang tải dữ liệu tin nhắn...
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="fa-chat-empty-state">
                                        <div className="fa-chat-empty-state-icon">
                                            <MessageCircle size={24} />
                                        </div>
                                        <h3>Bắt đầu cuộc trò chuyện</h3>
                                        <p>
                                            Hãy gửi tin nhắn đầu tiên để phản hồi, giải đáp thắc mắc hoặc thông báo cho người dùng!
                                        </p>
                                    </div>
                                ) : (
                                    messages.map((msg, idx) => {
                                        const isMe = msg.sender_id === myUserId;

                                        return (
                                            <div
                                                key={msg.message_id || idx}
                                                className={`fa-chat-bubble-wrap ${isMe ? 'me' : 'other'}`}
                                            >
                                                {!isMe && (
                                                    <span className="fa-chat-sender-name">
                                                        {msg.sender_name || 'Người dùng #' + msg.sender_id}
                                                    </span>
                                                )}

                                                <div className={`fa-chat-bubble ${isMe ? 'me' : 'other'}`}>
                                                    {msg.content}
                                                    <span className={`fa-chat-time ${isMe ? 'me' : 'other'}`}>
                                                        {new Date(msg.created_at).toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Form soạn tin nhắn */}
                            <form onSubmit={handleSend} className="fa-chat-input-row">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder={
                                        activeChat.type === 'group'
                                            ? `Gửi tin nhắn vào nhóm ${activeChat.data.group_name}...`
                                            : `Soạn tin nhắn hỗ trợ cho ${activeChat.data.full_name}...`
                                    }
                                />
                                <button
                                    type="submit"
                                    disabled={sending || !newMessage.trim()}
                                    className="fa-chat-send-btn"
                                >
                                    <Send size={14} />
                                    <span>Gửi</span>
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="fa-chat-empty-state">
                            <div className="fa-chat-empty-state-icon">
                                <MessageSquare size={28} />
                            </div>
                            <h3>Hộp thư Quản trị</h3>
                            <p>
                                Chọn một người dùng hoặc nhóm từ danh sách bên trái để bắt đầu cuộc trò chuyện và hỗ trợ.
                            </p>
                        </div>
                    )}
                </main>
            </div>

            {/* Modal Tạo Nhóm Mới */}
            {showCreateGroup && (
                <div
                    className="fa-chat-modal-backdrop"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) setShowCreateGroup(false);
                    }}
                >
                    <form className="fa-chat-modal" onSubmit={handleCreateGroup}>
                        <div className="fa-chat-modal-head">
                            <h3>
                                <UsersRound size={18} style={{ color: '#0284c7' }} />
                                Tạo nhóm mới
                            </h3>
                            <button type="button" onClick={() => setShowCreateGroup(false)}>
                                <X size={18} />
                            </button>
                        </div>

                        <label>
                            Tên nhóm
                            <input
                                type="text"
                                required
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                placeholder="VD: Ban Quản Trị, Gia đình VIP, ..."
                            />
                        </label>

                        <label>
                            Chọn thành viên tham gia ({selectedMembers.length} đã chọn)
                            <div className="fa-chat-member-select-list">
                                {contacts.map((contact) => {
                                    const isSelected = selectedMembers.includes(contact.user_id);

                                    return (
                                        <div
                                            key={contact.user_id}
                                            onClick={() => toggleSelectMember(contact.user_id)}
                                            className={`fa-chat-member-row ${isSelected ? 'selected' : ''}`}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div className="fa-chat-member-avatar">
                                                    {(contact.full_name || 'U').charAt(0)}
                                                </div>
                                                <div>
                                                    <span className="fa-chat-member-name">
                                                        {contact.full_name}
                                                    </span>
                                                    <span className="fa-chat-member-email">
                                                        {contact.email}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className={`fa-chat-member-checkbox ${isSelected ? 'checked' : ''}`}>
                                                {isSelected && <Check size={12} />}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </label>

                        <div className="fa-chat-modal-actions">
                            <button type="button" onClick={() => setShowCreateGroup(false)}>
                                Hủy
                            </button>
                            <button type="submit" disabled={creatingGroup || !groupName.trim()}>
                                {creatingGroup ? 'Đang tạo...' : 'Xác nhận tạo nhóm'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </section>
    );
}
