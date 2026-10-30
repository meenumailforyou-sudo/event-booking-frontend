const BASE = '/api/events';
const AUTH = '/api/auth';

export function getToken() {
  return localStorage.getItem('token');
}

export function getSavedUser() {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch {
    return null;
  }
}

function saveSession(data) {
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

async function request(url, options = {}) {
  const token = getToken();
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (res.status === 204) return null; // DELETE returns no body
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}

export async function login(email, password) {
  const data = await request(`${AUTH}/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  saveSession(data);
  return data.user;
}

export async function signup({ name, email, password, role }) {
  const data = await request(`${AUTH}/signup`, {
    method: 'POST',
    body: JSON.stringify({ name, email, password, role }),
  });
  saveSession(data);
  return data.user;
}

export const getEvents = () => request(BASE);
export const createEvent = (event) =>
  request(BASE, { method: 'POST', body: JSON.stringify(event) });
export const updateEvent = (id, event) =>
  request(`${BASE}/${id}`, { method: 'PUT', body: JSON.stringify(event) });
export const deleteEvent = (id) => request(`${BASE}/${id}`, { method: 'DELETE' });
