import type { Metadata } from "next";
import { Outfit, Syne } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import AICoach from "@/components/AICoach";
import Footer from "@/components/Footer";
import LoadingIntro from "@/components/LoadingIntro";
import RootLayoutClient from "@/components/RootLayoutClient";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
});

export const metadata: Metadata = {
  title: "TalentLink | Plateforme de Recrutement IA de Nouvelle Génération",
  description: "Connectez vos talents aux opportunités grâce à l'intelligence artificielle de Gemini 3.",
};

import DeveloperBackground from "@/components/DeveloperBackground";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body className={`${outfit.variable} ${syne.variable} font-sans antialiased text-white bg-background`} suppressHydrationWarning={true}>
        <DeveloperBackground />
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
