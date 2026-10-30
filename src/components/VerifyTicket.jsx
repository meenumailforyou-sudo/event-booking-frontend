import { useState } from 'react';
import { verifyTicket } from '../api';

export default function VerifyTicket({ onClose }) {
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);

  async function check(e) {
    e.preventDefault();
    if (!code.trim()) return;
    setBusy(true);
    setResult(null);
    try {
      const data = await verifyTicket(code.trim());
      setResult({
        ok: true,
        text: `Entry allowed: ${data.holder}, ${data.quantity} ticket(s) for ${data.eventTitle}`,
      });
      setCode('');
    } catch (err) {
      setResult({ ok: false, text: err.message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Verify ticket</h2>
        <button className="btn" onClick={onClose}>Back to events</button>
      </div>

      <form className="form" onSubmit={check}>
        <label>Ticket code (from the QR)
          <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Paste the code here" />
        </label>
        <div className="actions">
          <button type="submit" className="btn primary" disabled={busy}>
            {busy ? 'Checking...' : 'Verify'}
          </button>
        </div>
      </form>

      {result && (
        <p className={`verdict ${result.ok ? 'ok' : 'bad'}`} role="status">{result.text}</p>
      )}
    </section>
  );
}
