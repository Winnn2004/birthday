import { partyConfig } from '../config/party';

export default function Footer() {
  return (
    <footer className="invitation-footer">
      <p>
        Nếu lạc đường, gọi ngay cho{' '}
        <strong>{partyConfig.hostName}</strong> (
        <a href={`tel:${partyConfig.hostPhone}`} className="footer-phone-link">
          {partyConfig.hostPhone}
        </a>
        )
      </p>
    </footer>
  );
}
