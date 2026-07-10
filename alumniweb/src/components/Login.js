import { useContext, useState } from "react";
import { Alert } from "react-bootstrap";
import MySpinner from "./layout/MySpinner";
import { useNavigate } from "react-router-dom";
import Apis, { authApis, endpoints } from "../configs/Apis";
import cookie from 'react-cookies';
import { MyUserContext } from "../configs/Context";

const Login = () => {
    const [, dispatch] = useContext(MyUserContext);
    const [user, setUser] = useState({ username: '', password: '' });
    const [msg, setMsg] = useState();
    const nav = useNavigate();
    const [loading, setLoading] = useState(false);

    const login = async (event) => {
        event.preventDefault();
        setMsg("");

        try {
            setLoading(true);

            let res = await Apis.post(endpoints['login'], {
                ...user
            });

            if (res.status === 200) {
                cookie.save('token', res.data.token);

                let u = await authApis().get(endpoints.profile());

                if (u.data.isLocked === false) {
                    cookie.save('user', u.data);

                    dispatch({
                        "type": "login",
                        "payload": u.data
                    });

                    nav("/");
                } else {
                    if (u.data.userRole === "ROLE_ALUMNI")
                        setMsg("Mã số sinh viên của bạn chưa được xác nhận, vui lòng chờ thêm!");
                    else
                        setMsg("Tài khoản của bạn đã bị khóa do không đổi mật khẩu đúng hạn! Vui lòng liên hệ admin để gia hạn thời gian đổi mật khẩu!");
                    cookie.remove('token');
                }
            } else
                return;
        } catch (ex) {
            console.error(ex);
            setMsg("Sai thông tin đăng nhập!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            {/* Hero Section */}
            <div className="auth-hero">
                <h1>
                    Chào mừng đến<br />
                    <span className="hero-highlight">Alumni Network</span>
                </h1>
                <p>
                    Nền tảng kết nối cựu sinh viên hàng đầu. 
                    Chia sẻ kinh nghiệm, xây dựng mối quan hệ và 
                    cùng nhau phát triển sự nghiệp.
                </p>
                <div className="hero-features">
                    <div className="hero-feature">
                        <span className="feature-icon">🤝</span>
                        <span>Kết nối với hàng nghìn cựu sinh viên</span>
                    </div>
                    <div className="hero-feature">
                        <span className="feature-icon">💼</span>
                        <span>Cơ hội nghề nghiệp và tuyển dụng</span>
                    </div>
                    <div className="hero-feature">
                        <span className="feature-icon">📊</span>
                        <span>Tham gia khảo sát và sự kiện</span>
                    </div>
                    <div className="hero-feature">
                        <span className="feature-icon">💬</span>
                        <span>Nhắn tin và thảo luận trực tuyến</span>
                    </div>
                </div>
            </div>

            {/* Login Form */}
            <div className="auth-form-section">
                <div className="auth-card">
                    <h2>Đăng nhập</h2>
                    <p className="auth-subtitle">Nhập thông tin tài khoản để tiếp tục</p>

                    {msg && <Alert variant="danger">{msg}</Alert>}

                    <form onSubmit={login}>
                        <div className="auth-form-group">
                            <label>Tên đăng nhập</label>
                            <div className="auth-input-wrapper">
                                <span className="input-icon">👤</span>
                                <input
                                    type="text"
                                    placeholder="Nhập tên đăng nhập"
                                    required
                                    value={user.username}
                                    onChange={(e) => setUser({ ...user, username: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="auth-form-group">
                            <label>Mật khẩu</label>
                            <div className="auth-input-wrapper">
                                <span className="input-icon">🔒</span>
                                <input
                                    type="password"
                                    placeholder="Nhập mật khẩu"
                                    required
                                    value={user.password}
                                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                                />
                            </div>
                        </div>

                        {loading ? <MySpinner /> : (
                            <button type="submit" className="auth-btn">
                                Đăng nhập
                            </button>
                        )}
                    </form>

                    <div className="auth-link">
                        Chưa có tài khoản?{' '}
                        <button type="button" onClick={() => nav("/register")}>
                            Đăng ký ngay
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
