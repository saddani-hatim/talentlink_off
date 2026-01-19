"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const codeSymbols = [
  "{ }", "</>", "[]", "//", "&&", "||", "=>", "$", "#", "::", "01", "npm", "git"
];

export default function DeveloperBackground() {
  const [elements, setElements] = useState<any[]>([]);

  useEffect(() => {
    // Generate random positions for symbols
    const newElements = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      symbol: codeSymbols[Math.floor(Math.random() * codeSymbols.length)],
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 20,
    }));
    setElements(newElements);
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#050505]">
      {/* Subtle Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Radial Gradient Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[120px]" />

      {/* Floating Symbols */}
      {elements.map((el) => (
        <motion.div
          key={el.id}
          initial={{ opacity: 0, y: 100 }}
          animate={{ 
            opacity: [0, 0.1, 0], 
            y: [-20, -100],
            x: [0, (Math.random() - 0.5) * 50] // Slight drift
          }}
          transition={{
            duration: el.duration,
            repeat: Infinity,
            delay: el.delay,
            ease: "linear",
          }}
          className="absolute text-white/10 font-mono text-xl font-bold select-none"
          style={{
            left: `${el.x}%`,
            top: `${el.y}%`,
          }}
        >
          {el.symbol}
        </motion.div>
      ))}

      {/* Scanline Effect (Optional, very subtle) */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent bg-[length:100%_4px] opacity-20 pointer-events-none" />
    </div>
  );
}
