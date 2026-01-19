"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail, MapPin, ExternalLink, Plus, Camera, FileText, Trophy, Star, Zap, Code, Layout, Cpu, Loader2, Globe, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CVModal, SkillsModal } from "@/components/ProfileModals";
import candidateService from "@/services/candidate.service";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/Toast";

export default function CandidateProfile() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCVModalOpen, setIsCVModalOpen] = useState(false);
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
  const [isInternationalizing, setIsInternationalizing] = useState(false);
  const [intlResult, setIntlResult] = useState<any>(null);
  const [selectedRegion, setSelectedRegion] = useState("USA");
  const { toasts, removeToast, success, error, info } = useToast();
  const toastObj = { success, error, info };

  // Helper for file upload simulation
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cv') => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        if (type === 'avatar') {
          // Preview immediately
          const previewUrl = URL.createObjectURL(file);
          setProfile((prev: any) => ({ ...prev, avatarUrl: previewUrl }));

          // Upload to server
          const result = await candidateService.uploadAvatar(file);
          setProfile((prev: any) => ({ ...prev, avatarUrl: result.avatarUrl }));
          setProfile((prev: any) => ({ ...prev, avatarUrl: result.avatarUrl }));
          success('Photo de profil mise à jour avec succès !');
        } else {
          info(`Fichier ${file.name} sélectionné pour le CV.`);
          // CV upload logic could be added here similar to avatar
        }
      } catch (err) {
        console.error("Erreur d'upload:", err);
        error("Erreur lors de l'upload du fichier");
      }
    }
  };

  const handleInternationalize = async () => {
    try {
      setIsInternationalizing(true);
      const language = selectedRegion === "Europe" ? "English (Professional)" : "English";
      const result = await candidateService.internationalizeProfile(selectedRegion, language);
      setIntlResult(result);
    } catch (err: any) {
      console.error("Erreur internationalisation:", err);
      error(err.response?.data?.message || "Échec de l'exploration internationale.");
    } finally {
      setIsInternationalizing(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await candidateService.getProfile();
        setProfile(data);
      } catch (error) {
        console.error("Erreur lors de la récupération du profil:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={48} className="text-primary animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Profil non trouvé</h2>
        <p className="text-white/40">Veuillez vous assurer d'être connecté en tant que candidat.</p>
      </div>
    );
  }

  const stats = [
    { label: "Score Technique", value: profile.technicalScore || "0", color: "text-primary" },
    { label: "Matching Moyen", value: `${profile.matchRate || 0}%`, color: "text-secondary" },
    { label: "Projets", value: profile.projects?.length || "0", color: "text-accent" },
  ];

  const badges = [
    { name: "Fast Learner", icon: Zap, color: "text-yellow-400", bg: "bg-yellow-400/10" },
    { name: "Code Quality", icon: Code, color: "text-blue-400", bg: "bg-blue-400/10" },
    { name: "UI Expert", icon: Layout, color: "text-purple-400", bg: "bg-purple-400/10" },
    { name: "AI Explorer", icon: Cpu, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-40">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      {/* Profile Header */}
      <div className="glass rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] pointer-events-none" />
        
          <div className="relative group">
            <div className="w-32 h-32 md:w-44 md:h-44 rounded-3xl bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center transition-all group-hover:border-primary overflow-hidden">
              {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                  <Camera size={40} className="text-white/20 group-hover:text-primary transition-colors" />
              )}
            </div>
            
            {/* Hidden file input for avatar */}
            <input 
              type="file" 
              id="avatar-upload" 
              className="hidden" 
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'avatar')}
            />
            
            <button 
              onClick={() => document.getElementById('avatar-upload')?.click()}
              className="absolute -bottom-2 -right-2 p-3 bg-primary rounded-xl shadow-lg hover:scale-110 transition-transform">
              <Plus size={20} />
            </button>
          </div>

        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{profile.firstName} {profile.lastName}</h1>
          <p className="text-xl text-white/60 mb-6 flex items-center justify-center md:justify-start gap-2">
            {profile.title || "Développeur"} <span className="text-primary">•</span> {profile.location || "Non spécifié"}
          </p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            {profile.githubUrl && (
              <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="px-6 py-3 glass rounded-xl flex items-center gap-2 hover:bg-white/10 transition-colors">
                <Github size={18} /> GitHub
              </a>
            )}
            {profile.linkedinUrl && (
              <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="px-6 py-3 glass rounded-xl flex items-center gap-2 hover:bg-white/10 transition-colors">
                <Linkedin size={18} /> LinkedIn
              </a>
            )}
            <button 
              onClick={() => setIsCVModalOpen(true)}
              className="px-6 py-3 bg-white text-black font-bold rounded-xl flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <FileText size={18} /> {profile.cvUrl ? "Modifier CV" : "Ajouter CV"}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-8 rounded-3xl text-center"
          >
            <p className="text-sm font-medium text-white/40 uppercase tracking-widest mb-2">{stat.label}</p>
            <h4 className={`text-4xl font-black ${stat.color}`}>{stat.value}</h4>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <section className="glass p-8 md:p-10 rounded-[2.5rem]">
            <h3 className="text-2xl font-bold mb-6">À propos</h3>
            <p className="text-white/60 leading-relaxed text-lg">
              {profile.bio || "Aucune description fournie pour le moment."}
            </p>
          </section>

          <section className="glass p-8 md:p-10 rounded-[2.5rem]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Compétences Techniques</h3>
              <button 
                onClick={() => setIsSkillsModalOpen(true)}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors text-primary"
              >
                <Plus size={24} />
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {profile.skills?.length > 0 ? (
                profile.skills.map((item: any) => (
                  <span key={item.skill.id} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-medium hover:bg-primary/20 hover:border-primary/50 transition-all cursor-default">
                    {item.skill.name}
                  </span>
                ))
              ) : (
                <p className="text-white/40 italic">Aucune compétence ajoutée.</p>
              )}
            </div>
          </section>

          {/* Gamification / Badges */}
          <section className="glass p-8 md:p-10 rounded-[2.5rem]">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Trophy className="text-accent" /> Badges & Réalisations
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {badges.map((badge, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className={`p-6 rounded-[2rem] ${badge.bg} border border-white/5 flex flex-col items-center text-center gap-3`}
                >
                  <badge.icon size={32} className={badge.color} />
                  <p className="text-xs font-bold uppercase tracking-tight">{badge.name}</p>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <section className="glass p-8 rounded-[2.5rem] relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              IA Insight
            </h3>
            <p className="text-sm text-white/60 leading-relaxed mb-6">
              Gemini analyse votre profil : "Votre profil est en cours d'analyse. Complétez vos expériences pour une meilleure visibilité."
            </p>
            <button 
              onClick={() => router.push('/candidate/roadmap')}
              className="w-full py-3 bg-primary/10 border border-primary/30 rounded-xl text-primary font-bold hover:bg-primary hover:text-white transition-all">
              Voir l'analyse détaillée
            </button>
          </section>
        </div>
      </div>

       {/* International Explorer Section (Moved to bottom full width) */}
       <section className="glass p-8 md:p-10 rounded-[2.5rem] border border-primary/20 bg-primary/5">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
              <div>
                <h3 className="text-2xl font-bold flex items-center gap-3">
                  <Globe className="text-primary" /> Explorateur International
                </h3>
                <p className="text-white/40 text-sm mt-1">Adaptez votre profil pour les marchés mondiaux avec l'IA.</p>
              </div>
              <div className="flex gap-2">
                {["USA", "Europe", "Canada"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setSelectedRegion(r)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedRegion === r ? "bg-primary text-white shadow-lg shadow-primary/20" : "glass text-white/40 hover:text-white"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {!intlResult ? (
              <div className="text-center py-10 space-y-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                   <Zap size={32} className="text-primary animate-pulse" />
                </div>
                <div className="max-w-md mx-auto">
                  <p className="text-white/60 mb-6 italic">
                    "Prêt à conquérir le marché {selectedRegion} ? L'IA va reformuler votre bio, adapter vos expériences et vous donner les clés culturelles du succès."
                  </p>
                  <button 
                    onClick={handleInternationalize}
                    disabled={isInternationalizing}
                    className="px-8 py-4 bg-primary text-white font-bold rounded-2xl flex items-center gap-2 mx-auto hover:opacity-90 transition-all disabled:opacity-50"
                  >
                    {isInternationalizing ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
                    Lancer l'Analyse {selectedRegion}
                  </button>
                </div>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary">Profil Adapté ({selectedRegion})</p>
                    <div className="p-6 glass rounded-3xl space-y-4 border-primary/20">
                      <h4 className="text-lg font-bold text-primary">{intlResult.translatedProfile.title}</h4>
                      <p className="text-sm text-white/70 leading-relaxed">{intlResult.translatedProfile.bio}</p>
                      <ul className="space-y-2">
                        {intlResult.translatedProfile.experiences.map((exp: string, idx: number) => (
                          <li key={idx} className="text-xs text-white/40 flex items-start gap-2">
                             <span className="text-primary">•</span> {exp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-secondary">Analyse Linguistique & Culturelle</p>
                    <div className="p-6 glass rounded-3xl space-y-6 bg-white/5">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                           <span className="text-xs font-bold">Niveau Linguistique</span>
                           <span className="text-primary font-black">{intlResult.analysis.linguisticScore}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                           <div className="h-full bg-primary" style={{ width: `${intlResult.analysis.linguisticScore}%` }} />
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white/40 mb-2 uppercase tracking-tighter">Points de vigilance</p>
                        <p className="text-xs text-secondary/80 italic">"{intlResult.analysis.commonPitfalls}"</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white/40 mb-3 uppercase tracking-tighter">Conseils de Fit Culturel</p>
                        <div className="space-y-2">
                           {intlResult.analysis.culturalTips.map((tip: string, idx: number) => (
                             <div key={idx} className="flex items-center gap-2 p-3 bg-white/5 rounded-xl border border-white/5 text-[10px] font-medium">
                                <Trophy size={14} className="text-primary" /> {tip}
                             </div>
                           ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setIntlResult(null)}
                  className="text-xs font-bold text-white/20 hover:text-white transition-colors underline block mx-auto"
                >
                  Fermer l'explorateur
                </button>
              </motion.div>
            )}
       </section>

      {/* Modals */}
      <CVModal isOpen={isCVModalOpen} onClose={() => setIsCVModalOpen(false)} toast={toastObj} />
      <SkillsModal isOpen={isSkillsModalOpen} onClose={() => setIsSkillsModalOpen(false)} toast={toastObj} />
    </div>
  );
}
