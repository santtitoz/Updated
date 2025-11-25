// API configuration for Django backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`)
  }

  return response.json()
}

// Example API functions to consume Django endpoints
export const api = {
  // Courses
  getCourses: () => fetchAPI("/courses/"),
  getCourse: (id: string) => fetchAPI(`/courses/${id}/`),

  // User stats
  getUserStats: (userId: string) => fetchAPI(`/users/${userId}/stats/`),

  // Rankings
  getRankings: () => fetchAPI("/rankings/"),

  // Projects
  getProjects: () => fetchAPI("/projects/"),

  // Badges
  getBadges: (userId: string) => fetchAPI(`/users/${userId}/badges/`),
}
