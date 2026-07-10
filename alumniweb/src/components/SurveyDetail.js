import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { authApis, endpoints } from "../configs/Apis";
import MySpinner from "./layout/MySpinner";
import cookie from "react-cookies";
import { Alert } from "react-bootstrap";
import { formatTimeVi } from "../formatters/TimeFormatter";

const SurveyDetail = () => {
    const { id } = useParams();
    const [survey, setSurvey] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedOption, setSelectedOption] = useState(null);
    const [voted, setVoted] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = cookie.load("token");
        if (!token) {
            navigate("/login");
            return;
        }

        const loadSurvey = async () => {
            try {
                const res = await authApis().get(endpoints.surveyDetail(id));
                setSurvey(res.data);
            } catch (err) {
                console.error("Lỗi tải chi tiết khảo sát:", err.response?.data || err.message);
                navigate("/surveys");
            } finally {
                setLoading(false);
            }
        };

        loadSurvey();
    }, [id, navigate]);

    const handleVote = async () => {
        if (!selectedOption) {
            setError("Vui lòng chọn một lựa chọn để vote.");
            return;
        }

        setError("");

        try {
            await authApis().post(endpoints.surveyVote(id), {
                optionId: selectedOption,
            });

            const updatedOptions = survey.options.map(option =>
                option.id === selectedOption
                    ? { ...option, voteCount: option.voteCount + 1 }
                    : option
            );

            setSurvey({ ...survey, options: updatedOptions });
            setVoted(true);
        } catch (err) {
            setError("Có lỗi xảy ra khi gửi vote.");
            console.error("Vote error:", err.response?.data || err.message);
        }
    };

    if (loading) return <MySpinner />;
    if (!survey) return <p>Không tìm thấy khảo sát.</p>;

    return (
        <div className="survey-card" style={{ maxWidth: '680px', margin: '0 auto', cursor: 'default' }}>
            <span className="survey-badge active" style={{ marginBottom: '16px' }}>
                🟢 Đang khảo sát
            </span>

            <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 12px' }}>{survey.title}</h2>
            
            {survey.description && (
                <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: '1.7', margin: '0 0 16px' }}>
                    {survey.description}
                </p>
            )}

            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px' }}>
                🕒 Ngày tạo: {survey.createdAt ? formatTimeVi(survey.createdAt) : "Không xác định"}
            </div>

            <div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Hãy đưa ra lựa chọn của bạn:</h3>

                <form onSubmit={(e) => { e.preventDefault(); handleVote(); }} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {survey.options?.map(option => (
                        <label
                            key={option.id}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '14px 18px',
                                border: selectedOption === option.id ? '2px solid var(--primary)' : '2px solid var(--border-color)',
                                borderRadius: 'var(--radius-md)',
                                cursor: voted ? 'default' : 'pointer',
                                transition: 'all 0.2s',
                                background: selectedOption === option.id ? 'rgba(79, 70, 229, 0.04)' : 'var(--bg-card)'
                            }}
                            onMouseEnter={(e) => {
                                if (!voted && selectedOption !== option.id) {
                                    e.currentTarget.style.borderColor = 'var(--primary-light)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (selectedOption !== option.id) {
                                    e.currentTarget.style.borderColor = 'var(--border-color)';
                                }
                            }}
                        >
                            <input
                                type="radio"
                                name="survey-options"
                                checked={selectedOption === option.id}
                                onChange={() => setSelectedOption(option.id)}
                                disabled={voted}
                                style={{ width: '18px', height: '18px', cursor: voted ? 'default' : 'pointer' }}
                            />
                            <div style={{ flex: 1, fontSize: '15px', fontWeight: 500 }}>
                                {option.optionText}
                            </div>
                            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                ({option.voteCount} vote)
                            </div>
                        </label>
                    ))}

                    {error && <Alert variant="danger" style={{ marginTop: '16px' }}>{error}</Alert>}

                    {!voted ? (
                        <button
                            type="submit"
                            className="btn-primary-gradient"
                            style={{ marginTop: '24px', width: '100%', padding: '14px' }}
                            disabled={!selectedOption}
                        >
                            Gửi ý kiến bầu chọn
                        </button>
                    ) : (
                        <Alert variant="success" style={{ marginTop: '24px', textAlign: 'center', fontWeight: 600 }}>
                            ✅ Cảm ơn bạn đã tham gia bầu chọn! Ý kiến của bạn đã được ghi nhận.
                        </Alert>
                    )}
                </form>
            </div>
        </div>
    );
};

export default SurveyDetail;
