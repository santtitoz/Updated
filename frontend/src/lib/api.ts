import axiosInstance from './axiosInstance';
import type { UserProfile } from '@/types/user';

// Wrapper to simplify requests and extract data
const get = async (url: string) => {
  const response = await axiosInstance.get(url);
  return response.data;
};

const post = async (url: string, data: unknown) => {
  const response = await axiosInstance.post(url, data);
  return response.data;
};

const put = async (url: string, data: unknown = {}) => {
  const response = await axiosInstance.put(url, data);
  return response.data;
};

const patch = async (url: string, data: unknown) => {
  const response = await axiosInstance.patch(url, data);
  return response.data;
};

const del = async (url: string) => {
  const response = await axiosInstance.delete(url);
  return response.data;
};

export const api = {
  // Courses
  // Courses (Trilhas)
  getTrilhas: () => get('/trilhas/'),
  getTrilha: (id: string | number) => get(`/trilhas/${id}/`),
  completeActivity: (activityId: number) => post(`/trilhas/atividades/${activityId}/complete/`, {}),

  // User stats
  getUserStats: (userId: string) => get(`/users/${userId}/stats/`),

  // Rankings
  getRankings: () => get('/rankings/'),

  // Projects
  getProjects: () => get('/projects/'),

  // Badges
  getBadges: (userId: string) => get(`/users/${userId}/badges/`),
  getMyBadges: () => get('/users/badges/'),

  // Profile
  getProfile: () => get('/users/profile/me/'),
  getMyProfile: () => get('/users/profile/me/'),
  updateProfile: (data: Partial<UserProfile>) => patch('/users/profile/me/', data),

  // Friends
  getFriends: () => get('/friends/'),
  removeFriend: (userId: number) => del(`/friends/${userId}/`),

  getFriendRequests: () => get('/friends/request/'),
  sendFriendRequest: (toUserId: number) => post('/friends/request/', { to_user: toUserId }),

  acceptFriendRequest: (requestId: number) => put(`/friends/request/${requestId}/accept/`),
  rejectFriendRequest: (requestId: number) => del(`/friends/request/${requestId}/`),

  // Users Search
  // Backend route was renamed to 'users' so this is now correct
  searchUsers: (query: string) => get(`/users/users/?search=${query}`),
};

// Export fetchAPI for backward compatibility if needed, but mapped to axios
export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const method = (options.method || 'GET').toLowerCase();
  const data = options.body ? JSON.parse(options.body as string) : undefined;

  // Remove /v1 prefix if present since axiosInstance has it in baseURL
  const url = endpoint.replace(/^\/v1/, '');

  const response = await axiosInstance({
    url,
    method,
    data,
  });
  return response.data;
}
