"use client";

import { motion } from "framer-motion";
import { Mail, Lock, Github, Chrome, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";


import { useAuth } from "@/context/AuthContext";

function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLoading: authLoading } = useAuth();
  const [innerLoading, setInnerLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const router = useRouter();
  const searchParams = useSearchParams();

  const isLoading = innerLoading || authLoading;

  useEffect(() => {
    if (searchParams.get("signup") === "success") {
      setSuccess("Inscription réussie ! Vous pouvez maintenant vous connecter.");
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInnerLoading(true);
    setError("");
    setSuccess("");

    try {
      await login(formData);
      // Redirection logic is inside AuthContext.login
    } catch (err: any) {
      setError(err.message);
    } finally {
      setInnerLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm font-bold animate-shake">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-500 text-sm font-bold">
          {success}
        </div>
      )}
      
      <div className="space-y-2">
        <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Email</label>
        <div className="relative group">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={20} />
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            placeholder="nom@exemple.com"
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 flex pl-12 pr-4 focus:outline-none focus:border-primary transition-all text-sm"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center ml-1">
          <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Mot de passe</label>
          <Link href="/forgot-password" className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider">Oublié ?</Link>
        </div>
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
        className="w-full py-4 bg-primary text-white font-black rounded-2xl hover:opacity-90 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-primary/20 disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <Loader2 size={18} className="animate-spin" /> Connexion...
          </>
        ) : (
          <>
            Se Connecter <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </>
        )}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-6">
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-secondary/20 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass rounded-[3rem] p-10 md:p-12 shadow-2xl relative overflow-hidden"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/20">
            <Sparkles className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold mb-2">Bon retour !</h1>
          <p className="text-white/40">Connectez-vous pour accéder à votre espace TalentLink.</p>
        </div>

        <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>}>
          <LoginForm />
        </Suspense>

        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
            <span className="bg-background px-4 text-white/20">Ou continuer avec</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => window.location.href = 'http://localhost:2020/api/auth/google'}
            className="flex items-center justify-center gap-2 py-3 glass rounded-xl hover:bg-white/10 transition-colors text-sm font-bold"
          >
            <Chrome size={18} /> Google
          </button>
          <button 
            onClick={() => window.location.href = 'http://localhost:2020/api/auth/github'}
            className="flex items-center justify-center gap-2 py-3 glass rounded-xl hover:bg-white/10 transition-colors text-sm font-bold"
          >
            <Github size={18} /> GitHub
          </button>
        </div>

        <p className="mt-10 text-center text-sm text-white/40">
          Pas encore de compte ?{" "}
          <Link href="/register" className="text-primary font-bold hover:underline">Créer un compte</Link>
        </p>
      </motion.div>
    </div>
  );
}
