"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Mic, X, Sparkles, MessageSquare, Send, Volume2, VolumeX, MicOff } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { chatWithAI } from "@/services/ai.service";

interface Message {
  role: 'user' | 'model';
  text: string;
}

import { useAuth } from "@/context/AuthContext";

import { useToast } from "@/hooks/useToast";

export default function AICoach() {
  const { user } = useAuth();
  const { error: errorToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Bonjour ! Je suis votre Coach AI Gemini 3. Connectez-vous pour une expérience personnalisée ou posez-moi vos questions générales." }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [showVoiceControls, setShowVoiceControls] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [recognition, setRecognition] = useState<any>(null);

  // Update welcome message based on user role
  useEffect(() => {
    if (user) {
      let welcomeText = "";
      if (user.role === 'CANDIDATE') {
        welcomeText = `Bonjour ${user.name || 'Candidat'} ! Je suis votre Coach Carrière IA. Je peux vous aider à optimiser votre CV, préparer vos entretiens, ou vous guider dans votre développement professionnel. Par quoi souhaitez-vous commencer ?`;
      } else if (user.role === 'COMPANY') {
        welcomeText = `Bonjour ${user.name || 'Recruteur'} ! Je suis votre Assistant Recrutement IA. Je peux vous aider à rédiger des offres percutantes, analyser des profils, ou optimiser votre processus de recrutement. Comment puis-je vous assister ?`;
      } else {
        welcomeText = `Bonjour ${user.name} ! Je suis votre Assistant IA TalentLink. Comment puis-je vous aider aujourd'hui ?`;
      }
      
      setMessages([{ role: 'model', text: welcomeText }]);
    } else {
       setMessages([{ role: 'model', text: "Bonjour ! Je suis votre Coach AI Gemini 3. Connectez-vous pour une expérience personnalisée ou posez-moi vos questions générales." }]);
    }
  }, [user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const reco = new SpeechRecognition();
        reco.continuous = false;
        reco.interimResults = false;
        reco.lang = 'fr-FR';

        reco.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputText(transcript);
          handleSend(transcript);
        };

        reco.onend = () => {
          setIsListening(false);
        };

        reco.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
          
          let errorMessage = "Désolé, j'ai rencontré un problème avec la reconnaissance vocale.";
          
          if (event.error === 'network') {
            errorMessage = "Erreur de connexion (Network) : Le service de reconnaissance vocale de votre navigateur est inaccessible. Si vous utilisez Brave, activez 'Google Services for Push Messaging' et 'Web Speech API' dans les paramètres. Sinon, vérifiez votre connexion ou passez par l'écrit.";
          } else if (event.error === 'not-allowed') {
            errorMessage = "Accès au micro refusé. Veuillez autoriser l'utilisation du micro dans les paramètres de votre navigateur.";
          } else if (event.error === 'no-speech') {
            errorMessage = "Je n'ai rien entendu. Réessayez en parlant un peu plus fort.";
          }

          setMessages(prev => [...prev, { 
            role: 'model', 
            text: errorMessage 
          }]);
        };

        setRecognition(reco);
        return () => {
          reco.stop();
        };
      }
    }
  }, []);

  const speak = (text: string) => {
    if (isMuted) return;
    if (typeof window !== "undefined") {
      window.speechSynthesis.cancel();
      
      // Clean up markdown characters for speech
      const cleanText = text
        .replace(/\*/g, '')      // Remove asterisks
        .replace(/#/g, '')       // Remove hash signs
        .replace(/`/g, '')       // Remove backticks
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Keep link text, remove URL
        .replace(/[_~]/g, '')    // Remove underscores and tildes
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'fr-FR';
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSend = async (text: string = inputText) => {
    if (!text.trim() || isLoading) return;

    // Check if user is authenticated
    if (!user) {
      const userMessage: Message = { role: 'user', text };
      setMessages(prev => [...prev, userMessage]);
      setInputText("");
      
      const errorMessage = "Vous devez être connecté pour utiliser le Coach IA. Veuillez vous connecter ou créer un compte.";
      setMessages(prev => [...prev, { role: 'model', text: errorMessage }]);
      speak(errorMessage);
      return;
    }

    const userMessage: Message = { role: 'user', text };
    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const data = await chatWithAI(text, history);
      const aiMessage: Message = { role: 'model', text: data.reply };
      setMessages(prev => [...prev, aiMessage]);
      setHistory(data.history);
      speak(data.reply);
    } catch (error: any) {
      console.error("Error sending message:", error);
      // Show error via toast for better visibility
      errorToast(error.message || "Une erreur est survenue.");
      
      // Also add a system message to chat history for context
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: "⚠️ " + (error.message || "Erreur de connexion avec l'IA.")
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognition?.stop();
    } else {
      window.speechSynthesis.cancel();
      recognition?.start();
      setIsListening(true);
    }
  };

  const handleClose = () => {
    if (typeof window !== "undefined") {
      window.speechSynthesis.cancel();
    }
    recognition?.stop();
    setIsListening(false);
    setIsSpeaking(false);
    setIsOpen(false);
  };

  if (user?.role === 'COMPANY') {
    return null;
  }

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-[2rem] bg-gradient-to-br from-primary via-indigo-500 to-purple-600 shadow-[0_0_40px_rgba(79,70,229,0.3)] z-50 flex items-center justify-center group border-2 border-white/10"
      >
        <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-tr from-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        <MessageSquare className="text-white drop-shadow-md" size={32} strokeWidth={2.5} />
      </motion.button>


      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-28 right-8 w-80 md:w-[400px] glass rounded-[2.5rem] border-primary/30 z-50 overflow-hidden shadow-2xl flex flex-col"
            style={{ maxHeight: 'calc(100vh - 150px)' }}
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-primary/20 to-secondary/20 border-b border-white/10 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center relative">
                  <Sparkles size={18} className="text-primary" />
                  {isSpeaking && (
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full border-2 border-background"
                    />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-sm">Coach AI Gemini 3</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <p className="text-[10px] text-white/60 font-medium uppercase tracking-widest">Assistant Vocal Actif</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60"
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <button onClick={handleClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/40">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-4 bg-background/50 scroll-smooth min-h-[300px]"
            >
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    msg.role === 'model' ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'
                  }`}>
                    {msg.role === 'model' ? <Sparkles size={14} /> : <div className="text-[10px] font-bold">MOI</div>}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm leading-relaxed max-w-[80%] ${
                    msg.role === 'model' 
                      ? 'bg-white/5 border border-white/10 rounded-tl-none' 
                      : 'bg-primary/10 border border-primary/20 rounded-tr-none text-right'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                    <Sparkles size={14} className="text-primary animate-spin" />
                  </div>
                  <div className="bg-white/5 border border-white/10 p-3 rounded-2xl rounded-tl-none flex gap-1 items-center">
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="p-6 bg-white/5 border-t border-white/10 shrink-0">
              <div className="flex gap-3 relative">
                <button 
                  onClick={toggleListening}
                  className={`p-3 rounded-2xl flex items-center justify-center transition-all ${
                    isListening ? 'bg-accent animate-pulse text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                  title={isListening ? "Arrêter l'écoute" : "Parler à l'IA"}
                >
                  {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                </button>
                
                <div className="relative flex-1">
                  <input 
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Posez votre question..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 pr-12 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                  />
                  <button 
                    onClick={() => handleSend()}
                    disabled={!inputText.trim() || isLoading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary hover:text-primary/80 disabled:text-white/20 transition-colors"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>

              {isListening && (
                <div className="mt-4 flex justify-center gap-1.5">
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [8, 24, 8] }}
                      transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.05 }}
                      className="w-1 bg-primary rounded-full"
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
