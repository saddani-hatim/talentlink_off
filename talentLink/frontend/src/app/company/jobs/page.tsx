"use client";

import { motion } from "framer-motion";
import {
  Plus,
  Edit3,
  Trash2,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Wand2,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import companyService from "../../../services/company.service";
import Link from "next/link";

export default function JobManagement() {
  const [activeJob, setActiveJob] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await companyService.getJobs();
        if (res.success) {
          setJobs(
            res.jobs.map((j: any) => ({
              id: j.id,
              title: j.title,
              status: j.status === "OPEN" ? "Active" : "Draft",
              applicants: j._count?.application || 0,
              score: 85,
              description: j.description,
              suggestions: [
                "Ajoutez plus de détails sur la stack IA pour attirer des profils plus spécialisés.",
                "Le salaire est légèrement en dessous du marché actuel pour ce poste.",
              ],
            }))
          );
        }
      } catch (error) {
        console.error("Failed to fetch jobs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Chargement des offres...
      </div>
    );

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="flex-1 space-y-4">
          <h1 className="text-4xl font-bold flex items-center gap-3">
            Gestion des Offres <Edit3 className="text-secondary" />
          </h1>
          <p className="text-white/60">
            Créez et optimisez vos annonces grâce aux recommandations de Gemini.
          </p>
        </div>
        <Link
          href="/company/jobs/new"
          className="px-6 py-4 bg-secondary text-white font-bold rounded-2xl flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Plus size={20} /> Nouvelle Offre
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Jobs List */}
        <div className="lg:col-span-1 space-y-4">
          {jobs.map((job: any) => (
            <div
              key={job.id}
              onClick={() => setActiveJob(job)}
              className={`p-6 glass rounded-3xl border cursor-pointer transition-all ${
                activeJob?.id === job.id
                  ? "border-secondary bg-secondary/10"
                  : "border-white/5 hover:border-white/20"
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-bold text-lg">{job.title}</h4>
                <span
                  className={`text-[10px] font-black px-2 py-1 rounded-md ${
                    job.status === "Active"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-white/5 text-white/40"
                  }`}
                >
                  {job.status.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between text-xs font-bold text-white/40 uppercase tracking-widest">
                <span>{job.applicants} Candidats</span>
                <span className="text-secondary">IA Score: {job.score}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Job Details & AI Optimizer */}
        <div className="lg:col-span-2 space-y-8">
          {activeJob ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-8 md:p-12 rounded-[3rem] space-y-8"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">{activeJob.title}</h2>
                <div className="flex gap-2">
                  <button className="p-3 glass rounded-xl text-white/40 hover:text-white transition-colors">
                    <Trash2 size={20} />
                  </button>
                  <button className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:opacity-90">
                    Publier
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest">
                  Description du poste
                </label>
                <textarea
                  className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-6 focus:outline-none focus:border-secondary transition-all resize-none leading-relaxed"
                  defaultValue={activeJob.description}
                />
              </div>

              {/* AI Recommendations */}
              <div className="p-8 bg-secondary/5 border border-secondary/20 rounded-4xl space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Sparkles className="text-secondary" size={20} />{" "}
                    Optimisation Gemini
                  </h3>
                  <button className="flex items-center gap-2 text-sm text-secondary font-bold hover:gap-3 transition-all">
                    Appliquer tout <Wand2 size={16} />
                  </button>
                </div>

                <div className="space-y-4">
                  {activeJob.suggestions.map((s: string, i: number) => (
                    <div
                      key={i}
                      className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-secondary/30 transition-colors"
                    >
                      <AlertCircle
                        className="text-secondary shrink-0"
                        size={18}
                      />
                      <p className="text-sm text-white/80">{s}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <p className="text-xs text-white/40 font-medium">
                    Score d'attractivité prédictif
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-1.5 w-32 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-secondary"
                        style={{ width: `${activeJob.score}%` }}
                      />
                    </div>
                    <span className="font-black text-secondary">
                      {activeJob.score}%
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full min-h-[400px] glass rounded-[3rem] flex flex-col items-center justify-center text-center p-12 text-white/20">
              <Search size={64} className="mb-6 opacity-20" />
              <p className="text-xl font-medium">
                Sélectionnez une offre pour voir l'analyse détaillée
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
