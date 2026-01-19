"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Play, Save, CheckCircle2, Clock, Trophy, Code2, Terminal, Lightbulb, FileText, Sparkles, Layout, Database, Cpu, Brain } from "lucide-react";
import Link from "next/link";
import { useState, use } from "react";

export default function CandidateProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const project = {
    id: id,
    title: "Optimisation de Performance React",
    status: "En cours",
    progress: 65,
    difficulty: "Expert",
    points: 120,
    category: "Frontend",
    duration: "1h 00m",
    lastEdited: "Il y a 2 heures",
    description: "Dans ce défi, vous devez optimiser une application de tableau de bord complexe qui souffre de lags de rendu lors de la mise à jour de flux de données en temps réel.",
    milestones: [
      { name: "Analyse du Bundle", status: "completed" },
      { name: "Optimisation des Renders", status: "current" },
      { name: "Implémentation du Cache", status: "pending" },
      { name: "Tests de Performance", status: "pending" },
    ]
  };

  return (
    <div className="space-y-12 py-8 px-6 md:px-12">
      {/* Header & Breadcrumbs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <Link href="/candidate/tests" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
           <ArrowLeft size={16} /> Retour aux tests
        </Link>
        <div className="flex gap-4">
           <button className="px-6 py-3 glass rounded-xl text-sm font-bold hover:bg-white/10 transition-colors">Sauvegarder Brouillon</button>
           <Link href={`/candidate/tests/${project.id}`} className="px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform flex items-center gap-2">
              Continuer le Projet <Play size={16} fill="currentColor" />
           </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Left Column: Project Overview */}
        <div className="lg:col-span-2 space-y-10">
           <section className="glass p-10 md:p-14 rounded-[3.5rem] space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10">
                 <div className={`p-4 rounded-2xl bg-primary/10 text-primary`}>
                    <Layout size={32} />
                 </div>
              </div>
              
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-lg">Frontend</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{project.duration} restants</span>
                 </div>
                 <h1 className="text-4xl md:text-5xl font-bold">{project.title}</h1>
                 <p className="text-xl text-white/60 leading-relaxed italic max-w-2xl">
                    "{project.description}"
                 </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 pt-6">
                 <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Difficulté</p>
                    <p className="text-lg font-bold text-accent italic">{project.difficulty}</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Récompense Max</p>
                    <p className="text-lg font-bold text-emerald-400 italic">+{project.points} XP</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Dernière modification</p>
                    <p className="text-lg font-bold text-white/80">{project.lastEdited}</p>
                 </div>
              </div>
           </section>

           <section className="glass p-10 md:p-14 rounded-[3.5rem] space-y-10 border-white/5">
              <h3 className="text-2xl font-bold italic">Progression du Projet</h3>
              <div className="space-y-12">
                 <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm font-bold uppercase tracking-widest text-white/40">
                       <span>Avancement Global</span>
                       <span className="text-primary">{project.progress}%</span>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${project.progress}%` }}
                         className="h-full bg-gradient-to-r from-primary to-secondary rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                       />
                    </div>
                 </div>

                 <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {project.milestones.map((m, i) => (
                      <div key={i} className={`p-6 rounded-[2rem] border transition-all text-center space-y-4 ${
                        m.status === 'completed' ? 'glass border-emerald-500/30' : 
                        m.status === 'current' ? 'glass border-primary border-2 shadow-lg shadow-primary/10' : 
                        'glass border-white/5 opacity-40'
                      }`}>
                         <div className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center ${
                           m.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 
                           m.status === 'current' ? 'bg-primary/20 text-primary animate-pulse' : 
                           'bg-white/5 text-white/20'
                         }`}>
                           {m.status === 'completed' ? <CheckCircle2 size={24} /> : (i + 1)}
                         </div>
                         <p className="text-[10px] font-black uppercase tracking-widest leading-tight">{m.name}</p>
                      </div>
                    ))}
                 </div>
              </div>
           </section>
        </div>

        {/* Right Column: AI Assistant & Resources */}
        <div className="lg:col-span-1 space-y-10">
           <section className="glass p-8 rounded-[3rem] border-secondary/30 bg-gradient-to-br from-secondary/5 to-transparent relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-40 group-hover:opacity-100 transition-opacity">
                 <Sparkles className="text-secondary animate-pulse" />
              </div>
              <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
                 <Brain className="text-secondary" /> Assistant Gemini
              </h4>
              <div className="space-y-6">
                 <div className="p-4 bg-secondary/5 border border-secondary/20 rounded-2xl italic text-xs leading-relaxed text-white/60">
                    "J'ai remarqué que vous passez beaucoup de temps sur l'Optimisation des Renders. Jetez un œil à l'utilisation de `useTransition` pour vos flux de données complexes !"
                 </div>
                 <button className="w-full py-4 glass rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-colors text-secondary">
                    Demander un conseil
                 </button>
              </div>
           </section>

           <section className="glass p-8 rounded-[3rem] space-y-6">
              <h4 className="text-xl font-bold italic">Ressources du Projet</h4>
              <div className="space-y-3">
                 {[
                   { name: "Documentation API", icon: FileText, type: "PDF" },
                   { name: "Schéma Database", icon: Database, type: "SVG" },
                   { name: "Styleguide Entreprise", icon: Code2, type: "URL" },
                 ].map((res, i) => (
                   <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-primary transition-all group cursor-pointer">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 group-hover:text-primary transition-colors">
                            <res.icon size={16} />
                         </div>
                         <p className="text-xs font-bold">{res.name}</p>
                      </div>
                      <span className="text-[8px] font-black uppercase tracking-widest text-white/20">{res.type}</span>
                   </div>
                 ))}
              </div>
           </section>

           <section className="glass p-8 rounded-[3rem] text-center space-y-6 bg-gradient-to-t from-emerald-500/10 to-transparent border-emerald-500/20">
              <Trophy size={48} className="text-emerald-400 mx-auto" />
              <div className="space-y-2">
                 <h4 className="text-xl font-bold">Objectif</h4>
                 <p className="text-xs text-white/40 max-w-xs mx-auto">Complétez ce projet avec un score supérieur à 90% pour être directement recommandé au CTO de CyberTech.</p>
              </div>
           </section>
        </div>
      </div>
    </div>
  );
}
