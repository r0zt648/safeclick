CREATE DATABASE IF NOT EXISTS safeclick CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE safeclick;

CREATE TABLE IF NOT EXISTS lessons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(80) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quiz_questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question TEXT NOT NULL,
  option_a VARCHAR(255) NOT NULL,
  option_b VARCHAR(255) NOT NULL,
  option_c VARCHAR(255) NOT NULL,
  correct_option CHAR(1) NOT NULL,
  explanation TEXT NOT NULL,
  CHECK (correct_option IN ('A','B','C'))
);

INSERT INTO lessons (title, content, category) VALUES
('Nhận biết website giả mạo', 'Kiểm tra chính xác tên miền, tránh đăng nhập từ liên kết trong tin nhắn bất ngờ và không bỏ qua cảnh báo trình duyệt.', 'Website'),
('Nhận biết tin nhắn lừa đảo', 'Cảnh giác với lời thúc giục, đe dọa khóa tài khoản, yêu cầu OTP hoặc yêu cầu chuyển tiền. Hãy tự mở ứng dụng/website chính thức để kiểm tra.', 'Tin nhắn'),
('Bảo vệ tài khoản', 'Dùng mật khẩu riêng cho từng dịch vụ, bật xác thực đa yếu tố và tuyệt đối không chia sẻ mã OTP.', 'Tài khoản');

INSERT INTO quiz_questions (question, option_a, option_b, option_c, correct_option, explanation) VALUES
('Một tin nhắn tự xưng ngân hàng yêu cầu gửi mã OTP để xác minh. Bạn nên làm gì?',
 'Gửi OTP ngay', 'Không cung cấp OTP và liên hệ ngân hàng qua kênh chính thức', 'Chuyển tiếp tin nhắn cho bạn bè',
 'B', 'Mã OTP là thông tin xác thực bí mật. Ngân hàng không cần bạn đọc OTP cho người lạ.'),
('Bạn nhận được đường link nhận quà nhưng phải đăng nhập tài khoản. Cách xử lý tốt nhất?',
 'Bấm link và đăng nhập', 'Nhập thử mật khẩu cũ', 'Không đăng nhập qua link; tự truy cập trang chính thức để kiểm tra',
 'C', 'Ưu đãi bất ngờ và yêu cầu đăng nhập qua liên kết lạ là dấu hiệu cần cảnh giác.');
