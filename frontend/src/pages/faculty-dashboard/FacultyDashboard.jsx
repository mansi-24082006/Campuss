import React, { useState, useEffect } from "react";
import {
  Calendar, Users, TrendingUp, ShieldCheck,
  Megaphone, CheckCircle2, MessageSquare,
  ArrowRight, Star, LayoutDashboard,
  GraduationCap, MessageCircle, UserCircle, Menu, Search,
  Bell, Sparkles, LogOut, Settings, Plus, Edit2, Save, X, Phone, Building, Mail, MapPin, User as UserIcon
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Helmet } from "react-helmet-async";

import FacultyMyEvents from "./MyEvents";
import FacultyStudentList from "./StudentList";
import ProfileSection from "./ProfileSection";
import AnnouncementModal from "./AnnouncementModal";
import FeedbackTab from "./FeedbackTab";
import CreateEventModal from "./CreateEventModal";
import Footer from "@/components/layout/Footer";
import { getAvatarUrl } from "@/lib/avatar";
import NotificationCenter from "@/components/NotificationCenter";
import api from "@/lib/axios";

const FacultyDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState([]);
  const [sentAnnouncements, setSentAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [activeTab, setActiveTab] = useState("events");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [recentFeedback, setRecentFeedback] = useState([]);

  // Dynamic greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const fetchFacultyData = async () => {
    try {
      setLoading(true);
      const [eventsRes, sentRes, feedbackRes] = await Promise.allSettled([
        api.get("/events"),
        api.get("/notifications/sent"),
        api.get("/feedback")
      ]);
      if (eventsRes.status === "fulfilled") setEvents(eventsRes.value.data);
      if (sentRes.status === "fulfilled") setSentAnnouncements(sentRes.value.data);
      if (feedbackRes.status === "fulfilled") setRecentFeedback(feedbackRes.value.data.slice(0, 3));
    } catch (error) {
      console.error("Dashboard sync failed:", error);
      toast({
        title: "Sync failed",
        description: "Please check your connection and refresh.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacultyData();
  }, []);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Trigger parent components to refilter if needed
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const myEvents = events.filter((e) => {
    const isMine = (e.organizer?._id || e.organizer) === user?._id ||
      (e.assignedFaculty?._id || e.assignedFaculty) === user?._id;
    if (!isMine) return false;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return e.title?.toLowerCase().includes(query) ||
        e.venue?.toLowerCase().includes(query) ||
        e.description?.toLowerCase().includes(query);
    }
    return true;
  });

  const totalRegistered = myEvents.reduce((sum, e) => sum + (e.registeredStudents?.length || 0), 0);
  const totalAttended = myEvents.reduce((sum, e) => sum + (e.attendedStudents?.length || 0), 0);
  const attendanceRate = totalRegistered > 0 ? Math.round((totalAttended / totalRegistered) * 100) : 0;

  // Compute average rating from events if available
  const averageRating = myEvents.length > 0
    ? (myEvents.reduce((sum, e) => sum + (e.averageRating || 4.8), 0) / myEvents.length).toFixed(1)
    : "4.8";

  const NavItems = [
    { id: "events", label: "Events", icon: LayoutDashboard },
    { id: "students", label: "Students", icon: GraduationCap },
    { id: "feedback", label: "Feedback", icon: MessageCircle },
    { id: "profile", label: "Settings", icon: UserCircle },
  ];

  const handleEditEvent = (eventInput) => {
    if (eventInput) {
      if (typeof eventInput === "object") {
        setEditingEvent(eventInput);
      } else {
        const event = myEvents.find(e => e._id === eventInput);
        setEditingEvent(event);
      }
    } else {
      setEditingEvent(null);
    }
    setIsEventModalOpen(true);
  };

  const handleCreateEvent = () => {
    setEditingEvent(null);
    setIsEventModalOpen(true);
  };

  const StatsSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {Array(4).fill(0).map((_, i) => (
        <Skeleton key={i} className="h-32 w-full rounded-[2rem]" />
      ))}
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Helmet><title>Faculty Hub | CampusBuzz</title></Helmet>

      {/* SIDEBAR: Fixed on Left for Desktop */}
      <aside className="hidden lg:flex w-72 flex-col fixed top-20 bottom-0 left-0 z-50 bg-white border-r border-slate-200">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <ShieldCheck size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-900 leading-none">FacultyHub</span>
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-1">Management Portal</span>
            </div>
          </div>

          <nav className="space-y-1.5">
            {NavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-200 ${activeTab === item.id
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
              >
                <item.icon size={20} className={activeTab === item.id ? "text-white" : "text-slate-400"} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-slate-100 flex flex-col gap-3">
          <div className="p-4 bg-slate-900 rounded-[1.5rem] text-white relative overflow-hidden group">
            <Sparkles size={60} className="absolute -bottom-4 -right-4 opacity-10 group-hover:scale-110 transition-transform" />
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Power Tip</p>
            <p className="text-[11px] text-slate-300 leading-tight mb-3">Send instant broadcasts to all students!</p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowAnnouncementModal(true)}
              className="w-full bg-white/10 border-0 text-white hover:bg-white/20 font-bold h-8 text-[11px]"
            >
              Broadcast
            </Button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
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
                      <span className="font-black text-xl tracking-tight text-slate-900 leading-none">FacultyHub</span>
                      <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-1">Management Portal</span>
                    </div>
                  </div>
                  <nav className="flex-1 px-4 space-y-2 mt-4">
                    {NavItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => { setActiveTab(item.id); setIsSheetOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === item.id ? "bg-indigo-600 text-white" : "text-slate-500"
                          }`}
                      >
                        <item.icon size={20} /> {item.label}
                      </button>
                    ))}

                    <div className="h-px bg-slate-100 my-4" />
                    <Button
                      variant="outline"
                      className="w-full rounded-xl border-slate-200 font-bold h-12 flex items-center gap-2"
                      onClick={() => { setShowAnnouncementModal(true); setIsSheetOpen(false); }}
                    >
                      <Megaphone size={18} /> Broadcast
                    </Button>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
            <h1 className="text-lg font-bold text-slate-800 hidden sm:block">Faculty Overview</h1>
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
        <div className="p-4 md:p-8 max-w-[1400px] mx-auto space-y-8 flex-1 w-full">

          {/* Welcome Section */}
          <section className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-1">Performance Insights</p>
                <h2 className="text-xl font-black text-slate-900 leading-tight">{getGreeting()}, {user?.fullName?.split(' ')[0]} </h2>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="rounded-xl border-slate-200 font-bold"
                  onClick={() => setShowAnnouncementModal(true)}
                >
                  Quick Broadcast
                </Button>
                <Button
                  className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold"
                  onClick={handleCreateEvent}
                >
                  <Plus className="mr-2" size={18} /> New Event
                </Button>
              </div>
            </div>

            {/* Stats - With Skeleton Loader */}
            {loading ? (
              <StatsSkeleton />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
                {[
                  { label: "Attendance", value: `${attendanceRate}%`, icon: TrendingUp, color: "bg-indigo-50 text-indigo-600" },
                  { label: "Total Students", value: totalRegistered.toLocaleString(), icon: Users, color: "bg-emerald-50 text-emerald-600" },
                  { label: "Assigned", value: myEvents.length, icon: Calendar, color: "bg-blue-50 text-blue-600" }
                ].map((stat, i) => (
                  <Card key={i} className="border-none shadow-sm rounded-2xl hover:shadow-md transition-shadow">
                    <CardContent className="p-4 md:p-5 flex items-center gap-4">
                      <div className={`p-2.5 rounded-xl ${stat.color} shadow-sm shrink-0`}>
                        <stat.icon size={20} />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                        <p className="text-lg font-black text-slate-900 tracking-tighter mt-0.5">{stat.value}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Content Tabs */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                  <TabsContent value="events" className="mt-0 outline-none">
                    <FacultyMyEvents events={myEvents} handleEditEvent={handleEditEvent} onRefresh={fetchFacultyData} />
                  </TabsContent>
                  <TabsContent value="students" className="mt-0 outline-none">
                    <FacultyStudentList events={myEvents} />
                  </TabsContent>
                  <TabsContent value="feedback" className="mt-0 outline-none">
                    <FeedbackTab events={myEvents} />
                  </TabsContent>
                  <TabsContent value="profile" className="mt-0 outline-none">
                    <ProfileSection user={user} toast={toast} />
                  </TabsContent>
                </Tabs>
              </div>

              {/* Sidebar Cards */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl shadow-slate-200/50">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-5 flex items-center gap-2">
                    <Megaphone size={14} className="text-indigo-400" /> Recent Broadcasts
                  </h3>
                  <div className="space-y-6">
                    {sentAnnouncements.length > 0 ? sentAnnouncements.slice(0, 5).map((ann, i) => (
                      <div key={ann._id || i} className="flex gap-4 border-l-2 border-slate-800 pl-4 relative">
                        <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-indigo-500" />
                        <div>
                          <p className="text-sm font-bold text-slate-200 leading-tight mb-1">{ann.message}</p>
                          <p className="text-[10px] font-bold text-slate-500 uppercase">
                            {ann.createdAt ? new Date(ann.createdAt).toLocaleDateString() : 'Just now'}
                          </p>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-6">
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">No recent alerts</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-indigo-600 rounded-3xl p-6 text-white relative overflow-hidden group">
                  <div className="relative z-10">
                    <h2 className="text-lg font-black mb-1">Push Broadcast</h2>
                    <p className="text-indigo-100 text-xs mb-4">Need to reach everyone? Send an instant notification to all registered students.</p>
                    <Button
                      onClick={() => setShowAnnouncementModal(true)}
                      className="w-full rounded-xl bg-white/10 border-0 text-white hover:bg-white/20 font-bold py-5"
                    >
                      Open Broadcast
                    </Button>
                  </div>
                  <Megaphone size={100} className="absolute -bottom-4 -right-4 opacity-10 group-hover:scale-110 transition-transform" />
                </div>

                {/* Recent Student Feedback - NEW */}
                <Card className="border-slate-200 rounded-3xl p-6 shadow-sm bg-white overflow-hidden relative group">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                       <MessageCircle size={14} className="text-indigo-500" /> Student Insights
                    </h3>
                    <button onClick={() => setActiveTab("feedback")} className="text-[9px] font-bold text-indigo-600 hover:underline px-2 py-1 bg-indigo-50 rounded-lg">View All</button>
                  </div>
                  
                  <div className="space-y-4">
                    {recentFeedback.length === 0 ? (
                      <p className="text-[11px] text-slate-400 font-medium py-2">No student suggestions yet.</p>
                    ) : (
                      recentFeedback.map((fb, i) => (
                        <div key={i} className="space-y-1.5 pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-black text-slate-900 line-clamp-1">{fb.studentId?.fullName}</span>
                            <span className="text-[8px] font-bold text-slate-300 uppercase">{new Date(fb.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-tight line-clamp-2 italic">"{fb.message}"</p>
                        </div>
                      ))
                    )}
                  </div>
                </Card>

                <Card className="border-slate-200 rounded-3xl p-6 shadow-sm bg-white">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-black text-slate-900 uppercase tracking-widest text-[9px]">Quick Status</h3>
                  </div>
                  <div className="space-y-3 pt-3">
                    <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                      <span className="text-[11px] font-bold text-slate-500">Active Events</span>
                      <Badge className="bg-indigo-100 text-indigo-600 border-none px-2.5 py-0.5 font-black text-[9px]">
                        {myEvents.filter(e => e.status === 'approved').length}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                      <span className="text-[11px] font-bold text-slate-500">Total Reach</span>
                      <span className="text-[11px] font-black text-slate-900">{totalRegistered} Students</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </section>
        </div>

        <Footer />
      </main>

      <AnnouncementModal
        isOpen={showAnnouncementModal}
        onClose={() => setShowAnnouncementModal(false)}
        events={myEvents.filter(e => e.status !== 'completed')}
        onSuccess={fetchFacultyData}
      />

      <CreateEventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onSuccess={fetchFacultyData}
        eventData={editingEvent}
      />
    </div>
  );
};

export default FacultyDashboard;