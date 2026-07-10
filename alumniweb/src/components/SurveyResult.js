import React, { useEffect, useState } from 'react';
import { authApis, endpoints } from "../configs/Apis";

const SurveyResult = ({ surveyId }) => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await authApis().get(endpoints.surveyStats(surveyId));
                setStats(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        load();
    }, [surveyId]);

    if (!stats) return <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Đang tải kết quả...</p>;

    const total = stats.total || 1;
    const keys = Object.keys(stats).filter(k => k !== 'total');

    return (
        <div style={{ padding: '16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Kết quả khảo sát</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {keys.map(key => {
                    const count = stats[key] || 0;
                    const percentage = Math.round((count / total) * 100);

                    return (
                        <div key={key}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                                <span style={{ fontWeight: 500 }}>{key}</span>
                                <span style={{ color: 'var(--text-muted)' }}>{count} lượt ({percentage}%)</span>
                            </div>
                            <div className="survey-progress-bar">
                                <div
                                    className="fill"
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '16px', textAlign: 'right' }}>
                Tổng cộng: <strong>{total}</strong> lượt vote
            </div>
        </div>
    );
};

export default SurveyResult;
