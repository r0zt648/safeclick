# SAFECLICK – bản MVP

Ứng dụng mẫu gồm React (Vite) + Flask + MySQL:
- Phân tích URL bằng các quy tắc heuristic cơ bản (không khẳng định URL chắc chắn an toàn).
- Kiểm tra độ mạnh mật khẩu hoàn toàn trong trình duyệt; mật khẩu không được gửi tới API.
- Bài học ngắn và câu hỏi trắc nghiệm nhận diện lừa đảo.
- API Flask và cấu trúc database MySQL để lưu bài học/câu hỏi.

## 1. Yêu cầu
- Node.js 18+
- Python 3.10+
- MySQL 8+

## 2. Cài đặt backend
```bash
cd backend
python -m venv .venv
# Windows: .venv\\Scripts\\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
```
Tạo database bằng cách chạy `database/schema.sql` trong MySQL. Sao chép `.env.example` thành `.env`, sửa thông tin kết nối rồi chạy:
```bash
python app.py
```
API chạy tại http://localhost:5000

## 3. Cài đặt frontend
Mở terminal khác:
```bash
cd frontend
npm install
npm run dev
```
Mở địa chỉ Vite hiển thị trong terminal (thường là http://localhost:5173).

## Lưu ý bảo mật
- Bộ phân tích URL chỉ tìm dấu hiệu đáng ngờ, không phải dịch vụ xác minh danh tiếng tên miền.
- Không mở hoặc tải nội dung URL do người dùng nhập ở backend; việc đó có thể tạo lỗ hổng SSRF.
- Không nhập mật khẩu thật vào bản demo. Bộ đo mật khẩu chạy tại máy và không gửi mật khẩu lên máy chủ.
- Trước khi triển khai thật cần HTTPS, giới hạn tần suất, logging an toàn, kiểm thử, cập nhật thư viện và tích hợp nguồn threat-intelligence đáng tin cậy.
