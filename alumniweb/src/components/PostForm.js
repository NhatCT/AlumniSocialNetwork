import { useState, useContext } from "react";
import { Modal, Alert } from "react-bootstrap";
import { authApis, endpoints } from "../configs/Apis";
import { MyUserContext } from "../configs/Context";

const PostForm = ({ onPostCreated }) => {
    const [user] = useContext(MyUserContext);
    const [show, setShow] = useState(false);
    const [content, setContent] = useState("");
    const [error, setError] = useState("");

    const defaultAvatar = "https://res.cloudinary.com/dlnru7sj1/image/upload/v1753591841/wu5x3zqqgl7vgt4jgkxm.png";

    const handleClose = () => {
        setShow(false);
        setContent("");
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!content.trim()) {
            setError("Nội dung bài viết không được để trống!");
            return;
        }

        try {
            const res = await authApis().post(endpoints.posts, {
                content: content.trim()
            });

            onPostCreated(res.data);
            handleClose();
        } catch (err) {
            const errorMsg = err.response?.data || "Lỗi khi đăng bài. Vui lòng thử lại!";
            setError(errorMsg);

            if (err.response?.status === 401) {
                window.location.href = "/login";
            }
        }
    };

    return (
        <>
            {/* Inline Composer */}
            <div className="post-composer">
                <div className="composer-row">
                    <img src={user?.avatar || defaultAvatar} alt="" />
                    <div className="composer-input" onClick={() => setShow(true)}>
                        Bạn đang nghĩ gì, {user?.firstName}?
                    </div>
                </div>
                <div className="composer-actions">
                    <button className="composer-action-btn" onClick={() => setShow(true)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <svg style={{ width: '18px', height: '18px', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round', color: 'var(--success)' }} viewBox="0 0 24 24">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21 15 16 10 5 21"/>
                        </svg>
                        <span>Ảnh</span>
                    </button>
                    <button className="composer-action-btn" onClick={() => setShow(true)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <svg style={{ width: '18px', height: '18px', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round', color: 'var(--primary)' }} viewBox="0 0 24 24">
                            <line x1="18" y1="20" x2="18" y2="10"/>
                            <line x1="12" y1="20" x2="12" y2="4"/>
                            <line x1="6" y1="20" x2="6" y2="14"/>
                        </svg>
                        <span>Khảo sát</span>
                    </button>
                    <button className="composer-action-btn" onClick={() => setShow(true)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <svg style={{ width: '18px', height: '18px', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round', color: 'var(--warning)' }} viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                            <line x1="9" y1="9" x2="9.01" y2="9"/>
                            <line x1="15" y1="9" x2="15.01" y2="9"/>
                        </svg>
                        <span>Cảm xúc</span>
                    </button>
                </div>
            </div>

            {/* Post Modal */}
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Tạo bài viết</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <img
                            src={user?.avatar || defaultAvatar}
                            alt=""
                            style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                            <div style={{ fontWeight: 600 }}>{user?.lastName} {user?.firstName}</div>
                            <small style={{ color: 'var(--text-muted)' }}>Công khai 🌐</small>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <textarea
                            className="input-premium"
                            rows={5}
                            placeholder={`${user?.firstName} ơi, bạn đang nghĩ gì?`}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            style={{ resize: 'none', fontSize: '16px', border: 'none', padding: '0', background: 'transparent' }}
                        />

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button type="button" className="btn-ghost" style={{ display: 'flex', alignItems: 'center', padding: '8px' }}>
                                    <svg style={{ width: '20px', height: '20px', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }} viewBox="0 0 24 24">
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                        <circle cx="8.5" cy="8.5" r="1.5"/>
                                        <polyline points="21 15 16 10 5 21"/>
                                    </svg>
                                </button>
                                <button type="button" className="btn-ghost" style={{ display: 'flex', alignItems: 'center', padding: '8px' }}>
                                    <svg style={{ width: '20px', height: '20px', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }} viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10"/>
                                        <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                                        <line x1="9" y1="9" x2="9.01" y2="9"/>
                                        <line x1="15" y1="9" x2="15.01" y2="9"/>
                                    </svg>
                                </button>
                                <button type="button" className="btn-ghost" style={{ display: 'flex', alignItems: 'center', padding: '8px' }}>
                                    <svg style={{ width: '20px', height: '20px', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }} viewBox="0 0 24 24">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                        <circle cx="12" cy="10" r="3"/>
                                    </svg>
                                </button>
                            </div>
                            <button type="submit" className="btn-primary-gradient" disabled={!content.trim()}>
                                Đăng bài
                            </button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default PostForm;
