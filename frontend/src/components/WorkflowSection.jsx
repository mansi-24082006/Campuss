import React from "react";
import { motion } from "framer-motion";
import {
  LogIn,
  Calendar,
  Mail,
  Bell,
  CheckCircle2,
  Trophy,
  Database,
  LayoutDashboard
} from "lucide-react";

const WorkflowSection = () => {
  const steps = [
    {
      title: "Authentication Layer",
      desc: "Secure Login/Signup with automated Role Identification for Students, Faculty, and Admins.",
      icon: LogIn,
      accent: "indigo",
      details: ["User Authentication", "Role-Based Access Control", "JWT Protection"]
    },
    {
      title: "Event Lifecycle",
      desc: "Faculty creates events which are then verified and published by Administrators.",
      icon: Calendar,
      accent: "blue",
      details: ["Admin Verification", "Expert/Speaker Info", "Venue Management"]
    },
    {
      title: "Smart Engagement",
      desc: "Students search, filter, and register with one-click. Automated confirmation emails sent.",
      icon: Mail,
      accent: "violet",
      details: ["Tech/Non-Tech Filters", "Branch discovery", "One-Click RSVP"]
    },
    {
      title: "Automation Engine",
      desc: "Scheduled cron jobs trigger reminders 24h & 1h before events start.",
      icon: Bell,
      accent: "amber",
      details: ["Auto-trigger Reminders", "In-app Alerts", "Email Sync"]
    },
    {
      title: "Participation Logic",
      desc: "Faculty marks attendance. Only verified attendees are eligible for certificates.",
      icon: CheckCircle2,
      accent: "emerald",
      details: ["Presence Tracking", "Condition Check", "Data Integrity"]
    },
    {
      title: "Results & Rewards",
      desc: "Faculty uploads results. System calculates points and updates individual rankings.",
      icon: Trophy,
      accent: "rose",
      details: ["Auto-Certificates", "Global Leaderboard", "Performance Points"]
    }
  ];

  // Map accents to Tailwind classes safely
  const accentMap = {
    indigo: "hover:shadow-indigo-500/10 border-indigo-500",
    blue: "hover:shadow-blue-500/10 border-blue-500",
    violet: "hover:shadow-violet-500/10 border-violet-500",
    amber: "hover:shadow-amber-500/10 border-amber-500",
    emerald: "hover:shadow-emerald-500/10 border-emerald-500",
    rose: "hover:shadow-rose-500/10 border-rose-500",
  };

  return (
    <section className="py-32 px-4 md:px-8 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-slate-900 leading-[1.1]">
              Automated <span className="text-indigo-600">Event Workflow</span>
            </h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto font-medium">
              A streamlined, light-speed engine designed for modern campus management.
            </p>
          </motion.div>
        </div>

        <div className="relative">
          {/* Vertical path line */}
          <div className="absolute left-[50%] top-0 bottom-0 w-[1px] bg-slate-100 hidden lg:block" />

          <div className="space-y-16 lg:space-y-24">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: idx * 0.1 }}
                className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-20 ${idx % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                  }`}
              >
                {/* Text Content */}
                <div className={`flex-1 w-full ${idx % 2 === 0 ? "lg:text-right" : "lg:text-left"}`}>
                  <motion.div 
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    className={`inline-flex p-4 rounded-[1.5rem] bg-white border border-slate-100 mb-6 shadow-xl shadow-slate-200/40 transition-all duration-500`}
                  >
                    <step.icon className={`h-8 w-8 text-indigo-600`} />
                  </motion.div>
                  <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter">{step.title}</h3>
                  <p className="text-slate-500 text-lg leading-relaxed max-w-sm ml-auto mr-auto lg:mx-0 font-medium">
                    {step.desc}
                  </p>
                </div>

                {/* Center Pulse Point */}
                <div className="relative z-10 hidden lg:flex items-center justify-center w-12 h-12 bg-white border border-slate-100 rounded-full shadow-lg">
                  <div className={`w-3 h-3 rounded-full bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.5)]`} />
                  <div className="absolute inset-0 rounded-full border-2 border-indigo-100 animate-ping opacity-20" />
                </div>

                {/* Hover-Effect Card */}
                <div className="flex-1 w-full">
                  <motion.div
                    whileHover={{ y: -12, scale: 1.03 }}
                    className={`bg-white p-10 rounded-[3rem] border border-slate-100 relative group transition-all duration-700
                      shadow-[0_20px_50px_-20px_rgba(0,0,0,0.08)] 
                      hover:shadow-[0_40px_80px_-30px_rgba(79,70,229,0.2)]
                      border-t-8 border-t-indigo-600/5 hover:border-t-indigo-600`}
                  >
                    <div className="flex items-center justify-between mb-8">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Module Precision {idx + 1}</span>
                      <div className="flex gap-1.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-slate-100 group-hover:bg-indigo-200 transition-colors" />
                        <div className="h-1.5 w-1.5 rounded-full bg-slate-100 group-hover:bg-indigo-300 transition-colors" />
                        <div className="h-1.5 w-1.5 rounded-full bg-slate-100 group-hover:bg-indigo-400 transition-colors" />
                      </div>
                    </div>

                    <ul className="space-y-5">
                      {step.details.map((detail, dIdx) => (
                        <li key={dIdx} className="flex items-center gap-4 text-slate-600 font-black text-sm group-hover:text-slate-900 transition-all duration-300 group-hover:translate-x-1">
                          <div className={`h-2 w-2 rounded-full bg-indigo-600/20 group-hover:bg-indigo-600 shadow-sm transition-all`} />
                          {detail}
                        </li>
                      ))}
                    </ul>

                    {/* Subtle Internal Glow on Hover */}
                    <div className={`absolute inset-0 rounded-[3rem] bg-gradient-to-br from-indigo-500/0 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;