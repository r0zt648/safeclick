import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const API = 'http://127.0.0.1:5000';
const lessons = [
  ['Website giả mạo', 'Đọc kỹ tên miền, kiểm tra chính tả và không đăng nhập từ liên kết được gửi bất ngờ. HTTPS không đảm bảo website là thật.'],
  ['Email và tin nhắn lừa đảo', 'Cảnh giác với lời đe dọa, thúc giục, quà tặng bất ngờ, yêu cầu chuyển tiền hoặc cung cấp OTP.'],
  ['Bảo vệ tài khoản', 'Dùng mật khẩu riêng cho từng tài khoản, bật xác thực đa yếu tố và không chia sẻ mã xác minh.']
];
const questions = [
  {q:'Tin nhắn tự xưng ngân hàng yêu cầu mã OTP. Bạn nên làm gì?', a:['Gửi OTP ngay','Không cung cấp và liên hệ ngân hàng qua kênh chính thức','Gửi cho người nhắn ảnh thẻ'], correct:1, why:'Không chia sẻ OTP với bất kỳ ai.'},
  {q:'Một người lạ gửi link nhận quà và yêu cầu đăng nhập. Bạn nên?', a:['Đăng nhập để nhận quà','Nhập mật khẩu thử','Không dùng link; tự mở trang chính thức để kiểm tra'], correct:2, why:'Không đăng nhập qua liên kết không rõ nguồn gốc.'},
  {q:'Email yêu cầu tải tệp đính kèm bất ngờ. Cách tốt nhất?', a:['Xác minh người gửi qua kênh khác trước khi mở','Mở ngay','Chuyển tiếp cho mọi người'], correct:0, why:'Tệp đính kèm bất ngờ có thể chứa nội dung độc hại.'}
];

function passwordScore(p) {
  let score = 0;
  if (p.length >= 8) score++;
  if (p.length >= 12) score++;
  if (/[a-z]/.test(p) && /[A-Z]/.test(p)) score++;
  if (/\d/.test(p)) score++;
  if (/[^A-Za-z0-9]/.test(p)) score++;
  if (/(.)\1{2,}/.test(p) || /1234|password|qwerty/i.test(p)) score = Math.max(0, score - 2);
  return Math.min(5, score);
}
function App() {
  const [tab, setTab] = useState('url');
  const [url, setUrl] = useState('');
  const [urlResult, setUrlResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [answer, setAnswer] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const strength = useMemo(() => passwordScore(password), [password]);
  const checkUrl = async (e) => {
    e.preventDefault(); setLoading(true); setUrlResult(null);
    try {
      const r = await fetch(`${API}/api/analyze-url`, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({url})});
      const data = await r.json(); setUrlResult(data);
    } catch { setUrlResult({error:'Không kết nối được máy chủ. Hãy kiểm tra Flask API đang chạy.'}); }
    finally { setLoading(false); }
  };
  const scoreText = ['Rất yếu','Yếu','Trung bình','Khá','Mạnh','Rất mạnh'];
  return <div className="app">
    <header><div className="brand"><span className="shield">✓</span><span>SAFE<span>CLICK</span></span></div><p>Nhận biết rủi ro · Bảo vệ chính bạn</p></header>
    <section className="hero"><div><div className="eyebrow">AN TOÀN SỐ BẮT ĐẦU TỪ MỘT CÚ NHẤP</div><h1>Dừng lại một giây.<br/><em>An toàn hơn mỗi ngày.</em></h1><p>Kiểm tra dấu hiệu đáng ngờ và học cách tự bảo vệ mình trên Internet.</p></div><div className="heroIcon">🛡️</div></section>
    <nav>{[['url','Kiểm tra đường link'],['password','Mật khẩu'],['learn','Học bảo mật'],['quiz','Trắc nghiệm']].map(([id,label])=><button className={tab===id?'active':''} onClick={()=>setTab(id)} key={id}>{label}</button>)}</nav>
    <main>
      {tab==='url' && <section className="panel"><h2>Kiểm tra đường link</h2><p className="muted">Phân tích một số dấu hiệu thường gặp ở URL đáng ngờ.</p><form onSubmit={checkUrl}><label htmlFor="url">Đường dẫn website</label><div className="inputRow"><input id="url" value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://example.com" required/><button className="primary" disabled={loading}>{loading?'Đang kiểm tra...':'Phân tích URL'}</button></div></form>
      {urlResult && <div className="result"><h3>{urlResult.error || urlResult.risk}</h3>{urlResult.findings?.map((f,i)=><p key={i}>• {f}</p>)}{urlResult.disclaimer && <small>{urlResult.disclaimer}</small>}</div>}
      <div className="notice">Không nhập thông tin đăng nhập vào website chỉ vì công cụ này không phát hiện cảnh báo. Kết quả chỉ mang tính tham khảo.</div></section>}
      {tab==='password' && <section className="panel"><h2>Đánh giá mật khẩu</h2><p className="muted">Phân tích diễn ra ngay trên trình duyệt. Mật khẩu không được gửi tới máy chủ.</p><label htmlFor="pw">Mật khẩu thử nghiệm</label><input id="pw" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Nhập mật khẩu mẫu, không dùng mật khẩu thật"/>
      <div className="meter">{[1,2,3,4,5].map(n=><i key={n} className={strength>=n?'filled':''}/>)}</div><b>{password ? scoreText[strength] : 'Chưa có dữ liệu'}</b>
      <ul className="tips"><li>Nên dài từ 12 ký tự trở lên.</li><li>Kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt.</li><li>Không dùng lại mật khẩu giữa các dịch vụ.</li><li>Tránh tên, ngày sinh và chuỗi dễ đoán.</li></ul><div className="notice">Đây là bộ đánh giá cơ bản, không thay thế công cụ chuyên dụng. Hãy thử bằng mật khẩu giả, không nhập mật khẩu đang sử dụng.</div></section>}
      {tab==='learn' && <section className="panel"><h2>Học an toàn thông tin</h2><p className="muted">Những nguyên tắc cơ bản để nhận diện rủi ro.</p><div className="cards">{lessons.map((l,i)=><article className="lesson" key={l[0]}><div className="number">0{i+1}</div><h3>{l[0]}</h3><p>{l[1]}</p></article>)}</div></section>}
      {tab==='quiz' && <section className="panel"><h2>Thử thách nhận diện lừa đảo</h2><p className="muted">Chọn phương án phù hợp nhất cho mỗi tình huống.</p>{questions.map((q,i)=><article className="question" key={q.q}><h3>{i+1}. {q.q}</h3>{q.a.map((a,j)=><label className="option" key={a}><input type="radio" name={`q${i}`} checked={answer[i]===j} onChange={()=>{setAnswer({...answer,[i]:j});setSubmitted(false)}}/>{a}</label>)}{submitted && <p className={answer[i]===q.correct?'good':'bad'}>{answer[i]===q.correct?'Chính xác!':'Chưa đúng.'} {q.why}</p>}</article>)}<button className="primary" onClick={()=>setSubmitted(true)}>Chấm điểm</button>{submitted&&<h3>Kết quả: {questions.filter((q,i)=>answer[i]===q.correct).length}/{questions.length} câu đúng</h3>}</section>}
    </main>
    <footer>SAFECLICK · Dự án giáo dục an toàn thông tin <span>Không có công cụ tự động nào đảm bảo phát hiện được mọi hình thức lừa đảo.</span></footer>
  </div>;
}
createRoot(document.getElementById('root')).render(<App/>);
