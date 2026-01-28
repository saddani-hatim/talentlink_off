"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Lock, Trash2, Save, Loader2, Mail, MapPin, Briefcase, Globe, Github, Linkedin, AlertTriangle } from "lucide-react";
import candidateService from "@/services/candidate.service";
import authService from "@/services/auth.service";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/Toast";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const { toasts, removeToast, success, error: toastError, info } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

  // Profile State
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    title: "",
    bio: "",
    location: "",
    phone: "",
    website: "",
    githubUrl: "",
    linkedinUrl: ""
  });

  // Password State
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await candidateService.getProfile();
      setProfile({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        title: data.title || "",
        bio: data.bio || "",
        location: data.location || "",
        phone: data.phone || "",
        website: data.website || "",
        githubUrl: data.githubUrl || "",
        linkedinUrl: data.linkedinUrl || ""
      });
    } catch (err) {
      console.error(err);
      toastError("Impossible de charger le profil.");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await candidateService.updateProfile(profile);
      success("Profil mis à jour avec succès !");
    } catch (err: any) {
      console.error(err);
      toastError(err.response?.data?.message || "Erreur lors de la mise à jour.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toastError("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }
    if (passwords.newPassword.length < 6) {
        toastError("Le mot de passe doit contenir au moins 6 caractères.");
        return;
    }

    try {
      setSaving(true);
      await authService.changePassword({
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword
      });
      success("Mot de passe modifié !");
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      console.error(err);
      toastError(err.response?.data?.message || "Erreur lors du changement de mot de passe.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("ATTENTION : Cette action est irréversible. Voulez-vous vraiment supprimer votre compte et toutes vos données ?")) {
      return;
    }

    try {
      setSaving(true);
      await authService.deleteAccount();
      router.push("/login");
    } catch (err: any) {
      console.error(err);
      toastError(err.response?.data?.message || "Impossible de supprimer le compte.");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={48} className="text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-40">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <div>
        <h1 className="text-4xl font-bold mb-4">Paramètres</h1>
        <p className="text-white/60 text-lg">Gérez vos informations personnelles et la sécurité de votre compte.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="space-y-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all font-bold ${activeTab === 'profile' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'glass text-white/60 hover:text-white hover:bg-white/5'}`}
          >
            <User size={20} /> Profil Public
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all font-bold ${activeTab === 'security' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'glass text-white/60 hover:text-white hover:bg-white/5'}`}
          >
            <Lock size={20} /> Sécurité
          </button>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 space-y-8">
            
          {activeTab === 'profile' && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass p-8 rounded-[2.5rem] border-white/5"
            >
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <User className="text-primary" /> Informations Personnelles
              </h2>
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Prénom</label>
                    <input
                      type="text"
                      value={profile.firstName}
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Nom</label>
                    <input
                      type="text"
                      value={profile.lastName}
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Titre Professionnel</label>
                  <div className="relative">
                    <Briefcase size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                    <input
                      type="text"
                      placeholder="Ex: Développeur Full Stack Senior"
                      value={profile.title}
                      onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Bio</label>
                  <textarea
                    rows={4}
                    placeholder="Parlez de vous en quelques lignes..."
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Localisation</label>
                    <div className="relative">
                      <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                      <input
                        type="text"
                        placeholder="Paris, France"
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Téléphone</label>
                    <div className="relative">
                        {/* Assuming phone is a string not number for flexibility */}
                      <input
                        type="text"
                        placeholder="+33 6..."
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/5">
                    <h3 className="font-bold text-lg">Réseaux Sociaux</h3>
                    
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Site Web / Portfolio</label>
                        <div className="relative">
                            <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                            <input
                                type="url"
                                placeholder="https://..."
                                value={profile.website}
                                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">GitHub</label>
                            <div className="relative">
                                <Github size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                                <input
                                    type="url"
                                    placeholder="https://github.com/..."
                                    value={profile.githubUrl}
                                    onChange={(e) => setProfile({ ...profile, githubUrl: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-primary transition-colors"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">LinkedIn</label>
                            <div className="relative">
                                <Linkedin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                                <input
                                    type="url"
                                    placeholder="https://linkedin.com/in/..."
                                    value={profile.linkedinUrl}
                                    onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-primary transition-colors"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-6">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:opacity-90 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                    Enregistrer les modifications
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
            >
                {/* Change Password */}
                <div className="glass p-8 rounded-[2.5rem] border-white/5">
                    <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                        <Lock className="text-primary" /> Changer le mot de passe
                    </h2>
                    <form onSubmit={handlePasswordChange} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Mot de passe actuel</label>
                            <input
                                type="password"
                                required
                                value={passwords.oldPassword}
                                onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Nouveau mot de passe</label>
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    value={passwords.newPassword}
                                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Confirmer mot de passe</label>
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    value={passwords.confirmPassword}
                                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center gap-2 px-8 py-4 glass border-primary/20 hover:bg-primary hover:text-white font-bold rounded-2xl transition-all disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                                Mettre à jour le mot de passe
                            </button>
                        </div>
                    </form>
                </div>

                {/* Danger Zone */}
                <div className="p-8 rounded-[2.5rem] border border-red-500/20 bg-red-500/5">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-red-400">
                        <AlertTriangle /> Zone de Danger
                    </h2>
                    <p className="text-white/60 mb-6">
                        La suppression de votre compte est définitive. Toutes vos données, y compris vos expériences, projets et candidatures, seront effacées de manière permanente.
                    </p>
                    <div className="flex justify-end">
                        <button
                            onClick={handleDeleteAccount}
                            disabled={saving}
                            className="flex items-center gap-2 px-8 py-4 bg-red-500/10 text-red-400 border border-red-500/20 font-bold rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-xl shadow-red-500/5 disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="animate-spin" /> : <Trash2 size={20} />}
                            Supprimer mon compte définitivement
                        </button>
                    </div>
                </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
