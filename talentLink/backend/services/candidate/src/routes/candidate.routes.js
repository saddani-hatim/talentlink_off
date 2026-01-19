import express from 'express';
import candidateController from '../controllers/candidate.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import upload from '../config/multer.config.js';

const router = express.Router();

// All routes are protected and only for candidates
router.use(protect);
router.use(authorize('CANDIDATE'));

router.get('/me', candidateController.getProfile);
router.put('/me', candidateController.updateProfile);
router.post('/upload-avatar', upload.single('avatar'), candidateController.uploadAvatar);
router.post('/upload-project-image', upload.single('image'), candidateController.uploadProjectImage);

router.post('/experiences', candidateController.addExperience);
router.delete('/experiences/:id', candidateController.deleteExperience);

router.get('/projects', candidateController.getProjects);
router.post('/projects', candidateController.addProject);
router.put('/projects/:id', candidateController.updateProject);
router.delete('/projects/:id', candidateController.deleteProject);

router.get('/roadmaps', candidateController.getRoadmaps);
router.post('/roadmaps/generate', candidateController.generateRoadmap);
router.put('/roadmaps/steps/:id', candidateController.updateRoadmapStep);
router.post('/portfolio/optimize', candidateController.optimizePortfolio);
router.post('/profile/internationalize', candidateController.internationalizeProfile);

router.get('/ai-tests', candidateController.getAiTests);
router.post('/ai-submit', candidateController.submitAiChallenge);

router.get('/tests', candidateController.getAvailableTests);
router.get('/tests/:id', candidateController.getTestById);
router.post('/tests/submit', candidateController.submitTestResult);

router.get('/jobs/recommended', candidateController.getRecommendedJobs);
router.post('/jobs/apply', candidateController.applyToJob);

export default router;
