import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import emailService from './email.service.js';
import axios from 'axios';

class CandidateService {
  constructor() {
    this.prisma = new PrismaClient();
    this.lastGenerationAttempt = new Map(); // Simple in-memory rate limiter: userId -> timestamp
  }

  async getProfile(userId) {
    const profile = await this.prisma.candidateprofile.findUnique({
      where: { userId },
      include: {
        experience: true,
        education: true,
        candidateskill: { include: { skill: true } },
        project: true,
        certification: true,
        roadmap: { include: { roadmapstep: true } },
        application: { include: { job: { include: { companyprofile: true } } } }
      }
    });

    if (!profile) return null;

    // Map to plural for frontend compatibility
    return {
      ...profile,
      experiences: profile.experience,
      skills: profile.candidateskill,
      projects: profile.project,
      certifications: profile.certification,
      roadmaps: profile.roadmap?.map(r => ({
        ...r,
        steps: r.roadmapstep
      })),
      applications: profile.application
    };
  }

  async updateProfile(userId, data) {
    const { 
      firstName, lastName, title, bio, location, phone, 
      website, githubUrl, linkedinUrl,
      notifMatches, notifAiCoach, notifUpdates 
    } = data;

    return await this.prisma.candidateprofile.update({
      where: { userId },
      data: {
        firstName, lastName, title, bio, location, phone,
        website, githubUrl, linkedinUrl,
        notifMatches, notifAiCoach, notifUpdates
      }
    });
  }

  async updateAvatar(userId, avatarUrl) {
    return await this.prisma.candidateprofile.update({
      where: { userId },
      data: { avatarUrl }
    });
  }

  // Experiences
  async addExperience(userId, data) {
    const profile = await this.prisma.candidateprofile.findUnique({ where: { userId } });
    if (!profile) throw new Error('Profil candidat introuvable');
    return await this.prisma.experience.create({
      data: { ...data, candidateId: profile.id }
    });
  }

  async deleteExperience(id) {
    return await this.prisma.experience.delete({ where: { id } });
  }

  // Projects
  async getProjects(userId) {
    const profile = await this.prisma.candidateprofile.findUnique({ where: { userId } });
    if (!profile) return [];
    return await this.prisma.project.findMany({ where: { candidateId: profile.id } });
  }

  async addProject(userId, data) {
    const profile = await this.prisma.candidateprofile.findUnique({ where: { userId } });
    if (!profile) throw new Error('Profil candidat introuvable');
    return await this.prisma.project.create({
      data: { ...data, candidateId: profile.id }
    });
  }

  async updateProject(id, data) {
    return await this.prisma.project.update({ where: { id }, data });
  }

  async deleteProject(id) {
    return await this.prisma.project.delete({ where: { id } });
  }

  // Roadmaps
  async getRoadmaps(userId) {
    const profile = await this.prisma.candidateprofile.findUnique({ where: { userId } });
    if (!profile) return [];

    const roadmaps = await this.prisma.roadmap.findMany({
      where: { candidateId: profile.id },
      include: { roadmapstep: true },
      orderBy: { createdAt: 'desc' }
    });

    return roadmaps.map(r => ({
      ...r,
      steps: r.roadmapstep
    }));
  }

  async generateRoadmap(userId) {
    console.log(`Génération d'une roadmap pour l'utilisateur ${userId}...`);
    const profile = await this.getProfile(userId);
    const projects = await this.getProjects(userId);

    console.log('Appel du service AI Coach...');
    try {
      const response = await axios.post('http://127.0.0.1:2021/api/ai/generate-roadmap', {
        profile, 
        projects
      });

      const aiRoadmap = response.data;
      console.log('Roadmap générée par l\'IA avec succès.');

      // Save to database
      const result = await this.prisma.roadmap.create({
        data: {
          candidateId: profile.id,
          title: aiRoadmap.title,
          description: aiRoadmap.description,
          roadmapstep: {
            create: (aiRoadmap.steps || []).map(step => ({
              title: step.title,
              description: step.description,
              order: step.order,
              isCompleted: step.isCompleted || false,
              status: step.status || null
            }))
          }
        },
        include: { roadmapstep: true }
      });
      console.log('Roadmap enregistrée en base de données.');
      return {
        ...result,
        steps: result.roadmapstep
      };
    } catch (error) {
      console.error('DÉTAILS ERREUR GENERATE ROADMAP SERVICE:', error);
      throw error;
    }
  }

  async updateRoadmapStep(stepId, isCompleted) {
    // Check if ID is likely an int (regex digits only)
    const id = /^\d+$/.test(stepId) ? parseInt(stepId) : stepId;
    return await this.prisma.roadmapstep.update({
      where: { id },
      data: { isCompleted }
    });
  }

