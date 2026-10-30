import { useState } from 'react';
import { login, signup } from '../api';

export default function AuthForm({ onSuccess, onCancel }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password || (mode === 'signup' && !form.name)) {
      setError('Please fill all the fields.');
      return;
    }
    try {
      setBusy(true);
      const user = mode === 'login'
        ? await login(form.email, form.password)
        : await signup(form);
      onSuccess(user);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <form className="form" onSubmit={submit}>
      <h2>{mode === 'login' ? 'Log in' : 'Create account'}</h2>

      {mode === 'signup' && (
        <label>Name
          <input value={form.name} onChange={set('name')} placeholder="Your name" />
        </label>
      )}
      <label>Email
        <input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" />
      </label>
      <label>Password
        <input type="password" value={form.password} onChange={set('password')} placeholder="At least 6 characters" />
      </label>
      {mode === 'signup' && (
        <label>I am a
          <select value={form.role} onChange={set('role')}>
            <option value="user">User (book tickets)</option>
            <option value="organizer">Organizer (create events)</option>
          </select>
        </label>
      )}

      {error && <p className="notice error" role="alert">{error}</p>}

      <div className="actions">
        <button type="submit" className="btn primary" disabled={busy}>
          {busy ? 'Please wait...' : mode === 'login' ? 'Log in' : 'Sign up'}
        </button>
        <button type="button" className="btn" onClick={onCancel}>Cancel</button>
      </div>

      <p className="switch">
        {mode === 'login' ? 'New here? ' : 'Already have an account? '}
        <button type="button" className="link" onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}>
          {mode === 'login' ? 'Create an account' : 'Log in'}
        </button>
      </p>
    </form>
  );
}

