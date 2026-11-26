import os
import re
from urllib.parse import urlparse
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5173"]}})

SHORTENERS = {"bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "rb.gy"}
SUSPICIOUS_WORDS = {
    "login", "verify", "verification", "secure", "update", "bank",
    "account", "wallet", "password", "gift", "prize", "urgent"
}

def inspect_url(raw_url: str):
    findings = []
    score = 0
    candidate = raw_url.strip()

    if not candidate:
        return {"risk": "Không xác định", "score": 0, "findings": ["Vui lòng nhập URL."]}

    if not re.match(r"^https?://", candidate, re.I):
        candidate = "https://" + candidate

    try:
        parsed = urlparse(candidate)
        host = (parsed.hostname or "").lower().strip(".")
        if not host or "." not in host:
            findings.append("Tên miền không có định dạng thông thường.")
            score += 2
        if parsed.scheme != "https":
            findings.append("Đường dẫn không sử dụng HTTPS.")
            score += 1
        if parsed.username or parsed.password:
            findings.append("URL chứa thông tin đăng nhập trước tên miền.")
            score += 3
        if host in SHORTENERS:
            findings.append("Đây là dịch vụ rút gọn URL; đích đến chưa được thể hiện rõ.")
            score += 2
        if len(candidate) > 100:
            findings.append("URL dài bất thường.")
            score += 1
        if host.count("-") >= 2:
            findings.append("Tên miền có nhiều dấu gạch nối.")
            score += 1
        if re.search(r"\d+\.\d+\.\d+\.\d+", host):
            findings.append("Địa chỉ sử dụng IP thay vì tên miền thông thường.")
            score += 2
        words = SUSPICIOUS_WORDS.intersection(set(re.split(r"[^a-z0-9]+", host + " " + parsed.path.lower())))
        if words:
            findings.append("Có từ ngữ thường xuất hiện trong trang giả mạo: " + ", ".join(sorted(words)) + ".")
            score += min(2, len(words))
    except ValueError:
        findings.append("Không thể phân tích URL.")
        score += 3

    if not findings:
        findings.append("Chưa phát hiện dấu hiệu đáng ngờ theo các quy tắc cơ bản.")

    risk = "Cần thận trọng" if score <= 2 else ("Rủi ro cao" if score >= 5 else "Có dấu hiệu đáng ngờ")
    return {"risk": risk, "score": score, "findings": findings,
            "disclaimer": "Đây chỉ là đánh giá sơ bộ. Không có dấu hiệu cảnh báo không đồng nghĩa website an toàn."}

@app.get("/api/health")
def health():
    return jsonify({"status": "ok", "service": "SAFECLICK API"})

@app.post("/api/analyze-url")
def analyze_url():
    data = request.get_json(silent=True) or {}
    url = data.get("url", "")
    if not isinstance(url, str) or len(url) > 2048:
        return jsonify({"error": "URL không hợp lệ hoặc quá dài."}), 400
    return jsonify(inspect_url(url))

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
