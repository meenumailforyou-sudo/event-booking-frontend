import { useEffect, useState } from 'react';
import { getEvents, createEvent, updateEvent, deleteEvent } from './api';
import EventCard from './components/EventCard';
import EventForm from './components/EventForm';

export default function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null); // the event being edited, or null

  async function load() {
    try {
      setError('');
      setEvents(await getEvents());
    } catch (err) {
      setError('Cannot reach the server. Is `npm run dev` running in your backend folder?');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSave(data) {
    if (editing) await updateEvent(editing.id, data);
    else await createEvent(data);
    closeForm();
    load();
  }

  async function handleDelete(event) {
    if (!window.confirm(`Delete "${event.title}"?`)) return;
    try {
      await deleteEvent(event.id);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  function openNew() {
    setEditing(null);
    setFormOpen(true);
  }
  function openEdit(event) {
    setEditing(event);
    setFormOpen(true);
  }
  function closeForm() {
    setFormOpen(false);
    setEditing(null);
  }

  return (
    <div className="page">
      <header className="top">
        <h1>Tickets, on the door</h1>
        <button className="btn primary" onClick={openNew}>Add event</button>
      </header>

      {error && <p className="notice error" role="alert">{error}</p>}

      {formOpen && (
        <EventForm initial={editing} onSave={handleSave} onCancel={closeForm} />
      )}

      {loading ? (
        <p className="notice">Loading events…</p>
      ) : events.length === 0 && !error ? (
        <p className="notice">No events yet. Select “Add event” to create the first one.</p>
      ) : (
        <main className="grid">
          {events.map((ev) => (
            <EventCard key={ev.id} event={ev} onEdit={openEdit} onDelete={handleDelete} />
          ))}
        </main>
      )}
    </div>
  );
}