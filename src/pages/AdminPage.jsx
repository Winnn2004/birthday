import { useEffect, useState } from 'react';
import AdminLogin from '../components/admin/AdminLogin';
import GuestTable from '../components/admin/GuestTable';
import StatsCards from '../components/admin/StatsCards';
import { logoutAdmin, onAuthChange } from '../services/authService';
import { subscribeAllGuests } from '../services/guestService';
import { adminEmail, isFirebaseConfigured } from '../firebase/config';

export default function AdminPage() {
  const [user, setUser] = useState(undefined);
  const [guests, setGuests] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    return onAuthChange(setUser);
  }, []);

  useEffect(() => {
    if (!user) return;

    return subscribeAllGuests(setGuests, () => {
      setError('Không thể tải danh sách RSVP. Kiểm tra Firestore Rules rồi thử lại.');
    });
  }, [user]);

  if (user === undefined) {
    return (
      <div className="admin-page">
        <div className="admin-loading">Đang tải...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="admin-page">
        <AdminLogin />
      </div>
    );
  }

  if (
    !isFirebaseConfigured() ||
    (adminEmail && user.email?.toLowerCase() !== adminEmail)
  ) {
    return (
      <div className="admin-page">
        <div className="admin-access-card card">
          <h1>Không có quyền truy cập</h1>
          <p>
            Hãy đăng nhập đúng tài khoản admin. Nếu đã cấu hình{' '}
            <code>VITE_ADMIN_EMAIL</code>, email này phải trùng khớp.
          </p>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => logoutAdmin()}
          >
            Đăng xuất
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <h1>Quản lý khách mời</h1>
          <p className="admin-email">{user.email}</p>
        </div>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => logoutAdmin()}
        >
          Đăng xuất
        </button>
      </header>

      <StatsCards guests={guests} />
      {error && <p className="form-error admin-error">{error}</p>}
      <GuestTable guests={guests} />
    </div>
  );
}
