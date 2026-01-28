import api from '../lib/axios';

class AuthService {
  async signup(data: any) {
    const response = await api.post('/auth/signup', data);
    return response.data;
  }

  async login(data: any) {
    const response = await api.post('/auth/login', data);
    return response.data;
  }

  async logout() {
    const response = await api.post('/auth/logout');
    return response.data;
  }

  async getMe() {
    const response = await api.get('/auth/me');
    return response.data;
  }

  async forgotPassword(email: string) {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  }

  async resetPassword(data: any) {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  }

  async contact(data: any) {
    const response = await api.post('/auth/contact', data);
    return response.data;
  }
  async changePassword(data: any) {
    const response = await api.post('/auth/change-password', data);
    return response.data;
  }

  async deleteAccount() {
    const response = await api.delete('/auth/account');
    return response.data;
  }
}

export default new AuthService();
