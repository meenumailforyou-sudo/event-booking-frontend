export default function EventCard({ event, onEdit, onDelete }) {
  const { title, location, date, price, totalSeats, availableSeats } = event;
  const d = new Date(date);
  const valid = !isNaN(d);
  const sold = totalSeats - availableSeats;
  const pct = totalSeats ? Math.round((sold / totalSeats) * 100) : 0;

  return (
    <article className="ticket">
      <div className="ticket-main">
        <h2>{title}</h2>
        <p className="meta">{location || 'Location to be announced'}</p>
        <div className="seats" aria-label={`${availableSeats} of ${totalSeats} seats left`}>
          <div className="bar"><span style={{ width: `${pct}%` }} /></div>
          <small>{availableSeats} of {totalSeats} seats left</small>
        </div>
        <div className="actions">
          <button className="btn" onClick={() => onEdit(event)}>Edit</button>
          <button className="btn danger" onClick={() => onDelete(event)}>Delete</button>
        </div>
      </div>

      <div className="ticket-stub">
        <span className="day">{valid ? d.getDate() : '–'}</span>
        <span className="month">
          {valid ? d.toLocaleString('en-IN', { month: 'short', year: 'numeric' }) : ''}
        </span>
        <span className="price">{price ? `₹${price}` : 'Free'}</span>
      </div>
    </article>
  );
}