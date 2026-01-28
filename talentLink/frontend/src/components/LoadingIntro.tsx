"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingIntro() {
  const [isVisible, setIsVisible] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("hasVisited");
    if (!hasVisited) {
      setIsVisible(true);
    }
  }, []);

  const handleStart = () => {
    if (hasStarted) return;
    setHasStarted(true);

    // Start Audio
    try {
      const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      
      const audioCtx = new AudioContext();
      
      const playNote = (freq: number, startTime: number, duration: number, volume: number) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.01, startTime + duration);
        
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(volume, startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      const now = audioCtx.currentTime;
      
      // Rich melodic sequence (song-like)
      // Bass foundation
      playNote(130.81, now, 3, 0.12);       // C3 (Bass)
      playNote(196.00, now + 0.1, 3, 0.10); // G3
      
      // Melodic progression
      playNote(261.63, now + 0.3, 2, 0.10);     // C4
      playNote(329.63, now + 0.5, 2, 0.09);     // E4
      playNote(392.00, now + 0.7, 2, 0.08);     // G4
      playNote(523.25, now + 0.9, 2.5, 0.10);   // C5
      playNote(659.25, now + 1.1, 2.5, 0.08);   // E5
      playNote(783.99, now + 1.3, 2.5, 0.06);   // G5
      playNote(1046.50, now + 1.5, 3, 0.05);    // C6 (Peak)
      
    } catch (e) {
      console.log("Audio Error");
    }

    // End intro after animation completes
    setTimeout(() => {
      setIsFinished(true);
      sessionStorage.setItem("hasVisited", "true");
    }, 5500);
  };

  if (!isVisible || isFinished) return null;

  return (
    <AnimatePresence mode="wait">
      {!hasStarted ? (
        // Pre-launch screen
        <motion.div
          key="prelaunch"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          onClick={handleStart}
          onTouchStart={handleStart}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050505] cursor-pointer"
        >
          <div className="flex flex-col items-center gap-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
              className="w-20 h-20 rounded-full bg-primary/20 blur-xl"
            />
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white/40 text-sm uppercase tracking-[0.5em] font-light"
            >
              Cliquez pour commencer
            </motion.p>
          </div>
        </motion.div>
      ) : (
        // Main intro animation (starts ONLY after click)
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: [0.43, 0.13, 0.23, 0.96] }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050505]"
        >
          <div className="relative">
            {/* Ambient Background Glow */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 2.5, opacity: 0.5 }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full"
            />

            <div className="flex flex-col items-center">
              {/* Logo Animation */}
              <motion.div
                initial={{ y: 30, opacity: 0, scale: 0.7 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="mb-12"
              >
                <svg
                  width="140"
                  height="140"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-primary drop-shadow-2xl"
                >
                  <motion.path
                    d="M12 2L2 7L12 12L22 7L12 2Z"
                    stroke="currentColor"
                    strokeWidth="0.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 2.5, ease: "easeInOut" }}
                  />
                  <motion.path
                    d="M2 17L12 22L22 17"
                    stroke="currentColor"
                    strokeWidth="0.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 2.5, ease: "easeInOut", delay: 0.5 }}
                  />
                  <motion.path
                    d="M2 12L12 17L22 12"
                    stroke="currentColor"
                    strokeWidth="0.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 2.5, ease: "easeInOut", delay: 1 }}
                  />
                </svg>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, letterSpacing: "2em", y: 20 }}
                animate={{ opacity: 1, letterSpacing: "0.5em", y: 0 }}
                transition={{ duration: 2, delay: 0.8, ease: "easeOut" }}
                className="text-7xl md:text-8xl font-black gradient-text uppercase tracking-widest mb-8"
              >
                TalentLink
              </motion.h1>

              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "160%", opacity: 1 }}
                transition={{ duration: 2.5, delay: 1.5, ease: "easeInOut" }}
                className="h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"
              />

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 2.5 }}
                className="mt-10 flex flex-col items-center gap-3"
              >
                <span className="text-white/30 text-[9px] uppercase tracking-[0.7em] font-light">
                  Neural Interface Online
                </span>
                <div className="w-56 h-[1.5px] bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                     initial={{ x: "-100%" }}
                     animate={{ x: "100%" }}
                     transition={{ duration: 1.8, delay: 2.5, repeat: Infinity, ease: "easeInOut" }}
                     className="w-1/2 h-full bg-gradient-to-r from-transparent via-primary/50 to-transparent"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
