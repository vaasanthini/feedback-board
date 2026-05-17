const BASE_URL = import.meta.env.VITE_API_URL || '';

function getVoterToken() {
  let token = localStorage.getItem('voter_token');
  if (!token) {
    token = crypto.randomUUID();
    localStorage.setItem('voter_token', token);
  }
  return token;
}

export async function apiFetch(path, options = {}) {
  const adminKey = localStorage.getItem('admin_key') || '';
  const headers = {
    'Content-Type': 'application/json',
    'x-voter-token': getVoterToken(),
    ...(adminKey ? { 'x-admin-key': adminKey } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}
