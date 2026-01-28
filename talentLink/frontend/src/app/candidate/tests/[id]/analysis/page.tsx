"use client";

import { motion } from "framer-motion";
import { Sparkles, Trophy, Target, Zap, ArrowLeft, ArrowRight, Brain, UserCheck, Flame, Cpu } from "lucide-react";
import Link from "next/link";

import { use } from "react";

export default function TestAnalysisPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const analysis = {
    score: 92,
    rank: "Top 3%",
    strengths: ["Clean Code", "Optimisation React", "Gestion d'État"],
    weaknesses: ["Tests Unitaires", "Sécurité des Entrées"],
    feedback: "Votre solution pour la gestion de l'immutabilité est remarquable. Vous avez réduit les re-rendus de 85%, ce qui dépasse la moyenne des candidats seniors.",
    potential: "Architecte Fullstack",
  };

  return (
    <div className="space-y-12 py-8">
      {/* Header Container */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <Link href="/candidate/tests" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
           <ArrowLeft size={16} /> Retour aux tests
        </Link>
        <div className="flex gap-4">
           <button className="px-6 py-3 glass rounded-xl text-sm font-bold hover:bg-white/10 transition-colors">Partager sur LinkedIn</button>
           <Link href="/candidate/portfolio" className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:opacity-90 transition-opacity">Ajouter au Portfolio</Link>
        </div>
      </div>

      {/* Main Score & Hero */}
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="glass p-10 md:p-16 rounded-[4rem] flex flex-col md:flex-row items-center gap-12 border-primary/20">
           <div className="relative">
              <div className="w-48 h-48 rounded-[3.5rem] border-4 border-primary/30 flex items-center justify-center relative overflow-hidden">
                 <div className="absolute inset-2 border-2 border-dashed border-white/10 rounded-[2.5rem] animate-spin-slow" />
                 <h2 className="text-6xl font-black gradient-text">{analysis.score}</h2>
              </div>
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-white text-black font-black rounded-2xl flex items-center justify-center shadow-2xl rotate-12">
                 <Trophy size={24} />
              </div>
           </div>

           <div className="flex-1 space-y-6 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 rounded-lg text-primary text-[10px] font-black uppercase tracking-widest">
                 <Sparkles size={12} /> Analyse Gemini 3.0
              </div>
              <h1 className="text-4xl md:text-5xl font-bold">Excellent Résultat !</h1>
              <p className="text-xl text-white/60 leading-relaxed italic">
                 "{analysis.feedback}"
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
                 <div className="flex items-center gap-3 glass px-6 py-3 rounded-2xl">
                    <UserCheck className="text-emerald-400" />
                    <span className="font-bold">{analysis.rank} mondial</span>
                 </div>
                 <div className="flex items-center gap-3 glass px-6 py-3 rounded-2xl">
                    <Flame className="text-accent" />
                    <span className="font-bold">Score Technique : 850 pts</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Detailed Insights */}
        <div className="lg:col-span-2 grid md:grid-cols-2 gap-8">
           <section className="glass p-10 rounded-[3rem] space-y-8 h-fit">
              <h3 className="text-2xl font-bold flex items-center gap-3">
                 <Target className="text-primary" /> Points Forts
              </h3>
              <div className="space-y-4">
                 {analysis.strengths.map(s => (
                   <div key={s} className="flex items-center gap-3 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl group hover:bg-emerald-500/10 transition-colors">
                      <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                         <Zap size={14} />
                      </div>
                      <span className="font-bold text-sm">{s}</span>
                   </div>
                 ))}
              </div>
           </section>

           <section className="glass p-10 rounded-[3rem] space-y-8 h-fit">
              <h3 className="text-2xl font-bold flex items-center gap-3">
                 <Brain className="text-accent" /> À Améliorer
              </h3>
              <div className="space-y-4">
                 {analysis.weaknesses.map(w => (
                   <div key={w} className="flex items-center gap-3 p-4 bg-accent/5 border border-accent/20 rounded-2xl group hover:bg-accent/10 transition-colors">
                      <div className="w-6 h-6 rounded-lg bg-accent/20 flex items-center justify-center text-accent">
                         <Target size={14} />
                      </div>
                      <span className="font-bold text-sm text-white/70">{w}</span>
                   </div>
                 ))}
              </div>
           </section>

           <section className="md:col-span-2 glass p-10 md:p-14 rounded-[4rem] relative overflow-hidden group">
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary/10 blur-[100px] pointer-events-none" />
              <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                 <div className="space-y-6 flex-1">
                    <h3 className="text-3xl font-bold italic">Votre Potentiel de Carrière</h3>
                    <p className="text-lg text-white/50 leading-relaxed">
                       Selon vos performances sur ce test et vos projets précédents, vous avez le profil idéal pour évoluer vers un poste de :
                    </p>
                    <div className="inline-block px-10 py-5 bg-gradient-to-r from-primary to-secondary text-white font-black text-2xl rounded-3xl shadow-xl shadow-primary/20 group-hover:scale-105 transition-transform">
                       {analysis.potential}
                    </div>
                 </div>
                 <div className="w-48 h-48 rounded-[3rem] bg-white/5 border border-white/10 flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform">
                    <Cpu size={64} className="text-white/20" />
                 </div>
              </div>
           </section>
        </div>

        {/* Next Steps / Suggested Jobs */}
        <div className="lg:col-span-1 space-y-8">
           <section className="glass p-8 rounded-[3rem] border-secondary/30 bg-gradient-to-br from-secondary/5 to-transparent">
              <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
                 <Sparkles className="text-secondary" /> Jobs Recommandés
              </h4>
              <div className="space-y-4">
                 {[
                   { company: "FinTech Pro", role: "Sr. Frontend Dev", match: 98 },
                   { company: "DataAI", role: "Software Architect", match: 94 },
                 ].map((job, i) => (
                   <div key={i} className="p-5 glass rounded-2xl flex justify-between items-center group cursor-pointer hover:bg-white/5 transition-colors">
                      <div>
                         <p className="font-bold text-sm group-hover:text-primary transition-colors">{job.company}</p>
                         <p className="text-xs text-white/40">{job.role}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-primary font-black">{job.match}%</p>
                         <p className="text-[10px] uppercase font-bold text-white/20">Match</p>
                      </div>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold text-sm hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                 Voir tout <ArrowRight size={16} />
              </button>
           </section>

           <section className="glass p-8 rounded-[3rem] text-center space-y-6">
              <p className="text-sm font-bold text-white/40 uppercase tracking-widest">Temps Moyen des Candidats</p>
              <div className="text-4xl font-black">42:15<span className="text-xs text-white/20 ml-2">min</span></div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-primary" style={{ width: '70%' }} />
              </div>
              <p className="text-[10px] text-white/40 italic">Vous avez été 18% plus rapide que la moyenne.</p>
           </section>
        </div>
      </div>
    </div>
  );
}
