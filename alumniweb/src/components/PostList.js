import { useEffect, useState, useRef } from "react";
import { authApis, endpoints } from "../configs/Apis";
import PostItem from "./PostItem";
import PostForm from "./PostForm";

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [q, setQ] = useState("");
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const debounceTimer = useRef(null);
    const observerRef = useRef(null);
    const loadMoreRef = useRef(null);

    const loadPosts = async (search = q, pageNumber = page) => {
        try {
            setLoading(true);
            let url = `${endpoints.posts}?page=${pageNumber}`;
            if (search.trim()) url += `&kw=${encodeURIComponent(search.trim())}`;

            const res = await authApis().get(url);
            const data = res.data;

            if (pageNumber === 1) {
                setPosts(data);
            } else {
                setPosts(prev => [...prev, ...data]);
            }

            setHasMore(data.length >= 6);
        } catch (err) {
            console.error("Lỗi tải bài viết:", err);
        } finally {
            setLoading(false);
        }
    };

    // Debounce search
    useEffect(() => {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);

        debounceTimer.current = setTimeout(() => {
            setPage(1);
            loadPosts(q, 1);
        }, 500);

        return () => clearTimeout(debounceTimer.current);
    }, [q]);

    useEffect(() => {
        if (page > 1) loadPosts(q, page);
    }, [page]);

    // Infinite scroll with IntersectionObserver
    useEffect(() => {
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !loading) {
                setPage(prev => prev + 1);
            }
        }, { threshold: 0.1 });

        if (loadMoreRef.current) {
            observerRef.current.observe(loadMoreRef.current);
        }

        return () => {
            if (observerRef.current) observerRef.current.disconnect();
        };
    }, [hasMore, loading]);

    // Skeleton loader
    const SkeletonPost = () => (
        <div className="post-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div className="skeleton skeleton-avatar" />
                <div style={{ flex: 1 }}>
                    <div className="skeleton skeleton-text short" />
                    <div className="skeleton skeleton-text" style={{ width: '40%', height: '10px' }} />
                </div>
            </div>
            <div className="skeleton skeleton-text long" />
            <div className="skeleton skeleton-text medium" />
            <div className="skeleton skeleton-text short" />
        </div>
    );

    return (
        <>
            <PostForm onPostCreated={() => {
                setPage(1);
                loadPosts(q, 1);
            }} />

            {/* Search */}
            <div style={{ position: 'relative', marginBottom: '16px' }}>
                <span style={{
                    position: 'absolute', left: '16px', top: '50%',
                    transform: 'translateY(-50%)', fontSize: '16px', color: 'var(--text-muted)'
                }}>🔍</span>
                <input
                    className="search-input-feed"
                    value={q}
                    onChange={e => setQ(e.target.value)}
                    type="text"
                    placeholder="Tìm kiếm bài viết..."
                />
            </div>

            {/* Empty State */}
            {(!posts || posts.length === 0) && !loading && (
                <div className="empty-state">
                    <div className="empty-icon">📝</div>
                    <h3>Chưa có bài viết nào</h3>
                    <p>Hãy là người đầu tiên chia sẻ suy nghĩ của bạn!</p>
                </div>
            )}

            {/* Posts */}
            {posts.map(p => (
                <PostItem key={p.id} post={p} onPostUpdate={() => {
                    setPage(1);
                    loadPosts(q, 1);
                }} />
            ))}

            {/* Loading Skeletons */}
            {loading && (
                <>
                    <SkeletonPost />
                    <SkeletonPost />
                </>
            )}

            {/* Infinite Scroll Trigger */}
            <div ref={loadMoreRef} style={{ height: '1px' }} />

            {/* End of feed */}
            {!loading && !hasMore && posts.length > 0 && (
                <div style={{
                    textAlign: 'center',
                    padding: '24px',
                    color: 'var(--text-muted)',
                    fontSize: '14px'
                }}>
                    ✅ Bạn đã xem hết tất cả bài viết
                </div>
            )}
        </>
    );
};

export default PostList;
