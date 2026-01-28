"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, Briefcase, Map, GraduationCap, Github, Laptop, MessageSquare, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { href: "/candidate", icon: User, label: "Mon Profil" },
  { href: "/candidate/jobs", icon: Briefcase, label: "Opportunités" },
  { href: "/candidate/roadmap", icon: Map, label: "Mon Parcours" },
  { href: "/candidate/tests", icon: GraduationCap, label: "Tests Techniques" },
  { href: "/candidate/projects", icon: Laptop, label: "Mini-Projets" },
];

export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-[calc(100-rem)] pt-0">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } transition-all duration-300 border-r border-white/5 bg-background sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto hidden md:block`}
      >
        <div className="flex flex-col gap-2 p-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                  isActive 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "text-white/40 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon size={22} />
                {isSidebarOpen && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10">
        {children}
      </div>

      {/* AI Coach Floating Sidebar / Tooltip */}
      <div className="fixed bottom-8 right-8 z-[60]">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-16 h-16 bg-gradient-to-tr from-primary to-secondary rounded-full flex items-center justify-center text-white shadow-2xl glow-primary"
          onClick={() => router.push('/candidate/roadmap')}
        >
          <MessageSquare size={28} />
        </motion.button>
      </div>
    </div>
  );
}
