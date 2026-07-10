import { useEffect, useState, useRef } from "react";
import { authApis, endpoints } from "../configs/Apis";
import SurveyItem from "./SurveyItem";
import cookie from 'react-cookies';
import { useNavigate } from "react-router-dom";

const SurveyList = () => {
    const [surveys, setSurveys] = useState([]);
    const [page, setPage] = useState(1);
    const [q, setQ] = useState("");
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const debounceTimer = useRef(null);
    const observerRef = useRef(null);
    const loadMoreRef = useRef(null);
    const navigate = useNavigate();

    const loadSurveys = async (search = q, pageNumber = page) => {
        let url = `${endpoints.surveys}?page=${pageNumber}`;
        if (search.trim()) url += `&kw=${encodeURIComponent(search.trim())}`;

        try {
            setLoading(true);
            const res = await authApis().get(url);
            const data = res.data;

            if (!Array.isArray(data)) {
                console.warn("API trả về dữ liệu không hợp lệ:", data);
                setSurveys([]);
                setHasMore(false);
                return;
            }

            if (data.length === 0) {
                if (pageNumber === 1) setSurveys([]);
                setHasMore(false);
            } else {
                if (pageNumber === 1) {
                    setSurveys(data);
                } else {
                    setSurveys(prev => [...prev, ...data]);
                }
                setHasMore(data.length >= 6); // Giả định page size = 6
            }
        } catch (err) {
            console.error("Lỗi khi tải danh sách khảo sát:", err);
            setSurveys([]);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    // Debounce search
    useEffect(() => {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);

        debounceTimer.current = setTimeout(() => {
            setPage(1);
            loadSurveys(q, 1);
        }, 500);

        return () => clearTimeout(debounceTimer.current);
    }, [q]);

    useEffect(() => {
        if (page > 1) loadSurveys(q, page);
    }, [page]);

    useEffect(() => {
        const token = cookie.load("token");
        if (!token) {
            navigate("/login");
        } else {
            loadSurveys(q, 1);
        }
    }, []);

    // Infinite scroll observer
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
    const SkeletonSurvey = () => (
        <div className="survey-card" style={{ padding: '20px' }}>
            <div className="skeleton skeleton-text short" style={{ marginBottom: '16px', height: '24px', width: '30%' }} />
            <div className="skeleton skeleton-text long" style={{ height: '20px' }} />
            <div className="skeleton skeleton-text medium" style={{ height: '14px', width: '50%' }} />
        </div>
    );

    return (
        <>
            {/* Search */}
            <div style={{ position: 'relative', marginBottom: '24px' }}>
                <span style={{
                    position: 'absolute', left: '16px', top: '50%',
                    transform: 'translateY(-50%)', fontSize: '16px', color: 'var(--text-muted)'
                }}>🔍</span>
                <input
                    className="search-input-feed"
                    value={q}
                    onChange={e => setQ(e.target.value)}
                    type="text"
                    placeholder="Tìm kiếm cuộc khảo sát ý kiến..."
                />
            </div>

            {/* Empty State */}
            {surveys.length === 0 && !loading && (
                <div className="empty-state">
                    <div className="empty-icon">📊</div>
                    <h3>Không tìm thấy khảo sát</h3>
                    <p>Hiện tại không có cuộc khảo sát nào khớp với tìm kiếm của bạn.</p>
                </div>
            )}

            {/* Grid of Surveys */}
            <div className="survey-grid">
                {surveys.map(s => (
                    <SurveyItem key={s.id} survey={s} />
                ))}
            </div>

            {/* Loading Skeletons */}
            {loading && (
                <div className="survey-grid" style={{ marginTop: '16px' }}>
                    <SkeletonSurvey />
                    <SkeletonSurvey />
                </div>
            )}

            {/* Infinite Scroll Trigger */}
            <div ref={loadMoreRef} style={{ height: '1px' }} />
        </>
    );
};

export default SurveyList;
