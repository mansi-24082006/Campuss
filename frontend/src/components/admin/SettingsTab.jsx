import React from "react";
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
  ShieldCheck,
  Database,
  Terminal,
  ChevronRight,
  Sliders,
  Megaphone,
  Bell,
  Activity,
  Trophy
} from "lucide-react";
import api from "@/lib/axios";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const SettingsTab = ({ toast }) => {
  const settingsButtons = [
    {
      label: "Global Broadcast",
      feature: "Global announcement",
      icon: Megaphone,
    },
    {
      label: "Emergency Alert",
      feature: "Emergency alert",
      icon: Bell,
    },
    {
      label: "Security Settings",
      feature: "Security settings",
      icon: ShieldCheck,
    },
  ];

  const maintenanceButtons = [
    { label: "Full Database Backup", feature: "Database backup", icon: Database },
    { label: "Recalculate Student Rankings", feature: "Recalculate ranks", icon: Trophy },
    { label: "View System Logs", feature: "System logs", icon: Terminal },
    { label: "Platform Health Check", feature: "Health check", icon: Activity },
  ];

  const [logs, setLogs] = React.useState([]);
  const [showLogsModal, setShowLogsModal] = React.useState(false);
  const [settings, setSettings] = React.useState({
     allowRegistrations: true,
     maintenanceMode: false,
     certificateAutoIssue: true
  });

  const fetchSettings = async () => {
    try {
      const res = await api.get("/settings");
      setSettings(res.data);
    } catch (err) {
      console.error("Failed to fetch settings", err);
    }
  };

  React.useEffect(() => {
    fetchSettings();
  }, []);

  const handleToggleSetting = async (key) => {
    try {
      const updated = { ...settings, [key]: !settings[key] };
      setSettings(updated);
      await api.patch("/settings", updated);
      toast({ title: "Settings Updated", description: `${key} has been toggled.` });
    } catch (err) {
      toast({ title: "Update Failed", variant: "destructive" });
    }
  };

  const handleGlobalBroadcast = async () => {
    const message = window.prompt("Enter your global message for all students:");
    if (!message) return;
    
    try {
      await api.post("/notifications/global-broadcast", { message, type: "warning" });
      toast({
        title: "Broadcast Sent",
        description: "Your message has been sent to all registered students.",
      });
    } catch (err) {
      toast({
        title: "Broadcast Failed",
        description: "Failed to send the message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await api.get("/settings/logs");
      setLogs(res.data);
      setShowLogsModal(true);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch system logs.",
        variant: "destructive",
      });
    }
  };
  
  const handleRecalculate = async () => {
    try {
      await api.post("/users/recalculate-ranks");
      toast({
        title: "Rankings Updated",
        description: "National, State, and College ranks have been synchronized.",
      });
    } catch (err) {
      toast({
        title: "Rank Update Failed",
        description: "Failed to recalculate ranks. Please check console.",
        variant: "destructive",
      });
    }
  };

  const handleButtonClick = (feature) => {
    if (feature === "Global announcement") {
      handleGlobalBroadcast();
    } else if (feature === "System logs") {
      fetchLogs();
    } else if (feature === "Recalculate ranks") {
      handleRecalculate();
    } else {
      toast({
        title: "Unavailable",
        description: `${feature} is currently not active in this version.`,
      });
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex items-center gap-4 mb-2">
        <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 border border-indigo-100 shadow-sm">
          <Settings size={24} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            System Settings
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Global configuration and platform maintenance
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {/* --- Platform Configuration --- */}
        <Card className="bg-white border-slate-200/60 rounded-[2.5rem] shadow-xl shadow-slate-200/20 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500 overflow-hidden">
          <CardHeader className="bg-slate-50/30 border-b border-slate-100/50 p-8">
            <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-3">
              <Sliders className="h-5 w-5 text-indigo-500" />
              Platform Configuration
            </CardTitle>
            <CardDescription className="font-medium text-slate-400">
              Manage core system behavior and broadcasts
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-4">
            {/* Real Toggles */}
            <div className="space-y-3 mb-6">
               <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div>
                    <p className="font-bold text-slate-800 text-sm">Certificate Auto-Issue</p>
                    <p className="text-[10px] text-slate-500 font-medium">Issue certificates automatically on participation</p>
                  </div>
                  <button 
                    onClick={() => handleToggleSetting("certificateAutoIssue")}
                    className={`w-12 h-6 rounded-full transition-colors relative ${settings.certificateAutoIssue ? 'bg-indigo-600' : 'bg-slate-300'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.certificateAutoIssue ? 'left-7' : 'left-1'}`} />
                  </button>
               </div>

               <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div>
                    <p className="font-bold text-slate-800 text-sm">Maintenance Mode</p>
                    <p className="text-[10px] text-slate-500 font-medium">Disable all public facing event registrations</p>
                  </div>
                  <button 
                    onClick={() => handleToggleSetting("maintenanceMode")}
                    className={`w-12 h-6 rounded-full transition-colors relative ${settings.maintenanceMode ? 'bg-indigo-600' : 'bg-slate-300'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.maintenanceMode ? 'left-7' : 'left-1'}`} />
                  </button>
               </div>
            </div>

            <div className="h-px bg-slate-100 mb-6" />

            {settingsButtons.map((btn) => (
              <Button
                key={btn.label}
                variant="ghost"
                className="group w-full justify-between items-center h-16 rounded-[1.25rem] hover:bg-indigo-50/50 text-slate-700 transition-all px-6 border border-transparent hover:border-indigo-100"
                onClick={() => handleButtonClick(btn.feature)}
              >
                <div className="flex items-center">
                  <div className="p-2.5 rounded-xl bg-slate-50 group-hover:bg-white text-slate-400 group-hover:text-indigo-600 transition-colors shadow-sm border border-slate-100">
                    <btn.icon className="h-4.5 w-4.5" />
                  </div>
                  <span className="font-bold ml-4">{btn.label}</span>
                </div>
                <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all text-indigo-400" />
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* --- System Maintenance --- */}
        <Card className="bg-white border-slate-200/60 rounded-[2.5rem] shadow-xl shadow-slate-200/20 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-500 overflow-hidden">
          <CardHeader className="bg-slate-50/30 border-b border-slate-100/50 p-8">
            <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-3">
              <Database className="h-5 w-5 text-emerald-500" />
              System Maintenance
            </CardTitle>
            <CardDescription className="font-medium text-slate-400">
              Low-level technical operations and health
              </CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-4">
            {maintenanceButtons.map((btn) => (
              <Button
                key={btn.label}
                variant="ghost"
                className="group w-full justify-between items-center h-16 rounded-[1.25rem] hover:bg-emerald-50/50 text-slate-700 transition-all px-6 border border-transparent hover:border-emerald-100"
                onClick={() => handleButtonClick(btn.feature)}
              >
                <div className="flex items-center">
                  <div className="p-2.5 rounded-xl bg-slate-50 group-hover:bg-white text-slate-400 group-hover:text-emerald-600 transition-colors shadow-sm border border-slate-100">
                    <btn.icon className="h-4.5 w-4.5" />
                  </div>
                  <span className="font-bold ml-4">{btn.label}</span>
                </div>
                <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all text-emerald-400" />
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* --- Logs Modal --- */}
      {showLogsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl"
          >
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black text-slate-900">System Audit Logs</h3>
                <p className="text-sm text-slate-400 font-medium italic">Showing latest activity across all nodes</p>
              </div>
              <Button variant="ghost" className="rounded-xl font-bold" onClick={() => setShowLogsModal(false)}>Close</Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {logs.map(log => (
                <div key={log.id} className="p-4 bg-slate-50 rounded-2xl flex justify-between items-start border border-slate-100">
                  <div>
                    <p className="font-bold text-slate-800">{log.event}</p>
                    <p className="text-xs text-slate-500">{log.user}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase">{new Date(log.time).toLocaleString()}</p>
                    <Badge className={`mt-1 text-[9px] font-black uppercase ${log.status === 'Success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{log.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* --- Footer Status --- */}
      <div className="flex items-center justify-center p-6 bg-white rounded-[2rem] border border-slate-200/60 shadow-sm">
        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          <Activity size={14} className="text-emerald-500" />
          System Status: Optimal • Last Sync: {new Date().toLocaleDateString()} • {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
