import { partyConfig } from '../config/party';

export default function Hero({ guest, onChangeGuest }) {
  const guestTitle = guest.name && guest.name !== guest.nickname
    ? `${guest.name} (${guest.nickname})`
    : (guest.name || guest.nickname);

  return (
    <section className="hero invitation-section">
      <div className="hero-topline">
        <p className="eyebrow">MIDNIGHT SOCIAL CLUB</p>
        <button className="change-guest-btn" type="button" onClick={onChangeGuest}>
          Không phải {guest.nickname}?
        </button>
      </div>

      <div className="host-avatar-container">
        <img
          src={partyConfig.hostAvatar}
          alt={partyConfig.hostName}
          className="host-avatar-img"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        <div className="host-avatar-ring" />
      </div>

      <p className="invitation-to-label">TRÂN TRỌNG KÍNH MỜI</p>
      <h2 className="invited-guest-name">{guestTitle}</h2>

      <div className="gold-divider" />

      <h1 className="hero-title">
        Tiệc Sinh Nhật <span>{partyConfig.hostName}</span>
      </h1>

      <p className="hero-welcome">
        Ban tổ chức đã ghi nhận sự có mặt của bạn. Hãy chuẩn bị năng lượng tốt nhất để chung vui một đêm tiệc đáng nhớ!
      </p>
    </section>
  );
}
