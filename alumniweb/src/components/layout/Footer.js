import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="footer-premium">
            <div className="footer-grid">
                <div>
                    <div className="footer-brand">🎓 Alumni Network</div>
                    <p className="footer-desc">
                        Nền tảng kết nối cựu sinh viên, chia sẻ kinh nghiệm 
                        và xây dựng cộng đồng mạnh mẽ cho tương lai.
                    </p>
                    <div className="footer-social">
                        <a href="#" title="Facebook">📘</a>
                        <a href="#" title="LinkedIn">💼</a>
                        <a href="#" title="YouTube">🎬</a>
                        <a href="#" title="Email">📧</a>
                    </div>
                </div>

                <div>
                    <h4 className="footer-heading">Khám phá</h4>
                    <ul className="footer-links">
                        <li><Link to="/">Bảng tin</Link></li>
                        <li><Link to="/surveys">Khảo sát</Link></li>
                        <li><Link to="/chat">Tin nhắn</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="footer-heading">Tài khoản</h4>
                    <ul className="footer-links">
                        <li><Link to="/profile">Trang cá nhân</Link></li>
                        <li><Link to="/register">Đăng ký</Link></li>
                        <li><Link to="/login">Đăng nhập</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="footer-heading">Liên hệ</h4>
                    <ul className="footer-links">
                        <li><a href="#">support@alumni.edu.vn</a></li>
                        <li><a href="#">(028) 3835 4266</a></li>
                        <li><a href="#">97 Võ Văn Tần, Q.3, TP.HCM</a></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                © {new Date().getFullYear()} Alumni Social Network. Tất cả quyền được bảo lưu.
            </div>
        </footer>
    );
};

export default Footer;