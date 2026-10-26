import React, { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    Home,
    Users,
    UsersRound,
    MessageSquare,
    Bell,
    Search,
    Receipt,
    Wallet,
    PieChart,
    User,
    Settings,
    LogOut,
    Heart,
    MessageCircle,
    Share2,
    Image as ImageIcon,
    Smile,
    Send,
    MoreHorizontal,
    Sparkles,
    Plus,
    ChevronRight,
    ChevronDown,
    ShieldCheck,
    ScanLine,
    Cake,
    UserPlus,
    Check,
    X,
    TrendingUp,
    Clock,
    Globe,
    FileText,
    ArrowUpRight
} from "lucide-react";
import MiniChatWidget from "../../components/MiniChatWidget";
import ThemeToggle from "../../components/ThemeToggle";
import "./UserHome.css";

const initialPosts = [
    {
        id: 1,
        name: "Mai Hoa",
        avatar: "🌷",
        time: "2 giờ trước",
        text: "Cả nhà vừa có một bữa tối thật ngon tại nhà hàng! 🍽️ Cùng nhau quây quần ấm cúng là điều tuyệt vời nhất! 💗",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85",
        likes: 45,
        comments: [
            { id: 1, name: "Tuấn Anh", text: "Nhìn ngon và ấm cúng quá cả nhà ơi! ❤️" },
            { id: 2, name: "Lan Phương", text: "Cuối tuần này cả nhà mình lại đi ăn tiếp nhé!" }
        ],
        liked: false
    },
    {
        id: 2,
        name: "Tuấn Anh",
        avatar: "🏕️",
        time: "4 giờ trước",
        text: "Chuyến dã ngoại cuối tuần cùng gia đình thật nhiều năng lượng! 🏞️ Cảm ơn mọi người đã tạo nên những kỷ niệm đáng nhớ! ❤️",
        image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1200&q=85",
        likes: 28,
        comments: [
            { id: 1, name: "Đức Minh", text: "Ảnh đẹp quá anh ơi, lần sau cho em đi với nhé!" }
        ],
        liked: false
    }
];

