"use client";

import { motion } from "framer-motion";
import { Rocket, Target, Brain, TrendingUp, FileText, Award, CheckCircle2, Sparkles, Users, Zap } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function ForCandidatesPage() {
  const { user } = useAuth();
  const features = [
    {
      icon: Brain,
      title: "Profil Intelligent",
      description: "Créez un profil dynamique qui met en valeur vos compétences, expériences et projets. Notre IA analyse automatiquement vos points forts."
    },
    {
      icon: Target,
      title: "Matching Précis",
      description: "Recevez des opportunités parfaitement adaptées à votre profil grâce à notre algorithme de matching intelligent."
    },
    {
      icon: TrendingUp,
      title: "Roadmap Carrière",
      description: "Visualisez votre parcours professionnel et recevez des recommandations personnalisées pour atteindre vos objectifs."
    },
    {
      icon: FileText,
      title: "Portfolio de Projets",
      description: "Mettez en avant vos réalisations avec un portfolio interactif qui impressionne les recruteurs."
    },
    {
      icon: Award,
      title: "Tests & Évaluations",
      description: "Validez vos compétences avec des tests techniques et obtenez des certifications reconnues."
    },
    {
      icon: Users,
      title: "Suivi en Temps Réel",
      description: "Suivez l'avancement de vos candidatures et recevez des notifications instantanées."
    }
  ];

  const benefits = [
    "Accès à des milliers d'offres d'emploi qualifiées",
    "Matching IA avec 95% de pertinence",
    "Conseils personnalisés pour améliorer votre profil",
    "Préparation aux entretiens avec l'IA",
    "Visibilité auprès des meilleures entreprises",
    "Plateforme 100% gratuite pour les candidats"
  ];

  return (
    <div className="relative">
      {/* Background Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 blur-[120px] rounded-full pointer-events-none" />

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
        >
          <Sparkles size={16} className="text-primary" />
          <span className="text-sm font-medium">Pour les Candidats</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold mb-8 leading-tight"
        >
          Trouvez le job de vos <br />
          <span className="gradient-text">rêves avec l'IA</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          TalentLink vous accompagne dans votre recherche d'emploi avec des outils intelligents 
          qui mettent en valeur vos compétences et vous connectent aux meilleures opportunités.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col md:flex-row items-center justify-center gap-6"
        >
          {!user && (
            <Link 
              href="/register" 
              className="w-full md:w-auto px-8 py-4 bg-primary rounded-2xl font-bold flex items-center justify-center gap-2 glow-primary hover:scale-105 transition-transform"
            >
              Créer mon profil <Rocket size={20} />
            </Link>
          )}
          <Link 
            href="/about" 
            className="w-full md:w-auto px-8 py-4 glass rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/5 transition-colors"
          >
            En savoir plus
          </Link>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Nos Services pour Vous</h2>
          <p className="text-white/60">Des outils puissants pour booster votre carrière</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-8 rounded-3xl hover:border-primary/50 transition-all group"
            >
              <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/30 transition-colors">
                <feature.icon className="text-primary w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-white/60 leading-relaxed text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white/5 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Comment ça marche ?</h2>
            <p className="text-white/60">4 étapes simples pour décrocher votre prochain job</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Créez votre profil", desc: "Renseignez vos compétences et expériences en quelques minutes" },
              { step: "2", title: "Ajoutez vos projets", desc: "Mettez en valeur vos réalisations avec un portfolio interactif" },
              { step: "3", title: "Recevez des offres", desc: "L'IA vous propose des opportunités parfaitement adaptées" },
              { step: "4", title: "Décrochez le job", desc: "Suivez vos candidatures et préparez vos entretiens avec l'IA" }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-primary">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-white/60 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-4xl font-bold mb-6">Pourquoi choisir TalentLink ?</h2>
            <p className="text-white/60 mb-8 leading-relaxed">
              Notre plateforme utilise l'intelligence artificielle la plus avancée pour vous offrir 
              une expérience de recherche d'emploi unique et personnalisée.
            </p>
            <div className="space-y-4">
              {benefits.map((benefit, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="text-primary flex-shrink-0" size={20} />
                  <span className="text-white/80">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="glass p-12 rounded-[3rem] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] pointer-events-none" />
            <div className="relative">
              <Zap className="text-primary w-16 h-16 mb-6" />
              <h3 className="text-3xl font-bold mb-4">La force de notre IA</h3>
              <p className="text-white/60 mb-6 leading-relaxed">
                Notre algorithme analyse plus de 200 critères pour vous proposer les offres 
                les plus pertinentes. Grâce à Gemini 3, nous comprenons vos aspirations 
                au-delà des simples mots-clés.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">95%</div>
                  <div className="text-xs text-white/40 uppercase tracking-wider">Taux de matching</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">-60%</div>
                  <div className="text-xs text-white/40 uppercase tracking-wider">Temps de recherche</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-40 text-center">
        <h2 className="text-5xl font-bold mb-8 italic">Prêt à transformer votre carrière ?</h2>
        <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto">
          Rejoignez des milliers de candidats qui ont trouvé leur job idéal grâce à TalentLink
        </p>
        {!user && (
          <Link 
            href="/register" 
            className="px-12 py-5 bg-white text-black rounded-3xl font-black text-xl hover:scale-105 transition-transform inline-block"
          >
            Créer mon compte gratuitement
          </Link>
        )}
      </section>
    </div>
  );
}
