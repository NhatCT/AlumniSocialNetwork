# Alumni Social Network (Mạng xã hội Cựu sinh viên)

Dự án Mạng xã hội Cựu sinh viên là một ứng dụng Fullstack được chia thành 2 phần chính:
* **Backend (`/AlumniSocialNetwork`)**: Được phát triển bằng Java Spring Boot (Spring MVC, Spring Security, Hibernate), đóng gói dưới dạng file WAR và deploy chạy trên nền Tomcat thông qua Docker (host trên Render).
* **Frontend (`/alumniweb`)**: Được phát triển bằng React.js, đóng gói và deploy trên nền tảng Vercel.

---

## 🛠️ Cấu hình và Hướng dẫn chạy Dự án

### 1. Cấu hình Backend (Spring Boot)
Thư mục gốc backend: [AlumniSocialNetwork](file:///e:/AlumniSocialNetwork/AlumniSocialNetwork)

#### Cấu hình Database (`databases.properties`)
File cấu hình database: [databases.properties](file:///e:/AlumniSocialNetwork/AlumniSocialNetwork/src/main/resources/databases.properties)
* **Local**: Sử dụng schema `alumni_network` trên cổng local `3306`.
* **Production**: Tích hợp với MySQL Cluster trên **Aiven**, kết nối trực tiếp vào database **`alumni_db`** (không dùng `defaultdb` của Aiven vì đó là của dự án khác).

#### Các biến môi trường cần thiết (Cấu hình trên Render)
Khi deploy lên Render, hãy thêm các biến môi trường sau:
* `DB_URL`: Link kết nối database Aiven MySQL (dạng `jdbc:mysql://<aiven-host>:<port>/alumni_db?ssl-mode=REQUIRED`)
* `DB_USERNAME`: Tài khoản quản trị database Aiven (`avnadmin`)
* `DB_PASSWORD`: Mật khẩu database
* `CLOUDINARY_CLOUD_NAME`: Tên cloud lưu trữ ảnh trên Cloudinary
* `CLOUDINARY_API_KEY`: API Key Cloudinary
* `CLOUDINARY_API_SECRET`: API Secret Cloudinary

---

### 2. Cấu hình Frontend (React.js)
Thư mục gốc frontend: [alumniweb](file:///e:/AlumniSocialNetwork/alumniweb)

#### Cài đặt local:
1. Mở terminal tại thư mục `alumniweb/`
2. Chạy lệnh cài đặt thư viện: `npm install` (hoặc `yarn install`)
3. Chạy môi trường dev: `npm start` (hoặc `yarn start`)

#### Các biến môi trường cần thiết (Cấu hình trên Vercel)
Khi deploy lên Vercel, hãy thêm các biến môi trường sau:
* `REACT_APP_API_BASE_URL`: Link trỏ về API Backend của bạn trên Render, lưu ý phải có hậu tố `/api/` (Ví dụ: `https://alumnisocialnetwork.onrender.com/api/`).
* `REACT_APP_FIREBASE_API_KEY`, `REACT_APP_FIREBASE_AUTH_DOMAIN`, `REACT_APP_FIREBASE_PROJECT_ID`, `REACT_APP_FIREBASE_STORAGE_BUCKET`, `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`, `REACT_APP_FIREBASE_APP_ID`, `REACT_APP_FIREBASE_MEASUREMENT_ID`: Các thông số cấu hình Firebase để tích hợp chat/đăng nhập.

---

## 🚀 Các cải tiến và sửa lỗi gần đây

Dự án đã được cải thiện và sửa đổi một số lỗi quan trọng để chạy mượt mà trên môi trường Production (Render & Vercel):

### 1. Sửa lỗi CORS (Spring Security & Global Exception)
* **Vấn đề**: Browser chặn API preflight/request từ origin Vercel sang Render với thông báo CORS block, kể cả khi server báo lỗi 400/500 (như trùng username hay sai mật khẩu).
* **Giải pháp**:
  * Chuyển cấu hình `allowedOriginPatterns` và `allowedHeaders` trong [SpringSecurityConfigs.java](file:///e:/AlumniSocialNetwork/AlumniSocialNetwork/src/main/java/com/vmct/configs/SpringSecurityConfigs.java) sang dạng wildcard `*` để thông suốt toàn bộ domain Vercel (kể cả preview domain).
  * Bổ sung `@CrossOrigin` vào [GlobalExceptionHandler.java](file:///e:/AlumniSocialNetwork/AlumniSocialNetwork/src/main/java/com/vmct/controllers/GlobalExceptionHandler.java) để các response trả về lỗi của hệ thống vẫn có đầy đủ CORS headers, giúp frontend bắt và hiển thị thông báo lỗi chính xác lên giao diện.

### 2. Cải thiện quy trình Đăng ký (Register)
* **Vấn đề**: Nút đăng ký bấm không có phản hồi và báo lỗi ngầm khi người dùng không chọn ảnh đại diện (avatar).
* **Giải pháp**:
  * Ở backend [ApiUserController.java](file:///e:/AlumniSocialNetwork/AlumniSocialNetwork/src/main/java/com/vmct/controllers/ApiUserController.java), chuyển tham số `avatar` thành không bắt buộc (`required = false`).
  * Ở service [UserServiceImpl.java](file:///e:/AlumniSocialNetwork/AlumniSocialNetwork/src/main/java/com/vmct/services/impl/UserServiceImpl.java), thêm điều kiện check null: `if (avatar != null && !avatar.isEmpty())` trước khi gọi upload lên Cloudinary.
  * Ở frontend [Register.js](file:///e:/AlumniSocialNetwork/alumniweb/src/components/Register.js), cập nhật hàm `validate()` chặn submit khi mật khẩu không khớp, và bắt lỗi API hiển thị thông báo trực tiếp lên giao diện thay vì chỉ in log console.

### 3. Sửa nút điều hướng "Đăng kí" trên Login
* **Vấn đề**: Nút "Đăng kí" bên cạnh nút "Đăng nhập" ở trang login bị hiểu lầm là nút submit form đăng nhập, không chuyển hướng được sang trang `/register`.
* **Giải pháp**: Thêm `type="button"` và sự kiện `onClick={() => nav("/register")}` vào nút Đăng kí trong [Login.js](file:///e:/AlumniSocialNetwork/alumniweb/src/components/Login.js).

---

## 🗄️ Dữ liệu mẫu (Database Seeding)

Chúng tôi đã viết sẵn một kịch bản SQL nạp dữ liệu mẫu bao gồm: tài khoản Admin hệ thống, các tài khoản Cựu sinh viên test, bài viết, bình luận, lượt cảm xúc và cuộc khảo sát mẫu.

* **File Script**: [seed_data.sql](file:///e:/AlumniSocialNetwork/seed_data.sql)
* **Tài khoản Admin mới**:
  * Username: `admin`
  * Password: `adminpassword123`
* **Tài khoản Cựu sinh viên test**:
  * Username: `alumni1` / `alumni2`
  * Password: `admin`
* **Tài khoản cá nhân của bạn (`nhat1234`)**:
  * Đã được nâng cấp lên quyền **`ROLE_ADMIN`** và **MỞ KHÓA** để có thể đăng nhập test hệ thống ngay lập tức.