const stories = [
    { name: "Mai Hoa", image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=350&q=80", emoji: "🌸" },
    { name: "Tuấn Anh", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=350&q=80", emoji: "🏕️" },
    { name: "Lan Phương", image: "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=350&q=80", emoji: "🌿" },
    { name: "Hà My", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=350&q=80", emoji: "🌊" }
];

const friendsData = [
    { id: 1, name: "Mai Hoa", avatar: "🌷", roleDesc: "Thành viên gia đình", online: true },
    { id: 2, name: "Tuấn Anh", avatar: "🏕️", roleDesc: "Thành viên gia đình", online: true },
    { id: 3, name: "Lan Phương", avatar: "👩🏻", roleDesc: "Thành viên gia đình", online: true },
    { id: 4, name: "Hà My", avatar: "👩🏼", roleDesc: "Thành viên gia đình", online: false },
    { id: 5, name: "Đức Minh", avatar: "🧔🏻", roleDesc: "Thành viên gia đình", online: true }
];

const money = (value) =>
    new Intl.NumberFormat("vi-VN").format(value) + "đ";

function readUser() {
    try {
        return JSON.parse(
            localStorage.getItem("user") ||
            localStorage.getItem("lw_user") ||
            "{}"
        );
    } catch {
        return {};
    }
}

export default function UserHome({ user: userProp }) {
    const navigate = useNavigate();
    const currentUser = userProp || readUser();

    const [activeNav, setActiveNav] = useState("Trang chủ");
    const [posts, setPosts] = useState(initialPosts);
    const [postText, setPostText] = useState("");
    const [postImage, setPostImage] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [commentInputs, setCommentInputs] = useState({});
    const [expandedComments, setExpandedComments] = useState({});
    const [friendRequests, setFriendRequests] = useState([]);
    const [search, setSearch] = useState("");
    const [notice, setNotice] = useState("");
    const [showComposer, setShowComposer] = useState(false);
    const [userDropdown, setUserDropdown] = useState(false);

    const displayName =
        currentUser.full_name ||
        currentUser.fullName ||
        currentUser.name ||
        "Thành viên gia đình";

    const avatarLetter = displayName.trim().charAt(0).toUpperCase() || "U";

    const visiblePosts = useMemo(() => {
        const keyword = search.trim().toLowerCase();
        if (!keyword) return posts;

        return posts.filter(
            (post) =>
                post.name.toLowerCase().includes(keyword) ||
                post.text.toLowerCase().includes(keyword)
        );
    }, [posts, search]);

    const notify = (message) => {
        setNotice(message);
        window.setTimeout(() => setNotice(""), 2800);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        navigate("/login", { replace: true });
    };

    const handleImage = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            notify("Vui lòng chọn tệp hình ảnh hợp lệ.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            notify("Ảnh không được vượt quá 5 MB.");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setSelectedImage(String(reader.result));
            setPostImage("");
        };
        reader.readAsDataURL(file);
        event.target.value = "";
    };

    const publishPost = (event) => {
        event.preventDefault();

        if (!postText.trim() && !selectedImage && !postImage.trim()) {
            notify("Vui lòng nhập nội dung hoặc chọn hình ảnh để đăng!");
            return;
        }

        const newPost = {
            id: Date.now(),
            name: displayName,
            avatar: avatarLetter,
            time: "Vừa xong",
            text: postText.trim(),
            image: selectedImage || postImage.trim() || "",
            likes: 0,
            comments: [],
            liked: false
        };

        setPosts((previous) => [newPost, ...previous]);
        setPostText("");
        setPostImage("");
        setSelectedImage(null);
        setShowComposer(false);
        notify("Bài viết đã được chia sẻ lên bảng tin gia đình!");
    };

    const toggleLike = (postId) => {
        setPosts((previous) =>
            previous.map((post) =>
                post.id === postId
                    ? {
                        ...post,
                        liked: !post.liked,
                        likes: post.likes + (post.liked ? -1 : 1)
                    }
                    : post
            )
        );
    };

    const addComment = (postId) => {
        const text = (commentInputs[postId] || "").trim();
        if (!text) return;

        setPosts((previous) =>
            previous.map((post) =>
                post.id === postId
                    ? {
                        ...post,
                        comments: [
                            ...post.comments,
                            {
                                id: Date.now(),
                                name: displayName,
                                text
                            }
                        ]
                    }
                    : post
            )
        );

        setCommentInputs((previous) => ({ ...previous, [postId]: "" }));
        setExpandedComments((previous) => ({ ...previous, [postId]: true }));
    };

    const sendFriendRequest = (friend) => {
        if (friendRequests.includes(friend.id)) {
            notify("Bạn đã gửi lời mời kết nối tới " + friend.name + ".");
            return;
        }

        setFriendRequests((previous) => [...previous, friend.id]);
        notify("Đã gửi lời mời kết nối thành viên tới " + friend.name + ".");
    };

    const navGroups = [
        {
            title: "TỔNG QUAN",
            items: [
                { label: "Trang chủ", icon: Home, badge: null, action: () => setActiveNav("Trang chủ") },
                { label: "Bạn bè & Người thân", icon: Users, badge: "2", action: () => notify("Danh sách người thân trong gia đình") },
                { label: "Nhóm gia đình", icon: UsersRound, badge: null, action: () => navigate("/user/chat?tab=groups") },
                { label: "Tin nhắn", icon: MessageSquare, badge: "3", action: () => navigate("/user/chat") },
                { label: "Thông báo", icon: Bell, badge: "5", action: () => notify("Xem thông báo nhắc nhở tài chính mới") }
            ]
        },
        {
            title: "QUẢN LÝ TÀI CHÍNH",
            items: [
                { label: "Quét hóa đơn AI", icon: ScanLine, badge: "HOT", action: () => navigate("/scanner") },
                { label: "Khoản chi tiêu", icon: Receipt, badge: null, action: () => navigate("/scanner") },
                { label: "Hạn mức ngân sách", icon: Wallet, badge: null, action: () => notify("Tính năng Ngân sách hàng tháng đang cập nhật") },
                { label: "Báo cáo tài chính", icon: PieChart, badge: null, action: () => notify("Báo cáo phân tích thu chi gia đình") }
            ]
        },
        {
            title: "CÁ NHÂN",
            items: [
                { label: "Hồ sơ cá nhân", icon: User, badge: null, action: () => notify("Xem hồ sơ thành viên: " + displayName) },
                { label: "Cài đặt tài khoản", icon: Settings, badge: null, action: () => notify("Cài đặt tùy chọn thông báo & giao diện") }
            ]
        }
    ];

    return (
        <div className="family-home">
            {/* TOPBAR */}
            <header className="fh-topbar">
                {/* Brand Logo */}
                <Link to="/user" className="fh-brand" aria-label="Về trang chủ">
                    <div className="fh-brand-icon">
                        <ShieldCheck size={22} className="text-white" />
                    </div>
                    <span className="fh-brand-text">
                        Family<span className="fh-brand-accent">Expense</span>
                    </span>
                    <span className="fh-role-pill">USER</span>
                </Link>

                {/* Search Bar */}
                <div className="fh-search">
                    <Search size={18} className="fh-search-icon" />
                    <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Tìm kiếm bài viết, thành viên, chi tiêu..."
                    />
                    {search && (
                        <button onClick={() => setSearch("")} aria-label="Xóa tìm kiếm" className="fh-clear-search">
                            <X size={15} />
                        </button>
                    )}
                </div>

                {/* Top Action Buttons */}
                <div className="fh-top-actions">
                    <button
                        title="Quét hóa đơn AI"
                        onClick={() => navigate("/scanner")}
                        className="fh-quick-scan-btn"
                    >
                        <ScanLine size={16} />
                        <span>Quét Hóa Đơn AI</span>
                    </button>

                    <button title="Tin nhắn" onClick={() => navigate("/user/chat")} className="fh-action-btn">
                        <MessageSquare size={18} />
                        <i>3</i>
                    </button>

                    <button title="Thông báo" onClick={() => notify("5 thông báo mới về chi tiêu")} className="fh-action-btn">
                        <Bell size={18} />
                        <i>5</i>
                    </button>

                    {/* Nút chuyển đổi Giao diện Sáng (Xanh trắng) / Tối (Tím bóng) gọn gàng không đè nút khác */}
                    <div className="fh-theme-btn-wrap" title="Đổi giao diện: Sáng (Xanh-Trắng) / Tối (Tím bóng)">
                        <ThemeToggle variant="button" />
                    </div>

                    {/* Account User Profile */}
                    <div className="relative">
                        <button
                            className="fh-account"
                            onClick={() => setUserDropdown(!userDropdown)}
                            aria-label="Tài khoản cá nhân"
                        >
                            <span className="fh-avatar fh-avatar-small">{avatarLetter}</span>
                            <span className="fh-account-name">{displayName}</span>
                            <ChevronDown size={14} className="fh-account-chevron" />
                        </button>

                        {userDropdown && (
                            <div className="fh-dropdown-menu">
                                <div className="fh-dropdown-header">
                                    <div className="fh-avatar fh-avatar-small">{avatarLetter}</div>
                                    <div>
                                        <strong>{displayName}</strong>
                                        <p>{currentUser.email || "Thành viên gia đình"}</p>
                                    </div>
                                </div>
                                <div className="fh-dropdown-divider" />
                                <div style={{ padding: "8px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "12px", fontWeight: "600" }}>
                                    <span style={{ color: "var(--fh-text)" }}>Giao diện</span>
                                    <ThemeToggle variant="switch" />
                                </div>
                                <div className="fh-dropdown-divider" />
                                <button onClick={() => { setUserDropdown(false); navigate("/scanner"); }}>
                                    <ScanLine size={15} /> Quét hóa đơn AI
                                </button>
                                <button onClick={() => { setUserDropdown(false); notify("Hồ sơ: " + displayName); }}>
                                    <User size={15} /> Hồ sơ cá nhân
                                </button>
                                <button onClick={() => { setUserDropdown(false); notify("Cài đặt tài khoản"); }}>
                                    <Settings size={15} /> Cài đặt
                                </button>
                                <div className="fh-dropdown-divider" />
                                <button onClick={handleLogout} className="fh-logout-btn">
                                    <LogOut size={15} /> Đăng xuất
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* MAIN THREE-COLUMN LAYOUT */}
            <div className="fh-layout">
                {/* 1. LEFT SIDEBAR */}
                <aside className="fh-sidebar">
                    <div className="fh-profile-mini">
                        <div className="fh-avatar fh-avatar-large">{avatarLetter}</div>
                        <div className="fh-profile-copy">
                            <strong>{displayName}</strong>
                            <span>
                                <i className="fh-online-dot" /> Thành viên gia đình (Role 2)
                            </span>
                        </div>
                    </div>

                    <nav className="fh-navigation">
                        {navGroups.map((group) => (
                            <div className="fh-nav-group" key={group.title}>
                                <div className="fh-nav-heading">{group.title}</div>
                                {group.items.map((item) => {
                                    const IconComponent = item.icon;
                                    const isActive = activeNav === item.label;

                                    return (
                                        <button
                                            key={item.label}
                                            className={`fh-nav-item ${isActive ? "active" : ""}`}
                                            onClick={item.action}
                                        >
                                            <IconComponent size={18} className="fh-nav-icon" />
                                            <span>{item.label}</span>
                                            {item.badge && (
                                                <span className={`fh-nav-badge ${item.badge === "HOT" ? "badge-hot" : ""}`}>
                                                    {item.badge}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                    </nav>

                    <div className="fh-sidebar-bottom">
                        <div className="fh-family-illustration">
                            <Sparkles size={28} className="text-amber-400 mx-auto" />
                        </div>
                        <h3>Quản lý chi tiêu gia đình<br />Thông minh & Tiết kiệm</h3>
                        <p>Theo dõi thu chi, chia sẻ khoảnh khắc và kết nối các thành viên.</p>
                        <button
                            onClick={() => navigate("/scanner")}
                            className="fh-sidebar-cta"
                        >
                            <ScanLine size={14} /> Thử Quét Hóa Đơn AI
                        </button>
                    </div>
                </aside>

                {/* 2. CENTER FEED */}
                <main className="fh-feed">
                    {/* Status Composer */}
                    <section className={`fh-composer ${showComposer ? "fh-composer-open" : ""}`}>
                        <form onSubmit={publishPost}>
                            <div className="fh-compose-top">
                                <div className="fh-avatar">{avatarLetter}</div>
                                <textarea
                                    value={postText}
                                    onChange={(event) => setPostText(event.target.value)}
                                    onFocus={() => setShowComposer(true)}
                                    placeholder={`${displayName}, hôm nay bạn đang nghĩ gì cùng gia đình?`}
                                    rows={showComposer ? 3 : 1}
                                />
                            </div>

                            {selectedImage && (
                                <div className="fh-image-preview">
                                    <img src={selectedImage} alt="Ảnh chuẩn bị đăng" />
                                    <button
                                        type="button"
                                        onClick={() => setSelectedImage(null)}
                                        aria-label="Xóa ảnh"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            )}

                            {showComposer && (
                                <div className="fh-image-url-box">
                                    <input
                                        className="fh-image-url"
                                        value={postImage}
                                        onChange={(event) => {
                                            setPostImage(event.target.value);
                                            setSelectedImage(null);
                                        }}
                                        placeholder="Hoặc dán đường dẫn hình ảnh (https://...)"
                                    />
                                </div>
                            )}

                            <div className="fh-compose-actions">
                                <label className="fh-compose-tool fh-photo-tool">
                                    <ImageIcon size={17} />
                                    <span>Ảnh / Video</span>
                                    <input type="file" accept="image/*" onChange={handleImage} hidden />
                                </label>

                                <button
                                    type="button"
                                    className="fh-compose-tool"
                                    onClick={() => navigate("/scanner")}
                                >
                                    <ScanLine size={16} className="text-indigo-400" />
                                    <span>Đính kèm Hóa đơn</span>
                                </button>

                                <button
                                    type="button"
                                    className="fh-compose-tool fh-feeling-tool"
                                    onClick={() => setPostText((previous) => previous + " 😊")}
                                >
                                    <Smile size={17} />
                                    <span>Cảm xúc</span>
                                </button>

                                <button className="fh-primary-button" type="submit">
                                    <Send size={14} />
                                    <span>Đăng bài</span>
                                </button>
                            </div>
                        </form>
                    </section>

                    {/* Moments / Stories */}
                    <section className="fh-stories">
                        <div className="fh-section-heading">
                            <div className="flex items-center gap-2">
                                <Sparkles size={16} className="text-indigo-400" />
                                <h3>Khoảnh khắc gia đình</h3>
                            </div>
                            <button onClick={() => notify("Xem tất cả khoảnh khắc gia đình")}>
                                Xem tất cả →
                            </button>
                        </div>

                        <div className="fh-story-list">
                            <button
                                className="fh-story fh-create-story"
                                onClick={() => notify("Chức năng tạo Story đang được hoàn thiện.")}
                            >
                                <div className="fh-story-photo fh-create-photo">
                                    <div className="fh-create-icon-wrap">
                                        <Plus size={20} className="text-white" />
                                    </div>
                                </div>
                                <strong>Tạo khoảnh khắc</strong>
                            </button>

                            {stories.map((story) => (
                                <button
                                    className="fh-story"
                                    key={story.name}
                                    onClick={() => notify("Đang mở khoảnh khắc của " + story.name)}
                                >
                                    <div
                                        className="fh-story-photo"
                                        style={{
                                            backgroundImage: `linear-gradient(0deg, #0b0f19ee, transparent 65%), url(${story.image})`
                                        }}
                                    >
                                        <span className="fh-story-ring">{story.emoji}</span>
                                        <strong>{story.name}</strong>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Feed Header */}
                    <div className="fh-feed-title">
                        <div>
                            <span className="fh-eyebrow">BẢNG TIN NỘI BỘ</span>
                            <h2>{search ? `Kết quả tìm kiếm: "${search}"` : "Bảng tin gia đình"}</h2>
                        </div>
                        <button
                            className="fh-sort-button"
                            onClick={() => notify("Đang hiển thị bài viết mới nhất")}
                        >
                            <Clock size={14} />
                            <span>Mới nhất</span>
                        </button>
                    </div>

                    {visiblePosts.length === 0 && (
                        <div className="fh-empty">
                            <Search size={36} className="mx-auto text-indigo-400 mb-3" />
                            <h3>Chưa tìm thấy bài viết nào</h3>
                            <p>Hãy thử tìm kiếm với từ khóa khác hoặc chia sẻ bài viết đầu tiên nhé.</p>
                        </div>
                    )}

                    {/* Post List */}
                    {visiblePosts.map((post) => (
                        <article className="fh-post" key={post.id}>
                            <div className="fh-post-header">
                                <div className="fh-avatar">{post.avatar}</div>
                                <div className="fh-post-author">
                                    <strong>{post.name}</strong>
                                    <span>
                                        {post.time} · <Globe size={11} className="inline ml-1 text-slate-400" /> Gia đình
                                    </span>
                                </div>
                                <button
                                    className="fh-more-button"
                                    onClick={() => notify("Tùy chọn bài viết")}
                                    aria-label="Tùy chọn bài viết"
                                >
                                    <MoreHorizontal size={18} />
                                </button>
                            </div>

                            {post.text && <p className="fh-post-text">{post.text}</p>}

                            {post.image && (
                                <div className="fh-post-image-wrap">
                                    <img className="fh-post-image" src={post.image} alt="Ảnh bài viết" />
                                </div>
                            )}

                            {/* Post Stats */}
                            <div className="fh-post-stats">
                                <span className="fh-reaction-icons">
                                    <Heart size={14} className="fill-rose-500 text-rose-500 inline" />
                                </span>
                                <span>{post.likes} lượt thích</span>
                                <button
                                    className="fh-comment-toggle"
                                    onClick={() => setExpandedComments((previous) => ({
                                        ...previous,
                                        [post.id]: !previous[post.id]
                                    }))}
                                >
                                    {post.comments.length} bình luận
                                </button>
                            </div>

                            {/* Action Buttons */}
                            <div className="fh-post-actions">
                                <button
                                    className={post.liked ? "fh-liked" : ""}
                                    onClick={() => toggleLike(post.id)}
                                >
                                    <Heart
                                        size={18}
                                        className={post.liked ? "fill-rose-500 text-rose-500" : "text-slate-400"}
                                    />
                                    <span>{post.liked ? "Đã thích" : "Thích"}</span>
                                </button>

                                <button
                                    onClick={() => setExpandedComments((previous) => ({
                                        ...previous,
                                        [post.id]: !previous[post.id]
                                    }))}
                                >
                                    <MessageCircle size={18} className="text-slate-400" />
                                    <span>Bình luận</span>
                                </button>

                                <button
                                    onClick={() => {
                                        if (navigator.share) {
                                            navigator.share({ title: "FamilyExpense", text: post.text })
                                                .catch(() => { });
                                        } else {
                                            notify("Đã sao chép liên kết bài viết.");
                                        }
                                    }}
                                >
                                    <Share2 size={18} className="text-slate-400" />
                                    <span>Chia sẻ</span>
                                </button>
                            </div>

                            {/* Comments Section */}
                            {expandedComments[post.id] && (
                                <div className="fh-comments">
                                    {post.comments.map((comment) => (
                                        <div className="fh-comment" key={comment.id}>
                                            <div className="fh-comment-avatar">
                                                {comment.name.charAt(0)}
                                            </div>
                                            <div className="fh-comment-body">
                                                <strong>{comment.name}</strong>
                                                <p>{comment.text}</p>
                                            </div>
                                        </div>
                                    ))}

                                    <form
                                        className="fh-comment-form"
                                        onSubmit={(event) => {
                                            event.preventDefault();
                                            addComment(post.id);
                                        }}
                                    >
                                        <div className="fh-avatar fh-avatar-tiny">{avatarLetter}</div>
                                        <input
                                            value={commentInputs[post.id] || ""}
                                            onChange={(event) =>
                                                setCommentInputs((previous) => ({
                                                    ...previous,
                                                    [post.id]: event.target.value
                                                }))
                                            }
                                            placeholder="Viết bình luận cho cả nhà cùng xem..."
                                        />
                                        <button type="submit" aria-label="Gửi bình luận">
                                            <Send size={14} />
                                        </button>
                                    </form>
                                </div>
                            )}
                        </article>
                    ))}
                </main>

                {/* 3. RIGHT SIDEBAR */}
                <aside className="fh-rightbar">
                    {/* Widget: Tài chính gia đình */}
                    <section className="fh-widget fh-finance-widget">
                        <div className="fh-widget-heading">
                            <div className="fh-widget-icon">
                                <Receipt size={17} />
                            </div>
                            <h3>Tài chính gia đình</h3>
                            <span className="fh-period">Tháng 10/2026</span>
                        </div>

                        <div className="fh-finance-summary">
                            <div className="fh-donut">
                                <span>TỔNG</span>
                            </div>
                            <div>
                                <span className="fh-muted">Tổng chi tiêu tháng</span>
                                <strong className="fh-total-money">{money(12500000)}</strong>
                                <small>✦ Giảm 12% so với tháng trước</small>
                            </div>
                        </div>

                        <div className="fh-expense-list">
                            {[
                                ["🍜", "Ăn uống gia đình", 5200000, "42%", "food"],
                                ["🚕", "Di chuyển, xăng xe", 2800000, "22%", "travel"],
                                ["⚡", "Hóa đơn điện nước", 1500000, "12%", "bill"],
                                ["🛍️", "Mua sắm thiết yếu", 1200000, "10%", "shop"],
                                ["📦", "Chi tiêu khác", 1800000, "14%", "other"]
                            ].map(([icon, name, amount, percent, color]) => (
                                <div className="fh-expense-row" key={name}>
                                    <span className={`fh-expense-icon ${color}`}>{icon}</span>
                                    <span className="fh-expense-name">{name}</span>
                                    <strong>{money(amount)}</strong>
                                    <small>{percent}</small>
                                </div>
                            ))}
                        </div>

                        <button
                            className="fh-widget-link"
                            onClick={() => navigate("/scanner")}
                        >
                            <span>Quét hóa đơn thêm chi tiêu</span>
                            <ArrowUpRight size={14} />
                        </button>
                    </section>

                    {/* Widget: Sinh nhật thành viên */}
                    <section className="fh-widget">
                        <div className="fh-widget-heading">
                            <div className="fh-widget-icon bg-pink-500/20 text-pink-400">
                                <Cake size={17} />
                            </div>
                            <h3>Sinh nhật sắp tới</h3>
                            <button onClick={() => notify("Lịch sinh nhật các thành viên")}>Tất cả</button>
                        </div>
                        {[
                            ["🌷", "Mai Hoa", "Còn 3 ngày (28/10)"],
                            ["🏕️", "Tuấn Anh", "Còn 9 ngày (03/11)"],
                            ["👩🏻", "Lan Phương", "Còn 16 ngày (10/11)"]
                        ].map(([avatar, name, date]) => (
                            <div className="fh-birthday-row" key={name}>
                                <div className="fh-avatar">{avatar}</div>
                                <div>
                                    <strong>{name}</strong>
                                    <span>🎂 {date}</span>
                                </div>
                            </div>
                        ))}
                    </section>

                    {/* Widget: Gợi ý kết nối thành viên */}
                    <section className="fh-widget">
                        <div className="fh-widget-heading">
                            <div className="fh-widget-icon bg-indigo-500/20 text-indigo-400">
                                <Users size={17} />
                            </div>
                            <h3>Thành viên gia đình</h3>
                            <button onClick={() => notify("Xem toàn bộ danh bạ gia đình")}>Tất cả →</button>
                        </div>
                        {friendsData.map((friend) => (
                            <div className="fh-friend-row" key={friend.id}>
                                <div className="fh-avatar fh-friend-avatar">
                                    {friend.avatar}
                                    {friend.online && <i className="fh-online-dot" />}
                                </div>
                                <div className="fh-friend-info">
                                    <strong>{friend.name}</strong>
                                    <span>{friend.online ? "Đang hoạt động" : "Thành viên gia đình"}</span>
                                </div>
                                <button
                                    className={`fh-add-friend ${friendRequests.includes(friend.id) ? "sent" : ""}`}
                                    onClick={() => sendFriendRequest(friend)}
                                >
                                    {friendRequests.includes(friend.id) ? (
                                        <>
                                            <Check size={12} className="inline mr-1" /> Đã gửi
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus size={12} className="inline mr-1" /> Kết nối
                                        </>
                                    )}
                                </button>
                            </div>
                        ))}
                    </section>

                    {/* Widget: Nhóm gia đình */}
                    <section className="fh-widget">
                        <div className="fh-widget-heading">
                            <div className="fh-widget-icon bg-violet-500/20 text-violet-400">
                                <UsersRound size={17} />
                            </div>
                            <h3>Nhóm gia đình</h3>
                            <button onClick={() => notify("Nhóm gia đình nhỏ")}>Chi tiết</button>
                        </div>
                        <button
                            className="fh-family-group"
                            onClick={() => notify("Mở nhóm: Gia đình nhỏ của chúng ta")}
                        >
                            <span className="fh-group-cover">👨‍👩‍👧‍👦</span>
                            <span className="fh-group-info">
                                <strong>Gia đình nhỏ của chúng ta</strong>
                                <small>8 thành viên · Không gian riêng tư</small>
                            </span>
                            <ChevronRight size={18} className="fh-group-arrow" />
                        </button>
                    </section>

                    <div className="fh-right-footer">
                        <span>Family Management System ✦</span>
                        <p>© 2026 Quản lý chi tiêu & Gắn kết gia đình.</p>
                    </div>
                </aside>
            </div>

            {/* AI Mini Chat Floating Widget */}
            <MiniChatWidget />

            {/* Notification Toast */}
            {notice && (
                <div className="fh-toast" role="status">
                    <Sparkles size={16} className="text-amber-400 shrink-0" />
                    <span>{notice}</span>
                </div>
            )}
        </div>
    );
}
