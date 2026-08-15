import { useEffect, useState } from 'react';
import { partyConfig } from '../config/party';

function calcTimeLeft(targetDate) {
  const diff = new Date(targetDate).getTime() - Date.now();

  if (diff <= 0) {
    return null;
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(() =>
    calcTimeLeft(partyConfig.birthdayDate)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calcTimeLeft(partyConfig.birthdayDate));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!timeLeft) {
    return (
      <section className="countdown invitation-section">
        <h2 className="section-title">Hôm Nay Là Ngày Tiệc!</h2>
        <p className="countdown-done">✦ Chúc mừng sinh nhật ✦</p>
      </section>
    );
  }

  const units = [
    { label: 'Ngày', value: timeLeft.days },
    { label: 'Giờ', value: timeLeft.hours },
    { label: 'Phút', value: timeLeft.minutes },
    { label: 'Giây', value: timeLeft.seconds },
  ];

  return (
    <section className="countdown invitation-section">
      <h2 className="section-title">Thời Gian Đếm Ngược</h2>
      <div className="countdown-grid">
        {units.map((unit) => (
          <div key={unit.label} className="countdown-box">
            <span className="countdown-value">
              {String(unit.value).padStart(2, '0')}
            </span>
            <span className="countdown-label">{unit.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
