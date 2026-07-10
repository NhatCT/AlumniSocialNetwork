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
                {/* Brand Logo with flat SVG cap */}
                <Link to="/" className="navbar-brand">
                    <div className="brand-icon">
                        <svg style={{ width: '20px', height: '20px', fill: 'currentColor' }} viewBox="0 0 24 24">
                            <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
                            <path d="M19 12.18L12 16l-7-3.82V17l7 4 7-4v-4.82z"/>
                        </svg>
                    </div>
                    <span className="gradient-text">Alumni</span>
                </Link>

                {/* Search with modern flat search lens */}
                <div className="navbar-search">
                    <span className="search-icon" style={{ display: 'flex', alignItems: 'center' }}>
                        <svg style={{ width: '15px', height: '15px', fill: 'none', stroke: 'currentColor', strokeWidth: '2.5', strokeLinecap: 'round', strokeLinejoin: 'round' }} viewBox="0 0 24 24">
                            <circle cx="11" cy="11" r="8"/>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        </svg>
                    </span>
                    <input type="text" placeholder="Tìm kiếm bài viết, bạn bè..." />
                </div>

                {/* Nav Icons using modern SVG icons */}
                {user && (
                    <div className="navbar-nav-links">
                        <Link to="/" className={`nav-icon-btn ${location.pathname === '/' ? 'active' : ''}`} title="Trang chủ">
                            <svg style={{ width: '20px', height: '20px', fill: 'currentColor' }} viewBox="0 0 24 24">
                                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                            </svg>
                        </Link>
                        <Link to="/surveys" className={`nav-icon-btn ${location.pathname.startsWith('/surveys') ? 'active' : ''}`} title="Khảo sát">
                            <svg style={{ width: '20px', height: '20px', fill: 'currentColor' }} viewBox="0 0 24 24">
                                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                            </svg>
                        </Link>
                        <Link to="/chat" className={`nav-icon-btn ${location.pathname === '/chat' ? 'active' : ''}`} title="Tin nhắn">
                            <svg style={{ width: '20px', height: '20px', fill: 'currentColor' }} viewBox="0 0 24 24">
                                <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
                            </svg>
                        </Link>
                        
                        {/* Notifications Dropdown */}
                        <div className="user-dropdown" ref={notificationRef} style={{ display: 'inline-block' }}>
                            <button 
                                className={`nav-icon-btn ${notificationsOpen ? 'active' : ''}`} 
                                title="Thông báo" 
                                onClick={() => { setNotificationsOpen(!notificationsOpen); loadNotifications(); }}
                            >
                                <svg style={{ width: '20px', height: '20px', fill: 'currentColor' }} viewBox="0 0 24 24">
                                    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                                </svg>
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
                                        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
                                            <svg style={{ width: '36px', height: '36px', fill: 'none', stroke: 'currentColor', strokeWidth: '1.5', marginBottom: '8px', opacity: 0.5 }} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                            </svg>
                                            <div>Không có thông báo nào dành cho bạn.</div>
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
                                        <span className="item-icon" style={{ display: 'flex', alignItems: 'center' }}>
                                            <svg style={{ width: '16px', height: '16px', fill: 'currentColor' }} viewBox="0 0 24 24">
                                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                            </svg>
                                        </span>
                                        Trang cá nhân
                                    </Link>

                                    <button className="dropdown-item-custom" onClick={() => { setChangePassword(true); setDropdownOpen(false); }}>
                                        <span className="item-icon" style={{ display: 'flex', alignItems: 'center' }}>
                                            <svg style={{ width: '16px', height: '16px', fill: 'currentColor' }} viewBox="0 0 24 24">
                                                <path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                                            </svg>
                                        </span>
                                        Đổi mật khẩu
                                    </button>

                                    <div className="dropdown-divider" />

                                    <Link to="/login" className="dropdown-item-custom" onClick={() => { dispatch({ "type": "logout" }); setDropdownOpen(false); }}>
                                        <span className="item-icon" style={{ display: 'flex', alignItems: 'center' }}>
                                            <svg style={{ width: '16px', height: '16px', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }} viewBox="0 0 24 24">
                                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                                                <polyline points="16 17 21 12 16 7"/>
                                                <line x1="21" y1="12" x2="9" y2="12"/>
                                            </svg>
                                        </span>
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
