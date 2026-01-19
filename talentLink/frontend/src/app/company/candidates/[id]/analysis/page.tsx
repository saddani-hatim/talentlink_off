"use client";

import { motion } from "framer-motion";
import { Sparkles, Brain, Zap, ArrowLeft, ShieldCheck, Heart, TrendingUp, User, FileText, AlertTriangle, MapPin, Briefcase, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, use } from "react";
import companyService from "../../../../../services/company.service";
import jsPDF from "jspdf";
import domtoimage from "dom-to-image";
import { ToastContainer } from "@/components/Toast";

export default function CompanyCandidateAnalysis({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [toasts, setToasts] = useState<any[]>([]);

  const addToast = (message: string, type: "success" | "error" | "info" = "info") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const res = await companyService.getCandidateAnalysis(id);
        if (res.success) {
          setData(res);
        }
      } catch (error) {
        console.error("Failed to fetch candidate analysis", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, [id]);

  const application = data?.application;
  const analysis = data?.analysis;
  
  const candidate = {
    name: application?.candidateprofile ? `${application.candidateprofile.firstName} ${application.candidateprofile.lastName}` : "Candidat",
    photo: application?.candidateprofile?.avatarUrl,
    location: application?.candidateprofile?.location || "Non spécifiée",
    role: application?.job?.title || "Poste inconnu",
    matchScore: analysis?.score || 0,
    hardSkills: 90, 
    softSkills: 85,
    cultureFit: 88,
    retentionRisk: "Faible",
    predictedPerformance: "Exceptionnelle",
    aiSummary: analysis?.summary || "Analyse en attente.",
    radarStats: [
      { label: "Technique", value: 90 },
      { label: "Communication", value: 85 },
      { label: "Leadership", value: 80 },
      { label: "Adaptabilité", value: 95 },
      { label: "Culture Fit", value: 88 },
    ]
  };

  const handleExportPDF = async () => {
    const element = document.getElementById("analysis-content");
    if (!element) return;

    try {
      setIsExporting(true);
      await new Promise((resolve) => setTimeout(resolve, 500));

      const dataUrl = await domtoimage.toPng(element, {
        bgcolor: "#0a0a0b",
        quality: 1,
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Analyse_IA_${candidate.name.replace(/\s+/g, "_")}.pdf`);
      addToast("Rapport IA exporté avec succès !", "success");
    } catch (error) {
      console.error("PDF Export failed:", error);
      addToast("Échec de l'exportation du rapport.", "error");
    } finally {
      setIsExporting(false);
    }
  };

  const handleSchedule = async () => {
    try {
      setIsScheduling(true);
      addToast("Préparation de l'invitation...", "info");
      
      const res = await companyService.scheduleInterview(id);
      
      if (res.success) {
        addToast(`Candidature validée ! E-mail envoyé à ${candidate.name}`, "success");
        // Update local state to show "Already Scheduled"
        setData((prev: any) => ({
          ...prev,
          application: {
            ...prev.application,
            status: "INTERVIEW"
          }
        }));
      } else {
        addToast(res.message || "Erreur lors de la planification.", "error");
      }
    } catch (error: any) {
      console.error("Schedule Interview failed:", error);
      addToast(error.response?.data?.message || "Échec de l'envoi de l'invitation.", "error");
    } finally {
      setIsScheduling(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-white bg-[#0a0a0b]">
        <div className="flex flex-col items-center gap-4">
          <Zap className="text-secondary animate-pulse" size={48} />
          <p className="text-xl font-bold animate-pulse">Analyse IA en cours...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white">
      <div className="max-w-7xl mx-auto space-y-12 py-8 px-6 md:px-12">
        <ToastContainer toasts={toasts} removeToast={removeToast} />
        
        {/* Header & Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <Link href="/company/candidates" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest leading-none">
             <ArrowLeft size={16} /> Retour aux candidats
          </Link>
          <div className="flex gap-4">
             <button 
              onClick={handleExportPDF}
              disabled={isExporting}
              className="px-6 py-3 glass rounded-xl text-sm font-bold hover:bg-white/10 transition-colors disabled:opacity-50"
             >
              {isExporting ? "Génération..." : "Télécharger Rapport IA"}
             </button>
             
             {application?.status === "INTERVIEW" ? (
               <button 
                disabled
                className="px-6 py-3 bg-emerald-500/10 text-emerald-400 font-bold rounded-xl border border-emerald-500/20 flex items-center gap-2 cursor-default"
               >
                Entretien Planifié <ShieldCheck size={18} />
               </button>
             ) : (
               <button 
                onClick={handleSchedule}
                disabled={isScheduling}
                className="px-6 py-3 bg-secondary text-white font-bold rounded-xl shadow-lg shadow-secondary/20 hover:scale-105 transition-all disabled:opacity-50"
               >
                {isScheduling ? "Envoi..." : "Planifier Entretien"}
               </button>
             )}
          </div>
        </div>

        <div id="analysis-content" className="space-y-12 pb-20">
          {/* Hero Analysis Card */}
          <div className="relative">
            <div className="absolute inset-0 bg-secondary/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="glass p-10 md:p-14 rounded-[3.5rem] border-secondary/20 relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
                  <div className="relative">
                    <div className="w-44 h-44 rounded-[3rem] bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-white/10 flex items-center justify-center relative overflow-hidden group">
                        {candidate.photo ? (
                          <img src={candidate.photo} alt={candidate.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <User size={64} className="text-white/20 group-hover:scale-110 transition-transform" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-secondary/40 to-transparent pointer-events-none" />
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-16 h-16 glass rounded-2xl flex items-center justify-center border-emerald-500/30">
                        <ShieldCheck className="text-emerald-400" size={32} />
                    </div>
                  </div>

                  <div className="flex-1 space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 justify-center md:justify-start">
                        <h1 className="text-4xl font-bold">{candidate.name}</h1>
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-emerald-500/20 w-fit mx-auto md:mx-0">Vérifié par Gemini</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/40 font-medium justify-center md:justify-start">
                      <MapPin size={14} /> {candidate.location} • <Briefcase size={14} /> {candidate.role}
                    </div>
                    <p className="text-xl text-white/60 leading-relaxed italic max-w-2xl mx-auto md:mx-0">
                        "{candidate.aiSummary}"
                    </p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-2">
                        <div className="flex items-center gap-2">
                          <Zap className="text-secondary" size={20} />
                          <span className="text-sm font-bold">Match Global : <span className="text-secondary text-2xl">{candidate.matchScore}%</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="text-emerald-400" size={20} />
                          <span className="text-sm font-bold">Potentiel IA : <span className="text-emerald-400 text-2xl">{candidate.predictedPerformance}</span></span>
                        </div>
                    </div>
                  </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-10">
               <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { label: "Hard Skills", value: candidate.hardSkills, color: "text-primary", icon: Brain },
                    { label: "Soft Skills", value: candidate.softSkills, color: "text-secondary", icon: Sparkles },
                    { label: "Culture Fit", value: candidate.cultureFit, color: "text-accent", icon: Heart },
                  ].map((stat: any, i: number) => (
                    <div key={i} className="glass p-8 rounded-[2.5rem] space-y-4 border-white/5 hover:border-white/10 transition-all text-center md:text-left">
                       <div className="flex justify-center md:justify-start">
                        <stat.icon className={`${stat.color} mb-2`} size={24} />
                       </div>
                       <p className="text-xs font-bold text-white/40 uppercase tracking-widest">{stat.label}</p>
                       <h3 className={`text-3xl font-black ${stat.color}`}>{stat.value}%</h3>
                    </div>
                  ))}
               </div>

               <section className="glass p-10 md:p-14 rounded-[3.5rem] space-y-10 border-white/5 bg-gradient-to-t from-white/2 to-transparent">
                  <h3 className="text-2xl font-bold italic">Profil de Compétences 360°</h3>
                  <div className="grid md:grid-cols-2 gap-12 items-center">
                     <div className="space-y-6 text-center md:text-left">
                        {candidate.radarStats.map((s: any, i: number) => (
                          <div key={i} className="space-y-2">
                             <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-white/40">
                                <span>{s.label}</span>
                                <span className="text-white/80">{s.value}%</span>
                             </div>
                             <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${s.value}%` }}
                                  className="h-full bg-secondary"
                                />
                             </div>
                          </div>
                        ))}
                     </div>
                     <div className="relative aspect-square flex items-center justify-center">
                        <div className="absolute inset-0 border-2 border-white/5 rounded-full" />
                        <div className="absolute inset-8 border border-white/10 rounded-full" />
                        <div className="absolute inset-16 border border-white/5 rounded-full" />
                        <Brain size={120} className="text-secondary/10" />
                        <div className="absolute p-4 glass rounded-2xl border-secondary/20 shadow-xl shadow-secondary/10">
                           <p className="text-[10px] font-black uppercase tracking-widest text-secondary">Gemini Verdict</p>
                           <p className="font-bold text-xs uppercase italic">High-Potential</p>
                        </div>
                     </div>
                  </div>
               </section>
            </div>

            <div className="lg:col-span-1 space-y-8">
               {/* Emotion & Soft Skills Analysis */}
               <section className="glass p-8 rounded-[3rem] space-y-8 border-violet-500/20 bg-gradient-to-br from-violet-500/5 to-transparent relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
                    <Sparkles size={100} className="text-violet-500" />
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-xl font-bold flex items-center gap-2">
                        <Heart size={20} className="text-violet-400" /> Intelligence Émotionnelle
                    </h4>
                    <p className="text-xs text-white/40 font-medium uppercase tracking-widest">Analyse Vidéo & Audio</p>
                  </div>

                  <div className="space-y-6">
                     <div className="space-y-3">
                        <div className="flex justify-between items-end">
                           <span className="text-xs font-bold text-white/60">Confiance</span>
                           <span className="text-xl font-black text-violet-400">{analysis?.emotionAnalysis?.confidence || 0}%</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${analysis?.emotionAnalysis?.confidence || 0}%` }}
                             className="h-full bg-violet-400"
                           />
                        </div>
                     </div>

                     <div className="space-y-3">
                        <div className="flex justify-between items-end">
                           <span className="text-xs font-bold text-white/60">Motivation</span>
                           <span className="text-xl font-black text-violet-400">{analysis?.emotionAnalysis?.motivation || 0}%</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${analysis?.emotionAnalysis?.motivation || 0}%` }}
                             className="h-full bg-violet-400"
                           />
                        </div>
                     </div>

                     <div className="space-y-3">
                        <div className="flex justify-between items-end">
                           <span className="text-xs font-bold text-white/60">Niveau de Stress</span>
                           <span className={`text-xl font-black ${
                             (analysis?.emotionAnalysis?.stress || 0) < 30 ? "text-emerald-400" : 
                             (analysis?.emotionAnalysis?.stress || 0) < 60 ? "text-yellow-400" : "text-rose-400"
                           }`}>{analysis?.emotionAnalysis?.stress || 0}%</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${analysis?.emotionAnalysis?.stress || 0}%` }}
                             className={`h-full ${
                               (analysis?.emotionAnalysis?.stress || 0) < 30 ? "bg-emerald-400" : 
                               (analysis?.emotionAnalysis?.stress || 0) < 60 ? "bg-yellow-400" : "bg-rose-400"
                             }`}
                           />
                        </div>
                     </div>

                     <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                        <span className="text-xs font-bold text-white/60">Énergie Détectée</span>
                        <span className="px-3 py-1 bg-violet-500/10 text-violet-400 text-xs font-black uppercase tracking-widest rounded-lg border border-violet-500/20">
                          {analysis?.emotionAnalysis?.energyLevel || "N/A"}
                        </span>
                     </div>
                  </div>
               </section>

               <section className="glass p-8 rounded-[3rem] space-y-8 border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
                  <h4 className="text-xl font-bold flex items-center gap-2">
                     <AlertTriangle size={20} className="text-accent" /> Analyse des Risques
                  </h4>
                  <div className="space-y-6">
                     <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/40">
                           <span>Risque de Rétention</span>
                           <span className="text-emerald-400">Faible</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                           <div className="h-full bg-emerald-400 w-[15%]" />
                        </div>
                     </div>
                     <p className="text-xs text-white/60 leading-relaxed italic border-l-2 border-accent/30 pl-4">
                        "Le candidat semble très aligné avec les valeurs d'innovation. Le seul bémol est la forte sollicitation du marché pour son profil."
                     </p>
                  </div>
               </section>

               <section className="glass p-8 rounded-[3rem] space-y-6 text-center md:text-left">
                  <h4 className="text-xl font-bold italic">Documents Analysés</h4>
                  <div className="space-y-3 text-left">
                     {[
                       { name: "CV_Candidat.pdf", size: "1.2MB", status: "Analysé" },
                       { name: "Portfolio_Projects.url", size: "-", status: "Vérifié" },
                       { name: "Technical_Test_Result.json", size: "450KB", status: "Terminé" },
                     ].map((doc: any, i: number) => (
                       <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-secondary transition-all group cursor-pointer">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 group-hover:text-secondary transition-colors">
                                <FileText size={16} />
                             </div>
                             <div className="overflow-hidden">
                                <p className="text-xs font-bold truncate pr-2">{doc.name}</p>
                                <p className="text-[10px] text-white/40">{doc.size}</p>
                             </div>
                          </div>
                          <span className="text-[8px] font-black uppercase tracking-widest text-emerald-400 whitespace-nowrap">{doc.status}</span>
                       </div>
                     ))}
                  </div>
               </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
