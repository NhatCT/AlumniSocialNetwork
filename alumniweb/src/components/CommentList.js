import { useState, useEffect, useContext } from "react";
import { authApis, endpoints } from "../configs/Apis";
import { MyUserContext } from "../configs/Context";
import { formatTimeVi } from "../formatters/TimeFormatter";

const CommentList = ({ postId, isLocked, isOwner }) => {
    const [user] = useContext(MyUserContext);
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState("");
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingContent, setEditingContent] = useState("");

    const defaultAvatar = "https://res.cloudinary.com/dlnru7sj1/image/upload/v1753591841/wu5x3zqqgl7vgt4jgkxm.png";

    const loadComments = async () => {
        try {
            const res = await authApis().get(endpoints.commentByPost(postId));
            setComments(res.data);
        } catch (err) {
            console.error("Lỗi tải bình luận:", err);
        }
    };

    const addComment = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;
        try {
            await authApis().post(endpoints.comments, {
                content,
                postId: { id: postId }
            });
            setContent("");
            loadComments();
        } catch (err) {
            console.error("Lỗi thêm bình luận:", err);
        }
    };

    const deleteComment = async (commentId) => {
        try {
            await authApis().delete(endpoints.deleteComment(commentId));
            loadComments();
        } catch (err) {
            console.error("Lỗi xoá bình luận:", err);
        }
    };

    const startEdit = (comment) => {
        setEditingCommentId(comment.id);
        setEditingContent(comment.content);
    };

    const cancelEdit = () => {
        setEditingCommentId(null);
        setEditingContent("");
    };

    const submitEdit = async (e) => {
        e.preventDefault();
        try {
            await authApis().put(endpoints.updateComment(editingCommentId), {
                content: editingContent,
                postId: { id: postId }
            });
            setEditingCommentId(null);
            setEditingContent("");
            loadComments();
        } catch (err) {
            console.error("Lỗi cập nhật bình luận:", err);
        }
    };

    useEffect(() => {
        loadComments();
    }, [postId]);

    return (
        <>
            {/* Comment Input */}
            {!isLocked && user && (
                <form onSubmit={addComment} className="comment-input-row">
                    <img src={user.avatar || defaultAvatar} alt="" />
                    <input
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Viết bình luận..."
                        required
                    />
                    <button type="submit" className="btn-primary-gradient" style={{ padding: '8px 20px' }}>
                        Gửi
                    </button>
                </form>
            )}

            {isLocked && (
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '14px' }}>
                    Bình luận đã bị khóa cho bài viết này.
                </p>
            )}

            {/* Comment List */}
            {comments.map(c => (
                <div key={c.id} className="comment-bubble">
                    <img src={c.user?.avatar || defaultAvatar} alt="" />
                    <div className="comment-bubble-content">
                        <div className="comment-bubble-box">
                            <div className="comment-author">{c.user?.lastName} {c.user?.firstName}</div>

                            {editingCommentId === c.id ? (
                                <form onSubmit={submitEdit} style={{ marginTop: '8px' }}>
                                    <input
                                        className="input-premium"
                                        value={editingContent}
                                        onChange={(e) => setEditingContent(e.target.value)}
                                        required
                                        style={{ fontSize: '14px', padding: '8px 12px' }}
                                    />
                                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                                        <button type="submit" className="btn-primary-gradient" style={{ padding: '4px 16px', fontSize: '12px' }}>
                                            Lưu
                                        </button>
                                        <button type="button" className="btn-ghost" onClick={cancelEdit} style={{ fontSize: '12px' }}>
                                            Huỷ
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="comment-text">{c.content}</div>
                            )}
                        </div>

                        <div className="comment-meta">
                            <span>{formatTimeVi(c.createdAt)}</span>
                            {user && user.id === c.user?.id && (
                                <button onClick={() => startEdit(c)}>Sửa</button>
                            )}
                            {user && (user.id === c.user?.id || isOwner) && (
                                <button onClick={() => deleteComment(c.id)}>Xoá</button>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
};

export default CommentList;
