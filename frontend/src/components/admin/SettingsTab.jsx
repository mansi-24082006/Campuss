import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Settings,
  BarChart3,
  Mail,
  ShieldCheck,
  Database,
  Terminal,
  Trash2,
  ChevronRight,
  Sliders,
} from "lucide-react";

const SettingsTab = ({ toast }) => {
  const settingsButtons = [
    { label: "General Settings", feature: "Platform settings", icon: Sliders },
    {
      label: "Email Configuration",
      feature: "Email configuration",
      icon: Mail,
    },
    {
      label: "Security Settings",
      feature: "Security settings",
      icon: ShieldCheck,
    },
  ];

  const maintenanceButtons = [
    { label: "Database Backup", feature: "Database backup", icon: Database },
    { label: "View System Logs", feature: "System logs", icon: Terminal },
    { label: "Clear Cache", feature: "Cache management", icon: Trash2 },
  ];

  const handleButtonClick = (feature) => {
    toast({
      title: "Feature Unavailable",
      description: `🚧 ${feature} isn't implemented yet—but you can request it in your next prompt! 🚀`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
          <Settings size={20} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            System Settings
          </h2>
          <p className="text-sm text-slate-500">
            Global configuration and platform maintenance
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* --- Platform Configuration --- */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow overflow-hidden">
          <CardHeader className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="h-4 w-4 text-indigo-500" />
              Platform Configuration
            </CardTitle>
            <CardDescription className="dark:text-slate-400">
              Manage general system environment
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-3">
            {settingsButtons.map((btn) => (
              <Button
                key={btn.label}
                variant="ghost"
                className="group w-full justify-between items-center h-12 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-700 dark:text-slate-300 transition-all"
                onClick={() => handleButtonClick(btn.feature)}
              >
                <div className="flex items-center">
                  <btn.icon className="h-4 w-4 mr-3 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                  <span className="font-semibold">{btn.label}</span>
                </div>
                <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* --- System Maintenance --- */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow overflow-hidden">
          <CardHeader className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-emerald-500" />
              System Maintenance
            </CardTitle>
            <CardDescription className="dark:text-slate-400">
              Low-level database and file operations
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-3">
            {maintenanceButtons.map((btn) => (
              <Button
                key={btn.label}
                variant="ghost"
                className="group w-full justify-between items-center h-12 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-slate-700 dark:text-slate-300 transition-all"
                onClick={() => handleButtonClick(btn.feature)}
              >
                <div className="flex items-center">
                  <btn.icon className="h-4 w-4 mr-3 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                  <span className="font-semibold">{btn.label}</span>
                </div>
                <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* --- Footer Note --- */}
      <div className="flex items-center justify-center gap-2 p-4 bg-slate-100/50 dark:bg-slate-900/30 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          Last Backup: 12 Jan 2026 • 22:45
        </p>
      </div>
    </motion.div>
  );
};

export default SettingsTab;
