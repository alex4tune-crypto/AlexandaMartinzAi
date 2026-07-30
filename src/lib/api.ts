export const API_BASE = typeof window !== 'undefined' ? '' : 'http://localhost:3000';

export const api = {
  async get(path: string) {
    const response = await fetch(`${API_BASE}${path}`);
    if (!response.ok) throw new Error(`API error: ${response.statusText}`);
    return response.json();
  },

  async post(path: string, body?: any) {
    const response = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body || {}),
    });
    if (!response.ok) throw new Error(`API error: ${response.statusText}`);
    return response.json();
  },

  async patch(path: string, body?: any) {
    const response = await fetch(`${API_BASE}${path}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body || {}),
    });
    if (!response.ok) throw new Error(`API error: ${response.statusText}`);
    return response.json();
  },

  async delete(path: string) {
    const response = await fetch(`${API_BASE}${path}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(`API error: ${response.statusText}`);
    return response.json();
  },
};
