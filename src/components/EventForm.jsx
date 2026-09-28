import { useState } from 'react';

export default function EventForm({ initial, onSave, onCancel }) {
  const editing = Boolean(initial);
  const [form, setForm] = useState({
    title: initial?.title || '',
    location: initial?.location || '',
    date: initial?.date || '',
    totalSeats: initial?.totalSeats || '',
    price: initial?.price ?? '',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.date || !form.totalSeats) {
      setError('Title, date and total seats are required.');
      return;
    }
    const payload = {
      title: form.title.trim(),
      location: form.location.trim(),
      date: form.date,
      price: Number(form.price) || 0,
    };
    // Seat count is fixed after creation (your backend doesn't recalculate availableSeats yet)
    if (!editing) payload.totalSeats = Number(form.totalSeats);

    try {
      setSaving(true);
      setError('');
      await onSave(payload);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <form className="form" onSubmit={submit}>
      <h2>{editing ? 'Edit event' : 'New event'}</h2>

      <label>Title
        <input value={form.title} onChange={set('title')} placeholder="Coldplay Live" />
      </label>
      <label>Location
        <input value={form.location} onChange={set('location')} placeholder="Chennai" />
      </label>
      <div className="row">
        <label>Date
          <input type="date" value={form.date} onChange={set('date')} />
        </label>
        <label>Total seats
          <input type="number" min="1" value={form.totalSeats}
                 onChange={set('totalSeats')} disabled={editing} />
        </label>
        <label>Price (₹)
          <input type="number" min="0" value={form.price} onChange={set('price')} />
        </label>
      </div>

      {error && <p className="notice error" role="alert">{error}</p>}

      <div className="actions">
        <button type="submit" className="btn primary" disabled={saving}>
          {saving ? 'Saving…' : 'Save event'}
        </button>
        <button type="button" className="btn" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}