  async getAiGeneratedChallenges(userId) {
    const profile = await this.getProfile(userId);
    if (!profile) {
      console.warn(`[CandidateService] Aucun profil trouvé pour l'utilisateur ${userId}`);
      return [];
    }
    
    // Get all AI tests (available globally)
    let aiTests = await this.prisma.technicaltest.findMany({
      where: { isAiGenerated: true },
      include: {
        candidatetestresult: {
          where: { candidateId: profile.id }
        }
      },
      orderBy: { id: 'desc' }
    });

    // If we have very few tests, generate a fresh batch of 3
    if (aiTests.length < 2) {
      const lastAttempt = this.lastGenerationAttempt.get(userId) || 0;
      const now = Date.now();
      
      // Rate limit: Max 1 attempt per 60 seconds per user
      if (now - lastAttempt < 60000) {
        console.log(`[CandidateService] Rate limit hit for ${userId}. Skipping AI generation.`);
        return aiTests;
      }

      this.lastGenerationAttempt.set(userId, now);
      console.log(`[CandidateService] Génération d'une nouvelle vague de défis techniques IA pour ${userId}...`);
      try {
        const response = await axios.post('http://127.0.0.1:2021/api/ai/generate-challenge', {
          profile
        });

        const challenges = response.data;

        // Create the tests in parallel
        const createdTests = await Promise.all(challenges.map(data => 
          this.prisma.technicaltest.create({
            data: {
              title: data.title,
              description: data.description,
              category: data.category,
              difficulty: data.difficulty,
              requirements: data.requirements,
              points: data.points,
              duration: data.duration,
              isAiGenerated: true
            }
          })
        ));
        
        // Refresh the list to include results mapping
        aiTests = await this.prisma.technicaltest.findMany({
          where: { isAiGenerated: true },
          include: {
            candidatetestresult: {
              where: { candidateId: profile.id }
            }
          },
          orderBy: { id: 'desc' }
        });
      } catch (error) {
        console.error('[CandidateService] Erreur lors de la génération des défis IA:', error);
        // If we have some tests, just return them instead of failing completely
        if (aiTests.length > 0) return aiTests;
        throw error;
      }
    }

    return aiTests;
  }

  async submitAiChallenge(userId, testId, code) {
    const profile = await this.getProfile(userId);
    const test = await this.prisma.technicaltest.findUnique({ where: { id: testId } });

    console.log('Évaluation du défi IA...');
    try {
      const profileId = profile?.id;
      if (!profileId) throw new Error('Profil candidat introuvable');

      const response = await axios.post('http://127.0.0.1:2021/api/ai/evaluate-submission', {
        code, 
        challenge: test
      });

      const evaluation = response.data;

      // Persist result
      return await this.prisma.candidatetestresult.create({
        data: {
          candidateId: profile.id,
          testId: test.id,
          score: evaluation.score,
          status: evaluation.status,
          feedback: evaluation.feedback,
          aiAnalysis: evaluation.aiAnalysis,
          logicScore: evaluation.logicScore,
          qualityScore: evaluation.qualityScore,
          structureScore: evaluation.structureScore,
          performanceScore: evaluation.performanceScore,
          isOriginal: evaluation.isOriginal
        }
      });
    } catch (error) {
      console.error('[CandidateService] Erreur lors de l\'évaluation IA:', error);
      throw error;
    }
  }

  // Tests
  async getAvailableTests() {
    return await this.prisma.technicaltest.findMany();
  }

  async getTestById(id) {
    console.log('Searching for test ID:', id);
    // First try technical tests
    let resource = await this.prisma.technicaltest.findUnique({ where: { id } });
    
    // If not found, try projects as a fallback (some UI links use project IDs)
    if (!resource) {
      console.log('Test not found, trying project fallback for ID:', id);
      const project = await this.prisma.project.findUnique({ where: { id } });
      if (project) {
        // Map project fields to match technicaltest structure for the frontend
        resource = {
          ...project,
          duration: project.duration || 60, // Fallback duration
          points: project.points || 100,
          category: project.category || project.technology || 'Project'
        };
      }
    }

    if (!resource) {
      const allTests = await this.prisma.technicaltest.findMany({ select: { id: true } });
      const allProjects = await this.prisma.project.findMany({ select: { id: true } });
      console.log('Resource not found. Available Test IDs:', allTests.map(t => t.id));
      console.log('Available Project IDs:', allProjects.map(p => p.id));
    }
    return resource;
  }

