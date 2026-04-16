import { Template, UserProfile } from '../types';

export const api = {
  async getTemplates(params: { category?: string; search?: string; sort?: string; authorId?: string } = {}) {
    const query = new URLSearchParams(params as any).toString();
    const response = await fetch(`/api/templates?${query}`);
    return response.json() as Promise<Template[]>;
  },

  async getTemplate(id: string) {
    const response = await fetch(`/api/templates/${id}`);
    if (!response.ok) throw new Error('Template not found');
    return response.json() as Promise<Template>;
  },

  async publishTemplate(template: Partial<Template>) {
    const response = await fetch('/api/templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(template),
    });
    return response.json();
  },

  async registerUser(user: Partial<UserProfile>) {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    return response.json();
  },

  async getUserProfile(id: string) {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) throw new Error('User not found');
    return response.json() as Promise<UserProfile>;
  },

  async updateUserProfile(id: string, profile: Partial<UserProfile>) {
    const response = await fetch(`/api/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    if (!response.ok) throw new Error('Failed to update profile');
    return response.json() as Promise<UserProfile>;
  }
};
