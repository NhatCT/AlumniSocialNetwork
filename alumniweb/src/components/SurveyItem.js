import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SurveyResult from './SurveyResult';
import { formatTimeVi } from '../formatters/TimeFormatter';

const SurveyItem = ({ survey }) => {
    const [showResult, setShowResult] = useState(false);

    return (
        <div className="survey-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '12px' }}>
                <span className="survey-badge active">
                    🟢 Đang diễn ra
                </span>
                <button
                    className="btn-ghost"
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowResult(!showResult);
                    }}
                    style={{ fontSize: '13px', padding: '6px 12px', borderRadius: 'var(--radius-md)' }}
                >
                    {showResult ? "Ẩn kết quả" : "Xem kết quả 📊"}
                </button>
            </div>

            <h3 style={{ margin: '0 0 8px' }}>
                <Link to={`/surveys/${survey.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {survey.title}
                </Link>
            </h3>

            {survey.description && (
                <p className="survey-desc">{survey.description}</p>
            )}

            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '12px' }}>
                🕒 Tạo lúc: {survey.createdAt ? formatTimeVi(survey.createdAt) : "Không xác định"}
            </div>

            {showResult && (
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
                    <SurveyResult surveyId={survey.id} />
                </div>
            )}
        </div>
    );
};

export default SurveyItem;
