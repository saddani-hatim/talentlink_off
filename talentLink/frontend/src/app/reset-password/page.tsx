"use client";

import { motion } from "framer-motion";
import { Lock, ArrowLeft, ArrowRight, CheckCircle2, Loader2, KeyRound } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import authService from "@/services/auth.service";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Token de réinitialisation manquant.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      await authService.resetPassword({ token, password });
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Une erreur est survenue.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-6 relative overflow-hidden">
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-secondary/20 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass rounded-[3rem] p-10 md:p-12 shadow-2xl relative overflow-hidden"
      >
        {!isSuccess ? (
          <>
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/20">
                <Lock className="text-white" size={32} />
              </div>
              <h1 className="text-3xl font-bold mb-2">Nouveau mot de passe</h1>
              <p className="text-white/40">Entrez votre nouveau mot de passe ci-dessous.</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Nouveau mot de passe</label>
                <div className="relative group">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={20} />
                  <input
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 flex pl-12 pr-4 focus:outline-none focus:border-primary transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Confirmer le mot de passe</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-secondary transition-colors" size={20} />
                  <input
                    required
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 flex pl-12 pr-4 focus:outline-none focus:border-secondary transition-all text-sm"
                  />
                </div>
              </div>

              <button 
                disabled={isLoading || !token}
                className="w-full py-4 bg-primary text-white font-black rounded-2xl hover:opacity-90 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    Réinitialiser <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-6"
          >
            <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="text-emerald-400" size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-4">Succès !</h2>
            <p className="text-white/40 mb-8">Votre mot de passe a été modifié. Vous allez être redirigé vers la page de connexion...</p>
            <Link 
              href="/login"
              className="text-primary font-bold hover:underline"
            >
              Aller à la connexion maintenant
            </Link>
          </motion.div>
        )}

        <div className="mt-10 pt-10 border-t border-white/5 text-center">
          <Link href="/login" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
            <ArrowLeft size={16} /> Retour à la connexion
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center text-white/40">
        Chargement...
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
