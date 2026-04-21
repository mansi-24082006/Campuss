import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  TrendingUp,
  UserPlus,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

/* -------------------- STATS CONFIG -------------------- */
const statItems = [
  {
    icon: UserPlus,
    key: "studentCount",
    label: "Students",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: ShieldCheck,
    key: "facultyCount",
    label: "Faculty",
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    icon: Calendar,
    key: "totalEvents",
    label: "Total Events",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    icon: TrendingUp,
    key: "activeEvents",
    label: "Active",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: CheckCircle2,
    key: "pendingApprovals",
    label: "Pending",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
];

/* -------------------- COMPONENT -------------------- */
const AdminStats = ({ stats = {} }) => {
  return (
    /* FIXED: Changed to grid-cols-5 on large screens to keep everything in one line.
       Added min-w-max so cards don't get too squished on medium screens.
    */
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      {statItems.map((item, index) => {
        const value = typeof stats[item.key] === "number" ? stats[item.key] : 0;

        return (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card className="group relative overflow-hidden rounded-[1.25rem] border border-slate-200/60 bg-white hover-lift">
              <CardContent className="p-4 sm:p-5">
                <div className="flex justify-between items-start mb-3">
                  <div
                    className={`p-2.5 rounded-xl ${item.bg} ${item.color} transition-transform duration-500 group-hover:rotate-12`}
                  >
                    <item.icon className="h-4 w-4 md:h-5 md:w-5" />
                  </div>

                  <span className="flex items-center text-[8px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-100">
                    LIVE
                  </span>
                </div>

                <div className="space-y-0.5 relative z-10">
                  <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 truncate">
                    {item.label}
                  </p>
                  <h3 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
                    {value.toLocaleString()}
                  </h3>
                </div>

                {/* Decorative Background Icon */}
                <div className="pointer-events-none absolute -right-3 -bottom-3 opacity-[0.03] transition-transform duration-500 group-hover:scale-110">
                  <item.icon size={60} />
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