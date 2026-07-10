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
                    <button className="composer-action-btn" onClick={() => setShow(true)}>
                        📷 Ảnh
                    </button>
                    <button className="composer-action-btn" onClick={() => setShow(true)}>
                        📊 Khảo sát
                    </button>
                    <button className="composer-action-btn" onClick={() => setShow(true)}>
                        😊 Cảm xúc
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
                                <button type="button" className="btn-ghost">📷</button>
                                <button type="button" className="btn-ghost">😊</button>
                                <button type="button" className="btn-ghost">📍</button>
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
