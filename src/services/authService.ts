
const API_BASE_URL = 'https://frontend-take-home-service.fetch.com';

export const authService = {
  async login(name: string, email: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email }),
      credentials: 'include', // Important for cookie handling
    });

    if (!response.ok) {
      throw new Error(`Login failed: ${response.status}`);
    }
  },

  async logout(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Logout failed: ${response.status}`);
    }
  },
};
