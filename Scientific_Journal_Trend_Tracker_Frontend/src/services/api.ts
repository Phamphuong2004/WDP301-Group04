/**
 * API Service Layer
 * Base URL: http://localhost:5000/api
 *
 * Tất cả các hàm gọi API backend đều ở đây.
 * Khi cần thay đổi base URL (ví dụ deploy production), chỉ cần sửa API_BASE_URL.
 */

export const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5000/api";

// ─── Helper: lấy token từ localStorage ───
const getToken = (): string | null => localStorage.getItem("token");

// ─── Helper: header mặc định ───
const authHeaders = (): Record<string, string> => ({
  "Content-Type": "application/json",
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

// ─── Helper: xử lý response chung ───
async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || "API error");
  }
  return res.json();
}

// ══════════════════════════════════════
//  AUTH
// ══════════════════════════════════════

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
}

export interface AuthResponse {
  token: string;
  user: {
    _id: string;
    email: string;
    fullName: string;
    role: string;
  };
}

/** POST /api/auth/login */
export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<AuthResponse>(res);
}

/** POST /api/auth/register */
export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<AuthResponse>(res);
}

/** GET /api/auth/me */
export async function getCurrentUser(): Promise<AuthResponse["user"]> {
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: authHeaders(),
  });
  return handleResponse<AuthResponse["user"]>(res);
}

// ══════════════════════════════════════
//  PAPERS
// ══════════════════════════════════════

