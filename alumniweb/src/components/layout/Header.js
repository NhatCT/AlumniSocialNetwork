import { useContext, useState, useEffect, useRef } from "react";
import { MyUserContext } from "../../configs/Context";
import ChangePasswordModal from "./ChangePasswordModal";
import { Link, useLocation } from "react-router-dom";
import { authApis, endpoints } from "../../configs/Apis";

const Header = () => {
    const [user, dispatch] = useContext(MyUserContext);
    const [changePassword, setChangePassword] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [scrolled, setScrolled] = useState(false);
    const dropdownRef = useRef(null);
    const notificationRef = useRef(null);
    const location = useLocation();

    const defaultAvatar = "https://res.cloudinary.com/dlnru7sj1/image/upload/v1753591841/wu5x3zqqgl7vgt4jgkxm.png";

    const loadNotifications = async () => {
        try {
            const res = await authApis().get(endpoints.notifications);
            setNotifications(res.data);
        } catch (err) {
            console.error("Lỗi tải thông báo:", err);
        }
    };

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(e.target)) {
                setNotificationsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (user) {
            loadNotifications();
        }
    }, [user]);

    // Don't render navbar on auth pages
    const authPages = ['/login', '/register'];
    if (authPages.includes(location.pathname)) return null;

    const getRoleLabel = (role) => {
        switch(role) {
            case 'ROLE_ADMIN': return 'Quản trị viên';
            case 'ROLE_ALUMNI': return 'Cựu sinh viên';
            case 'ROLE_LECTURER': return 'Giảng viên';
            default: return role;
        }
    };

    return (
        <>
            <nav className={`navbar-premium ${scrolled ? 'scrolled' : ''}`}>
                {/* Brand */}
                <Link to="/" className="navbar-brand">
                    <div className="brand-icon">🎓</div>
                    <span className="gradient-text">Alumni</span>
                </Link>

                {/* Search */}
                <div className="navbar-search">
                    <span className="search-icon">🔍</span>
                    <input type="text" placeholder="Tìm kiếm bài viết, bạn bè..." />
                </div>

                {/* Nav Icons */}
                {user && (
                    <div className="navbar-nav-links">
                        <Link to="/" className={`nav-icon-btn ${location.pathname === '/' ? 'active' : ''}`} title="Trang chủ">
                            🏠
                        </Link>
                        <Link to="/surveys" className={`nav-icon-btn ${location.pathname.startsWith('/surveys') ? 'active' : ''}`} title="Khảo sát">
                            📊
                        </Link>
                        <Link to="/chat" className={`nav-icon-btn ${location.pathname === '/chat' ? 'active' : ''}`} title="Tin nhắn">
                            💬
                        </Link>
                        
                        {/* Notifications Dropdown */}
                        <div className="user-dropdown" ref={notificationRef} style={{ display: 'inline-block' }}>
                            <button 
                                className={`nav-icon-btn ${notificationsOpen ? 'active' : ''}`} 
                                title="Thông báo" 
                                onClick={() => { setNotificationsOpen(!notificationsOpen); loadNotifications(); }}
                            >
                                🔔
                                {notifications.length > 0 && (
                                    <span className="badge-count">{notifications.length}</span>
                                )}
                            </button>

                            {notificationsOpen && (
                                <div className="user-dropdown-menu" style={{ width: '360px', right: 0, padding: '12px', maxHeight: '480px', overflowY: 'auto' }}>
                                    <h3 style={{ fontSize: '16px', fontWeight: 700, padding: '4px 8px', marginBottom: '8px', borderBottom: '1px solid var(--border-light)' }}>
                                        Thông báo mới nhất
                                    </h3>
                                    {notifications.length === 0 ? (
                                        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
                                            📭 Không có thông báo nào dành cho bạn.
                                        </div>
                                    ) : (
                                        notifications.map(n => (
                                            <div key={n.id} style={{ display: 'flex', flexDirection: 'column', padding: '10px 8px', borderBottom: '1px solid var(--border-light)', gap: '4px' }}>
                                                <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>{n.title}</div>
                                                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>{n.content}</div>
                                                {n.eventLocation && (
                                                    <div style={{ fontSize: '12px', color: 'var(--primary)', marginTop: '4px' }}>
                                                        📍 Địa điểm: {n.eventLocation}
                                                    </div>
                                                )}
                                                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'right', marginTop: '2px' }}>
                                                    {new Date(n.createdAt).toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* User Actions */}
                {user && (
                    <div className="navbar-actions">
                        <div className="user-dropdown" ref={dropdownRef}>
                            <img
                                src={user.avatar || defaultAvatar}
                                alt="Avatar"
                                className="user-avatar-btn"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                            />

                            {dropdownOpen && (
                                <div className="user-dropdown-menu">
                                    <div className="dropdown-user-info">
                                        <img src={user.avatar || defaultAvatar} alt="" />
                                        <div>
                                            <div className="user-name">{user.lastName} {user.firstName}</div>
                                            <div className="user-role">{getRoleLabel(user.userRole)}</div>
                                        </div>
                                    </div>

                                    <Link to="/profile" className="dropdown-item-custom" onClick={() => setDropdownOpen(false)}>
                                        <span className="item-icon">👤</span>
                                        Trang cá nhân
                                    </Link>

                                    <button className="dropdown-item-custom" onClick={() => { setChangePassword(true); setDropdownOpen(false); }}>
                                        <span className="item-icon">🔑</span>
                                        Đổi mật khẩu
                                    </button>

                                    <div className="dropdown-divider" />

                                    <Link to="/login" className="dropdown-item-custom" onClick={() => { dispatch({ "type": "logout" }); setDropdownOpen(false); }}>
                                        <span className="item-icon">🚪</span>
                                        Đăng xuất
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            <ChangePasswordModal show={changePassword} handleClose={() => setChangePassword(false)} />
        </>
    );
};

export default Header;
