import { useEffect, useRef, useState } from "react";
import cookie from 'react-cookies';
import { authApis, endpoints } from "../configs/Apis";
import MySpinner from "./layout/MySpinner";
import { useNavigate, Link } from "react-router-dom";
import { formatTimeVi } from "../formatters/TimeFormatter";

const Profile = () => {
    const defaultAvatar = "https://res.cloudinary.com/dlnru7sj1/image/upload/v1753591841/wu5x3zqqgl7vgt4jgkxm.png";
    const [loading, setLoading] = useState(false);
    const user = cookie.load('user');
    const nav = useNavigate();
    const [posts, setPosts] = useState([]);
    const [activeTab, setActiveTab] = useState('posts');

    const avatar = useRef();
    const cover = useRef();

    const getRoleLabel = (role) => {
        switch (role) {
            case 'ROLE_ADMIN': return 'Quản trị viên';
            case 'ROLE_ALUMNI': return 'Cựu sinh viên';
            case 'ROLE_LECTURER': return 'Giảng viên';
            default: return role;
        }
    };

    const changeAvatar = async (event) => {
        event.preventDefault();
        if (avatar.current.files.length > 0) {
            try {
                setLoading(true);
                const formData = new FormData();
                formData.append("avatar", avatar.current.files[0]);

                let res = await authApis().post(endpoints['changeAvatar'], formData);
                if (res.status === 200) {
                    cookie.save('user', JSON.stringify(res.data));
                    nav("/profile");
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
    };

    const changeCover = async (event) => {
        event.preventDefault();
        if (cover.current.files.length > 0) {
            try {
                setLoading(true);
                const formData = new FormData();
                formData.append("cover", cover.current.files[0]);

                let res = await authApis().post(endpoints['changeCover'], formData);
                if (res.status === 200) {
                    cookie.save('user', JSON.stringify(res.data));
                    nav("/profile");
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
    };

    const loadPosts = async () => {
        try {
            setLoading(true);
            let res = await authApis().get(`${endpoints['posts']}?userId=${user.id}`);
            setPosts(res.data);
        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPosts();
    }, [user.id]);

    return (
        <div className="profile-page">
            {/* Cover Photo */}
            <div className="profile-cover">
                {user.cover ? (
                    <img src={user.cover} alt="Cover" />
                ) : null}
                <div className="cover-overlay" />
                <label className="change-cover-btn">
                    📷 {user.cover ? "Đổi ảnh bìa" : "Thêm ảnh bìa"}
                    <input type="file" accept="image/*" ref={cover} style={{ display: "none" }} onChange={changeCover} />
                </label>
            </div>

            {/* Profile Info */}
            <div className="profile-info-section">
                <div className="profile-avatar-wrapper">
                    <img src={user.avatar || defaultAvatar} alt="Avatar" />
                    <label className="change-avatar-btn">
                        📷
                        <input type="file" accept="image/*" ref={avatar} style={{ display: "none" }} onChange={changeAvatar} />
                    </label>
                </div>

                <div className="profile-name-section">
                    <h1>{user.lastName} {user.firstName}</h1>
                    <div className="profile-role">{getRoleLabel(user.userRole)}</div>
                </div>
            </div>

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
                            <span>Họ tên: <strong>{user.lastName} {user.firstName}</strong></span>
                        </div>
                        <div className="profile-info-item">
                            <span className="info-icon">🎓</span>
                            <span>MSSV: <strong>{user.studentId || "Chưa cập nhật"}</strong></span>
                        </div>
                        <div className="profile-info-item">
                            <span className="info-icon">📧</span>
                            <span>Email: <strong>{user.email}</strong></span>
                        </div>
                        <div className="profile-info-item">
                            <span className="info-icon">🏷️</span>
                            <span>Vai trò: <strong>{getRoleLabel(user.userRole)}</strong></span>
                        </div>
                    </div>
                </div>

                {/* Posts */}
                <div>
                    {loading ? <MySpinner /> : (
                        <>
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
                                    <p>Hãy chia sẻ suy nghĩ đầu tiên của bạn!</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
