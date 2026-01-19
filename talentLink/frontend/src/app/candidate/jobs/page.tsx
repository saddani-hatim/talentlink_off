"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Briefcase, MapPin, DollarSign, Zap, ArrowUpRight, Sparkles, Building2, Loader2, BrainCircuit, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import candidateService from "@/services/candidate.service";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/Toast";

export default function SmartJobMatching() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [isAiFiltering, setIsAiFiltering] = useState(false);
  const [applying, setApplying] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { toasts, removeToast, success, error } = useToast();

  const fetchData = async (showAiAnim = false) => {
    if (showAiAnim) setIsAiFiltering(true);
    try {
      if (showAiAnim) {
        // Simulation d'une analyse profonde pour le feeling "Premium"
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      const [jobsData, profileData] = await Promise.all([
        candidateService.getRecommendedJobs(),
        candidateService.getProfile()
      ]);
      
      setJobs(jobsData);
      
      if (profileData?.applications) {
        const appliedIds = new Set<string>(profileData.applications.map((app: any) => app.jobId as string));
        setAppliedJobIds(appliedIds);
      }

      if (showAiAnim) {
        success("Analyse IA terminée ! Les meilleures offres ont été trouvées.");
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des données:", err);
      error("Impossible de rafraîchir les recommandations.");
    } finally {
      setLoading(false);
      setIsAiFiltering(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApply = async (jobId: string) => {
    setApplying(jobId);
    try {
      await candidateService.applyToJob(jobId);
      success("Candidature envoyée avec succès !");
      setAppliedJobIds(prev => {
        const next = new Set(prev);
        next.add(jobId);
        return next;
      });
    } catch (err: any) {
      error(err.response?.data?.message || "Erreur lors de la candidature.");
    } finally {
      setApplying(null);
    }
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.requirements?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && !isAiFiltering) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="relative">
          <Loader2 size={48} className="text-primary animate-spin" />
          <BrainCircuit size={24} className="absolute inset-0 m-auto text-primary/50" />
        </div>
        <p className="text-white/40 animate-pulse">Initialisation du matching intelligent...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-40">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* AI Filtering Overlay */}
      <AnimatePresence>
        {isAiFiltering && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <div className="max-w-md w-full text-center space-y-8">
              <div className="relative inline-block">
                <motion.div 
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="w-32 h-32 rounded-full border-2 border-primary/30 border-t-primary"
                />
                <BrainCircuit size={48} className="absolute inset-0 m-auto text-primary animate-pulse" />
                <Sparkles size={24} className="absolute top-0 right-0 text-primary animate-bounce delay-100" />
                <Sparkles size={16} className="absolute bottom-4 left-0 text-primary/60 animate-bounce delay-300" />
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent italic">
                  Analyse par IA en cours...
                </h2>
                <div className="flex flex-col gap-2">
                  <p className="text-white/40 text-sm">Comparaison de vos compétences avec 1,000+ offres</p>
                  <p className="text-white/40 text-sm">Optimisation du score de matching</p>
                  <p className="text-white/40 text-sm">Vérification du fit culturel</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="flex-1 space-y-4">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl font-black italic flex items-center gap-4 tracking-tighter"
          >
            JOBS MATCHING <Zap className="text-primary fill-primary size-10" />
          </motion.h1>
          <p className="text-white/60 text-lg">L'intelligence artificielle au service de votre carrière.</p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={20} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par poste, entreprise ou compétence..." 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-4 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all text-lg"
              />
            </div>
            
            <button 
              onClick={() => fetchData(true)}
              className="px-8 py-5 bg-primary text-black font-black flex items-center justify-center gap-3 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)] group"
            >
              <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
              FILTRER PAR IA
            </button>
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 gap-8">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job, i) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-[3rem] p-10 hover:border-primary/40 transition-all group relative overflow-hidden flex flex-col lg:flex-row gap-10"
            >
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -z-10 group-hover:bg-primary/10 transition-colors" />

              {/* Match Indicator Badge (Modern side version) */}
              <div className="lg:w-32 shrink-0 flex lg:flex-col items-center justify-center gap-2 border-b lg:border-b-0 lg:border-r border-white/5 pb-6 lg:pb-0 lg:pr-10">
                <div className="relative w-20 h-20">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth="3"
                    />
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: (job.aiMatching?.score || 0) / 100 }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={(job.aiMatching?.score || 0) >= 80 ? '#10b981' : (job.aiMatching?.score || 0) >= 60 ? '#3b82f6' : '#6b7280'}
                      strokeWidth="3"
                      strokeDasharray="100, 100"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-black">{job.aiMatching?.score || 0}</span>
                    <span className="text-[8px] font-bold text-white/40 uppercase">Match</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                   {/* Company Logo */}
                  <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden shadow-2xl">
                    {job.companyprofile?.logoUrl || job.company?.logoUrl ? (
                      <img src={job.companyprofile?.logoUrl || job.company?.logoUrl} alt="Company" className="w-full h-full object-cover" />
                    ) : (
                      <Building2 size={40} className="text-white/10" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-3xl font-bold group-hover:text-primary transition-colors tracking-tight">{job.title}</h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1">
                          <span className="text-white/60 font-medium flex items-center gap-2">
                            <Building2 size={16} /> {job.companyprofile?.companyName || job.company?.name}
                          </span>
                          <span className="text-white/40 flex items-center gap-2">
                            <MapPin size={16} /> {job.location || job.companyprofile?.location}
                          </span>
                          <span className="text-white/40 flex items-center gap-2">
                            <DollarSign size={16} /> {job.salaryRange || "À négocier"}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {appliedJobIds.has(job.id) ? (
                          <div className="px-8 py-4 bg-emerald-500/10 text-emerald-400 font-black rounded-2xl border border-emerald-500/20 flex items-center gap-2">
                             DÉJÀ POSTULÉ <CheckCircle2 size={18} />
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleApply(job.id)}
                            disabled={applying === job.id}
                            className="px-10 py-4 bg-white text-black font-black rounded-2xl hover:bg-white/90 active:scale-95 transition-all disabled:opacity-50 shadow-xl"
                          >
                            {applying === job.id ? <Loader2 className="animate-spin" size={20} /> : "POSTULER MAINTENANT"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {job.requirements?.split(',').map((tag: string) => (
                    <span key={tag} className="px-5 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white/60 hover:bg-white/10 transition-colors">
                      {tag.trim()}
                    </span>
                  )) || (
                    <span className="px-5 py-2 bg-primary/10 border border-primary/20 rounded-xl text-sm font-bold text-primary">
                      {job.type || "Full-time"}
                    </span>
                  )}
                </div>

                {/* AI Insight Section - Premium Overhaul */}
                <div className="relative mt-8 p-6 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-[2rem] group/insight">
                  <div className="absolute -top-3 -left-3">
                    <div className="bg-primary text-black p-2 rounded-xl shadow-lg rotate-[-10deg] group-hover/insight:rotate-0 transition-transform">
                      <Sparkles size={16} />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-[12px] font-black uppercase tracking-[0.2em] text-primary/80">Gemini Match Insight</p>
                    <p className="text-lg text-white/90 leading-relaxed font-medium">
                      "{job.aiMatching?.justification || "Nous analysons la compatibilité avec votre profil d'expert."}"
                    </p>
                  </div>
                  <div className="absolute bottom-4 right-6 opacity-10 group-hover/insight:opacity-30 transition-opacity">
                    <BrainCircuit size={64} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-40 glass rounded-[4rem] border-dashed border-white/10">
            <div className="inline-block p-6 rounded-full bg-white/5 mb-6">
              <Search size={48} className="text-white/20" />
            </div>
            <h3 className="text-2xl font-bold text-white/60">Aucune offre trouvée</h3>
            <p className="text-white/20 mt-2">Essayez d'ajuster votre recherche ou laissez l'IA vous proposer de nouveaux matchs.</p>
          </div>
        )}
      </div>
    </div>
  );
}

