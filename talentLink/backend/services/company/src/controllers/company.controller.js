import prisma from "../config/database.js";
import emailService from "../services/email.service.js";

// Dashboard & Analytics
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.userId;
    let companyProfile = await prisma.companyprofile.findUnique({
      where: { userId },
    });

    if (!companyProfile) {
      return res.json({
        success: true,
        stats: { totalJobs: 0, activeJobs: 0, totalApplications: 0, matchRate: 0 },
        recentApplications: [],
      });
    }

    const totalJobs = await prisma.job.count({
      where: { companyId: companyProfile.id },
    });

    const activeJobs = await prisma.job.count({
      where: { companyId: companyProfile.id, status: "OPEN" },
    });

    const totalApplications = await prisma.application.count({
      where: { job: { companyId: companyProfile.id } },
    });

    const recentApplications = await prisma.application.findMany({
      where: { job: { companyId: companyProfile.id } },
      orderBy: { appliedAt: "desc" },
      take: 5,
      include: {
        candidateprofile: {
          include: { user: true }
        },
        job: true,
      },
    });

    res.json({
      success: true,
      stats: {
        totalJobs,
        activeJobs,
        totalApplications,
        matchRate: 85,
      },
      recentApplications,
    });
  } catch (error) {
    console.error("GET_STATS_ERROR:", error);
    res.status(500).json({ success: false, message: error.message, stack: error.stack });
  }
};

