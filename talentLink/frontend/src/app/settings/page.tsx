"use client";

import { motion } from "framer-motion";
import { User, Shield, Bell, Save, Camera, Lock, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import authService from "@/services/auth.service";
import candidateService from "@/services/candidate.service";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    title: "",
    bio: "",
    avatarUrl: "",
  });

  const [security, setSecurity] = useState({
    oldPassword: "",
    newPassword: "",
    isTwoFactorEnabled: false,
  });

  const [notifications, setNotifications] = useState({
    notifMatches: true,
    notifAiCoach: true,
    notifUpdates: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const user = await authService.getMe();
      const candidate = await candidateService.getProfile();

      if (candidate) {
        setProfile({
          firstName: candidate.firstName || "",
          lastName: candidate.lastName || "",
          title: candidate.title || "",
          bio: candidate.bio || "",
          avatarUrl: candidate.avatarUrl || "",
        });
        setNotifications({
          notifMatches: candidate.notifMatches ?? true,
          notifAiCoach: candidate.notifAiCoach ?? true,
          notifUpdates: candidate.notifUpdates ?? true,
        });
      }

      if (user) {
        setSecurity(prev => ({
          ...prev,
          isTwoFactorEnabled: user.user.isTwoFactorEnabled ?? false,
        }));
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      showFeedback("error", "Erreur lors du chargement des paramètres.");
    } finally {
      setLoading(false);
    }
  };

  const showFeedback = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      await candidateService.updateProfile({
        ...profile,
        ...notifications
      });
      showFeedback("success", "Paramètres mis à jour avec succès !");
    } catch (error: any) {
      showFeedback("error", error.response?.data?.message || "Erreur lors de la mise à jour.");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!security.oldPassword || !security.newPassword) {
      showFeedback("error", "Veuillez remplir les deux champs de mot de passe.");
      return;
    }
    try {
      setSaving(true);
      await authService.changePassword({
        oldPassword: security.oldPassword,
        newPassword: security.newPassword
      });
      showFeedback("success", "Mot de passe modifié avec succès !");
      setSecurity(prev => ({ ...prev, oldPassword: "", newPassword: "" }));
    } catch (error: any) {
      showFeedback("error", error.response?.data?.message || "Erreur lors du changement de mot de passe.");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setSaving(true);
      const res = await candidateService.uploadAvatar(file);
      setProfile(prev => ({ ...prev, avatarUrl: res.avatarUrl }));
      showFeedback("success", "Photo de profil mise à jour !");
    } catch (error) {
      showFeedback("error", "Erreur lors de l'upload de l'image.");
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profil", icon: User },
    { id: "security", label: "Sécurité", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-white/40 font-medium">Chargement de vos paramètres...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Paramètres</h1>
          <p className="text-white/40">Gérez votre compte, votre sécurité et vos préférences de notification.</p>
        </div>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-bold shadow-xl ${
              message.type === "success" ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
            }`}
          >
            {message.type === "success" ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
            {message.text}
          </motion.div>
        )}
      </div>

      <div className="grid lg:grid-cols-4 gap-12">
        {/* Sidebar Nav */}
        <div className="lg:col-span-1 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${
                activeTab === tab.id ? "bg-primary text-white shadow-lg shadow-primary/20" : "glass text-white/40 hover:text-white"
              }`}
            >
              <tab.icon size={20} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass p-8 md:p-14 rounded-[3rem] shadow-2xl space-y-10"
          >
            {activeTab === "profile" && (
              <div className="space-y-10">
                <div className="flex flex-col md:flex-row items-center gap-8 pb-10 border-b border-white/5">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-3xl bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center group-hover:border-primary transition-all overflow-hidden">
                      {profile.avatarUrl ? (
                        <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User size={48} className="text-white/20 group-hover:text-primary transition-colors" />
                      )}
                    </div>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-2 -right-2 p-3 bg-primary rounded-xl shadow-lg hover:scale-110 transition-transform"
                    >
                      <Camera size={20} />
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleAvatarUpload}
                    />
                  </div>
                  <div className="text-center md:text-left space-y-2">
                    <h3 className="text-2xl font-bold">Photo de profil</h3>
                    <p className="text-sm text-white/40">JPG, GIF ou PNG. 1MB Max.</p>
                    <div className="flex gap-4 mt-4">
                       <button className="px-4 py-2 glass rounded-xl text-xs font-bold hover:bg-white/10 transition-colors">Supprimer</button>
                       <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-white text-black rounded-xl text-xs font-bold hover:opacity-90 transition-opacity"
                       >
                         Changer
                       </button>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Prénom</label>
                    <input 
                      type="text" 
                      value={profile.firstName} 
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-primary transition-all text-sm" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Nom</label>
                    <input 
                      type="text" 
                      value={profile.lastName} 
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-primary transition-all text-sm" 
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Titre Professionnel</label>
                    <input 
                      type="text" 
                      value={profile.title} 
                      onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-primary transition-all text-sm" 
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Biographie</label>
                    <textarea 
                      rows={4} 
                      className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-4 px-6 focus:outline-none focus:border-primary transition-all text-sm resize-none" 
                      value={profile.bio} 
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-10">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <Lock className="text-primary" /> Changement de mot de passe
                  </h3>
                  <div className="grid gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Mot de passe actuel</label>
                      <input 
                        type="password" 
                        placeholder="••••••••" 
                        value={security.oldPassword}
                        onChange={(e) => setSecurity({ ...security, oldPassword: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-primary transition-all text-sm" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Nouveau mot de passe</label>
                      <input 
                        type="password" 
                        placeholder="••••••••" 
                        value={security.newPassword}
                        onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-primary transition-all text-sm" 
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-4">
                    <button 
                      onClick={handleChangePassword}
                      disabled={saving}
                      className="px-6 py-3 bg-white text-black rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      Mettre à jour le mot de passe
                    </button>
                  </div>
                </div>

                <div className="pt-10 border-t border-white/5 space-y-6">
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <Shield className="text-primary" /> Double authentification (2FA)
                  </h3>
                  <div className="flex items-center justify-between p-6 glass rounded-2xl border-white/5">
                    <div className="space-y-1">
                      <p className="font-bold">Authentification par Email</p>
                      <p className="text-xs text-white/40">Recevez un code à chaque connexion.</p>
                    </div>
                    <button 
                      onClick={() => setSecurity({ ...security, isTwoFactorEnabled: !security.isTwoFactorEnabled })}
                      className={`w-12 h-6 rounded-full relative transition-colors ${security.isTwoFactorEnabled ? "bg-primary" : "bg-white/10"}`}
                    >
                       <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${security.isTwoFactorEnabled ? "right-1" : "left-1"}`} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-10">
                 <h3 className="text-2xl font-bold flex items-center gap-3">
                    <Bell className="text-primary" /> Préférences Email
                 </h3>
                 <div className="space-y-4">
                    {[
                      { id: "notifMatches" as const, title: "Nouveaux Matches", desc: "Soyez alerté quand une offre correspond à 90%+" },
                      { id: "notifAiCoach" as const, title: "Messages Coach IA", desc: "Conseils quotidiens et rappels de défis." },
                      { id: "notifUpdates" as const, title: "Mises à jour Plateforme", desc: "Nouveautés et annonces majeures." }
                    ].map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-primary/20 transition-all group">
                         <div className="space-y-1">
                            <p className="font-bold group-hover:text-primary transition-colors">{item.title}</p>
                            <p className="text-xs text-white/40">{item.desc}</p>
                         </div>
                         <button 
                          onClick={() => setNotifications({ ...notifications, [item.id]: !notifications[item.id] })}
                          className={`w-12 h-6 rounded-full relative transition-colors ${notifications[item.id] ? "bg-primary" : "bg-white/10"}`}
                         >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifications[item.id] ? "right-1" : "left-1"}`} />
                         </button>
                      </div>
                    ))}
                 </div>
              </div>
            )}

            <div className="pt-10 border-t border-white/5 flex justify-end gap-4">
               <button 
                onClick={fetchData}
                disabled={saving}
                className="px-8 py-4 glass rounded-2xl font-bold hover:bg-white/10 transition-colors disabled:opacity-50"
               >
                 Annuler
               </button>
               <button 
                onClick={handleSaveProfile}
                disabled={saving}
                className="px-8 py-4 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50"
               >
                 {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                 Sauvegarder
               </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
