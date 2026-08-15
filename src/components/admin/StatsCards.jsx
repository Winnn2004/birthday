export default function StatsCards({ guests }) {
  const totalAttending = guests.filter((g) => g.status === 'attending' || !g.status).length;
  const withNotesCount = guests.filter((g) => g.note && g.note.trim().length > 0).length;

  const stats = [
    {
      label: 'Tổng Xác Nhận Tham Gia',
      value: totalAttending,
      className: 'stat-total',
    },
    {
      label: 'Số Người Để Lại Ghi Chú',
      value: withNotesCount,
      className: 'stat-notes',
    },
  ];

  return (
    <div className="stats-cards">
      {stats.map((stat) => (
        <div key={stat.label} className={`stat-card ${stat.className}`}>
          <span className="stat-value">{stat.value}</span>
          <span className="stat-label">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}
