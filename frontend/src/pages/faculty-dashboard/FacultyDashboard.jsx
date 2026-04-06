import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Users,
  TrendingUp,
  BarChart3,
  ShieldCheck,
  RefreshCcw,
  LogOut,
  Settings,
  Bell,
  Megaphone,
  CheckCircle2,
  Clock,
  MessageSquare,
  ChevronRight,
  ArrowRight,
  Search,
  Star
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

import MyEvents from "./MyEvents";
import StudentList from "./StudentList";
import ProfileSection from "./ProfileSection";
import CreateEventModal from "./CreateEventModal";
import AnnouncementModal from "./AnnouncementModal";
import FeedbackTab from "./FeedbackTab";
import { getAvatarUrl } from "@/lib/avatar";

import api from "@/lib/axios";

const FacultyDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [events, setEvents] = useState([]);
  const [students, setStudents] = useState([]);
  const [sentAnnouncements, setSentAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const fetchFacultyData = async () => {
    try {
      setLoading(true);
      const [eventsRes, usersRes, sentRes] = await Promise.allSettled([
        api.get("/events"),
        api.get("/users"),
        api.get("/notifications/sent")
      ]);

      if (eventsRes.status === "fulfilled") setEvents(eventsRes.value.data);
      if (usersRes.status === "fulfilled") {
        const allUsers = usersRes.value.data;
        const studentUsers = allUsers.filter(u => u.role === "student");
        setStudents(studentUsers);
      }
      if (sentRes.status === "fulfilled") setSentAnnouncements(sentRes.value.data);

    } catch (error) {
      console.error("Dashboard sync failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacultyData();
  }, []);

  const handleEditEvent = (eventId) => {
    const event = events.find((e) => e._id === eventId);
    if (event) {
      setEditingEvent(event);
      setShowCreateModal(true);
    }
  };

  // Filter events where faculty is organizer or assigned
  const myEvents = events.filter((e) =>
    (e.organizer?._id || e.organizer) === user?._id ||
    (e.assignedFaculty?._id || e.assignedFaculty) === user?._id
  );

  // Advanced Stats Calculation
  const totalRegistered = myEvents.reduce((sum, e) => sum + (e.registeredStudents?.length || 0), 0);
  const totalAttended = myEvents.reduce((sum, e) => sum + (e.attendedStudents?.length || 0), 0);
  const totalVerified = myEvents.reduce((sum, e) => sum + (e.verifiedStudents?.length || 0), 0);
  const attendanceRate = totalRegistered > 0 ? Math.round((totalAttended / totalRegistered) * 100) : 0;

  const stats = [
    { label: "Assigned Events", value: myEvents.length, icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Upcoming", value: myEvents.filter((e) => new Date(e.date) > new Date() && e.status !== "completed").length, icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Active Now", value: myEvents.filter((e) => e.status === "active").length, icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Total Students", value: totalRegistered, icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <>
      <div className="min-h-screen bg-[#F8FAFC]">
        {/* Modern Header */}
        <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="max-w-[1800px] mx-auto px-4 sm:px-6 md:px-8 h-16 md:h-20 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 md:gap-6 min-w-0">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-600 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 flex-shrink-0">
                <ShieldCheck className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg md:text-xl font-black tracking-tight truncate">Faculty <span className="hidden xs:inline">Command</span></h1>
                <p className="text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-wider hidden sm:block">Control Center</p>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
              <Button
                onClick={() => setShowAnnouncementModal(true)}
                className="bg-amber-500 hover:bg-amber-600 text-white rounded-full px-3 md:px-5 h-9 font-bold shadow-lg shadow-amber-500/20 transition-all text-[10px] md:text-xs flex items-center gap-1.5"
              >
                <Megaphone size={14} className="flex-shrink-0" /> <span className="hidden sm:inline">Announcement</span>
              </Button>
              
              <div className="flex items-center gap-2 md:gap-3 pl-2 md:pl-4 border-l border-slate-200 dark:border-slate-800">
                <div className="text-right hidden lg:block">
                  <p className="text-sm font-black leading-none">{user?.fullName}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Senior Faculty</p>
                </div>
                <Avatar className="h-8 w-8 md:h-10 md:h-10 border-2 border-white dark:border-slate-800 shadow-md">
                  <AvatarImage src={getAvatarUrl(user)} />
                  <AvatarFallback className="bg-indigo-600 text-white">{user?.fullName?.[0]}</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-[1600px] mx-auto px-4 sm:px-8 py-8 space-y-8">
          {/* Welcome Section */}
          <section className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="relative z-10 text-center sm:text-left">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white mb-3"
              >
                Welcome, Prof. {user?.fullName?.split(' ')[0]}
              </motion.h2>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 md:gap-3">
                <Badge className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800 px-3 py-1 rounded-lg font-bold text-[10px] sm:text-xs">
                  {myEvents.length} Events Assigned
                </Badge>
                <Badge className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800 px-3 py-1 rounded-lg font-bold text-[10px] sm:text-xs">
                  {totalRegistered} Active Students
                </Badge>
              </div>
            </div>
            {/* Abstract background shapes */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-indigo-500/5 to-transparent hidden sm:block" />
          </section>

          {/* ... Stats grid remains the same as it is already responsive with sm:grid-cols-2 ... */}

          {/* Stats & Insights Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Stats Column */}
            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {stats.map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="border-slate-200 rounded-[2rem] hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500 group overflow-hidden">
                      <CardContent className="p-7">
                        <div className="flex justify-between items-start mb-4">
                          <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-500`}>
                            <stat.icon size={26} />
                          </div>
                          <Badge variant="secondary" className="bg-slate-100 text-slate-500 border-0 rounded-lg text-[10px] font-bold">
                            REAL-TIME
                          </Badge>
                        </div>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                        <h3 className="text-4xl font-black text-slate-900 mt-1">{stat.value}</h3>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Student Activity Graph-like Section */}
              <Card className="border-slate-200 rounded-[2.5rem] bg-white overflow-hidden shadow-sm">
                <CardContent className="p-8">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="text-xl font-black text-slate-900">Student Participation</h3>
                      <p className="text-sm text-slate-500 font-medium">Breakdown of attendance and verification</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-black text-indigo-600">{attendanceRate}%</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avg Attendance</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Attendance Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                        <span>Attended ({totalAttended})</span>
                        <span>{totalRegistered} Registered</span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${attendanceRate}%` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 rounded-full"
                        />
                      </div>
                    </div>

                    {/* Verification Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                        <span>Verified Certificates ({totalVerified})</span>
                        <span>{totalAttended} Eligible</span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${totalAttended > 0 ? (totalVerified / totalAttended) * 100 : 0}%` }}
                          transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                          className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-50">
                    <div className="text-center">
                      <p className="text-2xl font-black text-slate-800">{totalRegistered}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">Registered</p>
                    </div>
                    <div className="text-center border-x border-slate-100 px-4">
                      <p className="text-2xl font-black text-slate-800">{totalAttended}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">Present</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-black text-slate-800">{totalVerified}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">Verified</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Columns: Announcements & Feedback */}
            <div className="space-y-8">
              {/* Recent Announcements */}
              <Card className="border-slate-200 rounded-[2.5rem] bg-slate-900 text-white overflow-hidden shadow-xl shadow-slate-200/50">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-black flex items-center gap-2">
                      <Megaphone size={18} className="text-indigo-400" />
                      Recent Broadcasts
                    </h3>
                    <Badge className="bg-white/10 text-white border-0">{sentAnnouncements.length}</Badge>
                  </div>

                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                    {sentAnnouncements.length === 0 ? (
                      <div className="py-10 text-center opacity-40">
                        <MessageSquare size={32} className="mx-auto mb-3" />
                        <p className="text-xs font-medium">No announcements sent yet</p>
                      </div>
                    ) : (
                      sentAnnouncements.map((ann, i) => (
                        <div key={ann._id} className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                          <p className="text-xs font-bold text-indigo-300 mb-1">{new Date(ann.createdAt).toLocaleDateString()}</p>
                          <p className="text-sm text-slate-200 line-clamp-2 leading-relaxed">{ann.message}</p>
                        </div>
                      ))
                    )}
                  </div>

                  <Button
                    onClick={() => setShowAnnouncementModal(true)}
                    className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl h-11"
                  >
                    New Announcement
                  </Button>
                </CardContent>
              </Card>

              {/* Feedback Highlights */}
              <Card className="border-slate-200 rounded-[2.5rem] bg-white overflow-hidden shadow-sm">
                <CardContent className="p-8">
                  <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                    <Star size={18} className="text-amber-400" />
                    Feedback Pulse
                  </h3>

                  <div className="space-y-4">
                    {myEvents.some(e => e.feedback?.length > 0) ? (
                      myEvents.filter(e => e.feedback?.length > 0).slice(0, 3).map((e, i) => (
                        <div key={e._id} className="group cursor-pointer">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-bold text-slate-800 truncate pr-2">{e.title}</span>
                            <div className="flex items-center text-amber-500 font-bold text-[10px]">
                              {(e.feedback.reduce((a, b) => a + b.rating, 0) / e.feedback.length).toFixed(1)} ★
                            </div>
                          </div>
                          <div className="w-full h-1 bg-slate-50 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-amber-400"
                              style={{ width: `${(e.feedback.reduce((a, b) => a + b.rating, 0) / e.feedback.length / 5) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 text-center py-6 font-medium">Waiting for student reviews...</p>
                    )}
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-50 text-center">
                    <p className="text-xs font-bold text-indigo-600 cursor-pointer hover:underline flex items-center justify-center gap-1 group">
                      View Detailed Reports <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="events" className="space-y-8 pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Management Desk</h2>
                <p className="text-sm text-slate-500">Fine-tune events, students, and certificates</p>
              </div>
              <TabsList className="bg-slate-200/60 rounded-2xl p-1">
                {["events", "students", "feedback", "profile"].map((t) => (
                  <TabsTrigger
                    key={t}
                    value={t}
                    className="rounded-xl px-1 sm:px-8 py-2.5 text-[10px] font-black uppercase tracking-wider data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
                  >
                    {t}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <div className="bg-white rounded-[3rem] p-4 sm:p-8 border border-slate-200 shadow-sm min-h-[600px]">
              <TabsContent value="events" className="mt-0 outline-none">
                <MyEvents events={myEvents} onEdit={handleEditEvent} onRefresh={fetchFacultyData} />
              </TabsContent>

              <TabsContent value="students" className="mt-0 outline-none">
                <StudentList events={myEvents} />
              </TabsContent>

              <TabsContent value="feedback" className="mt-0 outline-none">
                <FeedbackTab events={myEvents} />
              </TabsContent>

              <TabsContent value="profile" className="mt-0 outline-none">
                <ProfileSection user={user} />
              </TabsContent>
            </div>
          </Tabs>
        </main>

        {/* Modals */}
        <AnnouncementModal
          isOpen={showAnnouncementModal}
          onClose={() => setShowAnnouncementModal(false)}
          events={myEvents.filter(e => e.status !== 'completed')}
          onSuccess={fetchFacultyData}
        />

        <CreateEventModal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setEditingEvent(null);
          }}
          onSuccess={fetchFacultyData}
          eventData={editingEvent}
        />
      </div>
    </>
  );
};

export default FacultyDashboard;