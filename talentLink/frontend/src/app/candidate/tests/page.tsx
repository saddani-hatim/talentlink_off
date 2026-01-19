"use client";

import { motion } from "framer-motion";
import { Code, Layout, Cpu, Database, ChevronRight, Clock, Star, Trophy, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import candidateService from "@/services/candidate.service";

export default function TechnicalTests() {
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const data = await candidateService.getTests();
        setTests(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des tests:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={48} className="text-primary animate-spin" />
      </div>
    );
  }

  const getIcon = (category: string) => {
    switch (category) {
      case 'Frontend': return Layout;
      case 'Backend': return Database;
      case 'AI / ML': return Cpu;
      default: return Code;
    }
  };

  return (
    <div className="space-y-12">
      <div className="max-w-7xl mx-auto space-y-8 pb-40">
        <h1 className="text-4xl font-bold mb-4">Tests Techniques & Mini-Projets</h1>
        <p className="text-white/60 text-lg leading-relaxed">
          Prouvez vos compétences à travers des défis concrets. Vos résultats seront analysés par Gemini 3 et ajoutés à votre profil pour impressionner les recruteurs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {tests.length > 0 ? (
          tests.map((test, i) => {
            const Icon = getIcon(test.category);
            return (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-[2.5rem] p-8 border hover:border-white/20 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-4 rounded-2xl bg-primary/10 text-primary`}>
                      <Icon size={28} />
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">{test.category}</span>
                      <div className="flex items-center gap-1 text-accent font-bold">
                        <Trophy size={14} /> +{test.points || 100} pts
                      </div>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{test.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed mb-6">{test.description || test.desc}</p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-white/20">
                    <div className="flex items-center gap-2">
                      <Clock size={14} /> {test.duration || "30 min"}
                    </div>
                    <div className="flex items-center gap-2">
                      <Star size={14} className="fill-current" /> {test.difficulty || "Mixte"}
                    </div>
                  </div>

                  <Link 
                    href={`/candidate/tests/${test.id}`}
                    className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-2 font-bold hover:bg-primary hover:border-primary transition-all group/btn"
                  >
                    Commencer le test <ArrowRight size={18} className="translate-x-0 group-hover/btn:translate-x-2 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="col-span-1 md:col-span-2 text-center py-20 glass rounded-[2.5rem]">
            <p className="text-white/40">Aucun test technique disponible pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
