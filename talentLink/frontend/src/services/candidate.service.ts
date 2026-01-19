import axios from 'axios';

const apiCandidate = axios.create({
  baseURL: 'http://localhost:2022/api/candidate/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for handling 401 errors and token refresh
apiCandidate.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token via the auth service
        await axios.post('http://localhost:2020/api/auth/refresh', {}, { withCredentials: true });
        
        // If refresh successful, retry original request
        return apiCandidate(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

class CandidateService {
  async getProfile() {
    const response = await apiCandidate.get('me');
    return response.data;
  }

  async updateProfile(data: any) {
    const response = await apiCandidate.put('me', data);
    return response.data;
  }

  async addExperience(data: any) {
    const response = await apiCandidate.post('experiences', data);
    return response.data;
  }

  async deleteExperience(id: string) {
    const response = await apiCandidate.delete(`experiences/${id}`);
    return response.data;
  }

  async getProjects() {
    const response = await apiCandidate.get('projects');
    return response.data;
  }

  async addProject(data: any) {
    const response = await apiCandidate.post('projects', data);
    return response.data;
  }

  async updateProject(id: string, data: any) {
    const response = await apiCandidate.put(`projects/${id}`, data);
    return response.data;
  }

  async deleteProject(id: string) {
    const response = await apiCandidate.delete(`projects/${id}`);
    return response.data;
  }

  async getRoadmaps() {
    const response = await apiCandidate.get('roadmaps');
    return response.data;
  }

  async generateRoadmap() {
    const response = await apiCandidate.post('roadmaps/generate');
    return response.data;
  }

  async updateRoadmapStep(stepId: string, isCompleted: boolean) {
    const response = await apiCandidate.put(`roadmaps/steps/${stepId}`, { isCompleted });
    return response.data;
  }

  async getAiTests() {
    const response = await apiCandidate.get('ai-tests');
    return response.data;
  }

  async submitAiChallenge(testId: string, code: string) {
    const response = await apiCandidate.post('ai-submit', { testId, code });
    return response.data;
  }

  async optimizePortfolio(targetOffer?: string) {
    const response = await apiCandidate.post('portfolio/optimize', { targetOffer });
    return response.data;
  }

  async internationalizeProfile(region: string, targetLanguage: string) {
    const response = await apiCandidate.post('profile/internationalize', { region, targetLanguage });
    return response.data;
  }

  async getTests() {
    const response = await apiCandidate.get('tests');
    return response.data;
  }

  async getTest(id: string) {
    const response = await apiCandidate.get(`tests/${id}`);
    return response.data;
  }

  async submitTestResult(testId: string, code: string) {
    const response = await apiCandidate.post('tests/submit', { testId, code });
    return response.data;
  }

  async getRecommendedJobs() {
    const response = await apiCandidate.get('jobs/recommended');
    return response.data;
  }

  async applyToJob(jobId: string) {
    const response = await apiCandidate.post('jobs/apply', { jobId });
    return response.data;
  }

  async uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await apiCandidate.post('upload-avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async uploadProjectImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);
    const response = await apiCandidate.post('upload-project-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}

export default new CandidateService();
