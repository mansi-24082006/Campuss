import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Calendar,
  TrendingUp,
  UserCheck,
  Award,
  Clock, // Added for pending approvals
} from "lucide-react";

/* -------------------- STATS CONFIG -------------------- */
const statItems = [
  {
    icon: Users,
    key: "totalUsers",
    label: "Total Users",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100/60 dark:bg-blue-500/10",
  },
  {
    icon: Calendar,
    key: "totalEvents",
    label: "Total Events",
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-100/60 dark:bg-indigo-500/10",
  },
  {
    icon: TrendingUp, // Better suited for "Active"
    key: "activeEvents",
    label: "Active Events",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100/60 dark:bg-emerald-500/10",
  },
  {
    icon: Clock, // Changed from Calendar for visual variety
    key: "pendingApprovals",
    label: "Pending",
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-100/60 dark:bg-orange-500/10",
  },
  {
    icon: UserCheck,
    key: "totalParticipations",
    label: "Entries",
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-100/60 dark:bg-purple-500/10",
  },
  {
    icon: Award,
    key: "certificatesIssued",
    label: "Certificates",
    color: "text-yellow-600 dark:text-yellow-400",
    bg: "bg-yellow-100/60 dark:bg-yellow-500/10",
  },
];

/* -------------------- COMPONENT -------------------- */
const AdminStats = ({ stats = {} }) => {
  return (
    /* grid-cols-1: Mobile
       sm:grid-cols-2: Small tablets
       lg:grid-cols-3: Large tablets/Small laptops
       xl:grid-cols-6: Full desktop (Single Row)
    */
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-10">
      {statItems.map((item, index) => {
        const value =
          typeof stats[item.key] === "number"
            ? stats[item.key]
            : 0;

        return (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <Card className="group relative overflow-hidden rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              {/* Reduced padding from p-6 to p-4 to fit 6 in a row better */}
              <CardContent className="p-4 sm:p-5">
                <div className="flex justify-between items-start mb-3">
                  <div
                    className={`p-2.5 rounded-xl ${item.bg} ${item.color} transition-transform duration-300 group-hover:rotate-6`}
                  >
                    <item.icon className="h-5 w-5" />
                  </div>

                  <span className="flex items-center text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
                    LIVE
                  </span>
                </div>

                <div className="space-y-0.5 relative z-10">
                  <p className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 truncate">
                    {item.label}
                  </p>
                  <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                    {value.toLocaleString()}
                  </h3>
                </div>

                {/* Decorative Background Icon - slightly smaller */}
                <div className="pointer-events-none absolute -right-4 -bottom-4 opacity-[0.03] dark:opacity-[0.05] transition-transform duration-300 group-hover:scale-110">
                  <item.icon size={80} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default AdminStats;