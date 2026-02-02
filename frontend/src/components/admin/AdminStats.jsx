import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Calendar,
  TrendingUp,
  UserCheck,
  Award,
  ArrowUpRight,
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
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-100/60 dark:bg-green-500/10",
  },
  {
    icon: TrendingUp,
    key: "activeEvents",
    label: "Active Events",
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-100/60 dark:bg-purple-500/10",
  },
  {
    icon: UserCheck,
    key: "totalParticipations",
    label: "Participations",
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-100/60 dark:bg-orange-500/10",
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
      {statItems.map((item, index) => (
        <motion.div
          key={item.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: index * 0.1 }}
        >
          <Card className="group relative overflow-hidden rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
            <CardContent className="p-6">
              {/* Icon + Badge */}
              <div className="flex justify-between items-start mb-4">
                <div
                  className={`p-3 rounded-2xl ${item.bg} ${item.color} transition-transform group-hover:rotate-6`}
                >
                  <item.icon className="h-6 w-6" />
                </div>

                <span className="flex items-center text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-500/10 px-2 py-1 rounded-lg">
                  <ArrowUpRight size={12} className="mr-0.5" />
                  LIVE
                </span>
              </div>

              {/* Text */}
              <div className="space-y-1">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  {item.label}
                </p>
                <h3 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                  {stats[item.key]?.toLocaleString() ?? 0}
                </h3>
              </div>

              {/* Decorative Icon */}
              <div className="pointer-events-none absolute -right-6 -bottom-6 opacity-[0.04] dark:opacity-[0.06] transition-transform group-hover:scale-110">
                <item.icon size={110} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default AdminStats;
