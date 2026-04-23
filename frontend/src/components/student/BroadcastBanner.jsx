import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Megaphone, X, ArrowRight, Zap } from "lucide-react";
import api from "@/lib/axios";
import { Link } from "react-router-dom";

const BroadcastBanner = () => {
  const [latestBroadcast, setLatestBroadcast] = useState(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const fetchLatestBroadcast = async () => {
      try {
        const { data } = await api.get("/notifications");
        // Look for faculty announcements (starting with 📢 FROM FACULTY:)
        const facultyMsg = data.find(n => n.message.includes("📢 FROM FACULTY:") && !n.read);
        if (facultyMsg) {
          setLatestBroadcast(facultyMsg);
        }
      } catch (error) {
        console.error("Error fetching broadcast:", error);
      }
    };

    fetchLatestBroadcast();
    const interval = setInterval(fetchLatestBroadcast, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  if (!latestBroadcast || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative group mb-10"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 rounded-[2.5rem] blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
        
        <div className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10">
          {/* Animated Background Decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl -ml-24 -mb-24" />

          <div className="flex items-center gap-6 relative z-10">
            <div className="flex-shrink-0 w-16 h-16 bg-indigo-600/20 rounded-2xl flex items-center justify-center border border-indigo-500/30">
              <Megaphone className="text-indigo-400 w-8 h-8 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-md border border-indigo-500/30">
                  Faculty Announcement
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-700" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live Alert</span>
              </div>
              <h3 className="text-lg md:text-xl font-black text-white leading-tight">
                {latestBroadcast.message.replace("📢 FROM FACULTY: ", "").replace("📢", "")}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-4 relative z-10 w-full md:w-auto">
            <Link 
              to={latestBroadcast.link || "/student"}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-colors"
            >
              Acknowledge <ArrowRight size={14} />
            </Link>
            <button 
              onClick={() => setIsVisible(false)}
              className="p-3 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl border border-white/5 transition-all"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BroadcastBanner;
