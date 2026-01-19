"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import AICoach from "@/components/AICoach";
import Footer from "@/components/Footer";
import LoadingIntro from "@/components/LoadingIntro";

import { AuthProvider } from "@/context/AuthContext";

export default function RootLayoutClient({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [introFinished, setIntroFinished] = useState(false);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("hasVisited");
    if (hasVisited) {
      setIntroFinished(true);
    } else {
      // Listen for intro completion
      const checkIntro = setInterval(() => {
        if (sessionStorage.getItem("hasVisited")) {
          setIntroFinished(true);
          clearInterval(checkIntro);
        }
      }, 100);
      return () => clearInterval(checkIntro);
    }
  }, []);

  return (
    <AuthProvider>
      <LoadingIntro />
      <div style={{ opacity: introFinished ? 1 : 0, transition: 'opacity 0.5s' }}>
        <Navbar />
        <main className="min-h-screen pt-24">
          <div className="container mx-auto px-6 py-12">
            {children}
          </div>
        </main>
        <AICoach />
        <Footer />
      </div>
    </AuthProvider>
  );
}