export interface Paper {
  _id: string;
  title: string;
  abstract: string;
  authors: string[];
  publicationYear: number;
  doi: string;
  journal?: { _id: string; name: string };
  keywords?: { _id: string; name: string }[];
  citations?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

/** GET /api/papers?page=&limit= */
export async function getPapers(page = 1, limit = 10): Promise<{ papers: Paper[]; pagination: any }> {
  const res = await fetch(`${API_BASE_URL}/papers?page=${page}&limit=${limit}`);
  return handleResponse(res);
}

/** GET /api/papers/search/query?q=&year=&journalId= */
export async function searchPapers(
  q: string,
  year?: number,
  journalId?: string
): Promise<Paper[]> {
  const params = new URLSearchParams({ q });
  if (year) params.append("year", String(year));
  if (journalId) params.append("journalId", journalId);
  const res = await fetch(`${API_BASE_URL}/papers/search/query?${params}`);
  return handleResponse<Paper[]>(res);
}

/** GET /api/papers/:id */
export async function getPaperById(id: string): Promise<Paper> {
  const res = await fetch(`${API_BASE_URL}/papers/${id}`);
  return handleResponse<Paper>(res);
}

// ══════════════════════════════════════
//  KEYWORDS (Trending Topics)
// ══════════════════════════════════════

export interface Keyword {
  _id: string;
  name: string;
  trendScore?: number;
  paperCount?: number;
}

/** GET /api/keywords/trends/trending?limit= */
export async function getTrendingKeywords(limit = 20): Promise<Keyword[]> {
  const res = await fetch(`${API_BASE_URL}/keywords/trends/trending?limit=${limit}`);
  return handleResponse<Keyword[]>(res);
}

/** GET /api/keywords?page=&limit= */
export async function getKeywords(page = 1, limit = 20): Promise<{ keywords: Keyword[]; pagination: any }> {
  const res = await fetch(`${API_BASE_URL}/keywords?page=${page}&limit=${limit}`);
  return handleResponse(res);
}

// ══════════════════════════════════════
//  JOURNALS
// ══════════════════════════════════════

export interface Journal {
  _id: string;
  name: string;
  issn?: string;
  impactFactor?: number;
  field?: string;
  publisher?: string;
}

/** GET /api/journals?page=&limit= */
export async function getJournals(page = 1, limit = 10): Promise<{ journals: Journal[]; pagination: any }> {
  const res = await fetch(`${API_BASE_URL}/journals?page=${page}&limit=${limit}`);
  return handleResponse(res);
}

/** GET /api/journals/:id */
export async function getJournalById(id: string): Promise<Journal> {
  const res = await fetch(`${API_BASE_URL}/journals/${id}`);
  return handleResponse<Journal>(res);
}

// ══════════════════════════════════════
//  PUBLICATION TRENDS (Analytics)
// ══════════════════════════════════════

export interface PublicationTrend {
  _id: string;
  keyword?: Keyword;
  journal?: Journal;
  year: number;
  paperCount: number;
  growthRate: number;
}

/** GET /api/publication-trends/trending/list */
export async function getTrendingPublications(): Promise<PublicationTrend[]> {
  const res = await fetch(`${API_BASE_URL}/publication-trends/trending/list`);
  return handleResponse<PublicationTrend[]>(res);
}

/** GET /api/publication-trends?page=&limit= */
export async function getPublicationTrends(page = 1, limit = 10): Promise<{ trends: PublicationTrend[]; pagination: any }> {
  const res = await fetch(`${API_BASE_URL}/publication-trends?page=${page}&limit=${limit}`);
  return handleResponse(res);
}

/** GET /api/publication-trends/keyword/:keywordId */
export async function getTrendsByKeyword(keywordId: string): Promise<PublicationTrend[]> {
  const res = await fetch(`${API_BASE_URL}/publication-trends/keyword/${keywordId}`);
  return handleResponse<PublicationTrend[]>(res);
}

/** GET /api/publication-trends/journal/:journalId */
export async function getTrendsByJournal(journalId: string): Promise<PublicationTrend[]> {
  const res = await fetch(`${API_BASE_URL}/publication-trends/journal/${journalId}`);
  return handleResponse<PublicationTrend[]>(res);
}

// ══════════════════════════════════════
//  NOTIFICATIONS (Auth required)
// ══════════════════════════════════════

export interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

/** GET /api/notifications?page=&limit= */
export async function getNotifications(page = 1, limit = 20): Promise<{ notifications: Notification[]; pagination: any }> {
  const res = await fetch(`${API_BASE_URL}/notifications?page=${page}&limit=${limit}`, {
    headers: authHeaders(),
  });
  return handleResponse(res);
}

/** GET /api/notifications/unread/count */
export async function getUnreadNotificationCount(): Promise<{ count: number }> {
  const res = await fetch(`${API_BASE_URL}/notifications/unread/count`, {
    headers: authHeaders(),
  });
  return handleResponse<{ count: number }>(res);
}

/** PUT /api/notifications/:id/read */
export async function markNotificationRead(id: string): Promise<Notification> {
  const res = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
    method: "PUT",
    headers: authHeaders(),
  });
  return handleResponse<Notification>(res);
}

/** PUT /api/notifications/all/read */
export async function markAllNotificationsRead(): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE_URL}/notifications/all/read`, {
    method: "PUT",
    headers: authHeaders(),
  });
  return handleResponse(res);
}

/** DELETE /api/notifications/:id */
export async function deleteNotification(id: string): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE_URL}/notifications/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return handleResponse(res);
}

/** DELETE /api/notifications */
export async function clearAllNotifications(): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE_URL}/notifications`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return handleResponse(res);
}

// ══════════════════════════════════════
//  BOOKMARKS (Auth required)
// ══════════════════════════════════════

export interface Bookmark {
  _id: string;
  paper: Paper;
  createdAt: string;
}

/** GET /api/bookmarks?page=&limit= */
export async function getBookmarks(page = 1, limit = 20): Promise<{ bookmarks: Bookmark[]; pagination: any }> {
  const res = await fetch(`${API_BASE_URL}/bookmarks?page=${page}&limit=${limit}`, {
    headers: authHeaders(),
  });
  return handleResponse(res);
}

