// API Client for Pichanga Dashboard

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

interface RequestOptions extends RequestInit {
  token?: string
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { token, ...fetchOptions } = options

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...fetchOptions,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'An error occurred',
      }))
      throw new Error(error.message || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  async post<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async put<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async patch<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }
}

export const api = new ApiClient(API_URL)

// Example API functions (to be expanded)
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  register: (data: { fullName: string; email: string; phone: string; password: string }) =>
    api.post('/auth/register', data),

  logout: () => api.post('/auth/logout'),

  getProfile: (token: string) => api.get('/auth/profile', { token }),

  updateProfile: (data: unknown, token: string) =>
    api.patch('/auth/profile', data, { token }),
}

export const venuesApi = {
  getAll: (token: string) => api.get('/venues', { token }),

  getById: (id: string, token: string) => api.get(`/venues/${id}`, { token }),

  create: (data: unknown, token: string) =>
    api.post('/venues', data, { token }),

  update: (id: string, data: unknown, token: string) =>
    api.patch(`/venues/${id}`, data, { token }),

  delete: (id: string, token: string) => api.delete(`/venues/${id}`, { token }),
}

export const reservationsApi = {
  getAll: (token: string, params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : ''
    return api.get(`/reservations${query}`, { token })
  },

  getById: (id: string, token: string) =>
    api.get(`/reservations/${id}`, { token }),

  createManual: (data: unknown, token: string) =>
    api.post('/reservations/manual', data, { token }),

  update: (id: string, data: unknown, token: string) =>
    api.patch(`/reservations/${id}`, data, { token }),

  cancel: (id: string, token: string) =>
    api.post(`/reservations/${id}/cancel`, {}, { token }),
}