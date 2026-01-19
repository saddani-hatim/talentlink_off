import express from "express";
import companyController from "../controllers/company.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// All company routes are protected
router.use(authMiddleware);

// Dashboard & Analytics
router.get("/stats", companyController.getDashboardStats);

// Jobs
router.get("/jobs", companyController.getJobs);
router.post("/jobs", companyController.createJob);

// Analytics
router.get("/analytics", companyController.getMarketAnalytics);

// Candidates
router.get("/candidates", companyController.getCandidates);
router.get(
  "/candidates/:applicationId/analysis",
  companyController.getCandidateAnalysis
);
router.post(
  "/candidates/:applicationId/schedule",
  companyController.scheduleInterview
);

// Fair Hiring
router.get("/fair-hiring", companyController.getFairHiringData);

// Reports
router.get("/reports", companyController.getReports);

// Settings & Profile
router.get("/profile", companyController.getProfile);
router.put("/settings", companyController.updateSettings);

router.get("/debug", companyController.getDebugInfo);

export default router;
