"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  DollarSign,
  Users,
  Globe,
  Briefcase,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import companyService from "../../../services/company.service";
import jsPDF from "jspdf";
import domtoimage from "dom-to-image";
import { ToastContainer } from "@/components/Toast";

export default function MarketAnalytics() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [toasts, setToasts] = useState<any[]>([]);

  const addToast = (message: string, type: "success" | "error" | "info" = "info") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleExportPDF = async () => {
    const element = document.getElementById("analytics-content");
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
      pdf.save(`Analyse_Marche_${new Date().toLocaleDateString()}.pdf`);
      addToast("Rapport exporté avec succès !", "success");
    } catch (error) {
      console.error("PDF Export failed:", error);
      addToast("Échec de l'exportation PDF.", "error");
    } finally {
      setIsExporting(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setIsUpdating(true);
      const res = await companyService.getAnalytics();
      if (res.success) {
        setData(res.analytics);
        addToast("Données mises à jour en temps réel.", "success");
      }
    } catch (error) {
      addToast("Erreur lors de la mise à jour.", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleOptimize = () => {
    addToast("Gemini AI prépare votre stratégie optimisée...", "info");
    setTimeout(() => {
      addToast("Stratégie RH mise à jour avec les dernières tendances du marché.", "success");
    }, 2000);
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await companyService.getAnalytics();
        if (res.success) {
          setData(res.analytics);
        }
      } catch (error) {
        console.error("Failed to fetch analytics", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const icons: any = {
    DollarSign,
    Users,
    Briefcase,
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Chargement des analyses...
      </div>
    );

  const marketStats = data?.marketStats || [];
  const competitors = data?.competitors || [];
  const prediction = data?.growthPrediction;

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
            Analyse du Marché <BarChart3 className="text-primary" />
          </h1>
          <p className="text-white/60">
            Benchmarking en temps réel par rapport à vos concurrents et aux
            tendances du secteur Tech.
          </p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleExportPDF}
            disabled={isExporting}
            className="px-6 py-3 glass rounded-xl text-sm font-bold hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            {isExporting ? "Exportation..." : "Exporter PDF"}
          </button>
          <button 
            onClick={handleUpdate}
            disabled={isUpdating}
            className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isUpdating ? "Mise à jour..." : "Mettre à jour"}
          </button>
        </div>
      </div>

      <div id="analytics-content" className="space-y-10">
        {/* Market Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {marketStats.map((stat: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-8 rounded-[2.5rem] relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl pointer-events-none group-hover:bg-primary/10 transition-colors" />
              <div
                className={`p-4 rounded-2xl bg-white/5 w-fit mb-6 text-primary`}
              >
                {(() => {
                  const Icon = icons[stat.icon] || DollarSign;
                  return <Icon size={24} />;
                })()}
              </div>
              <h4 className="text-4xl font-black mb-2">{stat.value}</h4>
              <div className="flex justify-between items-center">
                <p className="text-white/40 text-sm font-medium">{stat.label}</p>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-lg ${
                    stat.trend.startsWith("+")
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {stat.trend}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Competitor Analysis */}
          <section className="glass p-8 md:p-10 rounded-[3rem] space-y-8">
            <h3 className="text-2xl font-bold flex items-center gap-3">
              <Globe className="text-secondary" /> Analyse Concurrentielle
            </h3>
            <div className="space-y-6">
              {competitors.map((comp: any, i: number) => (
                <div
                  key={i}
                  className="p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-secondary/30 transition-all flex justify-between items-center group"
                >
                  <div>
                    <h4 className="font-bold text-lg mb-1 group-hover:text-secondary transition-colors">
                      {comp.name}
                    </h4>
                    <p className="text-xs text-white/40">{comp.benefits}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-xl">{comp.salary}€</p>
                    <div className="flex items-center gap-1 justify-end mt-1">
                      <TrendingUp size={12} className="text-emerald-400" />
                      <span className="text-[10px] font-bold text-white/30 uppercase">
                        Attractivité : {comp.rating}/5
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Predictive Growth */}
          <section className="glass p-8 md:p-10 rounded-[3rem] bg-gradient-to-br from-primary/5 to-transparent border-primary/20 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold flex items-center gap-3 mb-6">
                <Zap className="text-primary fill-primary/20" /> Croissance
                Prédictive
              </h3>
              <p className="text-white/60 leading-relaxed mb-10 text-lg">
                Gemini prédit une hausse de la demande pour les profils{" "}
                <b>{prediction?.role}</b> de {prediction?.growth} au cours des {prediction?.timeframe}.
              </p>

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-white/40">
                    <span>Disponibilité Talents</span>
                    <span className="text-accent">{prediction?.talentAvailability?.label}</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-accent" style={{ width: `${prediction?.talentAvailability?.value || 30}%` }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-white/40">
                    <span>Urgence de Recrutement</span>
                    <span className="text-primary">{prediction?.hiringUrgency?.label}</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${prediction?.hiringUrgency?.value || 85}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={handleOptimize}
              className="w-full mt-12 py-5 bg-white text-black font-black rounded-2xl hover:opacity-90 transition-opacity uppercase tracking-widest text-xs"
            >
              Optimiser la stratégie RH
            </button>
          </section>
        </div>
      </div>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
