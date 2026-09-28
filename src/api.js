const BASE = '/api/events';

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (res.status === 204) return null; // DELETE returns no body
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}

export const getEvents = () => request(BASE);
export const createEvent = (event) =>
  request(BASE, { method: 'POST', body: JSON.stringify(event) });
export const updateEvent = (id, event) =>
  request(`${BASE}/${id}`, { method: 'PUT', body: JSON.stringify(event) });
export const deleteEvent = (id) => request(`${BASE}/${id}`, { method: 'DELETE' });