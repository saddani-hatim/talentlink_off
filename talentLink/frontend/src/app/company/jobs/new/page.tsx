"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Brain,
  Rocket,
  Target,
  Briefcase,
  Code2,
  Users,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sliders,
  Wand2,
  X,
  Plus,
} from "lucide-react";
import { useState } from "react";
import companyService from "../../../../services/company.service";
import { useRouter } from "next/navigation";
import { ToastContainer } from "@/components/Toast";

export default function NewJobWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [toasts, setToasts] = useState<any[]>([]);

  const addToast = (message: string, type: "success" | "error" | "info" = "info") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    type: "FULL_TIME",
    description: "",
    requirements: "",
    salaryRange: "",
    experience: "Intermédiaire",
    stack: ["React", "Next.js", "Typescript", "Tailwind", "PostgreSQL"],
  });

  const [newTag, setNewTag] = useState("");
  const [isAddingTag, setIsAddingTag] = useState(false);

  const addTag = () => {
    if (newTag.trim() && !formData.stack.includes(newTag.trim())) {
      setFormData({ ...formData, stack: [...formData.stack, newTag.trim()] });
      setNewTag("");
      setIsAddingTag(false);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      stack: formData.stack.filter((tag) => tag !== tagToRemove),
    });
  };

  const [validationTriggered, setValidationTriggered] = useState(false);

  const nextStep = () => {
    setValidationTriggered(true);
    if (step === 1 && !formData.title.trim()) {
      addToast("Le titre de l'offre est obligatoire pour continuer.", "error");
      return;
    }
    setValidationTriggered(false);
    setStep((s) => Math.min(s + 1, 4));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handlePublish = async () => {
    if (!formData.title.trim()) {
      addToast("Le titre de l'offre est obligatoire.", "error");
      return;
    }

    try {
      setIsGenerating(true);
      const finalRequirements = `Expérience: ${formData.experience} | Stack: ${formData.stack.join(", ")}`;
      const res = await companyService.createJob({
        ...formData,
        description: formData.description || "Description générée par IA...",
        requirements: finalRequirements,
      });
      if (res.success) {
        addToast("Offre publiée avec succès !", "success");
        setTimeout(() => router.push("/company/jobs"), 1500);
      } else {
        addToast(res.message || "Erreur lors de la publication.", "error");
      }
    } catch (error: any) {
      console.error("Failed to publish job", error);
      addToast(error.response?.data?.message || "Une erreur est survenue.", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const steps = [
    { title: "Bases", desc: "Titre et type" },
    { title: "Détails", desc: "Rôle et stack" },
    { title: "IA Preview", desc: "Optimisation" },
    { title: "Final", desc: "Publication" },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Wizard Progress Header */}
      <div className="flex justify-between items-center mb-16 relative px-4">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/5 -translate-y-1/2 -z-10 mx-10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(step - 1) * 33.33}%` }}
            className="h-full bg-primary"
          />
        </div>
        {steps.map((s: any, i: number) => (
          <div key={i} className="flex flex-col items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition-all border-2 ${
                step > i + 1
                  ? "bg-primary border-primary text-white shadow-lg shadow-primary/30"
                  : step === i + 1
                  ? "bg-background border-primary text-primary shadow-lg shadow-primary/20"
                  : "bg-background border-white/10 text-white/20"
              }`}
            >
              {step > i + 1 ? <CheckCircle2 size={24} /> : i + 1}
            </div>
            <div className="text-center hidden md:block">
              <p
                className={`text-xs font-black uppercase tracking-widest ${
                  step === i + 1 ? "text-primary" : "text-white/20"
                }`}
              >
                {s.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Forms Content */}
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass p-12 md:p-16 rounded-[4rem] relative overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-10"
            >
              <div className="space-y-4">
                <h2 className="text-3xl font-bold flex items-center gap-4">
                  Commençons par les bases{" "}
                  <Briefcase className="text-primary" />
                </h2>
                <p className="text-white/40">
                  Définissez l'intitulé du poste et le type de contrat pour
                  lancer l'IA.
                </p>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">
                    Titre de l'offre
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Lead Fullstack Developer (Node/Next)"
                    className={`w-full bg-white/5 border ${!formData.title.trim() && validationTriggered ? 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.1)]' : 'border-white/10'} rounded-2xl py-5 px-8 focus:outline-none focus:border-primary transition-all text-lg font-medium`}
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value });
                      if (e.target.value.trim()) setValidationTriggered(false);
                    }}
                  />
                  {!formData.title.trim() && validationTriggered && (
                    <p className="text-xs text-red-400 ml-1 mt-1 font-bold italic animate-pulse">
                      Le titre est requis pour générer l'offre avec l'IA.
                    </p>
                  )}
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">
                      Localisation
                    </label>
                    <div className="glass px-6 py-4 rounded-2xl border-white/10 flex items-center gap-3">
                      <Target size={18} className="text-white/20" />
                      <input
                        type="text"
                        placeholder="Paris, Remote..."
                        className="bg-transparent focus:outline-none w-full"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">
                      Type de contrat
                    </label>
                    <select
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-primary transition-all text-sm appearance-none"
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                    >
                      <option value="FULL_TIME">CDI</option>
                      <option value="FREELANCE">Freelance</option>
                      <option value="CONTRACT">CDD</option>
                      <option value="INTERNSHIP">Stage</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-10"
            >
              <div className="space-y-4">
                <h2 className="text-3xl font-bold flex items-center gap-4">
                  Compétences & Stack <Code2 className="text-primary" />
                </h2>
                <p className="text-white/40">
                  Quelles sont les technologies indispensables pour ce poste ?
                </p>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">
                    Stack Technique
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {formData.stack.map((tag: string) => (
                      <div
                        key={tag}
                        className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-xl text-xs font-bold text-primary flex items-center gap-2 group rotate-1 hover:rotate-0 transition-transform"
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="hover:text-red-400 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    {isAddingTag ? (
                      <div className="flex gap-2">
                        <input
                          autoFocus
                          type="text"
                          className="px-4 py-2 glass rounded-xl text-xs font-bold text-white bg-transparent outline-none border border-primary/50"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") addTag();
                            if (e.key === "Escape") setIsAddingTag(false);
                          }}
                          placeholder="Appuyez sur Entrée"
                        />
                      </div>
                    ) : (
                      <button
                        onClick={() => setIsAddingTag(true)}
                        className="px-4 py-2 border border-dashed border-white/20 rounded-xl text-xs font-bold text-white/20 hover:border-primary hover:text-primary transition-all flex items-center gap-2"
                      >
                        <Plus size={14} /> Ajouter une techno
                      </button>
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">
                    Expérience requise
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {["Junior", "Intermédiaire", "Senior"].map(
                      (level: string) => (
                        <button
                          key={level}
                          onClick={() => setFormData({ ...formData, experience: level })}
                          className={`py-4 rounded-2xl text-xs font-extrabold uppercase tracking-widest transition-all border ${
                            formData.experience === level
                              ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105"
                              : "glass text-white/40 border-white/5 hover:border-white/20"
                          }`}
                        >
                          {level}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-10"
            >
              <div className="flex justify-between items-center pb-8 border-b border-white/5">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold flex items-center gap-4 italic font-serif">
                    Optimization IA{" "}
                    <Sparkles className="text-primary" size={24} />
                  </h2>
                  <p className="text-white/40 text-sm">
                    Gemini 3 a analysé le marché pour vous.
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-1">
                    Score d'Attractivité
                  </p>
                  <p className="text-4xl font-black text-emerald-400">92/100</p>
                </div>
              </div>

              <div className="space-y-8">
                <div className="p-8 bg-secondary/5 border border-secondary/20 rounded-[3rem] space-y-4">
                  <h4 className="font-bold flex items-center gap-2 italic">
                    <Brain className="text-secondary" size={20} /> Conseil de
                    l'IA
                  </h4>
                  <p className="text-sm text-white/60 leading-relaxed italic">
                    "Le salaire proposé est 12% au-dessus de la moyenne locale.
                    J'ai ajouté un paragraphe sur vos avantages de
                    'Work-from-Anywhere' pour booster le taux de conversion."
                  </p>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">
                    Description Générée
                  </label>
                  <div className="glass p-8 rounded-5xl border-white/5 text-sm leading-loose text-white/60 min-h-[200px] italic">
                    <p className="mb-4 font-bold text-white/90">
                      # À propos du rôle
                    </p>
                    <p>
                      En tant que Lead Developer chez TalentLink, vous serez au
                      cœur de notre révolution technologique. Votre mission sera
                      de concevoir des architectures résilientes et
                      intuitives...
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10 space-y-10"
            >
              <div className="w-24 h-24 bg-primary/20 rounded-4xl flex items-center justify-center mx-auto relative border border-primary/40">
                <Rocket className="text-primary" size={48} />
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-primary/20 rounded-4xl -z-10"
                />
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl font-black">Prêt à décoller !</h2>
                <p className="text-white/40 max-w-sm mx-auto tracking-tight">
                  Votre offre a été optimisée pour attirer les meilleurs
                  profils. Voulez-vous la publier maintenant ?
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
                <button className="py-5 glass rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white/10 transition-colors">
                  Brouillon
                </button>
                <button
                  onClick={handlePublish}
                  disabled={isGenerating}
                  className="py-5 bg-primary text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-primary/30 hover:scale-105 transition-transform flex items-center justify-center gap-2"
                >
                  {isGenerating ? "Envoi..." : "Publier"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        {step < 4 && (
          <div className="mt-12 flex justify-between items-center pt-10 border-t border-white/5">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className={`flex items-center gap-2 font-bold transition-all ${
                step === 1 ? "opacity-0" : "text-white/40 hover:text-white"
              }`}
            >
              <ArrowLeft size={18} /> Précédent
            </button>

            {step === 3 ? (
              <button
                onClick={() => {
                  setIsGenerating(true);
                  setTimeout(() => {
                    setIsGenerating(false);
                    nextStep();
                  }, 1500);
                }}
                className="px-10 py-4 bg-secondary text-white font-black rounded-2xl shadow-lg shadow-secondary/20 hover:scale-105 transition-all flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    Génération{" "}
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  </>
                ) : (
                  <>
                    Finaliser avec l'IA <Wand2 size={20} />
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="px-10 py-4 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2"
              >
                Suivant <ArrowRight size={20} />
              </button>
            )}
          </div>
        )}
      </motion.div>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
