import { GoogleGenerativeAI } from "@google/generative-ai";

console.log(">>> AI Coach Controller VERSION 2.1 Loaded <<<");

const SYSTEM_PROMPT = `
Tu es l'Assistant Vocal Intelligent et Coach IA de l'application TalentLink. 
Ton rôle est d'être un "Conseiller technique" et un "Coach d'apprentissage" expert.

Tes responsabilités incluent :
1. Conseils personnalisés : Répondre aux questions techniques (ex: Node.js, React, Prisma) de manière précise et encourageante.
2. Suggestions d'actions : Recommander des projets concrets (ex: "Crée un projet CRUD avec Prisma"), des tutoriels ou des étapes d'apprentissage.
3. Évaluations et Feedback : Analyser le code ou les projets soumis et fournir des critiques constructives basées sur les meilleures pratiques.
4. Interaction fluide : Tes réponses doivent être concises et adaptées à une lecture vocale (Text-to-Speech).

Identité : Tu t'appelles "Coach AI Gemini 3". 
Ton ton est professionnel, motivant et pédagogique.
Si l'utilisateur parle de code, utilise des blocs de code markdown si nécessaire, mais garde le texte explicatif court pour la synthèse vocale.
`;

export const chatWithCoach = async (req, res) => {
  console.log(">>> Requête reçue par le Coach IA <<<");
  try {
    const { message, history } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("ERREUR: GEMINI_API_KEY est manquante dans l'environnement (process.env.GEMINI_API_KEY est undefined).");
      return res.status(500).json({ message: "La clé API Gemini n'est pas configurée sur le serveur." });
    }

    console.log(`Utilisation de la clé API (début): ${apiKey.substring(0, 10)}... (longueur: ${apiKey.length})`);

    if (!message) {
      return res.status(400).json({ message: "Le message est requis" });
    }

    const genAI = new GoogleGenerativeAI(apiKey.trim());
    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-lite-latest",
      systemInstruction: SYSTEM_PROMPT
    });

    const chat = model.startChat({
      history: history || [],
    });

    console.log("Envoi du message à Gemini...");
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    console.log("Réponse reçue de Gemini.");

    res.status(200).json({ 
      reply: text,
      history: [
        ...(history || []),
        { role: 'user', parts: [{ text: message }] },
        { role: 'model', parts: [{ text: text }] }
      ]
    });
  } catch (error) {
    console.error("ERREUR DÉTAILLÉE GEMINI SUR LE SERVEUR:", error);
    const status = error.status || 500;
    const message = error.message || "Erreur lors de la communication avec l'IA";
    res.status(status).json({ message, details: error.errorDetails || [] });
  }
};

