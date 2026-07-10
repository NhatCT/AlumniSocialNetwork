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
                    <button className="post-menu-btn" onClick={toggleLockComment} title={post.isCommentLocked ? "Mở khóa bình luận" : "Khóa bình luận"} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg style={{ width: '18px', height: '18px', fill: 'currentColor' }} viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="2"/>
                            <circle cx="6" cy="12" r="2"/>
                            <circle cx="18" cy="12" r="2"/>
                        </svg>
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
                    <button className={`reaction-button ${userReaction ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <span className="emoji" style={{ display: 'flex', alignItems: 'center' }}>
                            {currentEmoji ? currentEmoji.emoji : (
                                <svg style={{ width: '18px', height: '18px', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }} viewBox="0 0 24 24">
                                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                                </svg>
                            )}
                        </span>
                        <span>{currentEmoji?.label || 'Thích'}</span>
                    </button>
                </OverlayTrigger>

                <button
                    className="reaction-button"
                    onClick={() => setShowComment(!showComment)}
                    disabled={post.isCommentLocked}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                    <span className="emoji" style={{ display: 'flex', alignItems: 'center' }}>
                        {post.isCommentLocked ? '🔒' : (
                            <svg style={{ width: '18px', height: '18px', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }} viewBox="0 0 24 24">
                                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                            </svg>
                        )}
                    </span>
                    <span>Bình luận {post.isCommentLocked ? '🔒' : ''}</span>
                </button>

                <button className="reaction-button" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <span className="emoji" style={{ display: 'flex', alignItems: 'center' }}>
                        <svg style={{ width: '18px', height: '18px', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }} viewBox="0 0 24 24">
                            <circle cx="18" cy="5" r="3"/>
                            <circle cx="6" cy="12" r="3"/>
                            <circle cx="18" cy="19" r="3"/>
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                        </svg>
                    </span>
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
