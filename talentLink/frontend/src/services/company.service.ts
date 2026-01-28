import api from "../lib/axios";

export const companyService = {
  // Dashboard & Analytics
  getStats: async () => {
    const response = await api.get("/company/stats");
    return response.data;
  },

  getAnalytics: async () => {
    const response = await api.get("/company/analytics");
    return response.data;
  },

  // Jobs Management
  getJobs: async () => {
    const response = await api.get("/company/jobs");
    return response.data;
  },

  createJob: async (data: any) => {
    const response = await api.post("/company/jobs", data);
    return response.data;
  },

  // Candidates Management
  getCandidates: async () => {
    const response = await api.get("/company/candidates");
    return response.data;
  },

  getCandidateAnalysis: async (applicationId: string) => {
    const response = await api.get(`/company/candidates/${applicationId}/analysis`);
    return response.data;
  },
  
  scheduleInterview: async (applicationId: string) => {
    const response = await api.post(`/company/candidates/${applicationId}/schedule`);
    return response.data;
  },

  // Fair Hiring
  getFairHiringData: async () => {
    const response = await api.get("/company/fair-hiring");
    return response.data;
  },

  getReports: async () => {
    const response = await api.get("/company/reports");
    return response.data;
  },

  // Settings & Profile
  getProfile: async () => {
    const response = await api.get("/company/profile");
    return response.data;
  },

  updateSettings: async (data: any) => {
    const response = await api.put("/company/settings", data);
    return response.data;
  },
};

export default companyService;