/** POST /api/bookmarks/:paperId */
export async function addBookmark(paperId: string): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE_URL}/bookmarks/${paperId}`, {
    method: "POST",
    headers: authHeaders(),
  });
  return handleResponse(res);
}

/** DELETE /api/bookmarks/:paperId */
export async function removeBookmark(paperId: string): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE_URL}/bookmarks/${paperId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return handleResponse(res);
}

/** GET /api/bookmarks/:paperId/check */
export async function checkBookmark(paperId: string): Promise<{ isBookmarked: boolean }> {
  const res = await fetch(`${API_BASE_URL}/bookmarks/${paperId}/check`, {
    headers: authHeaders(),
  });
  return handleResponse(res);
}

// ══════════════════════════════════════
//  FOLLOWS (Auth required)
// ══════════════════════════════════════

export interface Follow {
  _id: string;
  targetType: "Keyword" | "Journal";
  targetId: string;
  notifyEnabled: boolean;
  target?: Keyword | Journal;
}

/** GET /api/follows */
export async function getFollows(): Promise<Follow[]> {
  const res = await fetch(`${API_BASE_URL}/follows`, {
    headers: authHeaders(),
  });
  return handleResponse<Follow[]>(res);
}

/** POST /api/follows */
export async function addFollow(
  targetType: "Keyword" | "Journal",
  targetId: string,
  notifyEnabled = true
): Promise<Follow> {
  const res = await fetch(`${API_BASE_URL}/follows`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ targetType, targetId, notifyEnabled }),
  });
  return handleResponse<Follow>(res);
}

/** DELETE /api/follows/:targetId */
export async function removeFollow(targetId: string): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE_URL}/follows/${targetId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return handleResponse(res);
}

// ══════════════════════════════════════
//  USERS (Auth required)
// ══════════════════════════════════════

export interface User {
  _id: string;
  email: string;
  fullName: string;
  role: string;
  status?: string;
  createdAt?: string;
}

export interface AdminStats {
  users: {
    total: number;
    researchers: number;
    lecturersStudents: number;
    admins: number;
  };
  papers: number;
  journals: number;
  topics: number;
  keywords: number;
  analysisRuns: number;
}

/** GET /api/users/admin/stats (Admin only) */
export async function getAdminStats(): Promise<AdminStats> {
  const res = await fetch(`${API_BASE_URL}/users/admin/stats`, {
    headers: authHeaders(),
  });
  return handleResponse<AdminStats>(res);
}

/** GET /api/users  (Admin only) */
export async function getUsers(page = 1, limit = 10): Promise<{ users: User[]; pagination: any }> {
  const res = await fetch(`${API_BASE_URL}/users?page=${page}&limit=${limit}`, {
    headers: authHeaders(),
  });
  return handleResponse(res);
}

/** PUT /api/users/:id */
export async function updateUser(id: string, data: Partial<User>): Promise<User> {
  const res = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<User>(res);
}

/** DELETE /api/users/:id (Admin only) */
export async function deleteUser(id: string): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return handleResponse(res);
}

/** POST /api/users/:id/change-password */
export async function changePassword(
  id: string,
  currentPassword: string,
  newPassword: string
): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE_URL}/users/${id}/change-password`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  return handleResponse(res);
}

// ══════════════════════════════════════
//  TOPICS
// ══════════════════════════════════════

export interface Topic {
  _id: string;
  name: string;
  description?: string;
  momentum?: number;
}

/** GET /api/topics/emerging/list */
export async function getEmergingTopics(): Promise<Topic[]> {
  const res = await fetch(`${API_BASE_URL}/topics/emerging/list`);
  return handleResponse<Topic[]>(res);
}

/** GET /api/topics?page=&limit= */
export async function getTopics(page = 1, limit = 10): Promise<{ topics: Topic[]; pagination: any }> {
  const res = await fetch(`${API_BASE_URL}/topics?page=${page}&limit=${limit}`);
  return handleResponse(res);
}
