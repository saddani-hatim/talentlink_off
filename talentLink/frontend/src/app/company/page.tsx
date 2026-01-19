"use client";

import { motion } from "framer-motion";
import {
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Search,
  Filter,
  ArrowUpRight,
  BrainCircuit,
  Mic,
  Heart,
  BarChart3,
  Target,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import companyService from "../../services/company.service";

export default function RecruiterDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await companyService.getStats();
        if (res.success) {
          setData(res);
        }
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    {
      label: "Candidats Actifs",
      value: data?.stats?.totalApplications || "0",
      change: "+12%",
      icon: Users,
      color: "text-blue-400",
    },
    {
      label: "Offres Ouvertes",
      value: data?.stats?.activeJobs || "0",
      change: "-25%",
      icon: TrendingUp,
      color: "text-emerald-400",
    },
    {
      label: "Score Qualité Moyen",
      value: `${data?.stats?.matchRate || 0}%`,
      change: "+5%",
      icon: BrainCircuit,
      color: "text-purple-400",
    },
  ];

  const matchedCandidates =
    data?.recentApplications?.map((app: any) => ({
      id: app.id,
      name: `${app.candidateprofile.firstName} ${app.candidateprofile.lastName}`,
      role: app.job.title,
      match: app.candidateprofile.matchRate || 85,
      softMatch: 90,
      culture: 88,
      status: app.status,
      avatar:
        app.candidateprofile.firstName[0] + app.candidateprofile.lastName[0],
    })) || [];

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Chargement des données...
      </div>
    );

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Tableau de Bord Recruteur</h1>
          <p className="text-white/40">
            Bienvenue, TechFlow Solutions. Voici vos insights IA du jour.
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/company/reports"
            className="px-6 py-3 glass rounded-xl hover:bg-white/10 transition-colors flex items-center gap-2"
          >
            <BarChart3 size={18} /> Rapports
          </Link>
          <Link
            href="/company/jobs/new"
            className="px-6 py-3 bg-secondary text-white font-bold rounded-xl shadow-lg shadow-secondary/20 hover:scale-105 transition-transform"
          >
            Nouvelle Offre
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-6 rounded-3xl"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl bg-white/5 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span
                className={`text-xs font-bold px-2 py-1 rounded-lg ${
                  stat.change.startsWith("+")
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-red-500/10 text-red-400"
                }`}
              >
                {stat.change}
              </span>
            </div>
            <h4 className="text-3xl font-bold mb-1">{stat.value}</h4>
            <p className="text-white/40 text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Target className="text-secondary" size={20} /> Matching Prédictif
              (Hard + Soft)
            </h3>
            <div className="flex gap-2">
              <button className="p-2 glass rounded-lg text-white/40 hover:text-white transition-colors">
                <Filter size={18} />
              </button>
              <button className="p-2 glass rounded-lg text-white/40 hover:text-white transition-colors">
                <Search size={18} />
              </button>
            </div>
          </div>

          <div className="glass rounded-4xl overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-6 py-4 text-xs font-bold text-white/20 uppercase tracking-widest text-[10px]">
                    Candidat
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-white/20 uppercase tracking-widest text-[10px]">
                    Hard Skills
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-white/20 uppercase tracking-widest text-[10px]">
                    Soft Skills
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-white/20 uppercase tracking-widest text-[10px]">
                    Culture
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-white/20 uppercase tracking-widest text-[10px]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {matchedCandidates.map((c: any, i: number) => (
                  <tr
                    key={i}
                    className="group hover:bg-white/2 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-bold text-secondary border border-white/10 group-hover:border-secondary transition-all">
                          {c.avatar}
                        </div>
                        <div>
                          <p className="font-bold">{c.name}</p>
                          <p className="text-[10px] text-white/40 uppercase tracking-tight">
                            {c.role}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-1 bg-secondary rounded-full"
                          style={{ width: `${c.match / 4}px` }}
                        />
                        <span className="font-bold text-secondary text-sm">
                          {c.match}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-emerald-400 font-bold text-sm">
                      <div className="flex items-center gap-1">
                        <Mic size={14} className="opacity-40" /> {c.softMatch}%
                      </div>
                    </td>
                    <td className="px-6 py-4 text-purple-400 font-bold text-sm">
                      <div className="flex items-center gap-1">
                        <Heart size={14} className="opacity-40" /> {c.culture}%
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/company/candidates/${c.id}/analysis`}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-bold hover:bg-primary transition-all"
                      >
                        Détails
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar Insights */}
        <div className="space-y-8">
          <section className="glass p-8 rounded-5xl bg-gradient-to-br from-secondary/5 to-transparent border-secondary/20">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <AlertCircle className="text-secondary" size={20} />
              Bias Detection
            </h3>
            <p className="text-sm text-white/60 leading-relaxed mb-6">
              Gemini signale un filtrage trop restrictif sur l'expérience (10+
              ans) qui pourrait exclure 40% des talents qualifiés.
            </p>
            <Link
              href="/company/fair-hiring"
              className="w-full py-3 bg-secondary/10 border border-secondary/30 rounded-xl text-secondary font-bold hover:bg-secondary hover:text-white transition-all text-center inline-block"
            >
              Recrutement Équitable
            </Link>
          </section>

          <section className="glass p-8 rounded-5xl">
            <h3 className="text-xl font-bold mb-6">Benchmarking Marché</h3>
            <div className="space-y-6">
              {[
                { label: "Salaire Proposé", vs: "+15%", status: "Haut" },
                { label: "Attractivité Poste", vs: "-5%", status: "Moyen" },
              ].map((b, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5"
                >
                  <div>
                    <p className="text-xs text-white/40 font-bold mb-1">
                      {b.label}
                    </p>
                    <p className="font-bold">{b.status}</p>
                  </div>
                  <span
                    className={`text-sm font-black p-2 rounded-lg ${
                      b.vs.startsWith("+") ? "text-emerald-400" : "text-accent"
                    }`}
                  >
                    {b.vs}
                  </span>
                </div>
              ))}
            </div>
            <Link
              href="/company/analytics" 
              className="w-full mt-6 py-3 glass rounded-xl text-xs font-bold hover:bg-white/10 transition-colors text-center block"
            >
              Voir l'analyse complète
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
