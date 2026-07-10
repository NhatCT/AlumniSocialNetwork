import { useContext } from "react";
import PostList from "./PostList";
import { MyUserContext } from "../configs/Context";
import { Link } from "react-router-dom";
import cookie from "react-cookies";

const Home = () => {
    const [user] = useContext(MyUserContext);
    const defaultAvatar = "https://res.cloudinary.com/dlnru7sj1/image/upload/v1753591841/wu5x3zqqgl7vgt4jgkxm.png";

    const getRoleLabel = (role) => {
        switch (role) {
            case 'ROLE_ADMIN': return 'Quản trị viên';
            case 'ROLE_ALUMNI': return 'Cựu sinh viên';
            case 'ROLE_LECTURER': return 'Giảng viên';
            default: return role;
        }
    };

    return (
        <div className="app-main">
            <div className="feed-layout">
                {/* Left Sidebar */}
                <aside className="sidebar-left">
                    {user && (
                        <div className="sidebar-widget">
                            <Link to="/profile" className="sidebar-user-card" style={{ textDecoration: 'none' }}>
                                <img src={user.avatar || defaultAvatar} alt="" />
                                <div>
                                    <div className="user-name">{user.lastName} {user.firstName}</div>
                                    <div className="user-role-badge">{getRoleLabel(user.userRole)}</div>
                                </div>
                            </Link>
                        </div>
                    )}

                    <div className="sidebar-widget">
                        <h3>Menu</h3>
                        <Link to="/" className="sidebar-nav-link active">
                            <span className="nav-emoji">🏠</span> Bảng tin
                        </Link>
                        <Link to="/profile" className="sidebar-nav-link">
                            <span className="nav-emoji">👤</span> Trang cá nhân
                        </Link>
                        <Link to="/surveys" className="sidebar-nav-link">
                            <span className="nav-emoji">📊</span> Khảo sát
                        </Link>
                        <Link to="/chat" className="sidebar-nav-link">
                            <span className="nav-emoji">💬</span> Tin nhắn
                        </Link>
                    </div>
                </aside>

                {/* Center Feed */}
                <div className="feed-center">
                    <PostList />
                </div>

                {/* Right Sidebar */}
                <aside className="sidebar-right">
                    <div className="sidebar-widget">
                        <h3>📢 Thông báo</h3>
                        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                            Chào mừng bạn đến với Alumni Network! Hãy kết nối và chia sẻ.
                        </p>
                    </div>

                    <div className="sidebar-widget">
                        <h3>🔥 Xu hướng</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ fontSize: '14px' }}>
                                <div style={{ fontWeight: 600 }}>📅 Ngày hội việc làm 2025</div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>128 lượt quan tâm</div>
                            </div>
                            <div style={{ fontSize: '14px' }}>
                                <div style={{ fontWeight: 600 }}>🎓 Lễ tốt nghiệp khóa 2025</div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>95 lượt quan tâm</div>
                            </div>
                            <div style={{ fontSize: '14px' }}>
                                <div style={{ fontWeight: 600 }}>🏢 Hội thảo khởi nghiệp</div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>67 lượt quan tâm</div>
                            </div>
                        </div>
                    </div>

                    <div className="sidebar-widget" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        Alumni Social Network © {new Date().getFullYear()}
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Home;
