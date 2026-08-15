import { useState } from 'react';
import { loginAdmin } from '../../services/authService';
import { adminEmail, isFirebaseConfigured } from '../../firebase/config';

export default function AdminLogin({ onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (adminEmail && email.trim().toLowerCase() !== adminEmail) {
      setError('Email này không có quyền quản trị.');
      return;
    }

    setLoading(true);

    try {
      await loginAdmin(email, password);
      onSuccess?.();
    } catch {
      setError('Email hoặc mật khẩu không đúng.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login-card">
        <p className="eyebrow">QUẢN TRỊ VIÊN</p>
        <h1>Đăng Nhập Admin</h1>
        <p className="admin-login-desc">
          Quản lý danh sách khách mời và ghi chú riêng
        </p>

        {!isFirebaseConfigured() && (
          <p className="form-error" style={{ marginBottom: '1.25rem' }}>
            Chưa cấu hình biến môi trường Firebase trong file <code>.env</code>.
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="dark-label" htmlFor="admin-email">
              Email Quản Trị
            </label>
            <input
              id="admin-email"
              className="dark-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="dark-label" htmlFor="admin-password">
              Mật Khẩu
            </label>
            <input
              id="admin-password"
              className="dark-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button className="gold-button" type="submit" disabled={loading}>
            {loading ? 'Đang đăng nhập...' : 'Đăng Nhập Admin'}
          </button>
        </form>
      </div>
    </div>
  );
}
