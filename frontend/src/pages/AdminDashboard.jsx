import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import {
  Search,
  LayoutDashboard,
  Users as UsersIcon,
  School,
  BarChart3,
  UserCircle,
  Settings2,
  Activity,
  Menu,
  Bell,
  ShieldCheck,
  LogOut
} from "lucide-react";
import api from "@/lib/axios";
import NotificationCenter from "@/components/NotificationCenter";

import AdminStats from "@/components/admin/AdminStats";
import EventManagementTab from "@/components/admin/EventManagementTab";
import UserManagementTab from "@/components/admin/UserManagementTab";
import SettingsTab from "@/components/admin/SettingsTab";
import ReportsTab from "@/components/admin/ReportsTab";
import CollegeManagementTab from "@/components/admin/CollegeManagementTab";
import ProfileSection from "@/pages/faculty-dashboard/ProfileSection";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Footer from "@/components/layout/Footer";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("events");
  const [recentActivity, setRecentActivity] = useState([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [eventsRes, usersRes] = await Promise.all([
        api.get("/events"),
        api.get("/users"),
      ]);
      setEvents(eventsRes.data);
      setUsers(usersRes.data);

      setStats({
        studentCount: usersRes.data.filter(u => u.role === "student").length,
        facultyCount: usersRes.data.filter(u => u.role === "faculty").length,
        totalEvents: eventsRes.data.length,
        activeEvents: eventsRes.data.filter((e) => e.status === "approved").length,
        pendingApprovals: eventsRes.data.filter((e) => e.status === "pending").length,
        totalParticipations: eventsRes.data.reduce((sum, e) => sum + (e.registeredStudents?.length || 0), 0),
        certificatesIssued: eventsRes.data.reduce((sum, e) => sum + (e.attendedStudents?.length || 0), 0),
      });

      const activity = [...eventsRes.data]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map((e) => ({
          type: e.status === "pending" ? "pending" : "event",
          message: e.status === "pending" ? `"${e.title}" awaiting approval` : `"${e.title}" is ${e.status}`,
          time: e.createdAt,
        }));
      setRecentActivity(activity);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAdminData(); }, []);

  const TABS = [
    { value: "events", label: "Events", icon: LayoutDashboard },
    { value: "users", label: "Users", icon: UsersIcon },
    { value: "colleges", label: "Colleges", icon: School },
    { value: "reports", label: "Analytics", icon: BarChart3 },
    { value: "profile", label: "Profile", icon: UserCircle },
    { value: "settings", label: "System", icon: Settings2 },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Helmet>
        <title>Admin Dashboard | CampusBuzz</title>
      </Helmet>

      {/* --- SIDEBAR: Fixed on Left for Desktop --- */}
      <aside className="hidden lg:flex w-72 flex-col fixed top-20 bottom-0 left-0 z-50 bg-white border-r border-slate-200">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <ShieldCheck size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-900 leading-none">AdminHub</span>
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-1">Control Center</span>
            </div>
          </div>

          <nav className="space-y-1.5 flex-1">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-200 ${activeTab === tab.value
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
              >
                <tab.icon size={20} className={activeTab === tab.value ? "text-white" : "text-slate-400"} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 lg:ml-72 min-w-0 flex flex-col">
        {/* Sticky Top Header */}
        <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-20 z-40 px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="lg:hidden">
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon"><Menu /></Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0 flex flex-col">
                  <div className="p-8 flex items-center gap-3 border-b border-slate-50">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                      <ShieldCheck size={20} />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-black text-xl tracking-tight text-slate-900 leading-none">AdminHub</span>
                      <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-1">Control Center</span>
                    </div>
                  </div>
                  <nav className="flex-1 px-4 space-y-2 mt-4">
                    {TABS.map((tab) => (
                      <button
                        key={tab.value}
                        onClick={() => { setActiveTab(tab.value); setIsSheetOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === tab.value ? "bg-indigo-600 text-white" : "text-slate-500"
                          }`}
                      >
                        <tab.icon size={20} /> {tab.label}
                      </button>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
            <h1 className="text-lg font-bold text-slate-800 hidden sm:block">Dashboard Overview</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-72 pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm font-medium focus:ring-2 ring-indigo-500/20 transition-all outline-none"
              />
            </div>
            <NotificationCenter />
          </div>
        </header>

        {/* Inner Content Container */}
        <div className="p-4 md:p-10 max-w-[1400px] mx-auto space-y-10 flex-1 w-full">

          {/* Welcome Section */}
          <section className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em] mb-1">System Administration</p>
                <h2 className="text-3xl font-black text-slate-900 leading-tight">Welcome, {user?.fullName?.split(' ')[0]} </h2>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="rounded-xl border-slate-200 font-bold"
                  onClick={async () => {
                    try {
                      const res = await api.get("/settings/logs");
                      const logs = res.data;
                      const headers = ["ID", "Event", "User", "Time", "Status"];
                      const rows = logs.map(l => [l.id, l.event, l.user, new Date(l.time).toLocaleString(), l.status]);
                      const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
                      const blob = new Blob([csv], { type: "text/csv" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `system_logs_${new Date().toISOString().split('T')[0]}.csv`;
                      a.click();
                      URL.revokeObjectURL(url);
                      toast({ title: "Success", description: "Logs exported successfully" });
                    } catch (err) {
                      toast({ title: "Error", description: "Failed to export logs", variant: "destructive" });
                    }
                  }}
                >
                  Export Logs
                </Button>
                <Button
                  className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold"
                  onClick={() => setActiveTab("users")}
                >
                  Manage Roles
                </Button>
              </div>
            </div>
            <AdminStats stats={stats} />
          </section>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Left: Tab Content */}
            <div className="lg:col-span-8 min-h-[600px]">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                <TabsContent value="events" className="outline-none"><EventManagementTab events={events} onStatusUpdate={fetchAdminData} /></TabsContent>
                <TabsContent value="users" className="outline-none"><UserManagementTab users={users} onRefresh={fetchAdminData} /></TabsContent>
                <TabsContent value="colleges" className="outline-none"><CollegeManagementTab /></TabsContent>
                <TabsContent value="reports" className="outline-none"><ReportsTab /></TabsContent>
                <TabsContent value="profile" className="outline-none"><ProfileSection toast={toast} /></TabsContent>
                <TabsContent value="settings" className="outline-none"><SettingsTab toast={toast} /></TabsContent>
              </Tabs>
            </div>

            {/* Right: Activity & Cards */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-slate-200/50">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                  <Activity size={16} className="text-indigo-400" /> Live Audit Log
                </h3>
                <div className="space-y-6">
                  {recentActivity.map((item, i) => (
                    <div key={i} className="flex gap-4 border-l-2 border-slate-800 pl-4 relative">
                      <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-indigo-500" />
                      <div>
                        <p className="text-sm font-bold text-slate-200 leading-tight mb-1">{item.message}</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase">{new Date(item.time).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                <h3 className="text-lg font-black mb-2">Technical Support</h3>
                <p className="text-indigo-100 text-sm mb-6">Database level issues or server errors? Contact the dev team.</p>
                <Button variant="secondary" className="w-full rounded-xl bg-white/10 border-0 text-white hover:bg-white/20">
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
};

export default AdminDashboard;