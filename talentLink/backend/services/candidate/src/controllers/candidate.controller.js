import candidateService from '../services/candidate.service.js';

class CandidateController {
  async getProfile(req, res) {
    try {
      const profile = await candidateService.getProfile(req.user.id);
      res.json(profile);
    } catch (error) {
      console.error('ERROR GET PROFILE:', error);
      res.status(500).json({ message: error.message });
    }
  }

  async updateProfile(req, res) {
    try {
      const profile = await candidateService.updateProfile(req.user.id, req.body);
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async uploadAvatar(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Aucun fichier téléchargé' });
      }
      
      const avatarUrl = `http://localhost:2022/uploads/avatars/${req.file.filename}`;
      const profile = await candidateService.updateAvatar(req.user.id, avatarUrl);
      
      res.json({ 
        message: 'Photo de profil mise à jour', 
        avatarUrl: profile.avatarUrl 
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async uploadProjectImage(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Aucun fichier téléchargé' });
      }
      
      const imageUrl = `http://localhost:2022/uploads/projects/${req.file.filename}`;
      res.json({ imageUrl });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async addExperience(req, res) {
    try {
      const exp = await candidateService.addExperience(req.user.id, req.body);
      res.json(exp);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteExperience(req, res) {
    try {
      await candidateService.deleteExperience(req.params.id);
      res.json({ message: 'Expérience supprimée' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getProjects(req, res) {
    try {
      const projects = await candidateService.getProjects(req.user.id);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async addProject(req, res) {
    try {
      const project = await candidateService.addProject(req.user.id, req.body);
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateProject(req, res) {
    try {
      const project = await candidateService.updateProject(req.params.id, req.body);
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteProject(req, res) {
    try {
      await candidateService.deleteProject(req.params.id);
      res.json({ message: 'Projet supprimé' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getRoadmaps(req, res) {
    try {
      const roadmaps = await candidateService.getRoadmaps(req.user.id);
      res.json(roadmaps);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async generateRoadmap(req, res) {
    try {
      const roadmap = await candidateService.generateRoadmap(req.user.id);
      res.json(roadmap);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateRoadmapStep(req, res) {
    try {
      const { isCompleted } = req.body;
      const step = await candidateService.updateRoadmapStep(req.params.id, isCompleted);
      res.json(step);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getAiTests(req, res) {
    try {
      const tests = await candidateService.getAiGeneratedChallenges(req.user.id);
      res.json(tests);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async submitAiChallenge(req, res) {
    try {
      const { testId, code } = req.body;
      const result = await candidateService.submitAiChallenge(req.user.id, testId, code);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async optimizePortfolio(req, res) {
    try {
      const { targetOffer } = req.body;
      const result = await candidateService.optimizePortfolio(req.user.id, targetOffer);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async internationalizeProfile(req, res) {
    try {
      const { region, targetLanguage } = req.body;
      const result = await candidateService.internationalizeProfile(req.user.id, region, targetLanguage);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getAvailableTests(req, res) {
    try {
      const tests = await candidateService.getAvailableTests();
      res.json(tests);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getTestById(req, res) {
    try {
      console.log('Requesting test with ID:', req.params.id);
      const test = await candidateService.getTestById(req.params.id);
      if (!test) {
        console.log('Test not found in DB for ID:', req.params.id);
        return res.status(404).json({ message: 'Test non trouvé' });
      }
      res.json(test);
    } catch (error) {
      console.error('Error in getTestById:', error);
      res.status(500).json({ message: error.message });
    }
  }

    async submitTestResult(req, res) {
    try {
      const { testId, code } = req.body;
      const result = await candidateService.submitTestResult(req.user.id, testId, code);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getRecommendedJobs(req, res) {
    try {
      const jobs = await candidateService.getRecommendedJobs(req.user.id);
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async applyToJob(req, res) {
    try {
      const { jobId } = req.body;
      const app = await candidateService.applyToJob(req.user.id, jobId);
      res.json(app);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new CandidateController();
