import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Rocket, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { 
  User as UserIcon, 
  LogOut, 
  LayoutDashboard, 
  ChevronDown, 
  Settings, 
  Briefcase, 
  Target, 
  UserCircle 
} from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const dashboardLink = user?.role === 'COMPANY' ? '/for-companies' : '/for-candidates';

  const userLinks = user?.role === 'COMPANY' ? [
    { label: 'Tableau de bord', href: '/for-companies', icon: <LayoutDashboard size={14} /> },
    { label: 'Profil Entreprise', href: '/company', icon: <UserCircle size={14} /> },
    { label: 'Offres d\'emploi', href: '/company/jobs', icon: <Briefcase size={14} /> },
    { label: 'Paramètres', href: '/settings', icon: <Settings size={14} /> },
  ] : [
    { label: 'Tableau de bord', href: '/for-candidates', icon: <LayoutDashboard size={14} /> },
    { label: 'Mon Profil', href: '/candidate', icon: <UserCircle size={14} /> },
    { label: 'Feuille de route', href: '/candidate/roadmap', icon: <Target size={14} /> },
    { label: 'Paramètres', href: '/settings', icon: <Settings size={14} /> },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "py-4" : "py-6"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className={`glass rounded-2xl px-6 py-3 flex items-center justify-between transition-all duration-300 ${
          isScrolled ? "bg-opacity-80 backdrop-blur-lg border-white/10" : "bg-opacity-20 backdrop-blur-md border-white/5"
        }`}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center glow-primary group-hover:scale-110 transition-transform">
              <Rocket className="text-primary w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight font-[family-name:var(--font-syne)]">
              Talent<span className="text-primary">Link</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/about" className="hover:text-primary transition-colors font-medium text-sm">À propos</Link>
            <Link href="/contact" className="hover:text-primary transition-colors font-medium text-sm">Contact</Link>
          </div>

          {/* CTA Buttons / User Profile */}
          <div className="hidden md:flex items-center gap-4">
            {!user ? (
              <>
                <Link 
                  href="/login" 
                  className="px-6 py-2 rounded-xl font-medium hover:bg-white/5 transition-colors text-sm"
                >
                  Connexion
                </Link>
                <Link 
                  href="/register" 
                  className="px-6 py-2 bg-primary text-white rounded-xl font-medium hover:opacity-90 transition-opacity glow-primary text-sm shadow-lg shadow-primary/20"
                >
                  S'inscrire
                </Link>
              </>
            ) : (
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 p-1.5 pr-4 glass rounded-2xl hover:bg-white/5 transition-all group"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-black uppercase tracking-widest text-primary leading-none mb-1">{user.role}</span>
                    <span className="text-sm font-bold leading-none">{user.name}</span>
                  </div>
                  <ChevronDown size={14} className={`text-white/40 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <>
                      <div className="fixed inset-0 z-[-1]" onClick={() => setIsProfileOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute top-full right-0 mt-4 w-64 glass rounded-[2rem] p-4 shadow-2xl border-white/10 backdrop-blur-3xl overflow-hidden"
                      >
                        <div className="space-y-1">
                          {userLinks.map((link, i) => (
                            <Link 
                              key={i} 
                              href={link.href}
                              onClick={() => setIsProfileOpen(false)}
                              className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-sm font-medium transition-colors group"
                            >
                              <div className="p-2 bg-white/5 rounded-lg text-white/40 group-hover:text-primary transition-colors">
                                {link.icon}
                              </div>
                              {link.label}
                            </Link>
                          ))}
                        </div>
                        <hr className="my-3 border-white/10" />
                        <button 
                          onClick={() => {
                            logout();
                            setIsProfileOpen(false);
                          }}
                          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 text-sm font-bold text-red-500 transition-colors group"
                        >
                          <div className="p-2 bg-red-500/5 rounded-lg text-red-500/60 group-hover:text-red-500 transition-colors">
                            <LogOut size={14} />
                          </div>
                          Déconnexion
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-white/70"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 px-6 py-4 md:hidden"
          >
            <div className="glass rounded-[2rem] p-6 flex flex-col gap-4 border-white/10 shadow-2xl backdrop-blur-2xl">
              <Link href="/about" className="flex items-center gap-3 text-lg font-medium p-2 hover:text-primary transition-colors">
                À propos
              </Link>
              <Link href="/contact" className="flex items-center gap-3 text-lg font-medium p-2 hover:text-primary transition-colors">
                <Mail size={20} /> Contact
              </Link>
              <hr className="border-white/10" />
              {!user ? (
                <>
                  <Link href="/login" className="text-center py-3 font-bold hover:text-primary transition-colors">Connexion</Link>
                  <Link href="/register" className="bg-primary text-white py-4 rounded-2xl text-center font-bold shadow-lg shadow-primary/20">S'inscrire</Link>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-4 mb-4 p-4 glass rounded-2xl">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white font-black text-xl">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase text-primary">{user.role}</p>
                      <p className="font-bold">{user.name}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {userLinks.map((link, i) => (
                      <Link 
                        key={i} 
                        href={link.href}
                        className="flex flex-col items-center gap-2 p-4 glass rounded-2xl text-xs font-bold hover:text-primary transition-colors"
                      >
                        {link.icon}
                        <span>{link.label}</span>
                      </Link>
                    ))}
                  </div>
                  <button 
                    onClick={() => logout()}
                    className="bg-red-500/10 text-red-500 py-4 rounded-2xl text-center font-bold flex items-center justify-center gap-2"
                  >
                    <LogOut size={20} /> Déconnexion
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
