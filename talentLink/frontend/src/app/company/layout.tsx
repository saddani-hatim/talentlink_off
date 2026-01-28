"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, FilePlus, BarChart3, Settings, ShieldCheck, Search } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const navItems = [
  { href: "/company", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/company/candidates", icon: Users, label: "Candidats" },
  { href: "/company/jobs/new", icon: FilePlus, label: "Publier une offre" },
  { href: "/company/analytics", icon: BarChart3, label: "Analyses" },
  { href: "/company/fair-hiring", icon: ShieldCheck, label: "Recrutement Équitable" },
];

export default function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-[calc(100vh-6rem)]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-background sticky top-24 h-[calc(100vh-6rem)] hidden lg:block">
        <div className="flex flex-col gap-2 p-6">
          <div className="mb-8">
            <p className="text-xs font-bold text-white/20 uppercase tracking-widest px-3 mb-4">Recrutement</p>
            {navItems.map((item: any) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                    isActive 
                      ? "bg-secondary text-white shadow-lg shadow-secondary/20" 
                      : "text-white/40 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <item.icon size={20} />
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              );
            })}
          </div>
          
          <div className="mt-auto">
             <Link
                href="/company/settings"
                className="flex items-center gap-3 p-3 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all"
              >
                <Settings size={20} />
                <span className="font-medium text-sm">Paramètres</span>
              </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6 lg:p-10 bg-white/1">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
