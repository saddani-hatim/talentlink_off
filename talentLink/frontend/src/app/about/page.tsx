"use client";
import ph from './ph.jpeg'
import { motion } from "framer-motion";
import { Sparkles, Target, Zap, ShieldCheck, Cpu, Globe, User } from "lucide-react";

export default function AboutPage() {
  const values = [
    { title: "Innovation IA", desc: "Nous repoussons les limites du possible avec Gemini 3 pour un recrutement plus intelligent.", icon: Cpu },
    { title: "Transparence", desc: "Des scores de matching clairs et des feedbacks honnêtes pour tous.", icon: Target },
    { title: "Globalité", desc: "Connecter les meilleurs talents aux meilleures entreprises, partout dans le monde.", icon: Globe },
    { title: "Équité", desc: "L'IA au service de la réduction des biais et de la diversité.", icon: ShieldCheck },
  ];

  return (
    <div className="space-y-24 py-12">
      {/* Hero Section */}
      <div className="relative text-center max-w-4xl mx-auto space-y-8">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 blur-[120px] pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-xs font-black uppercase tracking-[0.2em] text-primary mb-4"
        >
          <Sparkles size={14} /> Notre Vision
        </motion.div>
        
        <h1 className="text-5xl md:text-7xl font-black leading-tight">
          Réinventer le futur du <span className="gradient-text">Travail</span>
        </h1>
        <p className="text-xl text-white/60 leading-relaxed max-w-2xl mx-auto">
          TalentLink est né d'une idée simple : utiliser la puissance de l'intelligence artificielle pour créer des connexions plus humaines et plus efficaces entre les talents et les opportunités.
        </p>
      </div>

      {/* Mission Section */}
      <section className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
        <div className="glass p-10 md:p-16 rounded-[4rem] border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <h2 className="text-4xl font-bold mb-8 flex items-center gap-4">
             Notre Mission <Zap className="text-primary fill-primary/20" />
          </h2>
          <div className="space-y-6 text-lg text-white/70 leading-relaxed italic">
            <p>
              "Nous ne nous contentons pas de filtrer des CV. Nous analysons le potentiel, les soft skills et la culture pour assurer un match parfait."
            </p>
            <p>
              Grâce à l'intégration profonde de Gemini 3, nous offrons aux candidats un coach personnel et aux recruteurs un conseiller stratégique.
            </p>
          </div>
        </div>
        <div className="relative aspect-square">
           <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full animate-pulse" />
           <div className="absolute inset-10 glass rounded-[3rem] flex items-center justify-center border-white/10 backdrop-blur-3xl overflow-hidden">
              {/* Replace with a generated image or a decorative element */}
              <div className="relative w-full h-full p-12 flex flex-col justify-between">
                 <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10" />
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10" />
                 </div>
                 <div className="flex flex-col gap-4">
                    <div className="h-4 w-3/4 bg-white/10 rounded-full" />
                    <div className="h-4 w-1/2 bg-white/10 rounded-full" />
                    <div className="h-20 w-full bg-primary/20 border border-primary/30 rounded-3xl animate-pulse" />
                 </div>
                 <div className="flex justify-end">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10" />
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Values Grid */}
      <div className="space-y-16 max-w-6xl mx-auto">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">Nos Valeurs Fondamentales</h2>
          <p className="text-white/40">Ce qui guide chaque ligne de code que nous écrivons.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-8 rounded-[2.5rem] hover:border-primary/30 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                <v.icon size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">{v.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="space-y-16 max-w-6xl mx-auto">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">L'esprit derrière le projet</h2>
          <p className="text-white/40">Rencontrez le visionnaire qui a rendu tout cela possible.</p>
        </div>

        <div className="flex justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="group relative max-w-md"
          >
            <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="glass p-10 rounded-[3rem] text-center space-y-6 relative border-primary/20 bg-gradient-to-b from-primary/10 to-transparent">
              <div className="w-56 h-56 mx-auto rounded-[2.5rem] bg-white/5 border-2 border-primary/30 flex items-center justify-center overflow-hidden relative group-hover:border-primary transition-all shadow-2xl">
                <img 
                  src={ph.src} 
                  alt="Hatim Saddani"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
              </div>
              <div>
                 <h3 className="text-3xl font-black gradient-text">Hatim Saddani</h3>
                 <p className="text-primary font-bold uppercase tracking-[0.2em] text-xs mt-2">Lead Developer</p>
              </div>
              <p className="text-white/60 leading-relaxed text-sm">
                Architecte visionnaire et développeur fullstack, Hatim a conçu TalentLink avec l'ambition de briser les barrières du recrutement traditionnel grâce à l'IA de pointe.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto glass p-12 md:p-20 rounded-[4rem] text-center space-y-8 relative overflow-hidden bg-gradient-to-t from-secondary/10 to-transparent">
        <h2 className="text-4xl font-bold italic">"Le meilleur moyen de prédire le futur est de le créer."</h2>
        <div className="flex flex-wrap justify-center gap-6">
           <button className="px-8 py-4 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
              Rejoindre l'aventure
           </button>
           <button className="px-8 py-4 glass rounded-2xl font-black hover:bg-white/10 transition-colors">
              Nous contacter
           </button>
        </div>
      </div>
    </div>
  );
}
