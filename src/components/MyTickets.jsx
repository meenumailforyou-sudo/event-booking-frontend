import { useEffect, useState } from 'react';
import { getMyBookings } from '../api';

export default function MyTickets({ onClose, highlightId }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getMyBookings()
      .then(setTickets)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>My tickets</h2>
        <button className="btn" onClick={onClose}>Back to events</button>
      </div>

      {error && <p className="notice error" role="alert">{error}</p>}

      {loading ? (
        <p className="notice">Loading tickets...</p>
      ) : tickets.length === 0 ? (
        <p className="notice">You have no tickets yet.</p>
      ) : (
        <div className="tickets">
          {tickets.map((t) => (
            <article
              key={t.id}
              className={`qr-ticket ${t.status === 'used' ? 'used' : ''} ${t.id === highlightId ? 'fresh' : ''}`}
            >
              <img src={t.qr} alt={`QR code for ${t.eventTitle}`} width="160" height="160" />
              <div>
                <h3>{t.eventTitle}</h3>
                <p className="meta">{t.location || 'Location to be announced'} - {t.date}</p>
                <p>{t.quantity} ticket(s)</p>
                <span className={`badge ${t.status}`}>
                  {t.status === 'valid' ? 'Valid' : 'Already used'}
                </span>
                <p className="code">Code: <code>{t.ticketCode}</code></p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
