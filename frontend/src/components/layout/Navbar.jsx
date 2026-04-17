import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Settings,
  Home,
  Sparkles,
  ShieldCheck,
  Users as UsersIcon,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getAvatarUrl } from "@/lib/avatar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import NotificationCenter from "@/components/NotificationCenter";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mounted, setMounted] = useState(false);

  const profileRef = useRef(null);
  const navRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClickOutside = useCallback((event) => {
    if (profileRef.current && !profileRef.current.contains(event.target)) {
      setShowProfileMenu(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const navLinks = [
    { name: "Home", path: "/", icon: Home },
    { name: "Features", path: "/features", icon: Sparkles },
    { name: "About", path: "/about", icon: UsersIcon },
    { name: "Contact", path: "/contact", icon: ShieldCheck },
  ];

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    setIsOpen(false);
    navigate("/login");
  };

  if (!mounted) return null;

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-md border-b border-slate-100 h-20 flex items-center justify-center transition-all duration-300"
      >
        <div className="w-full max-w-7xl px-4 sm:px-8 flex items-center justify-between">

          {/* Logo Section with favicon.png */}
          <Link to="/" className="flex items-center gap-3 group relative shrink-0">
            <div className="relative p-1.5 bg-white rounded-[14px] shadow-lg shadow-indigo-600/10 border border-slate-100 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
              <img
                src="/favicon.png"
                alt="CampusBuzz Logo"
                className="h-8 w-8 object-contain"
              />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-white animate-ping" />
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="text-xl md:text-2xl font-black tracking-tighter text-slate-900">
                CampusBuzz
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600/60">
                Hub of Hubs
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1.5 p-1 bg-slate-50/80 rounded-2xl border border-slate-200/40">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`
                  px-5 py-2.5 text-[12px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center gap-2
                  ${isActive(link.path)
                    ? "text-white bg-indigo-600 shadow-lg shadow-indigo-600/20"
                    : "text-slate-500 hover:text-indigo-600 hover:bg-white"
                  }
                `}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Action Center */}
          <div className="flex items-center gap-2 sm:gap-4">
            {user ? (
              <div className="flex items-center gap-2 sm:gap-3" ref={profileRef}>
                <NotificationCenter />

                <div className="relative hidden lg:block">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2.5 p-1.5 pr-4 bg-slate-50/80 border border-slate-200/60 rounded-[1.25rem] group transition-all hover:bg-white hover:border-indigo-200"
                  >
                    <Avatar className="h-9 w-9 border-2 border-white shadow-sm transition-transform duration-300">
                      <AvatarImage src={getAvatarUrl(user)} />
                      <AvatarFallback className="bg-indigo-600 text-white text-xs font-black">
                        {user.fullName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="text-[11px] font-black text-slate-900 leading-none">
                        {(user.fullName || "User").split(" ")[0]}
                      </p>
                      <p className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest mt-0.5 opacity-60">
                        {user.role || "Member"}
                      </p>
                    </div>
                    <ChevronDown size={14} className={`text-slate-400 transition-transform duration-500 ${showProfileMenu ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {showProfileMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-64 bg-white border border-slate-200/60 rounded-3xl shadow-2xl shadow-indigo-600/10 py-2.5 z-50 overflow-hidden"
                      >
                        <div className="px-4 py-4 mb-2 bg-slate-50/50 flex items-center gap-3 mx-2 rounded-2xl border border-slate-100">
                          <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                            <AvatarImage src={getAvatarUrl(user)} />
                            <AvatarFallback className="bg-white text-indigo-600 font-black">
                              {(user.fullName || "U").charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col min-w-0">
                            <p className="text-sm font-black text-slate-900 truncate">{user.fullName || "User"}</p>
                            <p className="text-[10px] text-slate-500 font-bold truncate opacity-70">{user.email}</p>
                          </div>
                        </div>
                        <div className="px-2 space-y-1">
                          <Link
                            to={`/${user.role?.toLowerCase() || 'student'}`}
                            className="flex items-center gap-3 px-3 py-3 text-[12px] font-black uppercase tracking-widest text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-2xl transition-all group"
                            onClick={() => setShowProfileMenu(false)}
                          >
                            <LayoutDashboard size={16} className="text-slate-400 group-hover:text-indigo-600 transition-colors" /> Dashboard
                          </Link>
                          <Link
                            to="/settings"
                            className="flex items-center gap-3 px-3 py-3 text-[12px] font-black uppercase tracking-widest text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-2xl transition-all group"
                            onClick={() => setShowProfileMenu(false)}
                          >
                            <Settings size={16} className="text-slate-400 group-hover:text-indigo-600 transition-colors" /> Settings
                          </Link>
                          <div className="h-px bg-slate-100 mx-2 my-1" />
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-3 text-[12px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 rounded-2xl transition-all group"
                          >
                            <LogOut size={16} className="text-red-400 group-hover:text-red-500 transition-colors" /> Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" className="text-slate-600 hover:text-indigo-600 font-black uppercase tracking-widest text-[11px] rounded-2xl h-11 px-6">Login</Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-[11px] rounded-2xl h-11 px-6 shadow-xl shadow-indigo-600/20 active:scale-95 transition-all">Sign Up</Button>
                </Link>
              </div>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2.5 text-slate-600 hover:text-indigo-600 bg-slate-50 border border-slate-200/60 rounded-xl transition-all active:scale-90"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[150] lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl flex flex-col z-[151] overflow-hidden"
            >
              {/* Mobile Drawer Header with favicon.png */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-white rounded-lg shadow-sm border border-slate-100">
                    <img src="/favicon.png" alt="Logo" className="h-6 w-6 object-contain" />
                  </div>
                  <div className="flex flex-col -space-y-1">
                    <span className="text-lg font-black tracking-tight text-slate-900 leading-none">CampusBuzz</span>
                    <span className="text-[9px] font-bold text-indigo-600/60 uppercase tracking-widest">Premium Hub</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <X size={20} className="text-slate-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
                {user && (
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Account</p>
                    <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-4">
                      <Avatar className="h-14 w-14 border-4 border-white shadow-md">
                        <AvatarImage src={getAvatarUrl(user)} />
                        <AvatarFallback className="bg-indigo-600 text-white font-black text-lg">
                          {user.fullName?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-base font-black text-slate-900 leading-tight">{user.fullName || "User"}</span>
                        <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest mt-0.5 opacity-75">{user.role}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Explore</p>
                  <nav className="grid gap-2">
                    {navLinks.map((link) => (
                      <Link
                        key={link.name}
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className={`
                          flex items-center justify-between p-4 rounded-2xl transition-all font-black uppercase tracking-widest text-[13px] group
                          ${isActive(link.path)
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                            : "bg-white border border-slate-100 text-slate-600 hover:border-indigo-100 hover:bg-indigo-50/30 hover:text-indigo-600"
                          }
                        `}
                      >
                        <div className="flex items-center gap-4">
                          <link.icon size={20} className={isActive(link.path) ? "text-white" : "text-slate-400 group-hover:text-indigo-600"} />
                          {link.name}
                        </div>
                        <ArrowRight size={16} className={`opacity-0 group-hover:opacity-100 transition-all ${isActive(link.path) ? "opacity-100" : ""}`} />
                      </Link>
                    ))}
                  </nav>
                </div>

                {user && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Dashboard</p>
                    <div className="grid gap-4">
                      <Link
                        to={`/${user.role?.toLowerCase() || 'student'}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-4 p-4 text-[13px] font-black uppercase tracking-widest text-slate-600 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors"
                      >
                        <LayoutDashboard size={20} className="text-slate-400" />
                        Dashboard
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-4 p-4 text-[13px] font-black uppercase tracking-widest text-slate-600 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors"
                      >
                        <Settings size={20} className="text-slate-400" />
                        Settings
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-3 p-4 bg-red-50 text-red-600 font-black uppercase tracking-widest text-[13px] rounded-2xl hover:bg-red-100 transition-colors border border-red-100"
                  >
                    <LogOut size={20} />
                    Sign Out
                  </button>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[12px] border-2 border-slate-200 hover:bg-slate-50 text-slate-700">Login</Button>
                    </Link>
                    <Link to="/register" onClick={() => setIsOpen(false)}>
                      <Button className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-[12px] shadow-lg shadow-indigo-600/20">Sign Up Free</Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;