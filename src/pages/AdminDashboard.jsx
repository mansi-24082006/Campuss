import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminStats from '@/components/admin/AdminStats';
import EventManagementTab from '@/components/admin/EventManagementTab';
import UserManagementTab from '@/components/admin/UserManagementTab';
import SettingsTab from '@/components/admin/SettingsTab';

// =========================================
// FEEDBACK TAB
// =========================================
const FeedbackTab = ({ feedback }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">User Feedback</h2>

      <div className="grid gap-4">
        {feedback.map((item) => (
          <div
            key={item.id}
            className={`p-4 border rounded-lg shadow-sm ${
              item.type === "positive"
                ? "bg-green-50 border-green-300"
                : item.type === "negative"
                ? "bg-red-50 border-red-300"
                : "bg-yellow-50 border-yellow-300"
            }`}
          >
            <h3 className="font-semibold">{item.user}</h3>

            <p
              className="text-sm text-gray-700 line-clamp-1 cursor-pointer hover:underline"
              title={item.message}
            >
              {item.message}
            </p>

            <span
              className={`inline-block mt-2 text-xs px-2 py-1 rounded ${
                item.type === "positive"
                  ? "bg-green-200 text-green-800"
                  : item.type === "negative"
                  ? "bg-red-200 text-red-800"
                  : "bg-yellow-200 text-yellow-800"
              }`}
            >
              {item.type.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// =========================================
// NOTIFICATION TAB
// =========================================
const NotificationTab = ({ notifications }) => {
  const getRemainingTime = (eventDate) => {
    const today = new Date();
    const target = new Date(eventDate);
    const diff = target - today;

    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days < 0) return "Event Passed";
    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";

    return `Starts in ${days} days`;
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Notification Status</h2>

      <div className="grid gap-4">
        {notifications.map((item) => (
          <div
            key={item.id}
            className="p-4 border rounded-lg bg-blue-50 border-blue-300 shadow-sm"
          >
            <h3 className="font-semibold">{item.title}</h3>

            <p className="text-sm text-gray-700">
              Scheduled Date: <b>{item.date}</b>
            </p>

            <p className="mt-2 text-blue-700 font-medium">
              {getRemainingTime(item.date)}
            </p>

            <span className="inline-block mt-2 text-xs px-2 py-1 rounded bg-blue-200 text-blue-800">
              {item.type.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// =========================================
// MAIN ADMIN DASHBOARD
// =========================================
const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [feedback, setFeedback] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // EVENTS
    const mockEvents = [
      { id: 1, title: "TechFest 2025", organizer: "CSE Dept", date: "2025-03-15", participants: 245, status: "active", category: "Technology" },
      { id: 2, title: "Hackathon 2.0", organizer: "Innovation Cell", date: "2025-04-05", participants: 128, status: "upcoming", category: "Coding" },
      { id: 3, title: "Cultural Night", organizer: "Arts Club", date: "2025-03-21", participants: 400, status: "active", category: "Culture" },
      { id: 4, title: "Startup Pitch", organizer: "Business Club", date: "2025-04-10", participants: 67, status: "upcoming", category: "Business" },
      { id: 5, title: "Football Tournament", organizer: "Sports Dept", date: "2025-03-30", participants: 22, status: "active", category: "Sports" },
      { id: 6, title: "Photography Workshop", organizer: "Media Club", date: "2025-04-02", participants: 54, status: "upcoming", category: "Workshop" },
      { id: 7, title: "Robotics Expo", organizer: "Robotics Club", date: "2025-03-18", participants: 90, status: "active", category: "Technology" },
      { id: 8, title: "AI Awareness Seminar", organizer: "AI Cell", date: "2025-03-27", participants: 150, status: "active", category: "Seminar" },
    ];

    // USERS
    const mockUsers = [
      { id: 1, name: "Alice Johnson", email: "alice@campus.edu", role: "student", status: "active" },
      { id: 2, name: "Prof. Bob Smith", email: "bob@campus.edu", role: "faculty", status: "active" },
      { id: 3, name: "Charlie Brown", email: "charlie@campus.edu", role: "student", status: "inactive" },
      { id: 4, name: "Diana Prince", email: "diana@campus.edu", role: "faculty", status: "active" },
      { id: 5, name: "Rahul Mehta", email: "rahul@campus.edu", role: "student", status: "active" },
      { id: 6, name: "Sophia Lee", email: "sophia@campus.edu", role: "student", status: "active" },
    ];

    // FEEDBACK
    const mockFeedback = [
      {
        id: 1,
        user: "Alice Johnson",
        message: "Great platform! I like the clean UI and it's easy to find campus events. Helps a lot.",
        type: "positive",
      },
      {
        id: 2,
        user: "Charlie Brown",
        message: "Event registration is confusing. Button placement is not visible. Need UI improvements!",
        type: "negative",
      },
      {
        id: 3,
        user: "Prof. Diana",
        message: "Useful for announcements. Add scheduled announcement feature, it will help faculty.",
        type: "positive",
      },
      {
        id: 4,
        user: "Student XYZ",
        message: "Events sometimes do not load on slow WiFi. Improve caching and performance.",
        type: "neutral",
      },
    ];

    // NOTIFICATIONS (Upcoming event reminders)
    const mockNotifications = [
      { id: 1, title: "Hackathon Reminder", date: "2025-04-05", type: "event" },
      { id: 2, title: "Football Tournament Warm-up", date: "2025-03-30", type: "alert" },
      { id: 3, title: "Photography Workshop Starts Soon", date: "2025-04-02", type: "event" },
      { id: 4, title: "Cultural Night Final Call", date: "2025-03-21", type: "announcement" },
    ];

    // STATS
    const mockStats = {
      totalUsers: 1280,
      totalEvents: 60,
      activeEvents: 18,
      totalParticipations: 5400,
      certificatesIssued: 3200,
    };

    setEvents(mockEvents);
    setUsers(mockUsers);
    setStats(mockStats);
    setFeedback(mockFeedback);
    setNotifications(mockNotifications);
  }, []);

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - CampusBuzz</title>
        <meta name="description" content="Manage events, users, feedback, settings & notifications." />
      </Helmet>

      <div className="min-h-screen p-4 md:p-6">
        <AdminHeader user={user} onLogout={logout} />
        <AdminStats stats={stats} />

        <Tabs defaultValue="events" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/70">
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="events">
            <EventManagementTab events={events} toast={toast} />
          </TabsContent>

          <TabsContent value="users">
            <UserManagementTab users={users} toast={toast} />
          </TabsContent>

          <TabsContent value="feedback">
            <FeedbackTab feedback={feedback} />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationTab notifications={notifications} />
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
