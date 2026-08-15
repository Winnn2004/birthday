import { useState } from 'react';
import { updateGuestNote } from '../services/guestService';

export default function NoteForm({ guestId }) {
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    if (note.length > 200) {
      setError('Ghi chú tối đa 200 ký tự.');
      return;
    }

    setLoading(true);
    try {
      await updateGuestNote(guestId, note);
      setMessage(
        note.trim()
          ? 'Mình đã nhận được note riêng của bạn.\nありがとうございます。'
          : 'Đã lưu thành công.'
      );
    } catch (saveError) {
      setError(saveError.message || 'Không thể lưu ghi chú. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="note-section invitation-section" aria-labelledby="note-title">
      <div className="note-heading">
        <p className="eyebrow">LỜI NHẮN RIÊNG CHO CHỦ TIỆC</p>
        <h2 id="note-title">Có lưu ý gì thêm không?</h2>
        <p>
          Note này chỉ có tui biết thâu. Duu có gì muốn nói với tớ thì nói nhỏ với tớ nhé :))) Hoặc có idea mới lạ nhắn mình nhá. Then kìuuuu!!!!
        </p>
      </div>

      <form className="note-form" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="guest-note">
          Ghi chú riêng cho chủ tiệc
        </label>
        <textarea
          id="guest-note"
          className="dark-textarea"
          rows={4}
          maxLength={200}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          disabled={loading}
        />

        <div className="note-form-footer">
          <span>{note.length}/200 ký tự</span>
          <button
            className="gold-button gold-button-small"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Đang lưu...' : 'Lưu Ghi Chú'}
          </button>
        </div>

        {error && <p className="form-error">{error}</p>}
        {message && <p className="form-success">{message}</p>}
      </form>
    </section>
  );
}
