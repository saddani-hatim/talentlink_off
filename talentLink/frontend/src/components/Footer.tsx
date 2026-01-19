"use client";

import Link from "next/link";
import { Rocket, Twitter, Linkedin, Github, Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative mt-20 pb-12 pt-24 border-t border-white/5 overflow-hidden">
      {/* Decorative background blur */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-6 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center glow-primary group-hover:scale-110 transition-transform">
                <Rocket className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-bold tracking-tight">
                Talent<span className="text-primary">Link</span>
              </span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              La plateforme de recrutement nouvelle génération propulsée par l'intelligence artificielle Gemini 3.
            </p>
            <div className="flex gap-4">
              {[Twitter, Linkedin, Github].map((Icon, i) => (
                <Link key={i} href="#" className="w-10 h-10 glass rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:border-primary/40 transition-all">
                  <Icon size={18} />
                </Link>
              ))}
            </div>
          </div>

          {/* Solutions Column */}
          <div>
            <h4 className="font-bold text-white mb-8 uppercase tracking-widest text-[10px]">Solutions</h4>
            <ul className="space-y-4">
              {[
                { name: "Pour Candidats", href: "/for-candidates" },
                { name: "Pour Entreprises", href: "/for-companies" },
                { name: "À Propos", href: "/about" },
                { name: "Contact", href: "/contact" },
              ].map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-white/40 hover:text-primary transition-colors text-sm font-medium">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ressources Column */}
          <div>
            <h4 className="font-bold text-white mb-8 uppercase tracking-widest text-[10px]">Ressources</h4>
            <ul className="space-y-4">
              {[
                { name: "Blog", href: "#" },
                { name: "Aide & Support", href: "/contact" },
                { name: "Documentation", href: "#" },
                { name: "Carrières", href: "#" },
              ].map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-white/40 hover:text-primary transition-colors text-sm font-medium">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="space-y-6">
            <h4 className="font-bold text-white mb-8 uppercase tracking-widest text-[10px]">Contact Rapide</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-4 text-white/40 group">
                <MapPin size={18} className="text-primary shrink-0" />
                <span className="text-sm group-hover:text-white transition-colors">Casablanca, Maroc - AI Campus</span>
              </div>
              <div className="flex items-center gap-4 text-white/40 group">
                <Mail size={18} className="text-primary shrink-0" />
                <span className="text-sm group-hover:text-white transition-colors">hello@talentlink.ai</span>
              </div>
              <div className="flex items-center gap-4 text-white/40 group">
                <Phone size={18} className="text-primary shrink-0" />
                <span className="text-sm group-hover:text-white transition-colors">+212 600 000 000</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/20 text-xs font-medium">
            © 2026 TalentLink AI. Conçu par <Link href="/about" className="text-primary hover:underline">Hatim Saddani</Link>.
          </p>
          <div className="flex gap-8">
            <Link href="#" className="text-white/20 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">Confidentialité</Link>
            <Link href="#" className="text-white/20 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">Mentions Légales</Link>
            <Link href="#" className="text-white/20 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
