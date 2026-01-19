"use client";

import { motion } from "framer-motion";
import { FolderHeart, Play, CheckCircle2, Clock, Trophy, ArrowRight, Layout, Brain, Sparkles, Sliders, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import candidateService from "@/services/candidate.service";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/Toast";

export default function MyProjects() {
  const [filter, setFilter] = useState("all");
  const [projects, setProjects] = useState<any[]>([]);
  const [aiTests, setAiTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeAiTest, setActiveAiTest] = useState<any>(null);
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);
  const { toasts, removeToast, error: toastError } = useToast();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await candidateService.getProjects();
        setProjects(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des projets:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();

    const fetchAiTests = async () => {
      try {
        const data = await candidateService.getAiTests();
        setAiTests(data);
      } catch (error) {
        console.error("Erreur tests IA:", error);
      }
    };
    fetchAiTests();
  }, []);

  const handleSubmitAi = async () => {
    if (!activeAiTest || !code) return;
    try {
      setSubmitting(true);
      const result = await candidateService.submitAiChallenge(activeAiTest.id, code);
      setEvaluationResult(result);
      // Wait a bit to show success then close or update
    } catch (error) {
      toastError("Erreur lors de l'évaluation");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'Soumis';
      case 'IN_PROGRESS': return 'En cours';
      default: return 'Brouillon';
    }
  };

  const filteredProjects = filter === "all" 
    ? projects 
    : projects.filter(p => getStatusLabel(p.status).toLowerCase() === filter.toLowerCase());

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={48} className="text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-12 py-8 pb-40">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold flex items-center gap-4">
             Mes Mini-Projets <FolderHeart className="text-primary" />
          </h1>
          <p className="text-white/40 text-lg leading-relaxed max-w-2xl">
            Gérez vos défis techniques en cours et suivez l'évolution de vos compétences analysées par l'IA.
          </p>
        </div>
        <div className="flex p-1.5 glass rounded-2xl border-white/5">
           {["all", "En cours", "Soumis", "Brouillon"].map(f => (
             <button
               key={f}
               onClick={() => setFilter(f)}
               className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                 filter === f ? 'bg-primary text-white shadow-lg' : 'text-white/40 hover:text-white'
               }`}
             >
               {f === "all" ? "Tous" : f}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-8 rounded-[3rem] border border-white/5 hover:border-primary/20 transition-all group flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                 <div className={`p-4 rounded-2xl bg-primary/10 text-primary`}>
                    <Layout size={28} />
                 </div>
                 <div className="text-right">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border ${
                      p.status === 'COMPLETED' ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' :
                      p.status === 'IN_PROGRESS' ? 'text-primary border-primary/20 bg-primary/5' :
                      'text-white/20 border-white/10'
                    }`}>
                       {getStatusLabel(p.status)}
                    </span>
                    <p className="text-[10px] text-white/20 mt-2 font-bold italic">Récemment</p>
                 </div>
              </div>

              <div>
                 <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{p.title}</h3>
                 <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mt-1">{p.technology} • {p.difficulty || "Mixte"}</p>
              </div>

              <div className="space-y-3">
                 <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/40">
                    <span>Progression</span>
                    <span>{p.status === 'COMPLETED' ? 100 : 50}%</span>
                 </div>
                 <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${p.status === 'COMPLETED' ? 100 : 50}%` }}
                      className={`h-full ${p.status === 'COMPLETED' ? 'bg-emerald-400' : 'bg-primary'}`}
                    />
                 </div>
              </div>
            </div>

            <div className="pt-8">
               {p.status === 'COMPLETED' ? (
                 <Link 
                   href={`/candidate/tests/${p.id}/analysis`}
                   className="w-full py-4 glass rounded-2xl flex items-center justify-center gap-2 font-bold text-sm hover:bg-white/10 transition-all border-emerald-500/20 text-emerald-400"
                 >
                   Voir l'analyse IA <Sparkles size={16} />
                 </Link>
               ) : (
                 <Link 
                   href={`/candidate/projects/${p.id}`}
                   className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm hover:bg-primary hover:border-primary transition-all group/btn"
                 >
                   Continuer <ArrowRight size={18} className="translate-x-0 group-hover/btn:translate-x-2 transition-transform" />
                 </Link>
               )}
            </div>
          </motion.div>
        ))}

        {/* AI Challenges Section */}
        {aiTests.map((test, i) => (
          <motion.div
            key={test.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-8 rounded-[3rem] border border-primary/30 relative overflow-hidden group flex flex-col justify-between bg-primary/5 shadow-2xl shadow-primary/10"
          >
             <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Sparkles size={80} className="text-primary" />
             </div>
             
             <div className="space-y-6 relative z-10">
                <div className="flex justify-between items-start">
                   <div className="p-4 rounded-2xl bg-primary text-white">
                      <Brain size={28} />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg bg-primary/20 text-primary border border-primary/30">
                      Défi IA
                   </span>
                </div>

                <div>
                   <h3 className="text-xl font-bold">{test.title}</h3>
                   <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mt-1">{test.category} • {test.difficulty}</p>
                </div>

                <p className="text-sm text-white/60 line-clamp-3">
                   {test.description}
                </p>
             </div>

             <div className="pt-8 relative z-10">
                <button 
                  onClick={() => setActiveAiTest(test)}
                  className="w-full py-4 bg-primary text-white rounded-2xl flex items-center justify-center gap-2 font-bold text-sm hover:opacity-90 transition-all"
                >
                  Relever le défi <ArrowRight size={18} />
                </button>
             </div>
          </motion.div>
        ))}

        {/* New Project CTA */}
        <Link 
          href="/candidate/tests"
          className="glass p-8 rounded-[3rem] border border-dashed border-white/10 flex flex-col items-center justify-center gap-6 hover:border-primary group transition-all min-h-[350px]"
        >
           <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-all">
              <Play size={32} />
           </div>
           <div className="text-center">
              <p className="font-bold text-lg">Nouveau Défi</p>
              <p className="text-xs text-white/40">Parcourez les mini-projets disponibles</p>
           </div>
        </Link>
      </div>

      {/* Global AI Status */}
      <section className="glass p-10 md:p-14 rounded-[4rem] relative overflow-hidden bg-gradient-to-r from-primary/10 to-transparent flex flex-col md:flex-row items-center gap-10">
         <div className="w-24 h-24 rounded-3xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/40">
            <Trophy size={48} className="text-white" />
         </div>
         <div className="flex-1 space-y-4 text-center md:text-left">
            <h3 className="text-2xl font-bold italic">Top de votre forme technique !</h3>
            <p className="text-white/60 leading-relaxed max-w-xl">
               Basé sur vos {projects.length} projets, Gemini analyse votre progression en temps réel pour vous proposer les meilleures opportunités.
            </p>
         </div>
         <Link href="/candidate/portfolio" className="px-8 py-4 glass rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white/10 transition-colors">
            Voir mon Portfolio
         </Link>
      </section>

      {/* AI CHALLENGE MODAL */}
      {activeAiTest && !evaluationResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-10">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setActiveAiTest(null)} />
          <motion.div 
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="relative w-full max-w-4xl glass rounded-[3rem] border border-white/10 overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
               <div>
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                     <Brain className="text-primary" /> {activeAiTest.title}
                  </h2>
                  <p className="text-white/40 text-xs font-black uppercase tracking-widest mt-1">
                     {activeAiTest.category} • {activeAiTest.difficulty}
                  </p>
               </div>
               <button onClick={() => setActiveAiTest(null)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <Clock size={24} className="text-white/20" />
               </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
               <div className="space-y-4">
                  <h3 className="text-lg font-bold">Énoncé du défi</h3>
                  <div className="p-6 bg-white/5 rounded-2xl text-white/60 leading-relaxed whitespace-pre-wrap">
                     {activeAiTest.description}
                  </div>
               </div>

               <div className="space-y-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                     <Sliders size={20} className="text-primary" /> Votre solution (Code)
                  </h3>
                  <textarea 
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Collez votre code ici ou commencez à coder..."
                    className="w-full h-80 bg-black/40 border border-white/10 rounded-2xl p-6 font-mono text-sm focus:border-primary/50 transition-all outline-none resize-none"
                  />
               </div>
            </div>

            <div className="p-8 border-t border-white/5 bg-white/5 flex justify-end gap-4">
               <button 
                 onClick={() => setActiveAiTest(null)}
                 className="px-8 py-4 font-bold text-white/40 hover:text-white transition-colors"
               >
                 Annuler
               </button>
               <button 
                 disabled={submitting || !code}
                 onClick={handleSubmitAi}
                 className="px-10 py-4 bg-primary text-white font-bold rounded-2xl hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
               >
                 {submitting ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
                 Évaluer ma solution
               </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* EVALUATION RESULT MODAL */}
      {evaluationResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-10">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => { setEvaluationResult(null); setActiveAiTest(null); }} />
          <motion.div 
             initial={{ scale: 0.9, opacity: 0, y: 50 }}
             animate={{ scale: 1, opacity: 1, y: 0 }}
             className="relative w-full max-w-4xl glass rounded-[4rem] border border-white/10 overflow-hidden"
          >
            <div className="p-10 flex flex-col md:flex-row gap-10">
               <div className="flex-1 space-y-8">
                  <div className="flex justify-between items-start">
                     <div>
                        <h2 className="text-3xl font-bold flex items-center gap-3 italic">
                           Résultat de l'analyse <Sparkles className="text-primary" />
                        </h2>
                        <p className={`text-sm font-black uppercase tracking-widest mt-2 ${evaluationResult.status === 'PASSED' ? 'text-emerald-400' : 'text-red-400'}`}>
                           DÉFI {evaluationResult.status === 'PASSED' ? 'RÉUSSI' : 'ÉCHOUÉ'} • {evaluationResult.score}/100
                        </p>
                     </div>
                     {!evaluationResult.isOriginal && (
                        <div className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-[10px] font-black uppercase">
                           ⚠️ Plagiat potentiel détecté
                        </div>
                     )}
                  </div>

                  <div className="space-y-4">
                     <h3 className="font-bold flex items-center gap-2 text-primary">
                        <Trophy size={20} /> Feedback Technique
                     </h3>
                     <p className="text-white/60 leading-relaxed">
                        {evaluationResult.feedback}
                     </p>
                  </div>

                  <div className="p-6 bg-white/5 rounded-3xl border border-white/5 italic text-sm text-white/40">
                     <p className="font-bold mb-2">Analyse structurelle :</p>
                     {evaluationResult.aiAnalysis}
                  </div>
               </div>

               <div className="w-full md:w-72 space-y-6 flex flex-col justify-center">
                  {[
                    { label: "Logique", value: evaluationResult.logicScore },
                    { label: "Qualité", value: evaluationResult.qualityScore },
                    { label: "Structure", value: evaluationResult.structureScore },
                    { label: "Performance", value: evaluationResult.performanceScore },
                  ].map(score => (
                    <div key={score.label} className="space-y-2">
                       <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
                          <span>{score.label}</span>
                          <span className="text-white">{score.value}%</span>
                       </div>
                       <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${score.value}%` }}
                            className="h-full bg-primary"
                          />
                       </div>
                    </div>
                  ))}

                  <button 
                    onClick={() => { setEvaluationResult(null); setActiveAiTest(null); window.location.reload(); }}
                    className="w-full py-5 bg-white text-black font-black uppercase text-xs tracking-widest rounded-2xl mt-4 hover:bg-white/90 transition-all"
                  >
                    Fermer le rapport
                  </button>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
