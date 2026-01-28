"use client";

import { motion } from "framer-motion";
import { Building2, Users, BarChart3, Shield, Zap, Target, CheckCircle2, Sparkles, TrendingUp, Award } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function ForCompaniesPage() {
  const { user } = useAuth();
  const features = [
    {
      icon: Users,
      title: "Gestion des Candidatures",
      description: "Centralisez toutes vos candidatures et gérez vos recrutements efficacement avec notre interface intuitive."
    },
    {
      icon: Target,
      title: "Matching IA Avancé",
      description: "Notre algorithme analyse les profils en profondeur pour vous proposer les candidats les plus pertinents."
    },
    {
      icon: BarChart3,
      title: "Analyses & Rapports",
      description: "Accédez à des insights détaillés sur vos recrutements et optimisez votre processus avec des données précises."
    },
    {
      icon: Shield,
      title: "Recrutement Équitable",
      description: "Garantissez un processus inclusif et sans biais grâce à notre système de détection des discriminations."
    },
    {
      icon: Zap,
      title: "Publication Rapide",
      description: "Créez et publiez vos offres d'emploi en quelques minutes avec notre assistant intelligent."
    },
    {
      icon: Award,
      title: "Évaluation des Compétences",
      description: "Testez les candidats avec des évaluations techniques personnalisées et obtenez des rapports détaillés."
    }
  ];

  const benefits = [
    "Réduction de 60% du temps de recrutement",
    "Accès à un vivier de talents qualifiés",
    "Matching IA avec 95% de précision",
    "Détection automatique des biais",
    "Rapports d'analyse en temps réel",
    "Support dédié et accompagnement personnalisé"
  ];

  const stats = [
    { value: "500+", label: "Entreprises Partenaires" },
    { value: "10k+", label: "Candidats Actifs" },
    { value: "95%", label: "Taux de Satisfaction" },
    { value: "-60%", label: "Temps de Recrutement" }
  ];

  return (
    <div className="relative">
      {/* Background Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
        >
          <Sparkles size={16} className="text-secondary" />
          <span className="text-sm font-medium">Pour les Entreprises</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold mb-8 leading-tight"
        >
          Recrutez les meilleurs talents <br />
          <span className="gradient-text">avec l'IA</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          TalentLink révolutionne votre processus de recrutement avec une intelligence artificielle 
          qui trouve les candidats parfaits et garantit un recrutement équitable et efficace.
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
              className="w-full md:w-auto px-8 py-4 bg-secondary rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              Démarrer gratuitement <Building2 size={20} />
            </Link>
          )}
          <Link 
            href="/contact" 
            className="w-full md:w-auto px-8 py-4 glass rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/5 transition-colors"
          >
            Demander une démo
          </Link>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <h4 className="text-3xl md:text-4xl font-bold mb-1 text-secondary">{stat.value}</h4>
              <p className="text-white/40 text-sm uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Nos Solutions pour Vous</h2>
          <p className="text-white/60">Des outils puissants pour optimiser vos recrutements</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-8 rounded-3xl hover:border-secondary/50 transition-all group"
            >
              <div className="w-12 h-12 bg-secondary/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-secondary/30 transition-colors">
                <feature.icon className="text-secondary w-6 h-6" />
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
            <p className="text-white/60">4 étapes pour recruter vos talents idéaux</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Publiez vos offres", desc: "Créez des annonces attractives avec notre assistant IA en quelques minutes" },
              { step: "2", title: "Recevez des candidatures", desc: "L'IA présélectionne les profils les plus pertinents pour vous" },
              { step: "3", title: "Analysez et comparez", desc: "Utilisez nos outils d'analyse pour prendre les meilleures décisions" },
              { step: "4", title: "Recrutez équitablement", desc: "Garantissez un processus inclusif et sans biais discriminatoires" }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-secondary">
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
            className="glass p-12 rounded-[3rem] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 blur-[100px] pointer-events-none" />
            <div className="relative">
              <TrendingUp className="text-secondary w-16 h-16 mb-6" />
              <h3 className="text-3xl font-bold mb-4">La puissance de notre IA</h3>
              <p className="text-white/60 mb-6 leading-relaxed">
                Notre technologie Gemini 3 analyse plus de 200 critères pour chaque candidat, 
                incluant les compétences techniques, soft skills, culture d'entreprise et potentiel d'évolution.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary mb-2">95%</div>
                  <div className="text-xs text-white/40 uppercase tracking-wider">Précision matching</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary mb-2">10k+</div>
                  <div className="text-xs text-white/40 uppercase tracking-wider">Candidats actifs</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-4xl font-bold mb-6">Pourquoi choisir TalentLink ?</h2>
            <p className="text-white/60 mb-8 leading-relaxed">
              Notre plateforme combine intelligence artificielle avancée et expertise RH 
              pour vous offrir la meilleure expérience de recrutement.
            </p>
            <div className="space-y-4">
              {benefits.map((benefit, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="text-secondary flex-shrink-0" size={20} />
                  <span className="text-white/80">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Fair Hiring Section */}
      <section className="bg-white/5 py-20">
        <div className="container mx-auto px-6">
          <div className="glass p-12 md:p-16 rounded-[4rem] text-center max-w-4xl mx-auto">
            <Shield className="text-secondary w-16 h-16 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-6">Recrutement Équitable</h2>
            <p className="text-white/60 leading-relaxed mb-8 max-w-2xl mx-auto">
              Notre système de détection des biais garantit un processus de recrutement inclusif 
              et conforme aux normes DEI (Diversité, Équité, Inclusion). Chaque candidat est évalué 
              uniquement sur ses compétences et son potentiel.
            </p>
            <Link 
              href="/about" 
              className="px-8 py-4 glass rounded-2xl font-bold hover:bg-white/10 transition-colors inline-block"
            >
              En savoir plus sur notre engagement
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-40 text-center">
        <h2 className="text-5xl font-bold mb-8 italic">Prêt à révolutionner vos recrutements ?</h2>
        <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto">
          Rejoignez les entreprises qui ont transformé leur processus de recrutement avec TalentLink
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          {!user && (
            <Link 
              href="/register" 
              className="px-12 py-5 bg-white text-black rounded-3xl font-black text-xl hover:scale-105 transition-transform"
            >
              Essai gratuit 30 jours
            </Link>
          )}
          <Link 
            href="/contact" 
            className="px-12 py-5 glass rounded-3xl font-black text-xl hover:bg-white/10 transition-colors"
          >
            Demander une démo
          </Link>
        </div>
      </section>
    </div>
  );
}
