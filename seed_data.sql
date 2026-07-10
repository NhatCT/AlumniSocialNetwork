-- SQL script to seed default admin and sample data for Alumni Social Network

-- Disable foreign key checks to safely clean tables
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE `reaction`;
TRUNCATE TABLE `comment`;
TRUNCATE TABLE `post`;
TRUNCATE TABLE `survey_response`;
TRUNCATE TABLE `survey_option`;
TRUNCATE TABLE `survey`;
TRUNCATE TABLE `group_member`;
TRUNCATE TABLE `user_group`;
TRUNCATE TABLE `notification_recipient`;
TRUNCATE TABLE `notification`;

-- Delete existing default users if they exist to prevent duplicate errors
DELETE FROM `user` WHERE username IN ('admin', 'alumni1', 'alumni2');
SET FOREIGN_KEY_CHECKS = 1;

-- Update the user's existing account 'nhat1234' to Admin and unlock it so they can log in immediately
UPDATE `user` SET user_role = 'ROLE_ADMIN', is_locked = 0, is_checked = 1 WHERE username = 'nhat1234';

-- Insert admin and alumni users (if not exists)
INSERT INTO `user` (email, password, student_id, user_role, is_locked, created_at, first_name, last_name, username, is_checked) VALUES
('admin@alumni.com', '$2b$12$BZt6I2RhgjDndUI3Dwj9s.KxjhprCa/E6lvAgTLz1cMUpYxzzZPle', 'ADMIN', 'ROLE_ADMIN', 0, NOW(), 'Admin', 'System', 'admin', 1),
('alumni1@alumni.com', '$2b$12$Ep6uASTf4zFgggNkYt55cONRroU89QqrJ8/Os7Eoc2zKjwpUD2GGG', 'SV111111', 'ROLE_ALUMNI', 0, NOW(), 'An', 'Nguyen Van', 'alumni1', 1),
('alumni2@alumni.com', '$2b$12$Ep6uASTf4zFgggNkYt55cONRroU89QqrJ8/Os7Eoc2zKjwpUD2GGG', 'SV222222', 'ROLE_ALUMNI', 0, NOW(), 'Binh', 'Tran Thi', 'alumni2', 1);

-- Get IDs of users dynamically to insert posts
-- Post 1 (by admin)
INSERT INTO `post` (content, is_comment_locked, created_at, updated_at, user_id) 
SELECT 'Chào mừng tất cả cựu sinh viên tham gia vào mạng xã hội mới của chúng ta! Chúc các bạn có những trải nghiệm kết nối tuyệt vời.', 0, NOW(), NOW(), id 
FROM `user` WHERE username = 'admin';

-- Post 2 (by alumni1)
INSERT INTO `post` (content, is_comment_locked, created_at, updated_at, user_id) 
SELECT 'Có ai có thông tin về ngày hội việc làm và tuyển dụng của trường sắp tới không? Mình muốn đăng ký tham gia.', 0, NOW(), NOW(), id 
FROM `user` WHERE username = 'alumni1';

-- Post 3 (by alumni2)
INSERT INTO `post` (content, is_comment_locked, created_at, updated_at, user_id) 
SELECT 'Kỷ niệm 15 năm thành lập khoa CNTT, có cựu sinh viên nào khoa 2010 tham gia họp lớp không nhỉ?', 0, NOW(), NOW(), id 
FROM `user` WHERE username = 'alumni2';

-- Insert comments using dynamic SELECT for user_id and post_id
-- Comment 1 on Post 1 by alumni1
INSERT INTO `comment` (content, created_at, updated_at, parent_id, post_id, user_id)
SELECT 'Chúc mạng xã hội của chúng ta ngày càng phát triển!', NOW(), NOW(), NULL, p.id, u.id
FROM `post` p, `user` u 
WHERE p.content LIKE 'Chào mừng%' AND u.username = 'alumni1';

-- Comment 2 on Post 1 by alumni2
INSERT INTO `comment` (content, created_at, updated_at, parent_id, post_id, user_id)
SELECT 'Tuyệt vời quá admin ơi!', NOW(), NOW(), NULL, p.id, u.id
FROM `post` p, `user` u 
WHERE p.content LIKE 'Chào mừng%' AND u.username = 'alumni2';

-- Comment 3 on Post 2 by admin
INSERT INTO `comment` (content, created_at, updated_at, parent_id, post_id, user_id)
SELECT 'Ngày hội việc làm sẽ diễn ra vào ngày 20/10 tại cơ sở chính nhé bạn.', NOW(), NOW(), NULL, p.id, u.id
FROM `post` p, `user` u 
WHERE p.content LIKE 'Có ai có%' AND u.username = 'admin';

-- Insert reactions using dynamic SELECT
INSERT INTO `reaction` (type, created_at, post_id, user_id)
SELECT 'LIKE', NOW(), p.id, u.id
FROM `post` p, `user` u 
WHERE p.content LIKE 'Chào mừng%' AND u.username = 'alumni1';

INSERT INTO `reaction` (type, created_at, post_id, user_id)
SELECT 'LIKE', NOW(), p.id, u.id
FROM `post` p, `user` u 
WHERE p.content LIKE 'Chào mừng%' AND u.username = 'alumni2';

-- Insert sample survey
INSERT INTO `survey` (title, description, created_at) VALUES
('Khảo sát ý kiến về thời gian tổ chức Ngày hội cựu sinh viên', 'Chúng tôi muốn biết thời gian nào là thuận tiện nhất để các bạn tham gia ngày hội cựu sinh viên năm nay.', NOW());

-- Insert survey options using dynamic SELECT
INSERT INTO `survey_option` (option_text, survey_id)
SELECT 'Thứ Bảy, ngày 15/11', id FROM `survey` WHERE title LIKE 'Khảo sát%';

INSERT INTO `survey_option` (option_text, survey_id)
SELECT 'Chủ Nhật, ngày 16/11', id FROM `survey` WHERE title LIKE 'Khảo sát%';

INSERT INTO `survey_option` (option_text, survey_id)
SELECT 'Thứ Bảy, ngày 22/11', id FROM `survey` WHERE title LIKE 'Khảo sát%';
