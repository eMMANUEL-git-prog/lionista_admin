const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

class ApiClient {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_token', token);
    }
  }

  getToken(): string | null {
    if (this.token) return this.token;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('admin_token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    if (response.status === 401) {
      this.clearToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'An error occurred' }));
      throw new Error(error.error || 'An error occurred');
    }

    return response.json();
  }

  // Auth
  async login(email: string, password: string) {
    const data = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.token);
    return data;
  }

  async getMe() {
    return this.request('/api/auth/me');
  }

  logout() {
    this.clearToken();
  }

  // Dashboard
  async getDashboard() {
    return this.request('/api/stats/dashboard');
  }

  // Donations
  async getDonations(params?: { status?: string; page?: number; limit?: number }) {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set('status', params.status);
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    return this.request(`/api/donations?${searchParams}`);
  }

  async getDonationStats() {
    return this.request('/api/donations/stats');
  }

  async updateDonationStatus(id: string, status: string) {
    return this.request(`/api/donations/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ payment_status: status }),
    });
  }

  // Volunteers
  async getVolunteers(params?: { status?: string; page?: number; limit?: number }) {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set('status', params.status);
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    return this.request(`/api/volunteers?${searchParams}`);
  }

  async updateVolunteerStatus(id: string, status: string) {
    return this.request(`/api/volunteers/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async deleteVolunteer(id: string) {
    return this.request(`/api/volunteers/${id}`, { method: 'DELETE' });
  }

  // Programs
  async getPrograms() {
    return this.request('/api/programs');
  }

  async createProgram(data: Record<string, unknown>) {
    return this.request('/api/programs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProgram(id: string, data: Record<string, unknown>) {
    return this.request(`/api/programs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProgram(id: string) {
    return this.request(`/api/programs/${id}`, { method: 'DELETE' });
  }

  // Blog
  async getBlogPosts(params?: { status?: string; page?: number }) {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set('status', params.status);
    if (params?.page) searchParams.set('page', params.page.toString());
    return this.request(`/api/blog/admin/all?${searchParams}`);
  }

  async createBlogPost(data: Record<string, unknown>) {
    return this.request('/api/blog', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBlogPost(id: string, data: Record<string, unknown>) {
    return this.request(`/api/blog/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteBlogPost(id: string) {
    return this.request(`/api/blog/${id}`, { method: 'DELETE' });
  }

  // Contact Inquiries
  async getInquiries(params?: { status?: string; page?: number }) {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set('status', params.status);
    if (params?.page) searchParams.set('page', params.page.toString());
    return this.request(`/api/contact?${searchParams}`);
  }

  async updateInquiryStatus(id: string, status: string) {
    return this.request(`/api/contact/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async deleteInquiry(id: string) {
    return this.request(`/api/contact/${id}`, { method: 'DELETE' });
  }

  // Stats
  async getStats() {
    return this.request('/api/stats');
  }

  async updateStat(id: string, data: Record<string, unknown>) {
    return this.request(`/api/stats/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiClient();
