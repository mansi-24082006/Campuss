
import React from "react";
import { motion } from "framer-motion";
import { 
  UserPlus, 
  LogIn, 
  ShieldCheck, 
  Calendar, 
  Mail, 
  Bell, 
  CheckCircle2, 
  Award, 
  Trophy, 
  BarChart3,
  ArrowRight,
  Database
} from "lucide-react";

const WorkflowSection = () => {
  const steps = [
    {
      title: "Authentication Layer",
      desc: "Secure Login/Signup with automated Role Identification (Student | Faculty | Admin).",
      icon: LogIn,
      color: "bg-blue-500",
      details: ["User Authentication", "Role-Based Access Control", "Encrypted Passwords"]
    },
    {
      title: "Event Lifecycle",
      desc: "Faculty creates events which are then verified and published by Administrators.",
      icon: Calendar,
      color: "bg-indigo-500",
      details: ["Admin Verification", "Expert/Speaker Info", "Venue & Time Management"]
    },
    {
      title: "Smart Engagement",
      desc: "Students search, filter, and register with one-click. Automated confirmation emails sent.",
      icon: Mail,
      color: "bg-purple-500",
      details: ["Tech/Non-Tech Filters", "Branch-wise discovery", "Google Calendar Sync"]
    },
    {
      title: "Automation Engine",
      desc: "Scheduled cron jobs trigger reminders 24h & 1h before events start.",
      icon: Bell,
      color: "bg-amber-500",
      details: ["Auto-trigger Reminders", "In-app Alerts", "Email Notifications"]
    },
    {
      title: "Participation Logic",
      desc: "Faculty marks attendance. Only verified attendees are eligible for certificates.",
      icon: CheckCircle2,
      color: "bg-emerald-500",
      details: ["Presence Tracking", "Condition Check", "Data Integrity"]
    },
    {
      title: "Results & Rewards",
      desc: "Faculty uploads results. System calculates points and updates individual rankings.",
      icon: Trophy,
      color: "bg-rose-500",
      details: ["Auto-generated Certificates", "Global Leaderboard", "Performance Points"]
    },
    {
      title: "Analytics & Feedback",
      desc: "Post-event feedback feeds into Admin analytics for performance tracking.",
      icon: BarChart3,
      color: "bg-cyan-500",
      details: ["Student Ratings", "Participation Metrics", "Category Popularity"]
    }
  ];

  return (
    <section className="py-24 px-4 md:px-8 bg-slate-50 dark:bg-slate-900/50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black mb-6 tracking-tight dark:text-white"
          >
            The Perfect <span className="text-indigo-600">Workflow</span>
          </motion.h2>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Our end-to-end automated system ensures zero manual errors and a seamless experience for every role.
          </p>
        </div>

        <div className="relative">
          {/* Vertical line for desktop */}
          <div className="absolute left-[50%] top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 via-purple-500 to-rose-500 rounded-full opacity-20 hidden lg:block" />

          <div className="space-y-12 md:space-y-24">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className={`flex flex-col lg:flex-row items-center gap-12 ${
                  idx % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
              >
                <div className={`flex-1 w-full ${idx % 2 === 0 ? "text-right" : "text-left"}`}>
                  <div className={`inline-flex p-4 rounded-[2rem] ${step.color} shadow-xl mb-6`}>
                    <step.icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4">{step.title}</h3>
                  <p className={`text-lg text-slate-600 dark:text-slate-400 ${idx % 2 === 0 ? "ml-auto" : "mr-auto"} max-w-md font-medium`}>
                    {step.desc}
                  </p>
                </div>

                {/* Desktop Indicator */}
                <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-white dark:bg-slate-800 rounded-full shadow-lg border-4 border-indigo-50/50 hidden lg:flex">
                  <div className={`w-3 h-3 rounded-full ${step.color} animate-pulse`} />
                </div>

                <div className="flex-1 w-full">
                  <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-700/50 hover:shadow-2xl transition-all duration-500">
                    <h4 className="text-xs font-black uppercase text-indigo-500 tracking-[0.2em] mb-6">Execution Logic</h4>
                    <ul className="space-y-4">
                      {step.details.map((detail, dIdx) => (
                        <li key={dIdx} className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-bold">
                          <CheckCircle2 size={18} className="text-emerald-500" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Database Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-32 p-10 md:p-16 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500" />
          <Database className="h-16 w-16 text-indigo-600 mx-auto mb-6" />
          <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Integrated Data Hub</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 font-medium">
            Our optimized MongoDB schema manages all critical system entities with strong relations and data integrity.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {["Users", "Events", "Registrations", "Expert Info", "Certificates", "Feedback", "Scores"].map((item) => (
              <span key={item} className="px-6 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-700 dark:text-slate-200 font-black text-xs uppercase tracking-widest border border-slate-100 dark:border-slate-700">
                ✔ {item}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WorkflowSection;
