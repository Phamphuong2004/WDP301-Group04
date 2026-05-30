import AsyncStorage from '@react-native-async-storage/async-storage';

// Server đã deploy trên Railway
const API_BASE_URL = 'https://wdp301-group04-journal-trends.up.railway.app';

class ApiService {
  async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = await AsyncStorage.getItem('token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Error ${response.status}`);
    }

    return data;
  }

  get<T = any>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  post<T = any>(endpoint: string, body: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  put<T = any>(endpoint: string, body: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  delete<T = any>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiService();

// ─────────────────────────────────────────────────────────
// AUTH
// POST /api/auth/register → { email, password, fullName }
// POST /api/auth/login    → { email, password }  → { token, user }
// GET  /api/auth/me       → user profile (requires token)
// ─────────────────────────────────────────────────────────
export const authApi = {
  register: (data: { email: string; password: string; fullName: string; institution?: string }) =>
    api.post('/api/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post<{ token: string; user: any }>('/api/auth/login', data),

  me: () =>
    api.get('/api/auth/me'),
};

// ─────────────────────────────────────────────────────────
// PAPERS
// GET /api/papers?page=&limit=           → { data: Paper[], pagination }
// GET /api/papers/search/query?q=&year=  → { data: Paper[] }
// GET /api/papers/:id
// ─────────────────────────────────────────────────────────
export const papersApi = {
  list: (page = 1, limit = 10) =>
    api.get(`/api/papers?page=${page}&limit=${limit}`),

  search: (q: string, year?: number, journalId?: string) => {
    let url = `/api/papers/search/query?q=${encodeURIComponent(q)}`;
    if (year) url += `&year=${year}`;
    if (journalId) url += `&journalId=${journalId}`;
    return api.get(url);
  },

  getById: (id: string) =>
    api.get(`/api/papers/${id}`),
};

// ─────────────────────────────────────────────────────────
// KEYWORDS / TRENDING
// GET /api/keywords?page=&limit=&sort=
// GET /api/keywords/trends/trending?limit=
// ─────────────────────────────────────────────────────────
export const keywordsApi = {
  list: (page = 1, limit = 20, sort = '-trendScore') =>
    api.get(`/api/keywords?page=${page}&limit=${limit}&sort=${sort}`),

  trending: (limit = 20) =>
    api.get(`/api/keywords/trends/trending?limit=${limit}`),
};

// ─────────────────────────────────────────────────────────
// BOOKMARKS
// GET    /api/bookmarks                      → list user's bookmarks
// POST   /api/bookmarks/:paperId             → add bookmark
// DELETE /api/bookmarks/:paperId             → remove bookmark
// GET    /api/bookmarks/:paperId/check       → check if bookmarked
// ─────────────────────────────────────────────────────────
export const bookmarksApi = {
  list: (page = 1, limit = 20) =>
    api.get(`/api/bookmarks?page=${page}&limit=${limit}`),

  add: (paperId: string) =>
    api.post(`/api/bookmarks/${paperId}`, {}),

  remove: (paperId: string) =>
    api.delete(`/api/bookmarks/${paperId}`),

  check: (paperId: string) =>
    api.get(`/api/bookmarks/${paperId}/check`),
};

// ─────────────────────────────────────────────────────────
// NOTIFICATIONS
// GET /api/notifications?page=&limit=
// GET /api/notifications/unread/count
// PUT /api/notifications/all/read
// PUT /api/notifications/:id/read
// DELETE /api/notifications/:id
// ─────────────────────────────────────────────────────────
export const notificationsApi = {
  list: (page = 1, limit = 20) =>
    api.get(`/api/notifications?page=${page}&limit=${limit}`),

  unreadCount: () =>
    api.get('/api/notifications/unread/count'),

  markAllRead: () =>
    api.put('/api/notifications/all/read', {}),

  markRead: (id: string) =>
    api.put(`/api/notifications/${id}/read`, {}),

  delete: (id: string) =>
    api.delete(`/api/notifications/${id}`),
};

// ─────────────────────────────────────────────────────────
// USERS
// GET /api/users/:id
// PUT /api/users/:id → { fullName, institution, bio, interests, avatar }
// POST /api/users/:id/change-password → { currentPassword, newPassword }
// ─────────────────────────────────────────────────────────
export const usersApi = {
  list: () =>
    api.get('/api/users'),

  remove: (id: string) =>
    api.delete(`/api/users/${id}`),

  getById: (id: string) =>
    api.get(`/api/users/${id}`),

  update: (id: string, data: {
    fullName?: string; institution?: string; bio?: string;
    interests?: string[]; avatar?: string;
  }) =>
    api.put(`/api/users/${id}`, data),

  changePassword: (id: string, data: { currentPassword: string; newPassword: string }) =>
    api.post(`/api/users/${id}/change-password`, data),
};

// ─────────────────────────────────────────────────────────
// FOLLOWS
// GET  /api/follows             → list follows
// POST /api/follows             → { targetType: 'Keyword'|'Journal', targetId, notifyEnabled }
// DELETE /api/follows/:targetId → unfollow
// ─────────────────────────────────────────────────────────
export const followsApi = {
  list: () =>
    api.get('/api/follows'),

  follow: (targetType: 'Keyword' | 'Journal', targetId: string, notifyEnabled = true) =>
    api.post('/api/follows', { targetType, targetId, notifyEnabled }),

  unfollow: (targetId: string) =>
    api.delete(`/api/follows/${targetId}`),
};

// ─────────────────────────────────────────────────────────
// JOURNALS
// GET /api/journals?page=&limit=
// GET /api/journals/:id
// ─────────────────────────────────────────────────────────
export const journalsApi = {
  list: (page = 1, limit = 10) =>
    api.get(`/api/journals?page=${page}&limit=${limit}`),

  getById: (id: string) =>
    api.get(`/api/journals/${id}`),
};

// ─────────────────────────────────────────────────────────
// PUBLICATION TRENDS
// GET /api/publication-trends/trending/list
// GET /api/publication-trends/keyword/:keywordId
// ─────────────────────────────────────────────────────────
export const trendsApi = {
  trendingList: () =>
    api.get('/api/publication-trends/trending/list'),

  byKeyword: (keywordId: string) =>
    api.get(`/api/publication-trends/keyword/${keywordId}`),
};