export const generateRoadmap = async (req, res) => {
  console.log(">>> [AI] Début de génération de roadmap...");
  try {
    const { profile, projects } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error(">>> [AI] GEMINI_API_KEY manquante !");
      return res.status(500).json({ message: "La clé API Gemini n'est pas configurée." });
    }

    const genAI = new GoogleGenerativeAI(apiKey.trim());
    const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });

    const prompt = `
      Tu es un expert en coaching de carrière technique. 
      En te basant sur le profil suivant d'un candidat et ses projets, génère une ROADMAP d'apprentissage personnalisée de 4 étapes majeures pour atteindre le niveau supérieur (Sénior/Expert).
      
      PROFIL CANDIDAT:
      ${JSON.stringify(profile)}
      
      PROJETS:
      ${JSON.stringify(projects)}
      
      INSTRUCTIONS:
      1. La roadmap doit être cohérente avec ses compétences actuelles.
      2. Le format de sortie DOIT être un JSON valide.
      3. La dernière étape doit avoir le status "GOAL".
      
      FORMAT JSON ATTENDU:
      {
        "title": "Titre du parcours",
        "description": "Description globale",
        "steps": [
          {
            "title": "Titre de l'étape",
            "description": "Description détaillée",
            "order": 1,
            "isCompleted": false,
            "status": null
          }
        ]
      }
      
      Réponds UNIQUEMENT avec le JSON.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const roadmapData = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text);

    res.status(200).json(roadmapData);
  } catch (error) {
    console.error("ERREUR GENERATE ROADMAP:", error);
    if (error.status === 429 || error.message?.includes('429')) {
      return res.status(429).json({ message: "Gemini est surchargé. Réessayez dans un instant." });
    }
    res.status(500).json({ message: "Erreur génération roadmap" });
  }
};

export const generateTechnicalChallenge = async (req, res) => {
  console.log(">>> [AI] Génération de plusieurs défis techniques...");
  try {
    const { profile } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error(">>> [AI] GEMINI_API_KEY manquante !");
      return res.status(500).json({ message: "La clé API Gemini n'est pas configurée." });
    }

    const genAI = new GoogleGenerativeAI(apiKey.trim());
    const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });

    const prompt = `
      Tu es un recruteur technique senior. Génère EXACTEMENT 3 MINI-PROJETS techniques variés pour ce candidat.
      Les défis doivent être adaptés à son niveau et ses technologies.
      
      PROFIL: ${JSON.stringify(profile)}
      
      INSTRUCTIONS:
      1. Chaque mini-projet doit être réalisable en 30-60 minutes.
      2. Varie les domaines (ex: un axé logique, un axé UI/UX, un axé performance).
      
      FORMAT JSON ATTENDU (UNIQUEMENT LE JSON):
      {
        "challenges": [
          {
            "title": "Nom du défi",
            "description": "Énoncé complet et instructions",
            "category": "Frontend/Backend/AI/etc",
            "difficulty": "Junior/Intermédiaire/Senior",
            "requirements": "Instructions techniques précises pour l'évaluation",
            "points": 100,
            "duration": 60
          }
        ]
      }
      
      Réponds UNIQUEMENT avec le JSON.
    `;

    console.log("Envoi de la requête à Gemini pour 3 défis...");
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    console.log("Réponse brute reçue de Gemini.");
    
    // Improved JSON parsing
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("Aucun JSON trouvé dans la réponse Gemini:", text);
      throw new Error("Format de réponse IA invalide");
    }
    
    const data = JSON.parse(jsonMatch[0]);
    if (!data.challenges || !Array.isArray(data.challenges)) {
      console.error("Format de JSON invalide (manque 'challenges'):", data);
      throw new Error("Structure de réponse IA invalide");
    }

    res.status(200).json(data.challenges);
  } catch (error) {
    console.error("ERREUR GENERATE CHALLENGE:", error);
    if (error.status === 429 || error.message?.includes('429')) {
      return res.status(429).json({ message: "Gemini est surchargé. Réessayez dans un instant." });
    }
    res.status(500).json({ message: `Erreur génération défi: ${error.message}` });
  }
};

export const evaluateTechnicalSubmission = async (req, res) => {
  console.log(">>> [AI] Évaluation technique en cours...");
  try {
    const { code, challenge } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error(">>> [AI] GEMINI_API_KEY manquante !");
      return res.status(500).json({ message: "La clé API Gemini n'est pas configurée." });
    }

    const genAI = new GoogleGenerativeAI(apiKey.trim());
    const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });

    const prompt = `
      Tu es un évaluateur technique. Analyse le code suivant soumis pour le défi "${challenge.title}".
      
      Instructions du défi: ${challenge.requirements}
      Code soumis:
      ${code}
      
      TACHE:
      1. Évalue la LOGIQUE, la QUALITÉ DU CODE, la STRUCTURE et la PERFORMANCE sur 100.
      2. Détecte si le code semble être un copier-coller ou générer par une IA sans modification.
      3. Fournis un feedback technique détaillé et constructif.
      
      FORMAT JSON ATTENDU:
      {
        "score": 85,
        "logicScore": 90,
        "qualityScore": 80,
        "structureScore": 85,
        "performanceScore": 85,
        "status": "PASSED/FAILED",
        "feedback": "Texte détaillé du feedback",
        "isOriginal": true,
        "aiAnalysis": "Analyse détaillée des points forts et faibles"
      }
      
      Réponds UNIQUEMENT avec le JSON.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const evaluation = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text);

    res.status(200).json(evaluation);
  } catch (error) {
    console.error("ERREUR EVALUATION:", error);
    if (error.status === 429 || error.message?.includes('429')) {
      return res.status(429).json({ message: "Gemini est surchargé. Réessayez dans un instant." });
    }
    res.status(500).json({ message: "Erreur évaluation" });
  }
};

