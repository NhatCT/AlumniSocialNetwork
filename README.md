# Alumni Social Network (Mạng xã hội Cựu sinh viên)

Mạng xã hội Cựu sinh viên là nền tảng kết nối trực tuyến cao cấp, giúp gắn kết các thế hệ cựu sinh viên, giảng viên và nhà trường. Ứng dụng cung cấp các tính năng tương tác đa dạng, trao đổi thông tin nghề nghiệp, bầu chọn khảo sát và nhắn tin thời gian thực.

Dự án được xây dựng dưới mô hình Fullstack hoàn chỉnh:
* **Backend (`/AlumniSocialNetwork`)**: Java Spring Boot (Spring Security, Hibernate, JPA) được triển khai đóng gói dưới dạng WAR chạy trên nền Tomcat thông qua Docker (host trên **Render**).
* **Frontend (`/alumniweb`)**: React.js SPA được tối ưu hóa giao diện và trải nghiệm người dùng, triển khai trên **Vercel**.

---

## 🔗 Liên kết ứng dụng (Live Demo)

* **Trang chủ (Client)**: [https://alumniweb-psi.vercel.app](https://alumniweb-psi.vercel.app)
* **Cổng API (Backend)**: [https://alumnisocialnetwork.onrender.com](https://alumnisocialnetwork.onrender.com)

---

## 🔑 Tài khoản dùng thử (Demo Accounts)

Để thuận tiện cho quá trình đánh giá và dùng thử toàn bộ tính năng của hệ thống (bao gồm cả phân hệ Admin và Người dùng), bạn có thể sử dụng các tài khoản dùng thử được tạo sẵn dưới đây:

### 1. Phân quyền Quản trị viên (Admin)
Quyền quản trị cho phép truy cập bảng điều khiển, phê duyệt bài viết, quản lý khảo sát và gửi thông báo hệ thống:
* **Username**: `admin`
* **Password**: `adminpassword123`

### 2. Phân quyền Cựu sinh viên (Alumni)
* **Tài khoản test 1**: `alumni1` / Mật khẩu: `admin`
* **Tài khoản test 2**: `alumni2` / Mật khẩu: `admin`

---

## ✨ Tính năng nổi bật

1. **Bảng tin & Tương tác xã hội**:
   - Đăng bài viết kèm nội dung đa phương tiện.
   - Thả cảm xúc động với bảng Emoji mở rộng khi di chuột (Thích 👍, Haha 😂, Yêu thích ❤️).
   - Bình luận phân tầng (Threaded comments) giúp thảo luận mạch lạc. Chủ bài viết có quyền khóa/mở khóa bình luận.
   - Tự động cuộn vô hạn (Infinite Scroll) kết hợp hiệu ứng tải mượt mà (Shimmer skeleton).
2. **Hệ thống Tin nhắn Chat (Real-time Messaging)**:
   - Nhắn tin trực tuyến thời gian thực tích hợp với Firebase Realtime Database.
   - Trạng thái hoạt động (online indicator), lịch sử hội thoại gần nhất và tự động cuộn thông minh.
3. **Phân hệ Khảo sát & Thăm dò ý kiến (Surveys)**:
   - Hiển thị danh sách khảo sát dưới dạng thẻ grid hiện đại.
   - Bầu chọn trực quan với giao diện radio card và xem kết quả tỉ lệ phần trăm bằng biểu đồ thanh tiến trình.
4. **Trung tâm Thông báo Động (Notification Center)**:
   - Biểu tượng chuông báo thông minh trên Header hiển thị số lượng tin mới.
   - Hộp thư thông báo thả xuống (dropdown) tức thì, cập nhật các thông tin sự kiện quan trọng.
5. **Trang cá nhân Chuyên nghiệp**:
   - Đổi ảnh đại diện, ảnh bìa trực tiếp với Cloudinary.
   - Quản lý dòng thời gian cá nhân và thông tin tài khoản chuyên nghiệp.

---

## 💻 Thiết lập chạy dưới Local

### 1. Chạy Backend (Spring Boot)
* Yêu cầu: **JDK 17** và **Maven**.
* Cấu hình database local trong file `databases.properties` nằm tại:
  `AlumniSocialNetwork/src/main/resources/databases.properties`
* Tạo database MySQL local có tên: `alumni_network` và import file dữ liệu mẫu [seed_data.sql](file:///e:/AlumniSocialNetwork/seed_data.sql).
* Khởi động server bằng IDE hoặc chạy lệnh:
  ```bash
  mvn clean install
  mvn tomcat7:run-war
  ```

### 2. Chạy Frontend (React.js)
* Yêu cầu: **Node.js** (v18 trở lên) và **npm**.
* Mở Terminal tại thư mục `alumniweb` và thiết lập file `.env` chứa các API Endpoint bảo mật (không để lộ khóa mật):
  ```env
  REACT_APP_API_BASE_URL=http://localhost:8080/AlumniSocialNetwork/api/
  REACT_APP_FIREBASE_API_KEY=YOUR_FIREBASE_KEY
  REACT_APP_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
  ...
  ```
* Chạy các lệnh cài đặt và khởi động:
  ```bash
  npm install
  npm start
  ```

---

## 🔒 An toàn & Bảo mật thông tin

* **Không lưu trữ trực tiếp** các khóa bảo mật, mật khẩu DB, hoặc API secrets trong mã nguồn công khai (GitHub).
* Sử dụng các **Biến môi trường (Environment Variables)** trên các dịch vụ lưu trữ (Render và Vercel) để quản lý cấu hình nhạy cảm.
* Cơ chế phân quyền Spring Security kết hợp bộ lọc JWT token đảm bảo tính toàn vẹn và an toàn của hệ thống dữ liệu cựu sinh viên.
