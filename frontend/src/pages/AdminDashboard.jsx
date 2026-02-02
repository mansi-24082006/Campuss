import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

import AdminHeader from "@/components/admin/AdminHeader";
import AdminStats from "@/components/admin/AdminStats";
import EventManagementTab from "@/components/admin/EventManagementTab";
import UserManagementTab from "@/components/admin/UserManagementTab";
import SettingsTab from "@/components/admin/SettingsTab";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    activeEvents: 0,
    totalParticipations: 0,
    certificatesIssued: 0,
  });

  useEffect(() => {
    const mockEvents = [
      {
        id: 1,
        title: "TechFest 2025",
        organizer: "Computer Science Dept",
        date: "2025-03-15",
        participants: 245,
        status: "active",
        category: "Tech Fest",
      },
      {
        id: 2,
        title: "Startup Pitch Competition",
        organizer: "Business Club",
        date: "2025-03-20",
        participants: 89,
        status: "upcoming",
        category: "Competition",
      },
      {
        id: 3,
        title: "AI Workshop Series",
        organizer: "Prof. Sarah Johnson",
        date: "2025-02-28",
        participants: 156,
        status: "completed",
        category: "Workshop",
      },
      {
        id: 4,
        title: "National Hackathon",
        organizer: "Innovation Cell",
        date: "2025-04-10",
        participants: 320,
        status: "upcoming",
        category: "Hackathon",
      },
      {
        id: 5,
        title: "Cultural Night 2025",
        organizer: "Cultural Committee",
        date: "2025-03-05",
        participants: 410,
        status: "completed",
        category: "Cultural",
      },
      {
        id: 6,
        title: "Cyber Security Webinar",
        organizer: "IT Department",
        date: "2025-03-22",
        participants: 180,
        status: "active",
        category: "Webinar",
      },
    ];

    const mockUsers = [
      {
        id: 1,
        name: "Alice Johnson",
        email: "alice@university.edu",
        role: "student",
        status: "active",
      },
      {
        id: 2,
        name: "Bob Smith",
        email: "bob@university.edu",
        role: "faculty",
        status: "active",
      },
      {
        id: 3,
        name: "Charlie Brown",
        email: "charlie@university.edu",
        role: "student",
        status: "inactive",
      },
      {
        id: 4,
        name: "Diana Prince",
        email: "diana@university.edu",
        role: "faculty",
        status: "active",
      },
      {
        id: 5,
        name: "Ethan Hunt",
        email: "ethan@university.edu",
        role: "student",
        status: "active",
      },
      {
        id: 6,
        name: "Admin Root",
        email: "admin@campusbuzz.edu",
        role: "admin",
        status: "active",
      },
    ];

    setEvents(mockEvents);
    setUsers(mockUsers);

    // ✅ Derived stats (logical & safe)
    setStats({
      totalUsers: mockUsers.length,
      totalEvents: mockEvents.length,
      activeEvents: mockEvents.filter((e) => e.status === "active").length,
      totalParticipations: mockEvents.reduce(
        (sum, e) => sum + e.participants,
        0
      ),
      certificatesIssued: 2890,
    });
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-100">
      <Helmet>
        <title>Admin Dashboard - CampusBuzz</title>
      </Helmet>

      <div className="w-full min-h-screen px-6 py-6 lg:px-10 space-y-8">
        <AdminHeader user={user} onLogout={logout} />

        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <AdminStats stats={stats} />
        </section>

        <Tabs defaultValue="events" className="w-full space-y-8">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <TabsList className="bg-slate-100/60 p-1.5 rounded-xl border border-slate-200/60 backdrop-blur-sm">
              <TabsTrigger
                value="events"
                className="px-6 py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 transition-all"
              >
                Events
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="px-6 py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 transition-all"
              >
                Users
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="px-6 py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 transition-all"
              >
                Settings
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="mt-6">
            <TabsContent value="events">
              <EventManagementTab events={events} toast={toast} />
            </TabsContent>

            <TabsContent value="users">
              <UserManagementTab users={users} toast={toast} />
            </TabsContent>

            <TabsContent value="settings">
              <SettingsTab toast={toast} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
