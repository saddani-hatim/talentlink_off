"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Plus, Trash2, CheckCircle2, Image as ImageIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import candidateService from "@/services/candidate.service";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg glass rounded-[2.5rem] border-white/10 overflow-hidden shadow-2xl"
        >
          <div className="p-8 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-2xl font-bold">{title}</h3>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
              <X size={20} className="text-white/40" />
            </button>
          </div>
          <div className="p-8">{children}</div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export function CVModal({ isOpen, onClose, toast }: { isOpen: boolean; onClose: () => void; toast: any }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Mettre à jour le CV">
      <div className="space-y-6">
        <input 
          type="file" 
          id="cv-upload" 
          className="hidden" 
          accept=".pdf,.doc,.docx"
          onChange={(e) => {
             if (e.target.files?.[0]) toast.info(`CV sélectionné : ${e.target.files[0].name}`);
          }}
        />
        <div 
          onClick={() => document.getElementById('cv-upload')?.click()}
          className="border-2 border-dashed border-white/10 rounded-[2rem] p-10 flex flex-col items-center justify-center gap-4 hover:border-primary/50 transition-colors cursor-pointer group">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Upload className="text-primary" />
          </div>
          <div className="text-center">
            <p className="font-bold">Cliquez pour téléverser</p>
            <p className="text-sm text-white/40">PDF, DOCX (Max. 5MB)</p>
          </div>
        </div>
        <button 
          onClick={() => { toast.success('CV mis à jour avec succès !'); onClose(); }}
          className="w-full py-4 bg-primary text-white font-bold rounded-2xl hover:opacity-90 transition-opacity">
          Enregistrer les modifications
        </button>
      </div>
    </Modal>
  );
}

export function SkillsModal({ isOpen, onClose, toast }: { isOpen: boolean; onClose: () => void; toast: any }) {
  const [skills, setSkills] = useState(["React", "Next.js", "TypeScript"]);
  const [newSkill, setNewSkill] = useState("");

  const addSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill("");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Gérer les Compétences">
      <div className="space-y-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Ajouter une compétence..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
          />
          <button onClick={addSkill} className="p-3 bg-primary rounded-xl hover:opacity-90">
            <Plus size={20} />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span key={skill} className="px-4 py-2 bg-white/10 rounded-full text-sm flex items-center gap-2 group">
              {skill}
              <button onClick={() => setSkills(skills.filter(s => s !== skill))} className="hover:text-accent">
                <Trash2 size={14} />
              </button>
            </span>
          ))}
        </div>
        <button 
          onClick={() => { toast.success('Compétences mises à jour !'); onClose(); }}
          className="w-full py-4 bg-primary text-white font-bold rounded-2xl hover:opacity-90 transition-opacity">
          Valider
        </button>
      </div>
    </Modal>
  );
}

export function ProjectModal({ 
  isOpen, 
  onClose, 
  onSave, 
  project,
  toast 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (data: any) => void;
  project?: any;
  toast: any;
}) {
  const [formData, setFormData] = useState(project || {
    title: "",
    description: "",
    technologies: "",
    projectUrl: "",
    repoUrl: "",
    imageUrl: ""
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const result = await candidateService.uploadProjectImage(file);
      setFormData({ ...formData, imageUrl: result.imageUrl });
    } catch (error) {
      console.error("Erreur lors de l'upload de l'image:", error);
      toast.error("Erreur lors de l'upload de l'image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={project ? "Modifier le Projet" : "Ajouter un Projet"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Image Upload Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-white/40">Image du projet</label>
          <div className="relative group aspect-video rounded-2xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
            {formData.imageUrl ? (
              <>
                <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <button 
                     type="button"
                     onClick={() => setFormData({ ...formData, imageUrl: "" })}
                     className="p-3 bg-accent rounded-full text-white hover:scale-110 transition-transform">
                      <Trash2 size={20} />
                   </button>
                </div>
              </>
            ) : (
              <label className="cursor-pointer flex flex-col items-center gap-2 text-white/40 hover:text-primary transition-colors">
                {isUploading ? <Loader2 size={32} className="animate-spin" /> : <ImageIcon size={32} />}
                <span className="text-sm">{isUploading ? "Upload en cours..." : "Charger une photo"}</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
              </label>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-white/40">Titre du Projet</label>
          <input
            type="text"
            required
            placeholder="Ex: Système de Gestion de Stock"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-white/40">Description</label>
          <textarea
            required
            placeholder="Décrivez brièvement votre projet et votre rôle..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary min-h-[80px] transition-colors"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-white/40">Technologies</label>
          <input
            type="text"
            placeholder="React, Node.js, PostgreSQL..."
            value={formData.technologies}
            onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40">GitHub</label>
            <input
              type="url"
              placeholder="https://github.com/..."
              value={formData.repoUrl}
              onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40">Lien Live</label>
            <input
              type="url"
              placeholder="https://..."
              value={formData.projectUrl}
              onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
        <button 
          type="submit"
          className="w-full mt-4 py-4 bg-primary text-white font-bold rounded-2xl hover:opacity-90 transition-opacity shadow-lg shadow-primary/20">
          {project ? "Mettre à jour" : "Ajouter au Portfolio"}
        </button>
      </form>
    </Modal>
  );
}
