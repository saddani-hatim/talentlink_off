"use client";

import { motion } from "framer-motion";
import { BarChart3, PieChart, TrendingUp, Users, Calendar, ShieldAlert, Download, Filter, Sparkles, Target } from "lucide-react";
import { useEffect, useState } from "react";
import companyService from "../../../services/company.service";
import jsPDF from "jspdf";
import domtoimage from "dom-to-image";

export default function RecruitmentReports() {
  const [timeRange, setTimeRange] = useState("30");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    const element = document.getElementById("report-content");
    if (!element) return;

    try {
      setIsExporting(true);
      // Wait a bit for animations to settle
      await new Promise((resolve) => setTimeout(resolve, 500));

      const dataUrl = await domtoimage.toPng(element, {
        bgcolor: "#0a0a0b",
        quality: 1,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
        }
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
      pdf.save(`Rapport_Recrutement_${new Date().toLocaleDateString()}.pdf`);
    } catch (error) {
      console.error("PDF Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await companyService.getReports();
        if (res.success) {
          setData(res.reports);
        }
      } catch (error) {
        console.error("Failed to fetch reports", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const icons: any = {
    Calendar,
    TrendingUp,
    Target,
    Users
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Chargement des rapports...
      </div>
    );

  const kpis = data?.kpis || [];
  const pipeline = data?.pipeline || [];
  const bias = data?.biasAnalysis;
  const sources = data?.talentSources || [];

  return (
    <div className="space-y-12 py-8">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold flex items-center gap-3">
             Rapports & Insights <BarChart3 className="text-primary" />
          </h1>
          <p className="text-white/40">Analysez vos performances de recrutement et identifiez les opportunités d'optimisation.</p>
        </div>
        <div className="flex gap-4">
           <div className="glass px-4 py-2 rounded-xl border-white/10 flex items-center gap-2">
              <Filter size={16} className="text-white/40" />
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-transparent text-sm font-bold focus:outline-none cursor-pointer"
              >
                 <option value="7">7 derniers jours</option>
                 <option value="30">30 derniers jours</option>
                 <option value="90">90 derniers jours</option>
              </select>
           </div>
           <button 
             onClick={handleExportPDF}
             disabled={isExporting}
             className="p-3 glass rounded-xl hover:bg-white/10 transition-colors text-white/40 hover:text-white disabled:opacity-50 disabled:cursor-wait"
           >
              <Download size={20} className={isExporting ? "animate-bounce" : ""} />
           </button>
        </div>
      </div>

      <div id="report-content" className="space-y-12">
        {/* KPI Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-8 rounded-[2.5rem] space-y-4 hover:border-primary/20 transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                 {(() => {
                   const Icon = icons[kpi.icon] || Calendar;
                   return <Icon size={24} />;
                 })()}
              </div>
              <div>
                 <p className="text-xs font-bold text-white/40 uppercase tracking-widest">{kpi.label}</p>
                 <div className="flex items-baseline gap-3 mt-1">
                    <h3 className="text-2xl font-bold">{kpi.value}</h3>
                    <span className={`text-[10px] font-black ${kpi.trend === 'up' ? 'text-emerald-400' : 'text-accent'}`}>{kpi.change}</span>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main Analytics Chart Simulation */}
          <div className="lg:col-span-2 space-y-10">
            <section className="glass p-10 md:p-14 rounded-[4rem] relative overflow-hidden">
               <div className="flex justify-between items-center mb-12">
                  <h3 className="text-2xl font-black italic">Pipeline de Recrutement</h3>
                  <div className="flex gap-4 text-[10px] uppercase font-black tracking-widest">
                     <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary" /> Candidats</span>
                     <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-secondary" /> Entretiens</span>
                  </div>
               </div>
               
               {/* Simple visual bar chart simulation */}
               <div className="h-64 flex items-end justify-between gap-4 px-4">
                  {pipeline.map((h: number, i: number) => (
                    <div key={i} className="flex-1 space-y-2 group">
                       <div className="relative flex-1 flex flex-col justify-end gap-1">
                          <motion.div 
                            initial={{ height: 0 }} 
                            animate={{ height: `${h}%` }} 
                            className="w-full bg-primary/20 hover:bg-primary/40 rounded-t-lg transition-colors" 
                          />
                          <motion.div 
                            initial={{ height: 0 }} 
                            animate={{ height: `${h/2}%` }} 
                            className="w-full bg-secondary/40 hover:bg-secondary/60 rounded-t-lg transition-colors shadow-[0_-4px_12px_rgba(139,92,246,0.3)]" 
                          />
                       </div>
                       <span className="block text-center text-[8px] font-black text-white/10 group-hover:text-white/40 uppercase">Sem 0{i+1}</span>
                    </div>
                  ))}
               </div>
            </section>

            <section className="grid md:grid-cols-2 gap-8">
               <div className="glass p-10 rounded-[3rem] space-y-8 h-fit">
                  <h4 className="text-xl font-bold flex items-center gap-3">
                     <ShieldAlert className="text-accent" /> Analyse des Biais AI
                  </h4>
                  <div className="space-y-6">
                     <p className="text-sm text-white/40 italic leading-relaxed">
                        "{bias?.summary}"
                     </p>
                     <div className="flex items-center justify-between p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Score de Neutralité</span>
                        <span className="text-xl font-black text-emerald-400">{bias?.score}</span>
                     </div>
                  </div>
               </div>
               
               <div className="glass p-10 rounded-[3rem] space-y-8 h-fit">
                  <h4 className="text-xl font-bold flex items-center gap-3">
                     <Target className="text-primary" /> Sources de Talents
                  </h4>
                  <div className="space-y-4">
                     {sources.map((s: any, i: number) => (
                       <div key={i} className="space-y-2">
                          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/40">
                             <span>{s.label}</span>
                             <span>{s.value}%</span>
                          </div>
                          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                             <motion.div 
                               initial={{ width: 0 }} 
                               animate={{ width: `${s.value}%` }} 
                               className={`h-full ${s.color}`} 
                             />
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </section>
          </div>

          {/* AI Recommendations Sidebar */}
          <div className="lg:col-span-1 space-y-8">
             <section className="glass p-10 rounded-[3.5rem] border-primary/20 relative overflow-hidden bg-gradient-to-b from-primary/10 to-transparent">
                <div className="absolute top-0 right-0 p-6">
                   <Sparkles className="text-primary animate-pulse" />
                </div>
                <h4 className="text-2xl font-bold italic mb-6">Gemini Insights</h4>
                <div className="space-y-8">
                   <div className="space-y-4">
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Opportunité #1</p>
                      <p className="text-sm text-white/60 leading-relaxed italic border-l-2 border-primary/40 pl-4">
                         "Le temps moyen entre le 2ème entretien et l'offre a augmenté de 15%. Raccourcir ce délai pourrait réduire les pertes de candidats de 22%."
                      </p>
                   </div>
                   <div className="space-y-4">
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-secondary">Prédiction Market</p>
                      <p className="text-sm text-white/60 leading-relaxed italic border-l-2 border-secondary/40 pl-4">
                         "La demande pour les experts Kubernetes va augmenter de 40% au T2. Pensez à constituer un vivier dès maintenant."
                      </p>
                   </div>
                </div>
                <button 
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className="w-full mt-10 py-4 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-wait"
                >
                   {isExporting ? "Génération en cours..." : "Générer un rapport PDF"}
                </button>
             </section>

             <section className="glass p-10 rounded-[3rem] text-center space-y-6">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
                   <Users className="text-emerald-400" size={32} />
                </div>
                <div>
                   <h4 className="text-xl font-bold">Talents Actifs</h4>
                   <p className="text-sm text-white/40">Dans votre vivier CyberTech</p>
                </div>
                <div className="text-5xl font-black">4,850</div>
                <div className="flex justify-center -space-x-3">
                   {[1,2,3,4,5].map((i: number) => (
                     <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-white/5" />
                   ))}
                   <div className="w-10 h-10 rounded-full border-2 border-background bg-primary flex items-center justify-center text-[10px] font-black">+8k</div>
                </div>
             </section>
          </div>
        </div>
      </div>
    </div>
  );
}
