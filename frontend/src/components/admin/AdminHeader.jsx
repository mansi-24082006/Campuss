import React from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ShieldCheck, BadgeCheck } from "lucide-react";
import { getAvatarUrl } from "@/lib/avatar";

const AdminHeader = ({ user }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12"
    >
      {/* --- User Profile Section --- */}
      <div className="flex items-center space-x-6 group">
        <div className="relative">
          <Avatar className="h-20 w-20 border-4 border-white shadow-2xl transition-transform group-hover:scale-105 duration-500">
            <AvatarImage src={getAvatarUrl(user)} alt={user?.fullName} />
            <AvatarFallback className="bg-indigo-600 text-white font-black text-2xl">
              {user?.fullName?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {/* Status Indicator Badge */}
          <div className="absolute -bottom-1 -right-1 bg-emerald-500 border-4 border-slate-50 w-7 h-7 rounded-full flex items-center justify-center text-white shadow-lg">
            <BadgeCheck size={14} />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
              System Control
            </h1>
            <span className="hidden sm:inline-block px-3 py-1 rounded-lg bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] border border-indigo-100">
              Root Access
            </span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <ShieldCheck size={16} className="text-indigo-500" />
            <p className="text-slate-500 font-bold text-sm">
              Administrator:{" "}
              <span className="text-slate-900 underline decoration-indigo-200 decoration-2 underline-offset-4">
                {user?.fullName}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* --- Quick Date/Status Card --- */}
      <div className="hidden lg:flex items-center gap-4 bg-white border border-slate-200/60 p-4 px-8 rounded-[2rem] shadow-xl shadow-slate-200/20">
        <div className="text-right">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">
            Core Session
          </p>
          <p className="text-sm font-black text-emerald-600 flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            READY & ACTIVE
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminHeader;
