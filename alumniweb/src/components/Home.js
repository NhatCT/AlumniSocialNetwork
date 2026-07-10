import { useContext } from "react";
import PostList from "./PostList";
import { MyUserContext } from "../configs/Context";
import { Link } from "react-router-dom";

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
                        <h3 style={{ fontSize: '15px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px' }}>Menu</h3>
                        <Link to="/" className="sidebar-nav-link active" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', color: 'currentColor' }}>
                                <svg style={{ width: '18px', height: '18px', fill: 'currentColor' }} viewBox="0 0 24 24">
                                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                                </svg>
                            </span> 
                            <span>Bảng tin</span>
                        </Link>
                        <Link to="/profile" className="sidebar-nav-link" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', color: 'currentColor' }}>
                                <svg style={{ width: '18px', height: '18px', fill: 'currentColor' }} viewBox="0 0 24 24">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                </svg>
                            </span>
                            <span>Trang cá nhân</span>
                        </Link>
                        <Link to="/surveys" className="sidebar-nav-link" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', color: 'currentColor' }}>
                                <svg style={{ width: '18px', height: '18px', fill: 'currentColor' }} viewBox="0 0 24 24">
                                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                                </svg>
                            </span>
                            <span>Khảo sát</span>
                        </Link>
                        <Link to="/chat" className="sidebar-nav-link" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', color: 'currentColor' }}>
                                <svg style={{ width: '18px', height: '18px', fill: 'currentColor' }} viewBox="0 0 24 24">
                                    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
                                </svg>
                            </span>
                            <span>Tin nhắn</span>
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
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: 700 }}>
                            <svg style={{ width: '18px', height: '18px', fill: 'currentColor', color: 'var(--primary)' }} viewBox="0 0 24 24">
                                    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                            </svg>
                            Thông báo
                        </h3>
                        <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6', marginTop: '8px' }}>
                            Chào mừng bạn đến với Alumni Network! Hãy kết nối và chia sẻ những câu chuyện bổ ích của bạn.
                        </p>
                    </div>

                    <div className="sidebar-widget">
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: 700 }}>
                            <svg style={{ width: '18px', height: '18px', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round', color: 'var(--warning)' }} viewBox="0 0 24 24">
                                <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                                <polyline points="2 17 12 22 22 17"/>
                                <polyline points="2 12 12 17 22 12"/>
                            </svg>
                            Sự kiện sắp diễn ra
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
                            <div style={{ fontSize: '14px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                <span style={{ fontSize: '16px', color: 'var(--primary)' }}>📅</span>
                                <div>
                                    <div style={{ fontWeight: 600 }}>Ngày hội việc làm 2025</div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>128 cựu sinh viên quan tâm</div>
                                </div>
                            </div>
                            <div style={{ fontSize: '14px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                <span style={{ fontSize: '16px', color: 'var(--success)' }}>🎓</span>
                                <div>
                                    <div style={{ fontWeight: 600 }}>Lễ tốt nghiệp khóa 2025</div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>95 cựu sinh viên quan tâm</div>
                                </div>
                            </div>
                            <div style={{ fontSize: '14px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                <span style={{ fontSize: '16px', color: 'var(--info)' }}>🏫</span>
                                <div>
                                    <div style={{ fontWeight: 600 }}>Hội thảo khởi nghiệp</div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>67 cựu sinh viên quan tâm</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="sidebar-widget" style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>
                        Alumni Social Network © {new Date().getFullYear()}
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Home;
