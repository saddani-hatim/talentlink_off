"use client";

import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Users,
  TrendingUp,
  Sparkles,
  UserCheck,
  ShieldAlert,
  Cpu,
} from "lucide-react";
import { useEffect, useState } from "react";
import companyService from "../../../services/company.service";
import { ToastContainer } from "@/components/Toast";
import Link from "next/link";

export default function CandidateSourcing() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<any[]>([]);

  const addToast = (message: string, type: "success" | "error" | "info" = "info") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await companyService.getCandidates();
        if (res.success) {
          setCandidates(
            res.applications.map((app: any) => ({
              id: app.id,
              name: `${app.candidateprofile.firstName} ${app.candidateprofile.lastName}`,
              role: app.job.title,
              skills:
                app.candidateprofile.candidateskill?.map(
                  (s: any) => s.skill.name
                ) || [],
              match: app.candidateprofile.matchRate || 85,
              potential: app.aiScore > 80 ? "High" : "Medium",
              status: app.status,
              insight:
                app.aiAnalysis || "Candidat avec un bon potentiel technique.",
            }))
          );
        }
      } catch (error) {
        console.error("Failed to fetch candidates", error);
        addToast("Failed to fetch candidates.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Chargement des candidats...
      </div>
    );

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="flex-1 space-y-4">
          <h1 className="text-4xl font-bold flex items-center gap-3">
            Sourcing Proactif <Sparkles className="text-secondary" />
          </h1>
          <p className="text-white/60">
            Identifiez les talents cachés et les candidats passifs grâce au
            scoring prédictif de Gemini.
          </p>
          <div className="relative max-w-2xl">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
              size={20}
            />
            <input
              type="text"
              placeholder="Rechercher des talents par compétences ou potentiel..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-secondary transition-all"
            />
          </div>
        </div>
        <button className="px-6 py-4 glass rounded-2xl flex items-center gap-2 hover:bg-white/10 transition-colors">
          <Filter size={18} /> Filtres IA
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {candidates.map((c: any, i: number) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-5xl p-8 border hover:border-secondary/30 transition-all group"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center font-bold text-2xl border border-white/10 shrink-0">
                {c.name.charAt(0)}
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold flex items-center gap-3">
                      {c.name}
                      <span
                        className={`text-[10px] font-black p-1 px-2 rounded-md ${
                          c.status === "Passive"
                            ? "bg-white/5 text-white/40"
                            : "bg-emerald-500/10 text-emerald-400"
                        }`}
                      >
                        {c.status.toUpperCase()}
                      </span>
                    </h3>
                    <p className="text-white/40 font-medium">{c.role}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-[10px] text-white/20 font-black uppercase tracking-widest mb-1">
                        Match
                      </p>
                      <p className="text-xl font-bold text-secondary">
                        {c.match}%
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-white/20 font-black uppercase tracking-widest mb-1">
                        Potentiel
                      </p>
                      <p className="text-xl font-bold text-emerald-400">
                        {c.potential}
                      </p>
                    </div>
                    <Link
                      href={`/company/candidates/${c.id}/analysis`}
                      className="px-6 py-3 bg-secondary text-white font-bold rounded-xl hover:opacity-90"
                    >
                      Analyser
                    </Link>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {c.skills.map((skill: string) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="p-4 bg-secondary/5 border border-secondary/20 rounded-2xl flex items-center gap-3">
                  <Cpu size={18} className="text-secondary" />
                  <p className="text-sm text-white/70 italic">
                    <span className="font-bold text-secondary not-italic">
                      Gemini Radar :
                    </span>{" "}
                    {c.insight}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