export const optimizePortfolio = async (req, res) => {
  console.log(">>> [AI] Optimisation du portfolio...");
  try {
    const { profile, projects, targetOffer } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) return res.status(500).json({ message: "Clé API manquante." });

    const genAI = new GoogleGenerativeAI(apiKey.trim());
    const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });

    const prompt = `
      Tu es un expert en branding personnel et recruteur technique senior. 
      Ta mission est de transformer un portfolio de projets brut en un showcase professionnel percutant.
      
      CANDIDAT: ${JSON.stringify(profile)}
      PROJETS DISPONIBLES: ${JSON.stringify(projects)}
      OFFRE CIBLÉE (optionnelle): ${targetOffer || "Généraliste (Expert Technique)"}
      
      INSTRUCTIONS:
      1. Sélectionne les 3-4 meilleurs projets les plus pertinents pour l'offre ciblée.
      2. Pour chaque projet :
         - Rédige un storytelling professionnel suivant la méthode STAR (Situation, Task, Action, Result).
         - Optimise le titre pour qu'il soit accrocheur.
         - Liste les technologies clés.
      3. Le ton doit être professionnel, dynamique et axé sur les résultats.
      
      FORMAT JSON ATTENDU:
      {
        "intro": "Accroche professionnelle pour le portfolio",
        "curatedProjects": [
          {
            "id": "original_project_id",
            "title": "Titre optimisé",
            "storytelling": {
              "situation": "Le contexte du projet...",
              "task": "L'objectif à atteindre...",
              "action": "Ce que j'ai mis en place techniquement...",
              "result": "Les bénéfices ou performances obtenus..."
            },
            "technologies": ["React", "Node.js", "..."]
          }
        ]
      }
      
      Réponds UNIQUEMENT avec le JSON.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const optimizedData = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text);

    res.status(200).json(optimizedData);
  } catch (error) {
    console.error("ERREUR OPTIMISATION PORTFOLIO:", error);
    
    if (error.status === 429 || error.message?.includes('429')) {
      return res.status(429).json({ 
        message: "Gemini est temporairement surchargé. Veuillez patienter un instant avant de réessayer.",
        retryAfter: 30
      });
    }

    res.status(500).json({ message: "Erreur lors de l'optimisation par l'IA" });
  }
};

export const matchJobs = async (req, res) => {
  console.log(">>> [AI] Calcul du matching intelligent...");
  try {
    const { profile, jobs } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) return res.status(500).json({ message: "Clé API manquante." });

    const genAI = new GoogleGenerativeAI(apiKey.trim());
    const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });

    const prompt = `
      Tu es un algorithme de matching intelligent pour une plateforme de recrutement.
      Ta mission est de comparer un profil de candidat avec une liste d'offres d'emploi.
      
      CANDIDAT: ${JSON.stringify(profile)}
      OFFRES D'EMPLOI: ${JSON.stringify(jobs)}
      
      INSTRUCTIONS:
      1. Calcule un score de compatibilité (%) pour chaque offre.
      2. Pondération : Compétences expertes du candidat (Must-haves) > Compétences secondaires.
      3. Analyse le potentiel : Si le candidat a des projets pertinents même sans l'expérience pro exacte, augmente légèrement le score.
      4. Rédige une explication courte de 1-2 phrases (ex: "Cette offre correspond à X% car ton expertise en React est...").
      
      FORMAT JSON ATTENDU:
      {
        "matchings": [
          {
            "jobId": "id_de_l_offre",
            "score": 85,
            "justification": "Explication claire et positive"
          }
        ]
      }
      
      Réponds UNIQUEMENT avec le JSON.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const matchingData = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text);

    res.status(200).json(matchingData);
  } catch (error) {
    console.error("ERREUR MATCHING JOBS:", error);
    if (error.status === 429 || error.message?.includes('429')) {
      return res.status(429).json({ message: "Gemini est surchargé. Réessayez dans un instant." });
    }
    res.status(500).json({ message: "Erreur matching jobs" });
  }
};

export const internationalizeProfile = async (req, res) => {
  console.log(">>> [AI] Internationalisation du profil...");
  try {
    const { profile, region, targetLanguage } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) return res.status(500).json({ message: "Clé API manquante." });

    const genAI = new GoogleGenerativeAI(apiKey.trim());
    const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });

    const prompt = `
      Tu es un expert en recrutement international et traducteur technique. 
      Ta mission est d'adapter le profil d'un candidat pour le marché de la région : ${region}.
      La langue cible est : ${targetLanguage}.
      
      PROFIL ORIGINAL: ${JSON.stringify(profile)}
      
      INSTRUCTIONS:
      1. Traduis techniquement tout le contenu (Bio, Titre, Expériences).
      2. Adapte le ton et la structure selon les normes de la région ${region} (ex: Style direct et chiffré pour les US, formel pour l'Europe).
      3. Analyse linguistique : Évalue la qualité des traductions techniques et donne des conseils pour l'entretien.
      4. Fit Culturel : Donne 3 conseils clés pour réussir un entretien dans cette région spécifique.
      
      FORMAT JSON ATTENDU:
      {
        "translatedProfile": {
          "title": "Titre traduit",
          "bio": "Bio traduite et adaptée",
          "experiences": ["Liste des points clés adaptés"]
        },
        "analysis": {
          "linguisticScore": 85,
          "commonPitfalls": "Erreurs à éviter en parlant de technique dans cette langue",
          "culturalTips": ["Conseil 1", "Conseil 2", "Conseil 3"]
        }
      }
      
      Réponds UNIQUEMENT avec le JSON.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const internationalData = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text);

    res.status(200).json(internationalData);
  } catch (error) {
    console.error("ERREUR INTERNATIONALISATION:", error);
    if (error.status === 429 || error.message?.includes('429')) {
      return res.status(429).json({ message: "Gemini est surchargé. Réessayez dans un instant." });
    }
    res.status(500).json({ message: "Erreur internationalisation du profil" });
  }
};
