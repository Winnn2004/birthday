import { useRef, useState } from 'react';

const JOKES = [
  'Ơ kìa, nút này bị sao thế nhờ...',
  'Ê nha, bên kia cơ mà....',
  'Người tổ chức đã khoá lựa chọn này.',
  'Không có bấm được nút này đâu!',
  'Có nhầm lẫn gì không bạn gì ơi?',
  'Chọn "Enjoy the party" đi. Năn nỉ á',
  'Tiếc quá! Không có cơ hội từ chối ở đây đâu',
  'Ủa alo? Vẫn cố đuổi theo cái nút hả?',
];

export default function EntryGate({ onAdmit }) {
  const declineZoneRef = useRef(null);
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [hasAccepted, setHasAccepted] = useState(false);
  const [declinePosition, setDeclinePosition] = useState({ x: 0, y: 0 });
  const [joke, setJoke] = useState('Vui lòng điền thông tin và xác nhận tham gia.');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const dodgeDecline = () => {
    const zone = declineZoneRef.current;
    const card = zone ? zone.closest('.entry-card') : null;

    let maxX = 120;
    let maxY = 50;

    if (card) {
      const cardWidth = card.clientWidth || 360;
      maxX = Math.min(160, Math.floor(cardWidth / 2 - 35));
    }

    let newX, newY;
    let attempts = 0;
    do {
      newX = Math.round((Math.random() - 0.5) * maxX * 2);
      newY = Math.round((Math.random() - 0.5) * maxY * 2);
      attempts++;
    } while (
      attempts < 10 &&
      Math.abs(newX - declinePosition.x) < 40 &&
      Math.abs(newY - declinePosition.y) < 25
    );

    setDeclinePosition({ x: newX, y: newY });
    setJoke(JOKES[Math.floor(Math.random() * JOKES.length)]);
  };

  const handleDeclineAttempt = (event) => {
    event.preventDefault();
    event.stopPropagation();
    dodgeDecline();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const cleanName = name.trim();
    const cleanNickname = nickname.trim();

    if (!cleanName || !cleanNickname) {
      setError('Cho ban tổ chức xin cả tên thật lẫn biệt danh nhé.');
      return;
    }

    if (!hasAccepted) {
      setError('Muốn vào tiệc thì phải chọn “Enjoy the party” thôi nào.');
      return;
    }

    setLoading(true);
    try {
      await onAdmit({ name: cleanName, nickname: cleanNickname });
    } catch (submitError) {
      setError(submitError.message || 'Không thể mở thiệp. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="entry-page">
      <section className="entry-card" aria-labelledby="entry-title">
        <div className="entry-seal" aria-hidden="true">✦</div>
        <p className="eyebrow">Welcome to Ân’s Birthday!</p>
        <h1 id="entry-title">Birthday Party Invitation</h1>
        <p className="entry-intro">
          Điền đúng thông tin của bạn để nhận thông tin vé mời.
          <br />
          いかのじょうほうを にゅうりょくしてください。
        </p>

        <form className="entry-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="dark-label" htmlFor="gate-name">
              Tên của bạn
            </label>
            <input
              id="gate-name"
              className="dark-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="dark-label" htmlFor="gate-nickname">
              Biệt danh
            </label>
            <input
              id="gate-nickname"
              className="dark-input"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={30}
              required
              disabled={loading}
            />
          </div>

          <fieldset className="attendance-fieldset" disabled={loading}>
            <legend className="dark-label">Bạn sẽ có mặt chung vui chứ?</legend>
            <div className="attendance-options">
              <button
                className={`attendance-btn accept-btn ${hasAccepted ? 'is-selected' : ''}`}
                type="button"
                onClick={() => {
                  setHasAccepted(true);
                  setJoke('Tui biết bạn sẽ chọn tham gia mà');
                  setError('');
                }}
              >
                <span>✓</span> Enjoy the party
              </button>

              <div className="decline-zone" ref={declineZoneRef}>
                <button
                  className="decline-btn"
                  type="button"
                  style={{
                    transform: `translate(${declinePosition.x}px, ${declinePosition.y}px)`,
                    transition: 'transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  }}
                  onPointerEnter={dodgeDecline}
                  onPointerDown={handleDeclineAttempt}
                  onTouchStart={handleDeclineAttempt}
                  onFocus={dodgeDecline}
                  onClick={handleDeclineAttempt}
                >
                  Ở nhà ngủ
                </button>
              </div>
            </div>
            <p className="gate-joke" aria-live="polite">{joke}</p>
          </fieldset>

          {error && <p className="form-error">{error}</p>}

          <button
            className="gold-button"
            type="submit"
            disabled={!hasAccepted || loading || !name.trim() || !nickname.trim()}
          >
            {loading ? 'Đang mở phong bì...' : '✦ Mở Thiệp Mời ✦'}
          </button>
        </form>
      </section>
    </main>
  );
}