  async submitTestResult(userId, testId, code) {
    const profile = await this.prisma.candidateprofile.findUnique({ 
      where: { userId },
      include: { user: true } // Need user email/name for email
    });
    
    if (!profile) throw new Error('Profil candidat introuvable');

    let test = await this.prisma.technicaltest.findUnique({ where: { id: testId } });
    let isProject = false;

    if (!test) {
      const project = await this.prisma.project.findUnique({ where: { id: testId } });
      if (project) {
        test = {
          ...project,
          category: project.category || project.technology || 'Project'
        };
        isProject = true;
      }
    }

    if (!test) throw new Error('Test ou Projet introuvable');

    console.log(`[CandidateService] Évaluation IA pour le test ${testId} utilisateur ${userId}...`);
    
    // AI Evaluation
    let score = 0;
    let feedback = "Évaluation IA en cours...";
    let evaluation = null;
    
    try {
      const response = await axios.post('http://127.0.0.1:2021/api/ai/evaluate-submission', {
        code, 
        challenge: test
      });
      
      evaluation = response.data;
      score = evaluation.score;
      feedback = evaluation.feedback;
      
    } catch (error) {
      console.error('[CandidateService] Erreur appel IA (continuing with fallback):', error.message);
      // Fallback: don't fail the submission, just mark it for manual review or giving 0 score
      score = 0;
      feedback = "L'analyse IA n'a pas pu être générée pour le moment. Votre code a été bien reçu et sera évalué ultérieurement.";
      evaluation = null; // Ensure evaluation is null so we don't try to access props
    }

    const status = score >= 70 ? 'PASSED' : 'FAILED';
    
    // If it's a project, update project status
    if (isProject) {
      await this.prisma.project.update({
        where: { id: testId },
        data: { status: 'COMPLETED' }
      });
      
      // Return a simulated result since we can't easily link Project to CandidateTestResult without TestID
      return {
        id: 'project-submission-' + Date.now(),
        candidateId: profile.id,
        testId,
        score,
        status,
        feedback,
        aiAnalysis: evaluation ? evaluation.aiAnalysis : null,
        logicScore: evaluation ? evaluation.logicScore : null,
        qualityScore: evaluation ? evaluation.qualityScore : null,
        structureScore: evaluation ? evaluation.structureScore : null,
        performanceScore: evaluation ? evaluation.performanceScore : null,
        isOriginal: evaluation ? evaluation.isOriginal : true
      };
    }

    const result = await this.prisma.candidatetestresult.create({
      data: {
        candidateId: profile.id,
        testId,
        score,
        status,
        feedback: feedback,
        aiAnalysis: evaluation ? evaluation.aiAnalysis : null,
        logicScore: evaluation ? evaluation.logicScore : null,
        qualityScore: evaluation ? evaluation.qualityScore : null,
        structureScore: evaluation ? evaluation.structureScore : null,
        performanceScore: evaluation ? evaluation.performanceScore : null,
        isOriginal: evaluation ? evaluation.isOriginal : true
      }
    });

    // Send email notification
    await emailService.sendTestSubmissionEmail(
      { ...profile.user, firstName: profile.firstName, lastName: profile.lastName },
      test,
      score
    );

    return result;
  }

  async optimizePortfolio(userId, targetOffer) {
    const profile = await this.getProfile(userId);
    if (!profile) throw new Error('Profil candidat introuvable');
    const projects = await this.getProjects(userId);

    const response = await axios.post('http://127.0.0.1:2021/api/ai/optimize-portfolio', {
      profile, 
      projects, 
      targetOffer 
    });

    return response.data;
  }

  async internationalizeProfile(userId, region, targetLanguage) {
    const profile = await this.getProfile(userId);
    if (!profile) throw new Error('Profil candidat introuvable');
    const response = await axios.post('http://127.0.0.1:2021/api/ai/internationalize-profile', {
      profile, 
      region, 
      targetLanguage 
    });

    return response.data;
  }

  // Jobs
  async getRecommendedJobs(userId) {
    const profile = await this.getProfile(userId);
    const jobs = await this.prisma.job.findMany({
      where: { status: 'OPEN' },
      include: { companyprofile: true }
    });

    console.log('Appel de l\'IA pour matching intelligent...');
    try {
      const response = await axios.post('http://127.0.0.1:2021/api/ai/match-jobs', {
        profile, 
        jobs
      });

      const { matchings } = response.data;

      // Merge AI data into jobs
      return jobs.map(job => {
        const match = matchings.find(m => m.jobId === job.id);
        return {
          ...job,
          aiMatching: match || { score: 0, justification: "Analyse non disponible" }
        };
      }).sort((a, b) => b.aiMatching.score - a.aiMatching.score);
    } catch (error) {
      console.error('ERREUR AI MATCHING SERVICE:', error);
      return jobs.map(job => ({ ...job, aiMatching: { score: 0, justification: "Erreur d'analyse IA" } }));
    }
  }

  async applyToJob(userId, jobId) {
    console.log(`[CandidateService] Application attempt: user=${userId}, job=${jobId}`);
    const profile = await this.prisma.candidateprofile.findUnique({ where: { userId } });
    
    if (!profile) {
      console.error(`[CandidateService] Profile not found for userId: ${userId}`);
      throw new Error('Profil candidat introuvable');
    }
    
    console.log(`[CandidateService] Found profile: ${profile.id}`);
    
    // Check if already applied
    const existing = await this.prisma.application.findFirst({
      where: { jobId, candidateId: profile.id }
    });
    if (existing) {
      console.warn(`[CandidateService] Already applied: candidate=${profile.id}, job=${jobId}`);
      throw new Error('Vous avez déjà postulé à cette offre');
    }

    return await this.prisma.application.create({
      data: {
        jobId,
        candidateId: profile.id,
        status: 'PENDING',
        updatedAt: new Date()
      }
    });
  }
}

export default new CandidateService();
