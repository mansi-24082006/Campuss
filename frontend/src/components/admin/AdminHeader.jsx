import React from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ShieldCheck, BadgeCheck } from "lucide-react";

const AdminHeader = ({ user }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10"
    >
      {/* --- User Profile Section --- */}
      <div className="flex items-center space-x-5 group">
        <div className="relative">
          <Avatar className="h-16 w-16 border-2 border-white dark:border-slate-800 shadow-xl ring-4 ring-indigo-50 dark:ring-indigo-900/20 transition-transform group-hover:scale-105">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white font-black text-xl">
              {user?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {/* Status Indicator Badge */}
          <div className="absolute -bottom-1 -right-1 bg-emerald-500 border-4 border-[#F8FAFC] dark:border-slate-950 w-6 h-6 rounded-full flex items-center justify-center text-white">
            <BadgeCheck size={12} />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              System Control
            </h1>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 text-[10px] font-bold uppercase tracking-widest">
              Root Access
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <ShieldCheck size={14} className="text-slate-400" />
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
              Administrator:{" "}
              <span className="text-slate-700 dark:text-slate-200 font-bold">
                {user?.name}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* --- Quick Date/Status Card --- */}
      <div className="hidden lg:flex items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 px-6 rounded-[2rem] shadow-sm">
        <div className="text-right">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Session Status
          </p>
          <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Active Now
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminHeader;
