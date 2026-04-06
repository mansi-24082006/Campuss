import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import api from "@/lib/axios";

import AdminHeader from "@/components/admin/AdminHeader";
import AdminStats from "@/components/admin/AdminStats";
import EventManagementTab from "@/components/admin/EventManagementTab";
import UserManagementTab from "@/components/admin/UserManagementTab";
import SettingsTab from "@/components/admin/SettingsTab";
import ReportsTab from "@/components/admin/ReportsTab";
import ProfileSection from "@/pages/faculty-dashboard/ProfileSection";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    activeEvents: 0,
    pendingApprovals: 0,
    totalParticipations: 0,
    certificatesIssued: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("events");
  const [recentActivity, setRecentActivity] = useState([]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [eventsRes, usersRes] = await Promise.all([
        api.get("/events"),
        api.get("/users"),
      ]);

      const allEvents = eventsRes.data;
      const allUsers = usersRes.data;

      setEvents(allEvents);
      setUsers(allUsers);

      const pending = allEvents.filter((e) => e.status === "pending");
      setStats({
        totalUsers: allUsers.length,
        totalEvents: allEvents.length,
        activeEvents: allEvents.filter((e) => e.status === "approved").length,
        pendingApprovals: pending.length,
        totalParticipations: allEvents.reduce(
          (sum, e) => sum + (e.registeredStudents?.length || 0),
          0
        ),
        certificatesIssued: allEvents.reduce(
          (sum, e) => sum + (e.attendedStudents?.length || 0),
          0
        ),
      });

      // Build recent activity feed from latest events
      const activity = [...allEvents]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map((e) => ({
          type: e.status === "pending" ? "pending" : "event",
          message: e.status === "pending"
            ? `"${e.title}" awaiting approval`
            : `"${e.title}" is ${e.status}`,
          time: e.createdAt,
        }));
      setRecentActivity(activity);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const TABS = [
    { value: "events", label: "📅 Events", badge: null },
    { value: "users", label: "👥 Users", badge: null },
    { value: "reports", label: "📊 Reports", badge: null },
    { value: "profile", label: "👤 My Profile", badge: null },
    { value: "settings", label: "⚙️ Settings", badge: null },
  ];

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-100">
      <Helmet>
        <title>Admin Dashboard | CampusBuzz</title>
      </Helmet>

      <div className="max-w-[1600px] mx-auto w-full px-4 py-6 md:px-8 lg:px-10 space-y-6 md:space-y-8">
        <AdminHeader user={user} onLogout={logout} />

        {/* Pending Approvals Alert Banner */}
        {stats.pendingApprovals > 0 && (
          <div
            onClick={() => setActiveTab("events")}
            className="cursor-pointer flex items-center gap-2 md:gap-3 bg-amber-50 border border-amber-200 rounded-xl md:rounded-2xl px-4 md:px-5 py-3 hover:bg-amber-100 transition-colors"
          >
            <span className="flex h-2 w-2 md:h-3 md:w-3 rounded-full bg-amber-500 animate-pulse" />
            <p className="text-xs md:text-sm font-bold text-amber-800">
              ⏳ {stats.pendingApprovals} pending approval — <span className="underline">Review</span>
            </p>
          </div>
        )}

        {/* Stats Grid - Responsive cols */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <AdminStats stats={stats} />
        </section>

        {/* Recent Activity - Better mobile visibility */}
        {recentActivity.length > 0 && (
          <section className="bg-white border border-slate-200 rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-sm">
            <h3 className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Activity Feed
            </h3>
            <div className="space-y-3">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-xs md:text-sm py-1 border-b border-slate-50 last:border-0 pb-2 last:pb-0">
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${item.type === "pending" ? "bg-amber-400" : "bg-emerald-400"}`} />
                  <span className="text-slate-700 flex-1 truncate">{item.message}</span>
                  <span className="text-slate-400 text-[10px] font-medium">
                    {item.time ? new Date(item.time).toLocaleDateString("en-IN", { dateStyle: "short" }) : ""}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tabs - Mobile horizontal scroll if needed */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 border-b border-slate-200 pb-1">
            <div className="overflow-x-auto scrollbar-hide pb-2 lg:pb-0">
              <TabsList className="bg-slate-200/50 p-1 rounded-xl border border-slate-200/60 inline-flex w-auto md:w-full">
                {TABS.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="px-3 md:px-5 py-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm transition-all text-xs md:text-sm font-bold relative whitespace-nowrap"
                  >
                    {tab.label}
                    {tab.value === "events" && stats.pendingApprovals > 0 && (
                      <span className="absolute -top-1 -right-0.5 bg-red-500 text-white text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
                        {stats.pendingApprovals}
                      </span>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search everything…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                width="16" height="16" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
              </svg>
            </div>
          </div>

          <div className="mt-2 min-h-[400px]">
            <TabsContent value="events" className="outline-none">
              {loading ? (
                <div className="flex items-center justify-center h-64 text-slate-400 animate-pulse font-medium">
                  Fetching events…
                </div>
              ) : (
                <div className="animate-in fade-in duration-500">
                  <EventManagementTab
                    events={events.filter((e) => {
                      const q = searchQuery.toLowerCase();
                      return (
                        e.title.toLowerCase().includes(q) ||
                        (e.organizer?.fullName || "").toLowerCase().includes(q)
                      );
                    })}
                    onStatusUpdate={fetchAdminData}
                    toast={toast}
                  />
                </div>
              )}
            </TabsContent>

            <TabsContent value="users" className="outline-none">
              {loading ? (
                <div className="flex items-center justify-center h-64 text-slate-400 animate-pulse font-medium">
                  Fetching users…
                </div>
              ) : (
                <div className="animate-in fade-in duration-500">
                  <UserManagementTab
                    users={users.filter((u) => {
                      const q = searchQuery.toLowerCase();
                      return (
                        u.fullName.toLowerCase().includes(q) ||
                        u.email.toLowerCase().includes(q)
                      );
                    })}
                    onRefresh={fetchAdminData}
                    toast={toast}
                  />
                </div>
              )}
            </TabsContent>

            <TabsContent value="reports" className="outline-none">
              <div className="animate-in fade-in duration-500">
                <ReportsTab />
              </div>
            </TabsContent>

            <TabsContent value="profile" className="outline-none">
              <div className="animate-in fade-in duration-500">
                <ProfileSection toast={toast} />
              </div>
            </TabsContent>

            <TabsContent value="settings" className="outline-none">
              <div className="animate-in fade-in duration-500">
                <SettingsTab toast={toast} />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;