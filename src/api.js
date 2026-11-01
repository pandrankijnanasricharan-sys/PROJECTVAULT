const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export async function api(path, options = {}) {
  const token = localStorage.getItem('pv_token');
  const headers = { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers };
  let response;
  try { response = await fetch(`${BASE}${path}`, { ...options, headers }); }
  catch { throw new Error('Cannot reach the API. Make sure the server and MongoDB are running.'); }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Something went wrong.');
  return data;
}
export const json = data => JSON.stringify(data);
