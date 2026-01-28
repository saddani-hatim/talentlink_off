"use client";

import { motion } from "framer-motion";
import { Map, ChevronRight, Star, Target, Zap, Trophy, ArrowUpRight, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import candidateService from "@/services/candidate.service";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/Toast";

export default function CareerRoadmap() {
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toasts, removeToast, error } = useToast();

  const fetchRoadmaps = async () => {
    try {
      const data = await candidateService.getRoadmaps();
      setRoadmaps(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des parcours:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      await candidateService.generateRoadmap();
      await fetchRoadmaps();
    } catch (err) {
      console.error("Erreur lors de la génération:", err);
      error("Erreur lors de la génération du parcours par l'IA");
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={48} className="text-primary animate-spin" />
      </div>
    );
  }

  const roadmap = roadmaps[0]; // Take the latest one

  if (!roadmap) {
    return (
      <div className="text-center py-20 glass rounded-[4rem] max-w-3xl mx-auto px-6">
        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Map size={40} className="text-primary" />
        </div>
        <h2 className="text-3xl font-bold mb-4">Votre Roadmap IA</h2>
        <p className="text-white/40 mb-10 max-w-md mx-auto">
          Prêt à passer au niveau supérieur ? Notre IA analyse votre profil et vos projets pour créer un parcours d'apprentissage sur-mesure.
        </p>
        <button 
          onClick={handleGenerate}
          disabled={isGenerating}
          className="px-10 py-5 bg-primary text-white font-bold rounded-2xl hover:opacity-90 transition-all shadow-xl shadow-primary/20 flex items-center gap-3 mx-auto disabled:opacity-50">
          {isGenerating ? (
            <>
              <Loader2 size={24} className="animate-spin" />
              Génération en cours...
            </>
          ) : (
            <>
              <Zap size={24} />
              Générer mon parcours personnalisé
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-40">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="text-center md:text-left">
        <h1 className="text-4xl font-bold mb-3 flex items-center justify-center md:justify-start gap-3">
          {roadmap.title} <Map className="text-secondary" />
        </h1>
        <p className="text-white/60">Parcours personnalisé généré par Gemini pour atteindre vos objectifs.</p>
      </div>

      <div className="relative max-w-3xl mx-auto py-10">
        <div className="absolute left-[2.25rem] top-0 bottom-0 w-0.5 bg-white/5 overflow-hidden">
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: "100%" }}
            transition={{ duration: 1.5 }}
            className="w-full bg-gradient-to-b from-primary to-secondary"
          />
        </div>

        <div className="space-y-16">
          {roadmap.steps?.map((step: any, i: number) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.2 }}
              className="flex gap-10 relative group"
            >
              <div className={`relative z-10 w-18 h-18 rounded-2xl flex items-center justify-center shrink-0 border-2 transition-all duration-500 bg-background ${
                step.isCompleted ? 'border-primary bg-primary/10' :
                (!step.isCompleted && i === roadmap.steps.findIndex((s: any) => !s.isCompleted)) ? 'border-primary animate-pulse' :
                'border-white/10'
              }`}>
                {i === 0 ? <Target size={24} className="text-primary" /> : 
                 i === roadmap.steps.length - 1 ? <Trophy size={24} className="text-secondary" /> :
                 <Zap size={24} className={step.isCompleted ? 'text-primary' : 'text-white/20'} />}
              </div>

              <div className={`flex-1 glass p-8 rounded-[2rem] transition-all group-hover:border-primary/30 ${
                step.status === 'GOAL' ? 'border-secondary/50 bg-secondary/5' : ''
              }`}>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  {(!step.isCompleted && i === roadmap.steps.findIndex((s: any) => !s.isCompleted)) && (
                    <span className="text-[10px] font-black uppercase tracking-widest bg-primary text-white px-2 py-1 rounded-md">
                      En cours
                    </span>
                  )}
                </div>
                <p className="text-white/60 mb-6">{step.description}</p>
                
                 {(!step.isCompleted && i === roadmap.steps.findIndex((s: any) => !s.isCompleted)) && (
                  <div className="space-y-4">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                      <span>Progression</span>
                      <span className="text-primary">50%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "50%" }}
                        className="h-full bg-primary"
                      />
                    </div>
                    <div className="flex gap-3 mt-4">
                      <a 
                        href={`https://www.google.com/search?q=Apprendre+${encodeURIComponent(step.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-primary font-bold hover:gap-3 transition-all inline-flex"
                      >
                        Continuer la formation <ArrowUpRight size={16} />
                      </a>
                      <button 
                        onClick={async () => {
                          try {
                            await candidateService.updateRoadmapStep(step.id, true);
                            fetchRoadmaps();
                          } catch (err) {
                            error("Impossible de valider l'étape");
                          }
                        }}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg transition-colors"
                      >
                        Valider l'étape
                      </button>
                    </div>
                  </div>
                )}

                {(!step.isCompleted && i > roadmap.steps.findIndex((s: any) => !s.isCompleted)) && (
                  <button className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white/40 cursor-not-allowed">
                    Étape suivante
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
