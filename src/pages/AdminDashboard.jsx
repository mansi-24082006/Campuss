import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminStats from '@/components/admin/AdminStats';
import EventManagementTab from '@/components/admin/EventManagementTab';
import UserManagementTab from '@/components/admin/UserManagementTab';
import AnalyticsTab from '@/components/admin/AnalyticsTab';
import SettingsTab from '@/components/admin/SettingsTab';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    // Load mock data
    const mockEvents = [
      {
        id: 1,
        title: "TechFest 2025",
        organizer: "Computer Science Dept",
        date: "2025-03-15",
        participants: 245,
        status: "active",
        category: "Tech Fest"
      },
      {
        id: 2,
        title: "Startup Pitch Competition",
        organizer: "Business Club",
        date: "2025-03-20",
        participants: 89,
        status: "upcoming",
        category: "Competition"
      },
      {
        id: 3,
        title: "AI Workshop Series",
        organizer: "Prof. Sarah Johnson",
        date: "2025-02-28",
        participants: 156,
        status: "completed",
        category: "Workshop"
      }
    ];

    const mockUsers = [
      { id: 1, name: "Alice Johnson", email: "alice@university.edu", role: "student", status: "active", joinDate: "2024-01-15" },
      { id: 2, name: "Prof. Bob Smith", email: "bob@university.edu", role: "faculty", status: "active", joinDate: "2023-08-20" },
      { id: 3, name: "Charlie Brown", email: "charlie@university.edu", role: "student", status: "active", joinDate: "2024-02-01" },
      { id: 4, name: "Dr. Diana Prince", email: "diana@university.edu", role: "faculty", status: "active", joinDate: "2023-09-10" }
    ];

    const mockStats = {
      totalUsers: 1247,
      totalEvents: 45,
      activeEvents: 12,
      totalParticipations: 3456,
      certificatesIssued: 2890,
      averageRating: 4.7
    };

    setEvents(mockEvents);
    setUsers(mockUsers);
    setStats(mockStats);
  }, []);

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - CampusBuzz</title>
        <meta name="description" content="Comprehensive platform management with full control over events, users, and system analytics." />
      </Helmet>
      
      <div className="min-h-screen p-4 md:p-6">
        <AdminHeader user={user} onLogout={logout} />
        <AdminStats stats={stats} />

        <Tabs defaultValue="events" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/70">
            <TabsTrigger value="events">Event Management</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="events">
            <EventManagementTab events={events} toast={toast} />
          </TabsContent>
          
          <TabsContent value="users">
            <UserManagementTab users={users} toast={toast} />
          </TabsContent>
          
          <TabsContent value="analytics">
            <AnalyticsTab />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsTab toast={toast} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default AdminDashboard;