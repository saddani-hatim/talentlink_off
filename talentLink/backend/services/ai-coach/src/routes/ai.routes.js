import express from 'express';
import { 
  chatWithCoach, 
  generateRoadmap, 
  generateTechnicalChallenge, 
  evaluateTechnicalSubmission,
  optimizePortfolio,
  matchJobs,
  internationalizeProfile 
} from '../controllers/ai.controller.js';

const router = express.Router();

router.post('/chat', chatWithCoach);
router.post('/generate-roadmap', generateRoadmap);
router.post('/generate-challenge', generateTechnicalChallenge);
router.post('/evaluate-submission', evaluateTechnicalSubmission);
router.post('/optimize-portfolio', optimizePortfolio);
router.post('/match-jobs', matchJobs);
router.post('/internationalize-profile', internationalizeProfile);

export default router;
