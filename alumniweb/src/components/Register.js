import { useRef, useState } from "react";
import { Alert } from "react-bootstrap";
import Apis, { endpoints } from "../configs/Apis";
import { useNavigate } from "react-router-dom";
import MySpinner from "./layout/MySpinner";

const Register = () => {
    const avatar = useRef();
    const [user, setUser] = useState({});
    const [msg, setMsg] = useState();
    const [avatarPreview, setAvatarPreview] = useState(null);
    const nav = useNavigate();
    const [loading, setLoading] = useState(false);

    const getPasswordStrength = (password) => {
        if (!password) return 0;
        let strength = 0;
        if (password.length >= 6) strength++;
        if (password.length >= 10) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return Math.min(strength, 4);
    };

    const strengthLevel = getPasswordStrength(user.password);
    const strengthLabel = ['', 'Yếu', 'Trung bình', 'Khá', 'Mạnh'][strengthLevel];
    const strengthClass = ['', 'weak', 'medium', 'medium', 'strong'][strengthLevel];

    const validate = () => {
        if (user.confirm !== user.password) {
            setMsg("Mật khẩu không khớp!");
            return false;
        }
        return true;
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const register = async (event) => {
        event.preventDefault();

        if (validate()) {
            try {
                setLoading(true);
                let formData = new FormData();
                for (let key in user)
                    if (key !== 'confirm')
                        formData.append(key, user[key]);

                if (avatar.current.files.length > 0) {
                    formData.append("avatar", avatar.current.files[0]);
                }

                let res = await Apis.post(endpoints['register'], formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (res.status === 201)
                    nav("/login");
            } catch (ex) {
                console.error(ex);
                setMsg(ex.response?.data?.message || "Đăng ký thất bại! Vui lòng kiểm tra lại thông tin.");
            } finally {
                setLoading(false);
            }
        }
    };

    const fields = [
        { title: "Họ và tên đệm", field: "lastName", type: "text", icon: "👤", placeholder: "Nguyễn Văn" },
        { title: "Tên", field: "firstName", type: "text", icon: "✏️", placeholder: "An" },
        { title: "Mã số sinh viên", field: "studentId", type: "text", icon: "🎓", placeholder: "SV12345678" },
        { title: "Email", field: "email", type: "email", icon: "📧", placeholder: "email@example.com" },
        { title: "Tên đăng nhập", field: "username", type: "text", icon: "🆔", placeholder: "username" },
        { title: "Mật khẩu", field: "password", type: "password", icon: "🔒", placeholder: "Tối thiểu 6 ký tự" },
        { title: "Xác nhận mật khẩu", field: "confirm", type: "password", icon: "🔐", placeholder: "Nhập lại mật khẩu" },
    ];

    return (
        <div className="auth-page">
            {/* Hero */}
            <div className="auth-hero">
                <h1>
                    Tham gia<br />
                    <span className="hero-highlight">Alumni Network</span>
                </h1>
                <p>
                    Tạo tài khoản để kết nối với cộng đồng cựu sinh viên,
                    chia sẻ kinh nghiệm và khám phá cơ hội mới.
                </p>
                <div className="hero-features">
                    <div className="hero-feature">
                        <span className="feature-icon">🚀</span>
                        <span>Đăng ký nhanh chóng, miễn phí</span>
                    </div>
                    <div className="hero-feature">
                        <span className="feature-icon">🔒</span>
                        <span>Bảo mật thông tin cá nhân</span>
                    </div>
                    <div className="hero-feature">
                        <span className="feature-icon">✅</span>
                        <span>Xác thực bởi quản trị viên</span>
                    </div>
                </div>
            </div>

            {/* Register Form */}
            <div className="auth-form-section">
                <div className="auth-card" style={{ maxWidth: '520px' }}>
                    <h2>Đăng ký tài khoản</h2>
                    <p className="auth-subtitle">Điền thông tin bên dưới để tạo tài khoản mới</p>

                    {msg && <Alert variant="danger">{msg}</Alert>}

                    <form onSubmit={register}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            {fields.slice(0, 4).map(f => (
                                <div className="auth-form-group" key={f.field}>
                                    <label>{f.title}</label>
                                    <div className="auth-input-wrapper">
                                        <span className="input-icon">{f.icon}</span>
                                        <input
                                            type={f.type}
                                            placeholder={f.placeholder}
                                            required
                                            value={user[f.field] || ''}
                                            onChange={(e) => setUser({ ...user, [f.field]: e.target.value })}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {fields.slice(4).map(f => (
                            <div className="auth-form-group" key={f.field}>
                                <label>{f.title}</label>
                                <div className="auth-input-wrapper">
                                    <span className="input-icon">{f.icon}</span>
                                    <input
                                        type={f.type}
                                        placeholder={f.placeholder}
                                        required
                                        value={user[f.field] || ''}
                                        onChange={(e) => setUser({ ...user, [f.field]: e.target.value })}
                                    />
                                </div>
                                {f.field === 'password' && user.password && (
                                    <>
                                        <div className="password-strength">
                                            {[1, 2, 3, 4].map(i => (
                                                <div key={i} className={`strength-bar ${i <= strengthLevel ? `active ${strengthClass}` : ''}`} />
                                            ))}
                                        </div>
                                        <small style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                                            Độ mạnh: {strengthLabel}
                                        </small>
                                    </>
                                )}
                            </div>
                        ))}

                        {/* Avatar Upload */}
                        <div className="auth-form-group">
                            <label>Ảnh đại diện (tuỳ chọn)</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                {avatarPreview && (
                                    <img
                                        src={avatarPreview}
                                        alt="Preview"
                                        style={{
                                            width: 56, height: 56,
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                            border: '3px solid var(--primary-light)'
                                        }}
                                    />
                                )}
                                <label style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '10px 20px',
                                    background: 'var(--bg-secondary)',
                                    border: '2px dashed var(--border-color)',
                                    borderRadius: 'var(--radius-md)',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    color: 'var(--text-secondary)',
                                    transition: 'all 0.2s',
                                    flex: 1,
                                    justifyContent: 'center'
                                }}>
                                    📷 Chọn ảnh đại diện
                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={avatar}
                                        style={{ display: 'none' }}
                                        onChange={handleAvatarChange}
                                    />
                                </label>
                            </div>
                        </div>

                        {loading ? <MySpinner /> : (
                            <button type="submit" className="auth-btn">
                                Tạo tài khoản
                            </button>
                        )}
                    </form>

                    <div className="auth-link">
                        Đã có tài khoản?{' '}
                        <button type="button" onClick={() => nav("/login")}>
                            Đăng nhập
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;