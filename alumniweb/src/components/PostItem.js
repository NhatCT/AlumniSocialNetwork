import { useEffect, useState, useContext } from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { authApis, endpoints } from "../configs/Apis";
import { formatTimeVi } from "../formatters/TimeFormatter";
import { MyUserContext } from "../configs/Context";
import CommentList from "./CommentList";
import ReactionStats from "./ReactionStats";
import { Link } from "react-router-dom";

const PostItem = ({ post: initialPost }) => {
    const [user] = useContext(MyUserContext);
    const [post, setPost] = useState(initialPost);
    const [reactions, setReactions] = useState({});
    const [showComment, setShowComment] = useState(false);
    const [userReaction, setUserReaction] = useState(null);

    const defaultAvatar = "https://res.cloudinary.com/dlnru7sj1/image/upload/v1753591841/wu5x3zqqgl7vgt4jgkxm.png";

    const loadReactions = async () => {
        try {
            const res = await authApis().get(endpoints.reactionStats(post.id));
            setReactions(res.data);
        } catch { }
    };

    const loadUserReaction = async () => {
        try {
            const res = await authApis().get(endpoints.userReaction(post.id));
            setUserReaction(res.data?.type);
        } catch { }
    };

    const toggleLockComment = async () => {
        try {
            const newLockState = !post.isCommentLocked;
            await authApis().post(endpoints.lockComment(post.id, newLockState));
            setPost({ ...post, isCommentLocked: newLockState });
        } catch { }
    };

    useEffect(() => {
        setPost(initialPost);
        loadReactions();
        if (user) loadUserReaction();
    }, [initialPost]);

    const react = async (type) => {
        try {
            await authApis().post(endpoints.reactions, {
                type,
                postId: post.id
            });
            await loadReactions();
            await loadUserReaction();
        } catch { }
    };

    const isOwner = user && post?.user?.id === user.id;

    const reactionEmojis = [
        { type: "LIKE", emoji: "👍", label: "Thích" },
        { type: "HAHA", emoji: "😂", label: "Haha" },
        { type: "HEART", emoji: "❤️", label: "Yêu thích" },
    ];

    const popover = (
        <Popover>
            <Popover.Body className="d-flex gap-2 p-2">
                {reactionEmojis.map(r => (
                    <button
                        key={r.type}
                        onClick={() => react(r.type)}
                        style={{
                            fontSize: '28px', cursor: 'pointer', border: 'none',
                            background: 'none', padding: '4px 8px', borderRadius: '8px',
                            transition: 'transform 0.2s'
                        }}
                        title={r.label}
                        onMouseEnter={e => e.target.style.transform = 'scale(1.3)'}
                        onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                    >
                        {r.emoji}
                    </button>
                ))}
            </Popover.Body>
        </Popover>
    );

    const currentEmoji = reactionEmojis.find(r => r.type === userReaction);

    return (
        <div className="post-card">
            {/* Header */}
            <div className="post-header">
                <img src={post.user?.avatar || defaultAvatar} alt="" />
                <div className="user-info">
                    <Link to={`/profile/${post.user?.username}`} className="post-author">
                        {post.user?.lastName} {post.user?.firstName}
                    </Link>
                    <div className="post-time">{formatTimeVi(post.createdAt)}</div>
                </div>
                {isOwner && (
                    <button className="post-menu-btn" onClick={toggleLockComment} title={post.isCommentLocked ? "Mở khóa bình luận" : "Khóa bình luận"}>
                        ⋯
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="post-content">
                <p>{post.content}</p>
            </div>

            {/* Reaction Stats */}
            <div className="reaction-stats">
                <ReactionStats stats={reactions} />
            </div>

            {/* Action Buttons */}
            <div className="reaction-buttons">
                <OverlayTrigger trigger="click" placement="top" overlay={popover} rootClose>
                    <button className={`reaction-button ${userReaction ? 'active' : ''}`}>
                        <span className="emoji">{currentEmoji?.emoji || '👍'}</span>
                        <span>{currentEmoji?.label || 'Thích'}</span>
                    </button>
                </OverlayTrigger>

                <button
                    className="reaction-button"
                    onClick={() => setShowComment(!showComment)}
                    disabled={post.isCommentLocked}
                >
                    <span className="emoji">💬</span>
                    <span>Bình luận {post.isCommentLocked ? '🔒' : ''}</span>
                </button>

                <button className="reaction-button">
                    <span className="emoji">↗️</span>
                    <span>Chia sẻ</span>
                </button>
            </div>

            {/* Comments */}
            {showComment && (
                <div className="comment-section">
                    {post.isCommentLocked ? (
                        <p style={{ color: 'var(--danger)', fontSize: '14px' }}>🚫 Chủ bài viết đã khóa bình luận.</p>
                    ) : (
                        <CommentList postId={post.id} isLocked={false} isOwner={isOwner} />
                    )}
                </div>
            )}
        </div>
    );
};

export default PostItem;
