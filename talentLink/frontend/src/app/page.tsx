"use client";

import { motion } from "framer-motion";
import { Rocket, Brain, Target, Globe, ArrowRight, CheckCircle2, Star, Zap } from "lucide-react";
import Link from "next/link";
import MouseEffect from "@/components/MouseEffect";
import TiltCard from "@/components/TiltCard";
import { useAuth } from "@/context/AuthContext";



export default function Home() {
  const { user } = useAuth();
  return (
    <div className="relative">
      <MouseEffect />
      {/* Background Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 blur-[120px] rounded-full pointer-events-none" />

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center relative perspective-1000">
        


        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
        >
          <Zap size={16} className="text-primary" />
          <span className="text-sm font-medium">Propulsé par Gemini 3 AI</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold mb-8 leading-tight font-[family-name:var(--font-syne)]"
        >
          L'avenir du Recrutement <br />
          <span className="gradient-text">Commence Ici.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Connectez talents et opportunités grâce à notre plateforme intelligente. 
          Que vous soyez candidat en quête de votre prochain défi ou entreprise à la recherche de talents exceptionnels, 
          TalentLink simplifie et optimise votre parcours de recrutement.
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
              Commencer Gratuitement <ArrowRight size={20} />
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

      {/* Stats Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Utilisateurs Active", value: "10k+" },
            { label: "Partenaires", value: "500+" },
            { label: "Matches Réussis", value: "95%" },
            { label: "Gain de Temps", value: "-60%" },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <h4 className="text-3xl font-bold mb-1">{stat.value}</h4>
              <p className="text-white/40 text-sm uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Pourquoi choisir TalentLink ?</h2>
          <p className="text-white/60">Une plateforme conçue pour l'excellence et l'efficacité.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <TiltCard className="h-full">
            <div className="glass p-8 rounded-3xl h-full hover:border-primary/50 transition-all group">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Brain className="text-primary w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">IA Smart Match</h3>
              <p className="text-white/60 leading-relaxed">Notre algorithme analyse les compétences techniques et les soft skills pour des suggestions ultra-pertinentes.</p>
            </div>
          </TiltCard>

          <TiltCard className="h-full">
            <div className="glass p-8 rounded-3xl h-full hover:border-primary/50 transition-all group">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Target className="text-primary w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Roadmap de Carrière</h3>
              <p className="text-white/60 leading-relaxed">Visualisez votre futur professionnel et recevez des conseils personnalisés pour atteindre vos objectifs.</p>
            </div>
          </TiltCard>
          
          <TiltCard className="h-full">
            <div className="glass p-8 rounded-3xl h-full hover:border-primary/50 transition-all group">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Globe className="text-primary w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Portée Mondiale</h3>
              <p className="text-white/60 leading-relaxed">Accédez à des opportunités à l'international et trouvez l'entreprise qui correspond à votre culture.</p>
            </div>
          </TiltCard>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Comment ça marche ?</h2>
          <p className="text-white/60">Un processus simple et efficace pour tous</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* For Candidates */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="glass p-8 rounded-3xl"
          >
            <h3 className="text-2xl font-bold mb-6 text-primary">Pour les Candidats</h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Créez votre profil</h4>
                  <p className="text-white/60 text-sm">Renseignez vos compétences, expériences et aspirations professionnelles</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Ajoutez vos projets</h4>
                  <p className="text-white/60 text-sm">Mettez en valeur vos réalisations et projets personnels</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Recevez des opportunités</h4>
                  <p className="text-white/60 text-sm">Notre IA vous propose des offres parfaitement adaptées à votre profil</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary font-bold">4</span>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Évoluez avec votre roadmap</h4>
                  <p className="text-white/60 text-sm">Suivez votre progression et développez vos compétences</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              {user?.role !== 'CANDIDATE' && (
                <Link 
                  href="/for-candidates" 
                  className="w-full py-4 bg-primary/10 rounded-xl border border-primary/20 flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all font-bold group/btn"
                >
                  Découvrir l'espace Candidat <ArrowRight className="group-hover/btn:translate-x-1 transition-transform" size={18} />
                </Link>
              )}
            </div>
          </motion.div>

          {/* For Companies */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="glass p-8 rounded-3xl"
          >
            <h3 className="text-2xl font-bold mb-6 text-secondary">Pour les Entreprises</h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-secondary font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Publiez vos offres</h4>
                  <p className="text-white/60 text-sm">Créez des annonces détaillées avec notre assistant intelligent</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-secondary font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Recevez des candidatures ciblées</h4>
                  <p className="text-white/60 text-sm">L'IA sélectionne les profils les plus pertinents pour vos besoins</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-secondary font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Analysez et comparez</h4>
                  <p className="text-white/60 text-sm">Utilisez nos outils d'analyse pour prendre les meilleures décisions</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-secondary font-bold">4</span>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Recrutez équitablement</h4>
                  <p className="text-white/60 text-sm">Garantissez un processus de recrutement juste et inclusif</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              {user?.role !== 'COMPANY' && (
                <Link 
                  href="/for-companies" 
                  className="w-full py-4 bg-secondary/10 rounded-xl border border-secondary/20 flex items-center justify-center gap-2 hover:bg-secondary hover:text-white transition-all font-bold group/btn"
                >
                  Découvrir l'espace Entreprise <ArrowRight className="group-hover/btn:translate-x-1 transition-transform" size={18} />
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Details Section */}
      <section className="bg-white/5 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Nos Services</h2>
            <p className="text-white/60">Des fonctionnalités puissantes pour tous vos besoins</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="glass p-6 rounded-2xl"
            >
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4">
                <Rocket className="text-primary w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Profil Intelligent</h3>
              <p className="text-white/60 text-sm">
                Créez un profil dynamique qui met en valeur vos compétences, expériences et projets. 
                Notre système analyse automatiquement vos points forts.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass p-6 rounded-2xl"
            >
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4">
                <Brain className="text-primary w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Matching IA</h3>
              <p className="text-white/60 text-sm">
                Notre algorithme d'intelligence artificielle analyse les compétences techniques et soft skills 
                pour créer des correspondances parfaites.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass p-6 rounded-2xl"
            >
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4">
                <Target className="text-primary w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Roadmap Carrière</h3>
              <p className="text-white/60 text-sm">
                Visualisez votre parcours professionnel et recevez des recommandations personnalisées 
                pour atteindre vos objectifs de carrière.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass p-6 rounded-2xl"
            >
              <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center mb-4">
                <CheckCircle2 className="text-secondary w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Gestion des Offres</h3>
              <p className="text-white/60 text-sm">
                Créez, publiez et gérez vos offres d'emploi facilement. 
                Suivez les candidatures et organisez vos recrutements efficacement.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass p-6 rounded-2xl"
            >
              <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center mb-4">
                <Brain className="text-secondary w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Analyses Avancées</h3>
              <p className="text-white/60 text-sm">
                Accédez à des rapports détaillés et des insights sur vos recrutements. 
                Optimisez votre processus grâce aux données.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass p-6 rounded-2xl"
            >
              <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center mb-4">
                <Globe className="text-secondary w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Recrutement Équitable</h3>
              <p className="text-white/60 text-sm">
                Garantissez un processus de recrutement inclusif et sans biais. 
                Détectez et éliminez les discriminations potentielles.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Les Avantages TalentLink</h2>
          <p className="text-white/60">Ce qui nous rend unique</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="glass p-8 rounded-3xl"
          >
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <CheckCircle2 className="text-primary" />
              Gain de Temps
            </h3>
            <p className="text-white/60 leading-relaxed">
              Réduisez de 60% le temps consacré au recrutement grâce à notre IA qui présélectionne 
              automatiquement les meilleurs candidats et génère des analyses détaillées.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="glass p-8 rounded-3xl"
          >
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <CheckCircle2 className="text-primary" />
              Matching Précis
            </h3>
            <p className="text-white/60 leading-relaxed">
              95% de taux de satisfaction grâce à notre algorithme qui analyse en profondeur 
              les compétences, la culture d'entreprise et les aspirations de chacun.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="glass p-8 rounded-3xl"
          >
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <CheckCircle2 className="text-primary" />
              Transparence Totale
            </h3>
            <p className="text-white/60 leading-relaxed">
              Suivez chaque étape du processus en temps réel. Candidats et recruteurs bénéficient 
              d'une visibilité complète sur l'avancement des candidatures.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="glass p-8 rounded-3xl"
          >
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <CheckCircle2 className="text-primary" />
              Évolution Continue
            </h3>
            <p className="text-white/60 leading-relaxed">
              Accédez à des recommandations personnalisées pour développer vos compétences 
              et progresser dans votre carrière ou améliorer vos processus de recrutement.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-white/5 py-20">
        <div className="container mx-auto px-6">
          <div className="glass rounded-[3rem] p-12 md:p-20 flex flex-col md:flex-row items-center gap-12 overflow-hidden relative">
            <div className="relative z-10 flex-1">
              <h2 className="text-4xl font-bold mb-6 italic text-primary">"TalentLink a transformé notre façon de recruter."</h2>
              <p className="text-lg text-white/60 mb-8 italic">
                - Marie L., Responsable Talent Acquisition chez TechFlow
              </p>
              <div className="flex items-center gap-4">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
                </div>
                <span className="font-medium text-white/80">Excellent (4.9/5)</span>
              </div>
            </div>
            <div className="flex-1 relative">
               <div className="w-64 h-64 bg-secondary/30 blur-[80px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
               {/* Decorative elements could go here */}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-6 py-40 text-center">
        <h2 className="text-5xl font-bold mb-8 italic">Prêt à transformer votre carrière ?</h2>
        {!user && (
          <Link 
            href="/register" 
            className="px-12 py-5 bg-white text-black rounded-3xl font-black text-xl hover:scale-105 transition-transform inline-block"
          >
            Démarrer l'aventure
          </Link>
        )}
      </section>
    </div>
  );
}
