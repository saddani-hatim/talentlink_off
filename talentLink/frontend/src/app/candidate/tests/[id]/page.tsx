"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Play, Save, CheckCircle2, Clock, Trophy, Code2, Terminal, Lightbulb, Plus, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, use } from "react";
import candidateService from "@/services/candidate.service";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/Toast";

export default function TestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [test, setTest] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(3600);
  const [activeTab, setActiveTab] = useState("App.tsx");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timerStarted, setTimerStarted] = useState(false);
  const [language, setLanguage] = useState("javascript");
  const [framework, setFramework] = useState("react");
  const [files, setFiles] = useState<{name: string, content: string}[]>([{
    name: "App.tsx",
    content: `import React, { useState, useEffect } from 'react';\nimport { DashboardLayout } from './components';\n\nconst Dashboard = () => {\n  const [data, setData] = useState([]);\n\n  // TODO: Optimiser ce useEffect qui cause des re-rendus\n  useEffect(() => {\n    const socket = new WebSocket('wss://api.talentlink.ai/v3/feed');\n    socket.onmessage = (event) => {\n      setData(prev => [...prev, JSON.parse(event.data)]);\n    };\n  }, []);\n\n  return (\n    <DashboardLayout>\n      {data.map(item => (\n         <MetricCard key={item.id} {...item} />\n      ))}\n    </DashboardLayout>\n  );\n};\n`
  }]);
  const { toasts, removeToast, success, error, info, warning } = useToast();

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const data = await candidateService.getTest(id);
        if (data) {
           setTest(data);
           setTimeLeft(data.duration * 60);
        }
      } catch (error) {
        console.error("Erreur chargement test:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [id]);

  // Timer countdown
  useEffect(() => {
    if (!timerStarted || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          warning("Temps écoulé ! Veuillez soumettre votre test.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerStarted, timeLeft]);

  const handleSubmit = async () => {
    if (!timerStarted) {
      warning("Veuillez démarrer le test avant de soumettre.");
      return;
    }
    const currentCode = getCurrentFile().content;
    if (!currentCode || !currentCode.trim()) {
      error("Veuillez écrire du code avant de soumettre.");
      return;
    }

    try {
      setSubmitting(true);
      const result = await candidateService.submitTestResult(id, currentCode);
      success(`Test soumis avec succès ! Score IA: ${result.score}/100. Un email a été envoyé.`);
      setTimeout(() => window.location.href = '/candidate/tests', 2000);
    } catch (err: any) {
      console.error("Erreur soumission:", err);
      error("Erreur lors de la soumission");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSave = () => {
    localStorage.setItem(`test_${id}_files`, JSON.stringify(files));
    localStorage.setItem(`test_${id}_language`, language);
    localStorage.setItem(`test_${id}_framework`, framework);
    success("Code sauvegardé localement !");
  };

  const handleRun = () => {
    if (!timerStarted) {
      setTimerStarted(true);
      info("Test démarré ! Le chronomètre est lancé.");
    } else {
      info("Code exécuté ! Vérifiez la console du terminal ci-dessous.");
    }
  };

  const addNewFile = () => {
    const fileName = prompt("Nom du fichier (ex: utils.ts, styles.css):");
    if (fileName && !files.find(f => f.name === fileName)) {
      setFiles([...files, { name: fileName, content: "// Nouveau fichier\n" }]);
      setActiveTab(fileName);
    } else if (fileName) {
      warning("Un fichier avec ce nom existe déjà !");
    }
  };

  const deleteFile = (fileName: string) => {
    if (files.length === 1) {
      warning("Vous devez garder au moins un fichier !");
      return;
    }
    if (confirm(`Supprimer ${fileName} ?`)) {
      const newFiles = files.filter(f => f.name !== fileName);
      setFiles(newFiles);
      if (activeTab === fileName) {
        setActiveTab(newFiles[0].name);
      }
    }
  };

  const updateFileContent = (fileName: string, content: string) => {
    setFiles(files.map(f => f.name === fileName ? { ...f, content } : f));
  };

  const getCurrentFile = () => files.find(f => f.name === activeTab) || files[0];

  if (loading || !test) {
     return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">Chargement...</div>;
  }

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col pt-20">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      {/* Top Bar */}
      <div className="fixed top-20 left-0 right-0 z-40 glass border-b border-white/5 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/candidate/tests" className="p-2 hover:bg-white/5 rounded-xl transition-colors text-white/40 hover:text-white">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-3">
              {test.title}
              <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-md uppercase font-black tracking-widest">{test.difficulty}</span>
            </h1>
            <p className="text-xs text-white/20 font-medium">Mini-Projet ID: {id}</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 glass px-4 py-2 rounded-xl border-accent/20">
             <Clock size={18} className="text-accent" />
             <span className="font-mono font-bold text-lg text-accent">{formatTime(timeLeft)}</span>
          </div>
          <button 
             onClick={handleSubmit} 
             disabled={submitting}
             className="px-6 py-2.5 bg-emerald-500 text-white font-black rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50">
            {submitting ? 'Envoi...' : 'Soumettre'} <CheckCircle2 size={18} />
          </button>
        </div>
      </div>

      {/* Main Content Split View */}
      <div className="flex-1 flex flex-col lg:flex-row mt-16">
        {/* Left Side: Instructions & Tasks */}
        <div className="w-full lg:w-1/3 border-r border-white/5 p-8 lg:p-12 overflow-y-auto space-y-10">
          <div className="space-y-4">
             <h2 className="text-2xl font-bold text-white/80">Description</h2>
             <p className="text-white/40 leading-relaxed italic border-l-2 border-primary/50 pl-6">
                "{test.description}"
             </p>
          </div>

          <div className="space-y-6">
             <h3 className="text-xl font-bold flex items-center gap-2">
                <Trophy className="text-primary" size={20} /> Détails
             </h3>
             <div className="space-y-4">
                 <div className="flex gap-4 p-4 glass rounded-2xl border-white/5">
                     <span className="text-white/60">Difficulté: {test.difficulty}</span>
                 </div>
                 <div className="flex gap-4 p-4 glass rounded-2xl border-white/5">
                     <span className="text-white/60">Catégorie: {test.category}</span>
                 </div>
             </div>
          </div>

          <div className="p-6 bg-secondary/5 border border-secondary/20 rounded-[2rem] space-y-4">
             <h4 className="font-bold flex items-center gap-2">
                <Lightbulb className="text-secondary" size={18} /> Gemini Note
             </h4>
             <p className="text-xs text-white/50 leading-relaxed italic">
                Pensez à utiliser Profiler API de React DevTools pour identifier visuellement les sources de contention avant d'optimiser.
             </p>
          </div>
        </div>

        {/* Right Side: IDE-like Editor Simulation */}
        <div className="flex-1 bg-[#0a0a0a] flex flex-col relative">
           {/* Language and Framework Selectors */}
           <div className="flex items-center gap-4 p-4 bg-white/5 border-b border-white/10">
              <div className="flex items-center gap-2">
                 <label className="text-xs text-white/40 font-bold uppercase">Langage:</label>
                 <select 
                   value={language}
                   onChange={(e) => setLanguage(e.target.value)}
                   className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-xs text-white outline-none focus:border-primary"
                 >
                   <option value="javascript">JavaScript</option>
                   <option value="typescript">TypeScript</option>
                   <option value="python">Python</option>
                   <option value="java">Java</option>
                   <option value="csharp">C#</option>
                 </select>
              </div>
              <div className="flex items-center gap-2">
                 <label className="text-xs text-white/40 font-bold uppercase">Framework:</label>
                 <select 
                   value={framework}
                   onChange={(e) => setFramework(e.target.value)}
                   className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-xs text-white outline-none focus:border-primary"
                 >
                   <option value="react">React</option>
                   <option value="vue">Vue</option>
                   <option value="angular">Angular</option>
                   <option value="nextjs">Next.js</option>
                   <option value="express">Express</option>
                   <option value="django">Django</option>
                   <option value="spring">Spring</option>
                   <option value="none">Aucun</option>
                 </select>
              </div>
           </div>

           {/* File Tabs */}
           <div className="flex items-center p-px bg-white/5 border-b border-white/5 overflow-x-auto">
              {files.map((file) => (
                <div key={file.name} className="flex items-center group">
                  <button 
                    onClick={() => setActiveTab(file.name)}
                    className={`px-6 py-3 text-xs font-bold border-r border-white/5 transition-all ${
                      activeTab === file.name ? "bg-white/5 text-primary border-b-2 border-primary" : "text-white/40 hover:bg-white/5"
                    }`}
                  >
                    {file.name}
                  </button>
                  {files.length > 1 && (
                    <button
                      onClick={() => deleteFile(file.name)}
                      className="px-2 py-3 text-white/20 hover:text-accent hover:bg-accent/10 transition-colors border-r border-white/5"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addNewFile}
                className="px-4 py-3 text-white/40 hover:text-primary hover:bg-white/5 transition-colors flex items-center gap-2 text-xs font-bold"
              >
                <Plus size={14} /> Nouveau fichier
              </button>
           </div>

           <div className="flex-1 p-8 font-mono text-sm leading-relaxed overflow-auto relative">
              <textarea
                value={getCurrentFile().content}
                onChange={(e) => updateFileContent(activeTab, e.target.value)}
                className="w-full h-full bg-transparent text-white/80 resize-none outline-none border-none font-mono text-sm leading-relaxed"
                placeholder="Écrivez votre code ici..."
                spellCheck={false}
              />
           </div>

           {/* Terminal Output Simulation */}
           <div className="h-40 glass border-t border-white/10 p-6 font-mono text-[10px] space-y-2 overflow-y-auto">
              <div className="flex items-center gap-2 text-white/20">
                 <Terminal size={14} />
                 <span>Terminal output</span>
              </div>
              <p className="text-emerald-400">[info] Server running at http://localhost:3000</p>
              <p className="text-white/40">[warning] 12 components are re-rendering on every update.</p>
              <p className="text-secondary">[gemini] Analyse en cours : J'ai détecté une possible fuite de mémoire à la ligne 9.</p>
              {timerStarted && <p className="text-primary">[info] Test démarré ! Chronomètre en cours...</p>}
           </div>

           <div className="absolute bottom-8 right-8 flex gap-4">
              <button 
                onClick={handleSave}
                className="p-4 glass rounded-full text-white/40 hover:text-white transition-colors hover:scale-110 active:scale-95 shadow-xl"
              >
                 <Save size={24} />
              </button>
              <button 
                onClick={handleRun}
                className="p-4 bg-primary text-white rounded-full hover:opacity-90 transition-all hover:scale-110 active:scale-95 shadow-xl shadow-primary/20"
              >
                 <Play size={24} fill="currentColor" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
