"use client";

import { motion } from "framer-motion";
import { User as UserIcon, Building2, Mail, Lock, UserPlus, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const [role, setRole] = useState<"CANDIDATE" | "COMPANY">("CANDIDATE");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const { signup, isLoading: authLoading } = useAuth();
  const [innerLoading, setInnerLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const isLoading = innerLoading || authLoading;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInnerLoading(true);
    setError("");

    try {
      // Split full name into first and last name for candidates
      const nameParts = formData.fullName.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');

      await signup({
        email: formData.email,
        password: formData.password,
        role: role,
        firstName: role === 'CANDIDATE' ? firstName : undefined,
        lastName: role === 'CANDIDATE' ? lastName : undefined,
        companyName: role === 'COMPANY' ? formData.fullName : undefined
      });
      // Redirection logic is inside AuthContext.signup
    } catch (err: any) {
      setError(err.response?.data?.message || "Une erreur est survenue lors de l'inscription.");
    } finally {
      setInnerLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-16 px-6">
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-secondary/20 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl glass rounded-[3rem] p-10 md:p-14 shadow-2xl relative overflow-hidden"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Rejoindre l'aventure</h1>
          <p className="text-white/40 max-w-sm mx-auto">Créez votre compte TalentLink et commencez à transformer le recrutement avec l'IA.</p>
        </div>

        {/* Role Selection */}
        <div className="flex p-2 glass rounded-2xl mb-10 max-w-sm mx-auto border-white/5">
          <button
            onClick={() => setRole("CANDIDATE")}
            className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${
              role === "CANDIDATE" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-white/40 hover:text-white"
            }`}
          >
            <UserIcon size={18} /> Candidat
          </button>
          <button
            onClick={() => setRole("COMPANY")}
            className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${
              role === "COMPANY" ? "bg-secondary text-white shadow-lg shadow-secondary/20" : "text-white/40 hover:text-white"
            }`}
          >
            <Building2 size={18} /> Entreprise
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <form className="space-y-6 flex-1" onSubmit={handleSubmit}>
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm font-bold animate-shake">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">
                {role === "CANDIDATE" ? "Nom complet" : "Nom de l'entreprise"}
              </label>
              <div className="relative group">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={20} />
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder={role === "CANDIDATE" ? "Jean Dupont" : "Ma Super Entreprise"}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 flex pl-12 pr-4 focus:outline-none focus:border-primary transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Email professionnel</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={20} />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="jean@exemple.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 flex pl-12 pr-4 focus:outline-none focus:border-primary transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Mot de passe</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={20} />
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 flex pl-12 pr-4 focus:outline-none focus:border-primary transition-all text-sm"
                />
              </div>
            </div>

            <button 
              disabled={isLoading}
              className={`w-full py-4 ${role === 'CANDIDATE' ? 'bg-primary shadow-primary/20' : 'bg-secondary shadow-secondary/20'} text-white font-black rounded-2xl hover:opacity-90 transition-all flex items-center justify-center gap-2 group shadow-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Création en cours...
                </>
              ) : (
                <>
                  Créer mon compte <UserPlus size={18} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Benefits Sidebar */}
          <div className="hidden md:flex flex-col justify-center space-y-8 p-8 bg-white/5 border border-white/5 rounded-[2.5rem]">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <CheckCircle2 className={role === 'CANDIDATE' ? 'text-primary' : 'text-secondary'} size={24} />
              Inclus pour vous :
            </h3>
            <ul className="space-y-6">
              {[
                { title: "Matching IA", desc: "Soyez suggéré aux meilleures entreprises selon vos compétences." },
                { title: "Tests Techniques", desc: "Prouvez votre valeur avec des défis corrigés par l'IA." },
                { title: "Dashboard Premium", desc: "Suivez votre progression et vos opportunités en temps réel." }
              ].map((item, i) => (
                <li key={i} className="space-y-1">
                  <p className="font-bold text-sm tracking-wide">{item.title}</p>
                  <p className="text-xs text-white/40 leading-relaxed">{item.desc}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-12 text-center text-sm text-white/40">
          Vous avez déjà un compte ?{" "}
          <Link href="/login" className="text-primary font-bold hover:underline">Se connecter</Link>
        </p>
      </motion.div>
    </div>
  );
}