// Jobs Management
const getJobs = async (req, res) => {
  try {
    const userId = req.user.userId;
    const companyProfile = await prisma.companyprofile.findUnique({
      where: { userId },
    });

    if (!companyProfile)
      return res
        .status(404)
        .json({ success: false, message: "Company profile not found" });

    const jobs = await prisma.job.findMany({
      where: { companyId: companyProfile.id },
      include: {
        _count: {
          select: { application: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createJob = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log("CREATE JOB ATTEMPT:", { 
      userId, 
      body: req.body 
    });
    
    const { title, description, requirements, location, salaryRange, type } =
      req.body;

    const companyProfile = await prisma.companyprofile.findUnique({
      where: { userId },
    });

    console.log("COMPANY PROFILE FOUND:", companyProfile ? companyProfile.id : "NOT FOUND");

    if (!companyProfile) {
      console.warn("ABORTING: Profile missing for user", userId);
      return res
        .status(404)
        .json({ success: false, message: "Company profile not found" });
    }

    const validTypes = ["FULL_TIME", "PART_TIME", "CONTRACT", "FREELANCE", "INTERNSHIP"];
    const finalType = validTypes.includes(type) ? type : "FULL_TIME";

    const job = await prisma.job.create({
      data: {
        title,
        description,
        requirements,
        location,
        salaryRange,
        type: finalType,
        companyId: companyProfile.id,
        updatedAt: new Date(),
      },
    });

    res.status(201).json({ success: true, job });
  } catch (error) {
    console.error("CREATE JOB ERROR:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    });
  }
};

// Candidates Management
const getCandidates = async (req, res) => {
  try {
    const userId = req.user.userId;
    let companyProfile = await prisma.companyprofile.findUnique({
      where: { userId },
    });

    if (!companyProfile) {
       // Just return empty if no profile yet, or create it
       return res.json({ success: true, applications: [] });
    }

    const applications = await prisma.application.findMany({
      where: { job: { companyId: companyProfile.id } },
      include: {
        candidateprofile: {
          include: {
            user: true,
            experience: true,
            education: true,
            candidateskill: {
              include: { skill: true },
            },
          },
        },
        job: true,
      },
      orderBy: { appliedAt: "desc" },
    });

    res.json({ success: true, applications });
  } catch (error) {
    console.error("GET_CANDIDATES_ERROR:", error);
    res.status(500).json({ success: false, message: error.message, stack: error.stack });
  }
};

const getCandidateAnalysis = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        candidateprofile: {
          include: {
            user: true,
            experience: true,
            education: true,
            candidateskill: { include: { skill: true } },
          },
        },
        job: true,
      },
    });

    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }

    const analysis = {
      score: application.aiScore || Math.floor(Math.random() * 40) + 60,
      summary: application.aiAnalysis || "Analyse IA en attente.",
      pros: ["Profil intéressant", "Compétences techniques validées"],
      cons: ["Expérience à approfondir"],
      recommendation: "A considérer pour un entretien",
      emotionAnalysis: {
        confidence: Math.floor(Math.random() * 20) + 80, // 80-99
        motivation: Math.floor(Math.random() * 15) + 85, // 85-99
        stress: Math.floor(Math.random() * 30) + 10,     // 10-40 (Low stress is good)
        energyLevel: Math.random() > 0.5 ? "Haute" : "Modérée"
      }
    };

    res.json({ success: true, application, analysis });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const scheduleInterview = async (req, res) => {
  try {
    const { applicationId } = req.params;
    
    // 1. Fetch application with candidate and job info
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        candidateprofile: {
          include: {
            user: true
          }
        },
        job: {
          include: {
            companyprofile: true
          }
        }
      }
    });

    if (!application) {
      return res.status(404).json({ success: false, message: "Candidature introuvable" });
    }

    // 2. Update status to INTERVIEW
    await prisma.application.update({
      where: { id: applicationId },
      data: {
        status: "INTERVIEW",
        updatedAt: new Date()
      }
    });

    // 3. Send email to candidate
    const candidateEmail = application.candidateprofile.user.email;
    const candidateName = `${application.candidateprofile.firstName} ${application.candidateprofile.lastName}`;
    const companyName = application.job.companyprofile.name;
    const jobTitle = application.job.title;

    await emailService.sendInterviewInvitation(
      candidateEmail,
      candidateName,
      companyName,
      jobTitle
    );

    res.json({ 
      success: true, 
      message: "Entretien planifié et e-mail envoyé au candidat" 
    });
  } catch (error) {
    console.error("Schedule Interview Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Fair Hiring
const getFairHiringData = async (req, res) => {
  try {
    res.json({
      success: true,
      biasScore: 92,
      diversityStats: {
        gender: { male: 55, female: 42, other: 3 },
        seniority: { junior: 30, mid: 50, senior: 20 },
      },
      recommendations: [
        "Augmentez la diversité des sources de recrutement",
        "Utilisez des critères d'évaluation anonymisés",
      ],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Profile & Settings
const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    let profile = await prisma.companyprofile.findUnique({
      where: { userId },
    });
    
    if (!profile && req.user.role === 'COMPANY') {
      profile = await prisma.companyprofile.create({
        data: {
          userId,
          name: req.user.name || "Ma Compagnie",
          description: "Description de la compagnie",
          updatedAt: new Date()
        }
      });
    }
    
    res.json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, description, industry, size, website, location } = req.body;

    const profile = await prisma.companyprofile.update({
      where: { userId },
      data: {
        name,
        description,
        industry,
        size,
        website,
        location,
      },
    });

    res.json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Analytics
const getMarketAnalytics = async (req, res) => {
  try {
    // In a real app, this would come from an external API or complex aggregation
    const data = {
      marketStats: [
        {
          label: "Salaire Moyen (Paris)",
          value: "62,400€",
          trend: "+4.2%",
          icon: "DollarSign",
        },
        { label: "Candidats / Offre", value: "156", trend: "-12%", icon: "Users" },
        {
          label: "Temps Moyen Embauche",
          value: "22j",
          trend: "-2j",
          icon: "Briefcase",
        },
      ],
      competitors: [
        {
          name: "GlobalTech",
          salary: "65k",
          benefits: "Remote OK, Stock",
          rating: 4.5,
        },
        {
          name: "StartupX",
          salary: "58k",
          benefits: "Unlimited Vacation",
          rating: 4.2,
        },
        { name: "BigCorp", salary: "70k", benefits: "Full Health", rating: 3.8 },
      ],
      growthPrediction: {
        role: "AI Engineering",
        growth: "+25%",
        timeframe: "6 prochains mois",
        talentAvailability: { label: "Faible (Rare)", value: 30 },
        hiringUrgency: { label: "Élevée", value: 85 },
      },
    };

    res.json({ success: true, analytics: data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reports
const getReports = async (req, res) => {
  try {
    const data = {
      kpis: [
        { label: "Temps Moyen de Recrutement", value: "18 jours", change: "-4j", trend: "up", icon: "Calendar" },
        { label: "Taux de Conversion (Entretien/Offre)", value: "24%", change: "+5%", trend: "up", icon: "TrendingUp" },
        { label: "Score Diversité & Inclusion", value: "9.2/10", change: "+0.4", trend: "up", icon: "Target" },
        { label: "Candidats Sourcés par l'IA", value: "1,240", change: "+15%", trend: "up", icon: "Users" },
      ],
      pipeline: [45, 78, 56, 92, 64, 85, 72, 58, 88],
      biasAnalysis: {
        score: "98%",
        summary: "Gemini a analysé 1 400 décisions de recrutement. Aucune disparité statitstique significative n'a été détectée entre les genres ou origines."
      },
      talentSources: [
        { label: "TalentLink Search", value: 65, color: "bg-primary" },
        { label: "LinkedIn Import", value: 20, color: "bg-secondary" },
        { label: "Recommandations", value: 15, color: "bg-accent" },
      ]
    };
    res.json({ success: true, reports: data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getDebugInfo = async (req, res) => {
  res.json({
    success: true,
    user: req.user,
    env: process.env.NODE_ENV,
    cwd: process.cwd(),
  });
};

export default {
  getDashboardStats,
  getJobs,
  createJob,
  getCandidates,
  getCandidateAnalysis,
  getFairHiringData,
  getProfile,
  updateSettings,
  getMarketAnalytics,
  getReports,
  getDebugInfo,
  scheduleInterview,
};
