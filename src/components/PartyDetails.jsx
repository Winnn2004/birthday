import { partyConfig } from '../config/party';

function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function renderFormattedMessage(rawMessage) {
  if (!rawMessage) return null;

  // Split by newlines if present, otherwise by sentence endings
  const lines = rawMessage.includes('\n')
    ? rawMessage.split('\n').map((s) => s.trim()).filter(Boolean)
    : rawMessage.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);

  return (
    <div className="message-box">
      {lines.map((line, index) => (
        <div key={index} className="message-item">
          <span className="message-bullet">✦</span>
          <p className="message-text">{line}</p>
        </div>
      ))}
    </div>
  );
}

export default function PartyDetails() {
  return (
    <section className="party-details invitation-section">
      <h2 className="section-title">THÔNG TIN BỮA TIỆC</h2>
      <div className="details-card">
        <div className="detail-row">
          <div>
            <p className="detail-label">Thời Gian</p>
            <p className="detail-value">{formatDate(partyConfig.birthdayDate)}</p>
          </div>
        </div>

        <div className="detail-row">
          <div>
            <p className="detail-label">Địa Điểm</p>
            {partyConfig.venueMapUrl ? (
              <a
                className="detail-value detail-link"
                href={partyConfig.venueMapUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {partyConfig.venue} ↗
              </a>
            ) : (
              <p className="detail-value">{partyConfig.venue}</p>
            )}
          </div>
        </div>

        {partyConfig.dresscode && (
          <div className="detail-row">
            <div>
              <p className="detail-label">Dresscode</p>
              <p className="detail-value">{partyConfig.dresscode}</p>
            </div>
          </div>
        )}

        <div className="detail-row detail-row-message">
          <div>
            <p className="detail-label">Lời Mời Từ Chủ Tiệc</p>
            {renderFormattedMessage(partyConfig.message)}
          </div>
        </div>
      </div>
    </section>
  );
}
