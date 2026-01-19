"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Loader2 } from "lucide-react";
import { useState } from "react";
import authService from "@/services/auth.service";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Support Technique",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await authService.contact(formData);
      setSuccess(true);
      setFormData({ name: "", email: "", subject: "Support Technique", message: "" });
    } catch (err: any) {
      setError(err.response?.data?.message || "Une erreur est survenue lors de l'envoi du message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-20 py-12 px-6">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl md:text-6xl font-black">Contactez-nous</h1>
        <p className="text-xl text-white/40">Une question ? Un projet ? Notre équipe et Gemini sont là pour vous répondre.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
        {/* Contact Info Cards */}
        <div className="space-y-6">
          <div className="glass p-8 rounded-[2.5rem] space-y-4 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
              <Mail size={24} />
            </div>
            <h3 className="text-xl font-bold">Email</h3>
            <p className="text-white/60">support@talentlink.ai</p>
            <p className="text-xs text-secondary font-black uppercase tracking-widest">Réponse en {"<"} 2h</p>
          </div>

          <div className="glass p-8 rounded-[2.5rem] space-y-4">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/60">
              <Phone size={24} />
            </div>
            <h3 className="text-xl font-bold">Téléphone</h3>
            <p className="text-white/60">+33 (0) 1 23 45 67 89</p>
            <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">Lun - Ven, 9h - 18h</p>
          </div>

          <div className="glass p-8 rounded-[2.5rem] space-y-4">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/60">
              <MapPin size={24} />
            </div>
            <h3 className="text-xl font-bold">Siège Social</h3>
            <p className="text-white/60">123 Avenue de l'Innovation, 75008 Paris, France</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass p-10 md:p-14 rounded-[4rem] shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 blur-[100px] pointer-events-none" />
            
            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Nom Complet</label>
                  <input
                    type="text"
                    required
                    placeholder="Jean Dupont"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-primary transition-all text-sm"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="jean@exemple.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-primary transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Sujet</label>
                <select 
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-primary transition-all text-sm appearance-none cursor-pointer"
                >
                  <option className="bg-background">Support Technique</option>
                  <option className="bg-background">Partenariat</option>
                  <option className="bg-background">Recrutement</option>
                  <option className="bg-background">Autre</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Message</label>
                <textarea
                  required
                  placeholder="Comment pouvons-nous vous aider ?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full h-48 bg-white/5 border border-white/10 rounded-[2.5rem] p-8 focus:outline-none focus:border-primary transition-all text-sm resize-none"
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-500 text-sm font-bold italic">Votre message a été envoyé avec succès !</p>}

              <button 
                type="submit"
                disabled={loading}
                className="w-full md:w-fit px-12 py-5 bg-white text-black font-black rounded-2xl hover:opacity-90 transition-all flex items-center justify-center gap-3 group shadow-xl disabled:opacity-50"
              >
                {loading ? (
                  <>Patientez... <Loader2 size={18} className="animate-spin" /></>
                ) : (
                  <>Envoyer le Message <Send size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* FAQ Sneak Peek */}
      <div className="max-w-4xl mx-auto glass p-10 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8 border-white/5 bg-gradient-to-r from-transparent to-secondary/5">
        <div className="flex items-center gap-6">
           <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
              <MessageSquare size={32} />
           </div>
           <div>
              <h4 className="text-xl font-bold">Besoin d'une réponse immédiate ?</h4>
              <p className="text-white/40">Utilisez notre Coach IA disponible 24/7 en bas à droite.</p>
           </div>
        </div>
        <button className="w-full md:w-fit px-8 py-4 glass rounded-2xl font-bold hover:bg-white/10 transition-colors">
           Consulter la FAQ
        </button>
      </div>
    </div>
  );
}
