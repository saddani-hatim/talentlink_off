"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github, Globe, Sparkles, Image as ImageIcon, Video, Code, Plus, Loader2, Trash2, Edit2 } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import candidateService from "@/services/candidate.service";
import { ProjectModal } from "@/components/ProfileModals";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/Toast";

export default function InteractivePortfolio() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [targetOffer, setTargetOffer] = useState("");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedData, setOptimizedData] = useState<any>(null);
  const { toasts, removeToast, error: toastError, success: toastSuccess, info: toastInfo } = useToast();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await candidateService.getProjects();
      setProjects(data);
    } catch (error) {
      console.error("Erreur lors de la récupération du portfolio:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOptimize = async () => {
    try {
      setIsOptimizing(true);
      const data = await candidateService.optimizePortfolio(targetOffer);
      setOptimizedData(data);
    } catch (error: any) {
      console.error("Erreur optimisation:", error);
      let msg = error.response?.data?.message || "Échec de l'optimisation par l'IA. Veuillez réessayer dans quelques instants.";
      if (typeof msg !== 'string') {
        msg = typeof msg === 'object' ? (msg.message || JSON.stringify(msg)) : String(msg);
      }
      toastError(msg);
    } finally {
      setIsOptimizing(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSave = async (data: any) => {
    try {
      // Handle the field mismatch: backend expects 'technology' and 'technologies'
      const mainTech = data.technologies ? data.technologies.split(',')[0].trim() : "";
      const projectData = { ...data, technology: mainTech };

      if (editingProject) {
        await candidateService.updateProject(editingProject.id, projectData);
      } else {
        await candidateService.addProject(projectData);
      }
      fetchProjects();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du projet:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Voulez-vous vraiment supprimer ce projet ?")) {
      try {
        await candidateService.deleteProject(id);
        fetchProjects();
      } catch (error) {
        console.error("Erreur lors de la suppression du projet:", error);
      }
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
    <div className="space-y-12 pb-40">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold mb-4">Portfolio Dynamique</h1>
          <p className="text-white/60 text-lg">
            Une vitrine visuelle de vos meilleures réalisations, enrichie par les analyses de l'IA.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
           <input 
             type="text" 
             placeholder="Poste ciblé (ex: Lead Dev React)"
             value={targetOffer}
             onChange={(e) => setTargetOffer(e.target.value)}
             className="px-6 py-4 glass rounded-2xl border-white/10 focus:border-primary/50 outline-none text-sm min-w-[300px]"
           />
           <button 
             onClick={handleOptimize}
             disabled={isOptimizing}
             className="px-8 py-4 bg-gradient-to-r from-primary to-purple-600 text-white font-bold rounded-2xl flex items-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
           >
             {isOptimizing ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
             Optimisation IA
           </button>
           <button 
             onClick={() => { setEditingProject(null); setIsModalOpen(true); }}
             className="px-6 py-4 glass text-white font-bold rounded-2xl flex items-center gap-2 hover:bg-white/5 transition-colors border-white/10">
             <Plus size={20} /> Nouveau Projet
           </button>
        </div>
      </div>

      {optimizedData && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 glass rounded-[3rem] border border-primary/30 bg-primary/5 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10">
             <Sparkles size={80} className="text-primary" />
          </div>
          <div className="relative z-10 space-y-4">
             <div className="flex items-center gap-3">
                <div className="px-3 py-1 bg-primary text-white text-[10px] font-black rounded-lg uppercase tracking-widest">IA Curator</div>
                <h3 className="text-xl font-bold italic text-primary">{optimizedData.intro}</h3>
             </div>
             <p className="text-white/40 text-sm">
                L'IA a sélectionné et optimisé vos projets les plus pertinents pour le poste de <strong>{targetOffer || "Expert Technique"}</strong>.
             </p>
             <button 
               onClick={() => setOptimizedData(null)}
               className="text-xs font-bold text-white/20 hover:text-white transition-colors underline"
             >
               Revenir à la vue standard
             </button>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {projects.length > 0 ? (
          (optimizedData ? optimizedData.curatedProjects : projects).map((project: any, i: number) => {
            const isOptimized = !!optimizedData;
            // Map original project data if optimized
            const originalProject = isOptimized ? projects.find(p => p.id === project.id) : project;
            if (!originalProject && isOptimized) return null;

            return (
              <motion.div
                key={project.id || i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className={`group glass rounded-[3rem] overflow-hidden border-white/5 hover:border-primary/20 transition-all shadow-2xl ${isOptimized ? 'border-primary/30 ring-1 ring-primary/10' : ''}`}
              >
                {/* Project Image Placeholder */}
                <div className="relative aspect-video overflow-hidden bg-white/5 flex items-center justify-center">
                  {(project.imageUrl || originalProject?.imageUrl) ? (
                    <img 
                      src={project.imageUrl || originalProject?.imageUrl} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <ImageIcon size={48} className="text-white/10 group-hover:text-primary transition-colors" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    {(project.repoUrl || originalProject?.repoUrl) && (
                      <a href={project.repoUrl || originalProject?.repoUrl} target="_blank" rel="noopener noreferrer" className="p-4 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors">
                        <Github size={24} />
                      </a>
                    )}
                    {(project.projectUrl || originalProject?.projectUrl) && (
                      <a href={project.projectUrl || originalProject?.projectUrl} target="_blank" rel="noopener noreferrer" className="p-4 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors">
                        <Globe size={24} />
                      </a>
                    )}
                  </div>
                  {isOptimized && (
                     <div className="absolute top-6 left-6 px-4 py-2 bg-primary text-white text-[10px] font-black rounded-xl uppercase tracking-widest shadow-xl flex items-center gap-2">
                        <Sparkles size={12} /> Recommandé par l'IA
                     </div>
                  )}
                </div>

                <div className="p-8 space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{typeof project.title === 'string' ? project.title : String(project.title || '')}</h3>
                      <div className="flex flex-wrap gap-2">
                        {(() => {
                          const techData = project.technologies || originalProject?.technologies;
                          if (!techData) return null;
                          
                          let techs: string[] = [];
                          if (Array.isArray(techData)) {
                            techs = techData;
                          } else if (typeof techData === 'string') {
                            techs = techData.split(',');
                          } else {
                            return null;
                          }
                          
                          return techs.map((tag: string) => (
                            <span key={tag} className="text-[10px] font-black uppercase tracking-wider text-primary px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                              {tag.trim()}
                            </span>
                          ));
                        })()}
                      </div>
                    </div>
                    {!isOptimized && (
                      <div className="flex gap-2">
                         <button 
                           onClick={() => { setEditingProject(project); setIsModalOpen(true); }}
                           className="p-2 glass rounded-lg text-white/40 hover:text-white transition-colors">
                            <Edit2 size={18} />
                         </button>
                         <button 
                           onClick={() => handleDelete(project.id)}
                           className="p-2 glass rounded-lg text-white/40 hover:text-accent transition-colors">
                            <Trash2 size={18} />
                         </button>
                      </div>
                    )}
                  </div>

                  {isOptimized && project.storytelling ? (
                    <div className="space-y-4">
                       <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-white/5 rounded-2xl">
                             <p className="text-[8px] font-black uppercase tracking-widest text-primary mb-1">Situation</p>
                             <p className="text-xs text-white/60 line-clamp-3">{project.storytelling.situation}</p>
                          </div>
                          <div className="p-4 bg-white/5 rounded-2xl">
                             <p className="text-[8px] font-black uppercase tracking-widest text-primary mb-1">Objectif</p>
                             <p className="text-xs text-white/60 line-clamp-3">{project.storytelling.task}</p>
                          </div>
                       </div>
                       <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                          <p className="text-[8px] font-black uppercase tracking-widest text-primary mb-1">Actions & Résultats</p>
                          <p className="text-xs text-white/80 italic">"{project.storytelling.action}"</p>
                          <p className="text-[10px] text-emerald-400 font-bold mt-2">✨ {project.storytelling.result}</p>
                       </div>
                    </div>
                  ) : (
                    <p className="text-white/60 leading-relaxed">
                      {typeof project.description === 'string' ? project.description : String(project.description || '')}
                    </p>
                  )}

                  {!isOptimized && (
                    <div className="p-5 bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-[2rem] flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                        <Sparkles size={18} className="text-primary" />
                      </div>
                      <p className="text-sm text-white/80 leading-relaxed italic">
                         Gemini analyse : "Ce projet démontre une solide maîtrise des concepts avancés en {(() => {
                           const techData = project.technologies || originalProject?.technologies;
                           if (!techData) return 'développement';
                           
                           let techs: string[] = [];
                           if (Array.isArray(techData)) {
                             techs = techData;
                           } else if (typeof techData === 'string') {
                             techs = techData.split(',');
                           }
                           
                           return techs.length > 0 ? techs[0].trim() : 'développement';
                         })()}."
                      </p>
                    </div>
                  )}

                  <div className="pt-4 flex gap-4">
                    <Link href={`/candidate/projects/${project.id || originalProject.id}`} className="flex-1 py-4 glass rounded-2xl flex items-center justify-center gap-2 font-bold hover:bg-white/10 transition-colors text-center">
                      Détails du Projet
                    </Link>
                    {(project.projectUrl || originalProject?.projectUrl) && (
                      <a href={project.projectUrl || originalProject?.projectUrl} target="_blank" rel="noopener noreferrer" className="p-4 glass rounded-2xl text-primary hover:bg-primary hover:text-white transition-all">
                        <ExternalLink size={20} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="col-span-1 md:col-span-2 text-center py-20 glass rounded-[2.5rem]">
            <p className="text-white/40">Aucun projet dans votre portfolio pour le moment.</p>
          </div>
        )}
      </div>
      <ProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSave}
        project={editingProject}
        toast={{ success: toastSuccess, error: toastError, info: toastInfo }}
      />
    </div>
  );
}
