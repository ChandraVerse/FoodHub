const API_BASE_URL = 'http://localhost:8080';

export async function apiRequest(path, options = {}, token) {
  const url = `${API_BASE_URL}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
  const response = await fetch(url, {
    ...options,
    headers
  });
  let body = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }
  if (!response.ok) {
    const message = body?.message || 'Request failed';
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }
  return body;
}

