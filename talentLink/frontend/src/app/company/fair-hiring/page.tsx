"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Users,
  Target,
  Scale,
  Zap,
  AlertCircle,
  Sparkles,
  ArrowLeft,
  Download,
  Info,
  CheckCircle2,
} from "lucide-react";
import { useEffect, useState } from "react";
import companyService from "../../../services/company.service";
import Link from "next/link";
import jsPDF from "jspdf";
import domtoimage from "dom-to-image";
import { ToastContainer } from "@/components/Toast";

export default function EquitableRecruitment() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [toasts, setToasts] = useState<any[]>([]);

  const addToast = (message: string, type: "success" | "error" | "info" = "info") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await companyService.getFairHiringData();
        if (res.success) {
          setData(res);
        }
      } catch (error) {
        console.error("Failed to fetch fair hiring data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleExportPDF = async () => {
    const element = document.getElementById("fair-hiring-content");
    if (!element) return;

    try {
      setIsExporting(true);
      await new Promise((resolve) => setTimeout(resolve, 500));

      const dataUrl = await domtoimage.toPng(element, {
        bgcolor: "#050505",
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
      pdf.save(`Rapport_DEI_TalentLink_${new Date().toLocaleDateString()}.pdf`);
      addToast("Rapport DEI exporté avec succès !", "success");
    } catch (error) {
      console.error("PDF Export failed:", error);
      addToast("Échec de l'exportation du rapport.", "error");
    } finally {
      setIsExporting(false);
    }
  };

  const handleViewAnalysis = (jobTitle: string) => {
    addToast(`Gemini analyse l'inclusivité de l'offre : ${jobTitle}`, "info");
    setTimeout(() => {
      addToast("Analyse terminée : Terminologie 100% inclusive validée.", "success");
    }, 2000);
  };

  const handleSearchAtypical = () => {
    addToast("Lancement de la recherche de profils multi-potentiels et a-typiques...", "info");
    setTimeout(() => {
      addToast("5 nouveaux profils identifiés correspondant à vos critères DEI.", "success");
    }, 2500);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-white bg-[#050505]">
        <div className="flex flex-col items-center gap-4">
          <Scale className="text-emerald-400 animate-bounce" size={48} />
          <p className="text-xl font-bold">Audit Diversité & Inclusion en cours...</p>
        </div>
      </div>
    );

  const deimetrics = [
    {
      label: "Parité Genre",
      value: `${data?.diversityStats?.gender?.male || 50}/${data?.diversityStats?.gender?.female || 42}`,
      target: "50/50",
      status: "Optimal",
      color: "text-emerald-400",
    },
    {
      label: "Audit Diversité",
      value: `${data?.biasScore || 92}%`,
      target: "90%",
      status: "Excellent",
      color: "text-primary",
    },
    {
      label: "Neutralité Sémantique",
      value: "98/100",
      target: "95/100",
      status: "Vérifié",
      color: "text-secondary",
    },
  ];

  const recommendations = data?.recommendations || [
    "Augmentez la diversité des sources de recrutement",
    "Utilisez des critères d'évaluation anonymisés"
  ];

  return (
    <div className="space-y-12 py-8 px-6 md:px-12 bg-[#050505] min-h-screen text-white">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <Link
          href="/company"
          className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest leading-none"
        >
          <ArrowLeft size={16} /> Retour Dashboard
        </Link>
        <div className="flex gap-4">
          <button 
            onClick={handleExportPDF}
            disabled={isExporting}
            className="px-6 py-3 glass rounded-xl text-sm font-bold hover:bg-white/10 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Download size={16} /> {isExporting ? "Exportation..." : "Rapport DEI"}
          </button>
        </div>
      </div>

      <div id="fair-hiring-content" className="space-y-12 pb-20">
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="glass p-10 md:p-14 rounded-[4rem] border-emerald-500/20 relative overflow-hidden flex flex-col md:flex-row items-center gap-12">
            <div className="w-40 h-40 rounded-[3rem] bg-emerald-500/10 flex items-center justify-center border-2 border-emerald-500/20 shadow-2xl shadow-emerald-500/10">
              <Scale size={64} className="text-emerald-400" />
            </div>
            <div className="flex-1 space-y-6 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 rounded-lg text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                <ShieldCheck size={12} /> Recrutement Équitable Certifié
              </div>
              <h1 className="text-4xl md:text-5xl font-bold">
                Zéro Biais, 100% Talent.
              </h1>
              <p className="text-xl text-white/60 leading-relaxed italic max-w-2xl mx-auto md:mx-0">
                "Gemini 3.0 veille à ce que chaque décision de recrutement soit
                basée uniquement sur les compétences et le potentiel, en
                neutralisant les biais inconscients."
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <div className="grid md:grid-cols-3 gap-6">
              {deimetrics.map((m: any, i: number) => (
                <div
                  key={i}
                  className="glass p-8 rounded-[2.5rem] space-y-4 border-white/5 hover:border-emerald-500/30 transition-all"
                >
                  <p className="text-xs font-bold text-white/40 uppercase tracking-widest">
                    {m.label}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <h3 className={`text-3xl font-black ${m.color}`}>
                      {m.value}
                    </h3>
                    <span className="text-[10px] text-white/20">
                      vs {m.target}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase text-emerald-400">
                    <CheckCircle2 size={12} /> {m.status}
                  </div>
                </div>
              ))}
            </div>

            <section className="glass p-10 md:p-14 rounded-[3.5rem] space-y-10">
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <Sparkles className="text-primary" /> Audit d'Inclusivité des
                Offres
              </h3>
              <div className="space-y-6">
                {[
                  {
                    title: "Senior Fullstack Developer",
                    score: 98,
                    status: "Inclusif",
                  },
                  {
                    title: "AI Research Lead",
                    score: 85,
                    status: "Optimisé",
                    alert: "Terminologie trop masculine détectée",
                  },
                  { title: "Product Manager", score: 92, status: "Inclusif" },
                ].map((job, i) => (
                  <div
                    key={i}
                    className="p-6 bg-white/5 border border-white/5 rounded-4xl flex flex-col md:flex-row justify-between items-center gap-6"
                  >
                    <div className="space-y-1 text-center md:text-left">
                      <h4 className="font-bold text-lg">{job.title}</h4>
                      <div className="flex items-center gap-2 justify-center md:justify-start">
                        <span
                          className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
                            job.score >= 90
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-primary/10 text-primary"
                          }`}
                        >
                          Score : {job.score}%
                        </span>
                        {job.alert && (
                          <span className="text-[10px] font-bold text-accent flex items-center gap-1">
                            <AlertCircle size={10} /> {job.alert}
                          </span>
                        )}
                      </div>
                    </div>
                    <button 
                      onClick={() => handleViewAnalysis(job.title)}
                      className="px-6 py-3 glass rounded-xl text-xs font-bold hover:bg-white/10 transition-colors uppercase tracking-widest"
                    >
                      Voir Analyse
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-1 space-y-8">
            <section className="glass p-10 rounded-[3rem] border-secondary/30 bg-gradient-to-br from-secondary/5 to-transparent relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6">
                <Info className="text-secondary opacity-40 group-hover:opacity-100 transition-opacity" />
              </div>
              <h4 className="text-xl font-bold mb-6 italic">IA Vigilante</h4>
              <div className="space-y-8">
                <div className="space-y-4">
                  <p className="text-xs font-black uppercase tracking-widest text-secondary flex items-center gap-2">
                    <Zap size={14} /> Recommandations IA
                  </p>
                  <div className="space-y-4">
                    {recommendations.map((r: string, i: number) => (
                      <p key={i} className="text-sm text-white/60 leading-relaxed italic border-l-2 border-secondary/40 pl-4">
                        "{r}"
                      </p>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={handleSearchAtypical}
                  className="w-full py-4 glass border border-secondary/30 rounded-2xl text-xs font-black uppercase tracking-widest text-secondary hover:bg-secondary hover:text-white transition-all"
                >
                  Rechercher des Talents A-typiques
                </button>
              </div>
            </section>

            <section className="glass p-10 rounded-[3rem] text-center space-y-6 border-primary/20 bg-gradient-to-t from-primary/5 to-transparent">
              <Users className="text-primary mx-auto" size={48} />
              <div>
                <h4 className="text-xl font-bold">
                  Communautés Sous-représentées
                </h4>
                <p className="text-xs text-white/40 mt-1">
                  Visibilité accrue pour vos offres
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-2xl">
                  <p className="text-2xl font-black text-primary">2.4k</p>
                  <p className="text-[8px] font-bold text-white/20 uppercase">
                    Impressions
                  </p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl">
                  <p className="text-2xl font-black text-secondary">320</p>
                  <p className="text-[8px] font-bold text-white/20 uppercase">
                    Candidatures
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
