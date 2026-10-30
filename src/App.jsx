import { useEffect, useState } from 'react';
import {
  getEvents, createEvent, updateEvent, deleteEvent, bookTicket, getSavedUser, logout,
} from './api';
import EventCard from './components/EventCard';
import EventForm from './components/EventForm';
import AuthForm from './components/AuthForm';
import MyTickets from './components/MyTickets';
import VerifyTicket from './components/VerifyTicket';

export default function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [user, setUser] = useState(getSavedUser());
  const [authOpen, setAuthOpen] = useState(false);
  const [view, setView] = useState('events'); // events | tickets | verify
  const [newBookingId, setNewBookingId] = useState(null);

  const canManage = Boolean(user) && (user.role === 'organizer' || user.role === 'admin');

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

  async function handleBook(event) {
    if (!user) {
      setAuthOpen(true);
      setError('Please log in to book tickets.');
      return;
    }
    const answer = window.prompt('How many tickets? (1 to 5)', '1');
    if (answer === null) return;
    const quantity = Number(answer);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 5) {
      setError('Please enter a number from 1 to 5.');
      return;
    }
    try {
      setError('');
      const booking = await bookTicket(event.id, quantity);
      setNewBookingId(booking.id);
      setView('tickets');
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

  function handleAuthSuccess(loggedIn) {
    setUser(loggedIn);
    setAuthOpen(false);
    setError('');
  }
  function handleLogout() {
    logout();
    setUser(null);
    closeForm();
    setView('events');
    setError('');
  }
  function backToEvents() {
    setView('events');
    setNewBookingId(null);
    setError('');
    load();
  }

  return (
    <div className="page">
      <header className="top">
        <h1>Tickets, on the door</h1>
        <div className="top-actions">
          {user ? (
            <>
              <span className="who">Hello, {user.name} ({user.role})</span>
              <button className="btn" onClick={() => setView('tickets')}>My tickets</button>
              {canManage && (
                <>
                  <button className="btn" onClick={() => setView('verify')}>Verify ticket</button>
                  <button className="btn primary" onClick={() => { setView('events'); openNew(); }}>Add event</button>
                </>
              )}
              <button className="btn" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <button className="btn primary" onClick={() => setAuthOpen(true)}>
              Login / Sign up
            </button>
          )}
        </div>
      </header>

      {error && <p className="notice error" role="alert">{error}</p>}

      {authOpen && !user && (
        <AuthForm onSuccess={handleAuthSuccess} onCancel={() => setAuthOpen(false)} />
      )}

      {view === 'tickets' && user && (
        <MyTickets onClose={backToEvents} highlightId={newBookingId} />
      )}

      {view === 'verify' && canManage && <VerifyTicket onClose={backToEvents} />}

      {view === 'events' && (
        <>
          {formOpen && canManage && (
            <EventForm initial={editing} onSave={handleSave} onCancel={closeForm} />
          )}

          {loading ? (
            <p className="notice">Loading events...</p>
          ) : events.length === 0 && !error ? (
            <p className="notice">No events yet.{canManage ? ' Select "Add event" to create the first one.' : ''}</p>
          ) : (
            <main className="grid">
              {events.map((ev) => (
                <EventCard
                  key={ev.id}
                  event={ev}
                  canManage={canManage}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                  onBook={handleBook}
                />
              ))}
            </main>
          )}
        </>
      )}
    </div>
  );
}
