"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Palette,
  CreditCard,
  Building2,
  Plus,
  Mail,
  Shield,
  CheckCircle2,
  Layout,
  Sliders,
  X,
  Sparkles,
  BrainCircuit,
} from "lucide-react";
import { useEffect, useState } from "react";
import companyService from "../../../services/company.service";
import { ToastContainer } from "@/components/Toast";

export default function RecruiterSettings() {
  const [activeSection, setActiveSection] = useState("profile");
  const [toasts, setToasts] = useState<any[]>([]);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [teamMembers, setTeamMembers] = useState([
    {
      name: "Sarah Connor",
      role: "Admin",
      email: "sarah@cybertech.ai",
      status: "Actif",
    },
    {
      name: "John Doe",
      role: "Recruteur",
      email: "john@cybertech.ai",
      status: "Actif",
    },
  ]);
  const [inviteForm, setInviteForm] = useState({
    email: "",
    role: "Recruteur",
  });

  const addToast = (message: string, type: "success" | "error" | "info" = "info") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const [profile, setProfile] = useState({
    name: "",
    description: "",
    industry: "",
    size: "",
    website: "",
    location: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await companyService.getProfile();
        if (res.success && res.profile) {
          setProfile(res.profile);
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
        addToast("Impossible de charger le profil.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      if (!profile.name.trim()) {
        addToast("Le nom de l'entreprise est obligatoire.", "error");
        return;
      }
      setLoading(true);
      await companyService.updateSettings(profile);
      addToast("Profil mis à jour avec succès !", "success");
    } catch (error) {
      console.error("Failed to save settings", error);
      addToast("Erreur lors de la mise à jour du profil.", "error");
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    { id: "profile", label: "Profil Entreprise", icon: Building2 },
    { id: "team", label: "Gestion d'Équipe", icon: Users },
    { id: "branding", label: "Image de Marque", icon: Palette },
    { id: "billing", label: "Facturation", icon: CreditCard },
  ];

  const handleInvite = async () => {
    if (!inviteForm.email.trim()) {
      addToast("L'email est requis.", "error");
      return;
    }
    
    setIsInviting(true);
    // Simulation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setTeamMembers(prev => [
      ...prev,
      {
        name: inviteForm.email.split('@')[0],
        role: inviteForm.role,
        email: inviteForm.email,
        status: "Invité",
      }
    ]);
    
    addToast(`Invitation envoyée à ${inviteForm.email}`, "success");
    setIsInviteModalOpen(false);
    setInviteForm({ email: "", role: "Recruteur" });
    setIsInviting(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-8">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold flex items-center gap-3">
            Configuration Entreprise <Building2 className="text-primary" />
          </h1>
          <p className="text-white/40">
            Gérez vos collaborateurs, l'apparence de votre page entreprise et
            vos abonnements.
          </p>
        </div>
        <div className="flex p-1.5 glass rounded-2xl border-white/5">
          {sections.map((s: any) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`px-6 py-3 rounded-xl flex items-center gap-2 font-bold text-sm transition-all ${
                activeSection === s.id
                  ? "bg-primary text-white shadow-lg"
                  : "text-white/40 hover:text-white"
              }`}
            >
              <s.icon size={16} /> {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Main Configuration Card */}
        <div className="lg:col-span-2">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-10 md:p-14 rounded-5xl shadow-2xl relative overflow-hidden"
          >
            {activeSection === "profile" && (
              <div className="space-y-8">
                <h3 className="text-2xl font-bold">Informations Générales</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">
                      Nom de l'entreprise
                    </label>
                    <input
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-primary"
                      value={profile.name}
                      onChange={(e) =>
                        setProfile({ ...profile, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">
                      Secteur
                    </label>
                    <input
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-primary"
                      value={profile.industry || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, industry: e.target.value })
                      }
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">
                      Description
                    </label>
                    <textarea
                      className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-primary resize-none"
                      value={profile.description || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, description: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">
                      Site Web
                    </label>
                    <input
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-primary"
                      value={profile.website || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, website: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">
                      Localisation
                    </label>
                    <input
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-primary"
                      value={profile.location || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, location: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            )}
            {activeSection === "team" && (
              <div className="space-y-10">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-bold">Membres de l'équipe</h3>
                    <p className="text-white/40 text-sm mt-1">Gérez les accès et les permissions de votre équipe de recrutement.</p>
                  </div>
                  <button 
                    onClick={() => setIsInviteModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20 group"
                  >
                    <Plus size={18} className="group-hover:rotate-90 transition-transform" /> 
                    Nouveau Membre
                  </button>
                </div>

                <div className="space-y-4">
                  {teamMembers.map((user: any, i: number) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5 group hover:border-primary/30 transition-all hover:bg-white/[0.07]"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center font-black text-xl border border-white/10 group-hover:border-primary/50 transition-colors">
                            {user.name.charAt(0)}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0a0a0b]" />
                        </div>
                        <div>
                          <p className="font-bold text-lg group-hover:text-primary transition-colors">
                            {user.name}
                          </p>
                          <p className="text-sm text-white/40">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-right hidden md:block">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-1">
                            Role
                          </p>
                          <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-white/60">
                            {user.role}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-1">
                            Status
                          </p>
                          <div className="flex items-center justify-end gap-2 text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            {user.status}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === "branding" && (
              <div className="space-y-10">
                <h3 className="text-2xl font-bold">Apparence de votre page</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">
                      Couleur Principale
                    </label>
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary border-4 border-white/20 cursor-pointer" />
                      <div className="w-12 h-12 rounded-2xl bg-secondary border border-white/10 cursor-pointer" />
                      <div className="w-12 h-12 rounded-2xl bg-accent border border-white/10 cursor-pointer" />
                      <div className="w-12 h-12 rounded-2xl glass border border-white/20 flex items-center justify-center text-white/20">
                        <Plus size={20} />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">
                      Logo Entreprise
                    </label>
                    <div className="h-32 glass rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-white/20 hover:border-primary group cursor-pointer transition-all">
                      <Layout
                        size={32}
                        className="mb-2 group-hover:text-primary transition-colors"
                      />
                      <p className="text-[10px] font-black uppercase tracking-[0.2em]">
                        Upload PNG
                      </p>
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">
                      Slogan IA (Généré par Gemini)
                    </label>
                    <div className="p-6 bg-secondary/5 border border-secondary/20 rounded-4xl flex items-center justify-between">
                      <p className="text-white/70 italic text-sm">
                        "Chez CyberTech, nous codons le futur avec conscience."
                      </p>
                      <button className="p-2 hover:bg-secondary/20 rounded-xl transition-colors text-secondary">
                        <Sliders size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "billing" && (
              <div className="space-y-10">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold">Plan Enterprise</h3>
                    <p className="text-primary font-bold text-xs uppercase tracking-widest mt-1">
                      Illimité • Accès Gemini 3 Ultra
                    </p>
                  </div>
                  <span className="px-4 py-2 glass rounded-xl text-xs font-bold">
                    Prochain prélèvement : 12/02/2026
                  </span>
                </div>

                <div className="p-8 bg-emerald-500/5 border border-emerald-500/20 rounded-[2.5rem] flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 size={32} />
                  </div>
                  <div>
                    <p className="text-lg font-bold">Paiement à jour</p>
                    <p className="text-sm text-white/40">
                      Tous vos services sont actifs. Voir l'historique des
                      factures.
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pt-10 border-t border-white/5">
                  <h4 className="font-bold text-white/60">Mode de paiement</h4>
                  <div className="flex items-center justify-between p-6 glass rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-white/5 rounded-lg flex items-center justify-center font-bold">
                        VISA
                      </div>
                      <p className="font-medium font-mono text-sm">
                        •••• •••• •••• 4242
                      </p>
                    </div>
                    <button className="text-xs font-bold text-primary hover:underline uppercase tracking-widest">
                      Modifier
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-12 pt-10 border-t border-white/5 flex justify-end gap-4">
              <button className="px-8 py-4 glass rounded-2xl font-bold hover:bg-white/10 transition-colors">
                Réinitialiser
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-8 py-4 bg-white text-black font-black rounded-2xl hover:opacity-90 transition-opacity"
              >
                {loading ? "Chargement..." : "Enregistrer les modifications"}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Info Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          <section className="glass p-8 rounded-5xl relative overflow-hidden bg-gradient-to-br from-primary/10 to-transparent">
            <h4 className="text-xl font-bold mb-4 flex items-center gap-2 italic">
              <Shield size={20} className="text-primary" /> Sécurité Enterprise
            </h4>
            <p className="text-sm text-white/60 leading-relaxed mb-6 italic">
              Toutes vos données de recrutement sont chiffrées de bout en bout
              et conformes aux normes RGPD les plus strictes.
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                <CheckCircle2 size={12} className="text-emerald-400" /> Data
                Isolation OK
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                <CheckCircle2 size={12} className="text-emerald-400" /> SOC2
                Compliance
              </div>
            </div>
          </section>

          <section className="glass p-8 rounded-5xl">
            <h4 className="text-xl font-bold mb-6">Stats Globales</h4>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/40">
                  <span>Quota Offres</span>
                  <span>28/50</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: "56%" }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/40">
                  <span>Score Culturel</span>
                  <span>8.4/10</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-secondary"
                    style={{ width: "84%" }}
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Invite Modal */}
      <AnimatePresence>
        {isInviteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsInviteModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg glass p-10 rounded-[3rem] border-white/10 shadow-2xl overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 blur-[80px]" />
              
              <div className="flex justify-between items-center mb-10">
                <div className="space-y-1">
                  <h2 className="text-3xl font-bold flex items-center gap-3 italic">
                    INVITER <Plus className="text-primary" />
                  </h2>
                  <p className="text-white/40 text-sm">Ajouter un nouveau recruteur à votre espace.</p>
                </div>
                <button 
                  onClick={() => setIsInviteModalOpen(false)}
                  className="p-3 hover:bg-white/5 rounded-2xl transition-colors text-white/40 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">
                    Adresse Email Professionnelle
                  </label>
                  <div className="relative group">
                    <Mail size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" />
                    <input 
                      type="email"
                      value={inviteForm.email}
                      onChange={(e) => setInviteForm({...inviteForm, email: e.target.value})}
                      placeholder="ex: recruteur@entreprise.com"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">
                    Sélectionner le Rôle
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {["Recruteur", "Admin"].map((role) => (
                      <button
                        key={role}
                        onClick={() => setInviteForm({...inviteForm, role})}
                        className={`py-4 rounded-2xl font-bold text-sm border transition-all ${
                          inviteForm.role === role 
                            ? "bg-primary/10 border-primary text-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]" 
                            : "bg-white/5 border-white/5 text-white/40 hover:border-white/20"
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-6">
                  <button 
                    onClick={handleInvite}
                    disabled={isInviting}
                    className="w-full py-5 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-2xl"
                  >
                    {isInviting ? (
                      <>
                        <BrainCircuit className="animate-spin" size={20} />
                        ENVOI EN COURS...
                      </>
                    ) : (
                      <>
                        <Sparkles size={20} />
                        ENVOYER L'INVITATION
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
