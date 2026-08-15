import { useState } from 'react';
import { fireConfetti } from './ConfettiEffect';
import { addGuest } from '../services/guestService';
import { isFirebaseConfigured } from '../firebase/config';

export default function RsvpForm() {
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showThankYou, setShowThankYou] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError('Vui lòng nhập tên của bạn.');
      return;
    }

    if (trimmedName.length > 50) {
      setError('Tên không được quá 50 ký tự.');
      return;
    }

    if (!status) {
      setError('Vui lòng chọn bạn sẽ đến hay không.');
      return;
    }

    if (note.trim().length > 200) {
      setError('Ghi chú không được quá 200 ký tự.');
      return;
    }

    if (!isFirebaseConfigured()) {
      setError('Firebase chưa được cấu hình. Vui lòng xem README.');
      return;
    }

    setLoading(true);

    try {
      await addGuest({ name: trimmedName, note, status });

      if (status === 'attending') {
        fireConfetti(true);
        setShowThankYou(true);
      } else {
        setMessage('Cảm ơn bạn đã phản hồi. Hẹn dịp khác nhé!');
      }

      setName('');
      setNote('');
      setStatus('');
    } catch (err) {
      setError(err.message || 'Không thể gửi phản hồi. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rsvp section">
      <h2 className="section-title">Xác nhận tham dự</h2>
      <form className="rsvp-form card" onSubmit={handleSubmit}>
        {!isFirebaseConfigured() && (
          <div className="alert alert-warning">
            Firebase chưa được cấu hình. Copy file .env.example thành .env và
            điền thông tin Firebase.
          </div>
        )}

        <label className="form-label" htmlFor="guest-name">
          Tên của bạn *
        </label>
        <input
          id="guest-name"
          className="form-input"
          type="text"
          placeholder="Nhập tên của bạn"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={50}
          disabled={loading}
        />

        <label className="form-label" htmlFor="guest-note">
          Ghi chú
        </label>
        <textarea
          id="guest-note"
          className="form-textarea"
          placeholder="Mang theo ai? Dị ứng thực phẩm?..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={200}
          rows={3}
          disabled={loading}
        />

        <fieldset className="form-fieldset">
          <legend className="form-label">Bạn có tham dự không? *</legend>
          <label className="radio-option">
            <input
              type="radio"
              name="status"
              value="attending"
              checked={status === 'attending'}
              onChange={(e) => setStatus(e.target.value)}
              disabled={loading}
            />
            <span>Tôi sẽ đến</span>
          </label>
          <label className="radio-option">
            <input
              type="radio"
              name="status"
              value="declined"
              checked={status === 'declined'}
              onChange={(e) => setStatus(e.target.value)}
              disabled={loading}
            />
            <span>Tôi không thể đến</span>
          </label>
        </fieldset>

        {error && <p className="form-error">{error}</p>}
        {message && <p className="form-success">{message}</p>}

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Đang gửi...' : 'Gửi phản hồi'}
        </button>
      </form>

      {showThankYou && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={() => setShowThankYou(false)}
        >
          <div
            className="thank-you-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="thank-you-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <span className="thank-you-emoji" aria-hidden="true">🎉</span>
            <h3 id="thank-you-title">Cảm ơn bạn đã đồng ý tham gia!</h3>
            <p>Phản hồi của bạn đã được lưu. Hẹn gặp bạn tại bữa tiệc nhé!</p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowThankYou(false)}
            >
              Tuyệt vời!
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
