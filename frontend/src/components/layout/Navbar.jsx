import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  LogOut,
  ChevronDown,
  Bell,
  Sun,
  Moon,
  Trophy,
  LayoutDashboard,
  User as UserIcon,
  Settings,
  Home,
  Search,
  Sparkles,
  Command,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "next-themes";
import { getAvatarUrl } from "@/lib/avatar";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { scrollY } = useScroll();

  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mounted, setMounted] = useState(false);

  const profileRef = useRef(null);
  const navRef = useRef(null);

  // Transform values for scroll animations - only for background opacity and shadow
  const navBgOpacity = useTransform(scrollY, [0, 50], [0.6, 0.9]);
  const navBorderColor = useTransform(
    scrollY,
    [0, 50],
    ["rgba(255, 255, 255, 0.1)", "rgba(255, 255, 255, 0.2)"]
  );
  const navShadow = useTransform(
    scrollY,
    [0, 50],
    ["0px 0px 0px rgba(0,0,0,0)", "0px 10px 30px rgba(0,0,0,0.1)"]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClickOutside = useCallback((event) => {
    if (profileRef.current && !profileRef.current.contains(event.target)) {
      setShowProfileMenu(false);
    }
    if (navRef.current && !navRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  const navLinks = [
    { name: "Home", path: "/", icon: Home },
    { name: "Features", path: "/features", icon: Sparkles },
    { name: "Scoreboard", path: "/scoreboard", icon: Trophy },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    setIsOpen(false);
    navigate("/login");
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) return null;

  return (
    <>
      <motion.nav
        ref={navRef}
        style={{
          boxShadow: navShadow,
        }}
        className="fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ease-out border-b border-white/10 dark:border-slate-800/50"
      >
        <motion.div
          style={{
            backgroundColor: theme === "dark" ? `rgba(2, 6, 23, ${navBgOpacity.get()})` : `rgba(255, 255, 255, ${navBgOpacity.get()})`,
            backdropFilter: "blur(20px)",
          }}
          className="w-full flex items-center justify-center h-20 md:h-22"
        >
          <div className="w-full max-w-7xl px-4 sm:px-8 flex items-center justify-between">

            {/* Logo Section */}
            <Link to="/" className="flex items-center gap-3 group relative">
              <motion.div
                className="relative p-2.5 bg-gradient-to-tr from-indigo-500 via-violet-600 to-fuchsia-600 rounded-xl shadow-lg group-hover:shadow-indigo-500/40 transition-all duration-300 overflow-hidden"
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
              >
                <img
                  src="/favicon.png"
                  alt="CampusBuzz"
                  className="h-6 w-6 object-contain brightness-110"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
              </motion.div>
              <div className="flex flex-col -space-y-1">
                <span className="text-xl md:text-2xl font-black tracking-tighter bg-gradient-to-r from-slate-900 via-indigo-600 to-slate-900 dark:from-white dark:via-indigo-400 dark:to-white bg-clip-text text-transparent">
                  CampusBuzz
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500/80 dark:text-slate-400/80 uppercase">
                  Hub of Hubs
                </span>
              </div>
            </Link>

            {/* Desktop Search Center */}
            <div className="hidden xl:flex flex-1 max-w-md mx-8">
              <div className="relative w-full group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                  <Search size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Search events, clubs..."
                  className="w-full h-11 pl-12 pr-12 bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-500 font-medium"
                />
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <kbd className="hidden sm:flex h-5 select-none items-center gap-1 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-1.5 font-mono text-[10px] font-medium text-slate-500 opacity-100">
                    <Command size={10} /> K
                  </kbd>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`
                      relative px-4 py-2 text-sm font-bold rounded-xl transition-all duration-300
                      ${isActive
                        ? "text-indigo-600 dark:text-indigo-400 font-extrabold"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-900/50"
                      }
                    `}
                  >
                    <span className="relative z-10">{link.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="nav-active-bg"
                        className="absolute inset-0 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl -z-0"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Action Center */}
            <div className="flex items-center gap-3 ml-4">
              {/* Theme Toggle */}
              <motion.button
                onClick={toggleTheme}
                className="p-2.5 bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 rounded-xl text-slate-600 dark:text-slate-400 hover:text-indigo-500 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </motion.button>

              {user ? (
                <div className="flex items-center gap-3" ref={profileRef}>
                  {/* Notifications */}
                  <motion.button
                    className="relative p-2.5 bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 rounded-xl text-slate-600 dark:text-slate-400 hover:text-indigo-500 transition-colors group"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full ring-2 ring-white dark:ring-slate-950 animate-pulse" />
                  </motion.button>

                  {/* Profile Trigger */}
                  <div className="relative">
                    <motion.button
                      onClick={() => setShowProfileMenu(!showProfileMenu)}
                      className="flex items-center gap-2 p-1 pr-3 bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl group transition-all"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="w-9 h-9 rounded-xl overflow-hidden shadow-md group-hover:ring-2 ring-indigo-500 transition-all">
                        <img
                          src={getAvatarUrl(user)}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <ChevronDown size={14} className={`text-slate-400 dark:text-slate-500 transition-transform duration-300 ${showProfileMenu ? 'rotate-180 text-indigo-500' : ''}`} />
                    </motion.button>

                    {/* Profile Menu Dropdown */}
                    <AnimatePresence>
                      {showProfileMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: 15, scale: 0.95, filter: "blur(10px)" }}
                          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                          exit={{ opacity: 0, y: 15, scale: 0.95, filter: "blur(10px)" }}
                          className="absolute right-0 mt-3 w-72 bg-white/90 dark:bg-slate-950/90 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 shadow-2xl rounded-3xl overflow-hidden p-2"
                        >
                          <div className="p-4 mb-2 bg-slate-50 dark:bg-slate-900/50 rounded-2xl">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 p-0.5">
                                <img src={getAvatarUrl(user)} className="w-full h-full rounded-[10px] object-cover" alt="" />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-900 dark:text-white truncate max-w-[150px]">
                                  {user?.name || user?.email?.split('@')[0]}
                                </span>
                                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                  {user?.role || 'Student'}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <ProfileMenuItem
                              icon={<LayoutDashboard size={18} />}
                              label="Dashboard"
                              onClick={() => navigate(`/${user?.role?.toLowerCase() || 'student'}`)}
                            />
                            <ProfileMenuItem
                              icon={<UserIcon size={18} />}
                              label="My Profile"
                              onClick={() => navigate(`/${user?.role?.toLowerCase() || 'student'}/profile`)}
                            />
                            <ProfileMenuItem
                              icon={<Settings size={18} />}
                              label="Preferences"
                            />
                            <hr className="my-2 border-slate-100 dark:border-slate-800 mx-2" />
                            <ProfileMenuItem
                              icon={<LogOut size={18} />}
                              label="Sign Out"
                              variant="danger"
                              onClick={handleLogout}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login">
                    <Button variant="ghost" className="hidden sm:flex font-bold rounded-xl px-5 transition-all text-slate-600 dark:text-slate-400 hover:text-indigo-500">
                      Log in
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2.5 bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 rounded-xl text-slate-600 dark:text-slate-400"
              whileTap={{ scale: 0.9 }}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </motion.div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-md z-[101]"
            />
            <motion.div
              initial={{ x: "100%", filter: "blur(10px)" }}
              animate={{ x: 0, filter: "blur(0px)" }}
              exit={{ x: "100%", filter: "blur(10px)" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-[400px] bg-white dark:bg-slate-950 z-[102] flex flex-col shadow-2xl p-6 md:p-10 border-l border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-center justify-between mb-12">
                <span className="text-2xl font-black text-indigo-600">Menu</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-3 bg-slate-100 dark:bg-slate-900 rounded-2xl hover:rotate-90 transition-transform duration-300"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 space-y-4">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-6 p-4 rounded-3xl hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all group"
                    >
                      <div className="w-12 h-12 flex items-center justify-center bg-slate-100 dark:bg-slate-900 rounded-xl group-hover:scale-110 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20 text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 transition-all">
                        {link.icon ? <link.icon size={24} /> : <Home size={24} />}
                      </div>
                      <span className="text-xl font-bold dark:text-white">{link.name}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
                {!user ? (
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="h-16 text-lg font-bold rounded-2xl border-2"
                      onClick={() => { navigate("/login"); setIsOpen(false); }}
                    >
                      Login
                    </Button>
                    <Button
                      className="h-16 text-lg font-bold rounded-2xl bg-indigo-600 shadow-lg"
                      onClick={() => { navigate("/signup"); setIsOpen(false); }}
                    >
                      Join
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="destructive"
                    className="w-full h-16 text-lg font-bold rounded-2xl"
                    onClick={handleLogout}
                  >
                    Sign Out
                  </Button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

const ProfileMenuItem = ({ icon, label, onClick, variant = "default" }) => (
  <button
    onClick={onClick}
    className={`
      w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all group
      ${variant === "danger"
        ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
        : "text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400"
      }
    `}
  >
    <div className={`
      p-1.5 rounded-lg transition-colors
      ${variant === "danger"
        ? "bg-red-100/50 dark:bg-red-500/20 group-hover:bg-red-100 dark:group-hover:bg-red-500/30"
        : "bg-slate-100 dark:bg-slate-900 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20"
      }
    `}>
      {icon}
    </div>
    <span>{label}</span>
  </button>
);

export default Navbar;
