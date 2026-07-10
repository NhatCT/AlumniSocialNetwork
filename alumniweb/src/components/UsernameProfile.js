import { useEffect, useState } from "react";
import cookie from 'react-cookies';
import { authApis, endpoints } from "../configs/Apis";
import MySpinner from "./layout/MySpinner";
import { useNavigate, useParams, Link } from "react-router-dom";
import { formatTimeVi } from "../formatters/TimeFormatter";
import ChatBox from "../components/ChatBox";

const UsernameProfile = () => {
    const defaultAvatar = "https://res.cloudinary.com/dlnru7sj1/image/upload/v1753591841/wu5x3zqqgl7vgt4jgkxm.png";

    const { username } = useParams();
    const [loading, setLoading] = useState(false);
    const [profileUser, setProfileUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [showChat, setShowChat] = useState(false);
    const [activeTab, setActiveTab] = useState('posts');
    const nav = useNavigate();

    const currentUser = cookie.load('user');

    useEffect(() => {
        if (currentUser && username === currentUser.username) {
            nav("/profile");
        }
    }, [username, currentUser]);

    const loadProfileUser = async () => {
        try {
            setLoading(true);
            const res = await authApis().get(endpoints.profile(username));
            setProfileUser(res.data);
        } catch (err) {
            console.error("Lỗi khi tải user theo username:", err);
        } finally {
            setLoading(false);
        }
    };

    const loadPosts = async (userId) => {
        try {
            const res = await authApis().get(`${endpoints.posts}?userId=${userId}`);
            setPosts(res.data);
        } catch (ex) {
            console.error("Lỗi khi tải bài viết:", ex);
        }
    };

    useEffect(() => {
        loadProfileUser();
    }, [username]);

    useEffect(() => {
        if (profileUser) {
            loadPosts(profileUser.id);
        }
    }, [profileUser]);

    const getRoleLabel = (role) => {
        switch (role) {
            case 'ROLE_ADMIN': return 'Quản trị viên';
            case 'ROLE_ALUMNI': return 'Cựu sinh viên';
            case 'ROLE_LECTURER': return 'Giảng viên';
            default: return role;
        }
    };

    if (loading || !profileUser) return <MySpinner />;

    return (
        <div className="profile-page">
            {/* Cover Photo */}
            <div className="profile-cover">
                {profileUser.cover && <img src={profileUser.cover} alt="Cover" />}
                <div className="cover-overlay" />
            </div>

            {/* Profile Info */}
            <div className="profile-info-section">
                <div className="profile-avatar-wrapper">
                    <img src={profileUser.avatar || defaultAvatar} alt="Avatar" />
                </div>

                <div className="profile-name-section" style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '16px', flexWrap: 'wrap' }}>
                    <div>
                        <h1>{profileUser.lastName} {profileUser.firstName}</h1>
                        <div className="profile-role">{getRoleLabel(profileUser.userRole)}</div>
                    </div>

                    {profileUser.id !== currentUser?.id && (
                        <button
                            className="btn-primary-gradient"
                            onClick={() => setShowChat(!showChat)}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                        >
                            💬 {showChat ? "Đóng chat" : "Nhắn tin"}
                        </button>
                    )}
                </div>
            </div>

            {/* Embedded Chat Box */}
            {showChat && (
                <div style={{ margin: '24px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                    <ChatBox currentUserId={currentUser?.id?.toString()} receiverId={profileUser.id} />
                </div>
            )}

            {/* Tabs */}
            <div className="profile-tabs">
                <button className={`profile-tab ${activeTab === 'posts' ? 'active' : ''}`} onClick={() => setActiveTab('posts')}>
                    Bài viết
                </button>
                <button className={`profile-tab ${activeTab === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')}>
                    Thông tin
                </button>
            </div>

            {/* Content */}
            <div className="profile-content">
                {/* Info Card */}
                <div>
                    <div className="profile-info-card">
                        <h3>Thông tin cá nhân</h3>
                        <div className="profile-info-item">
                            <span className="info-icon">👤</span>
                            <span>Họ tên: <strong>{profileUser.lastName} {profileUser.firstName}</strong></span>
                        </div>
                        <div className="profile-info-item">
                            <span className="info-icon">🎓</span>
                            <span>MSSV: <strong>{profileUser.studentId || "Chưa cập nhật"}</strong></span>
                        </div>
                        <div className="profile-info-item">
                            <span className="info-icon">📧</span>
                            <span>Email: <strong>{profileUser.email}</strong></span>
                        </div>
                        <div className="profile-info-item">
                            <span className="info-icon">🏷️</span>
                            <span>Vai trò: <strong>{getRoleLabel(profileUser.userRole)}</strong></span>
                        </div>
                    </div>
                </div>

                {/* Posts */}
                <div>
                    {posts.length > 0 ? posts.map(post => (
                        <div key={post.id} className="post-card" style={{ marginBottom: '16px' }}>
                            <div style={{ padding: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                        🕒 {formatTimeVi(post.createdAt)}
                                    </span>
                                    <Link to={`/posts/${post.id}`} className="btn-primary-gradient" style={{ padding: '6px 16px', fontSize: '12px', textDecoration: 'none' }}>
                                        Xem chi tiết
                                    </Link>
                                </div>

                                <p style={{ fontSize: '15px', lineHeight: '1.7', margin: '0 0 12px' }}>
                                    {post.content}
                                </p>

                                <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-muted)' }}>
                                    <span>👍 {post.reactionStats?.LIKE || 0}</span>
                                    <span>😂 {post.reactionStats?.HAHA || 0}</span>
                                    <span>❤️ {post.reactionStats?.HEART || 0}</span>
                                    <span>💬 {post.commentCount || 0} bình luận</span>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="empty-state">
                            <div className="empty-icon">📝</div>
                            <h3>Chưa có bài viết nào</h3>
                            <p>Cựu sinh viên này chưa chia sẻ bài viết nào.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UsernameProfile;
