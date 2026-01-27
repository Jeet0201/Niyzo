const DEFAULT_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

function getToken(): string | null {
  try {
    return localStorage.getItem('auth:token');
  } catch {
    return null;
  }
}

async function request(path: string, options: RequestInit & { auth?: boolean } = {}) {
  const base = DEFAULT_BASE_URL.replace(/\/$/, '');
  const url = `${base}${path.startsWith('/') ? '' : '/'}${path}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };
  if (options.auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const text = await res.text();
    let message = text;
    try {
      message = JSON.parse(text).message || message;
    } catch {}
    throw new Error(message || `Request failed: ${res.status}`);
  }
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) return res.json();
  return res.text();
}

export const api = {
  login: (email: string, password: string) =>
    request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  getHealth: () => request('/api/health'),
  // Questions
  createQuestion: (payload: { studentName: string; studentEmail?: string; subject: string; question: string; assignedMentorId?: string }) =>
    request('/api/questions', { method: 'POST', body: JSON.stringify(payload) }),
  getQuestions: () => request('/api/questions', { auth: true }),
  updateQuestion: (id: string, patch: any) => request(`/api/questions/${id}`, { method: 'PATCH', body: JSON.stringify(patch), auth: true }),
  // Mentors
  getMentors: () => request('/api/mentors', { auth: true }),
  getPublicMentors: () => request('/api/public/mentors'),
  createMentor: (payload: { name: string; subject: string; university?: string; status?: string }) =>
    request('/api/mentors', { method: 'POST', body: JSON.stringify(payload), auth: true }),
  updateMentor: (id: string, patch: any) =>
    request(`/api/mentors/${id}`, { method: 'PATCH', body: JSON.stringify(patch), auth: true }),
  deleteMentor: (id: string) => request(`/api/mentors/${id}`, { method: 'DELETE', auth: true }),
  // Public resolved answers
  getPublicResolved: () => request('/api/public/resolved'),
};

export type { };
