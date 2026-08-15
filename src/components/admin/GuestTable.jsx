import { useState } from 'react';
import { deleteGuest } from '../../services/guestService';

function formatTimestamp(timestamp) {
  if (!timestamp) return '—';

  const date =
    typeof timestamp.toDate === 'function'
      ? timestamp.toDate()
      : new Date(timestamp);

  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function GuestTable({ guests }) {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (guestId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa khách mời này khỏi danh sách?')) {
      return;
    }

    setDeletingId(guestId);
    try {
      await deleteGuest(guestId);
    } catch {
      alert('Không thể xóa. Vui lòng kiểm tra quyền admin và thử lại.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="guest-table-wrap">
      <div className="table-responsive">
        <table className="guest-table">
          <thead>
            <tr>
              <th>Tên Tự Nhập</th>
              <th>Biệt Danh</th>
              <th>Ghi Chú Trực Tiếp</th>
              <th>Thời Gian RSVP</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {guests.length === 0 ? (
              <tr>
                <td colSpan={5} className="table-empty">
                  Chưa có ai hoàn tất xác nhận tham gia.
                </td>
              </tr>
            ) : (
              guests.map((guest) => (
                <tr key={guest.id}>
                  <td>
                    <strong>{guest.name}</strong>
                  </td>
                  <td>
                    <span className="guest-nickname-badge">
                      {guest.nickname || '—'}
                    </span>
                  </td>
                  <td>{guest.note ? guest.note : <span style={{ opacity: 0.4 }}>—</span>}</td>
                  <td>{formatTimestamp(guest.createdAt)}</td>
                  <td>
                    <button
                      type="button"
                      className="btn-danger"
                      onClick={() => handleDelete(guest.id)}
                      disabled={deletingId === guest.id}
                    >
                      {deletingId === guest.id ? 'Đang xóa...' : 'Xóa'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
