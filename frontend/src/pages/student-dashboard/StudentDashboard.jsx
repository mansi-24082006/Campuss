import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  Sparkles,
  Filter,
  ChevronLeft,
  ChevronRight,
  Search,
  Clock,
  CalendarDays,
  Zap,
  Trophy,
  Target,
  Bell,
  X,
  User as UserIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarUrl } from "@/lib/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import api from "@/lib/axios";

import AvailableEvents from "./AvailableEvents";
import MyEvents from "./MyEvents";
import ProfileSection from "./ProfileSection";
import CertificatesTab from "./CertificatesTab";
import NotificationCenter from "@/components/NotificationCenter";
import AIChatbot from "@/components/AIChatbot";

// Helper: generate Google Calendar link
const buildCalendarLink = (event) => {
  const start = new Date(event.date);
  const end = event.endDate ? new Date(event.endDate) : new Date(start.getTime() + 2 * 60 * 60 * 1000);
  const fmt = (d) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: event.description || "",
    location: event.venue || "Campus",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

const FILTER_CHIPS = [
  { label: "All", value: "all", icon: Target },
  { label: "Today", value: "today", icon: Clock },
  { label: "Upcoming", value: "upcoming", icon: CalendarDays },
  { label: "Hackathon", value: "hackathon", icon: Zap },
  { label: "Seminar", value: "seminar", icon: Bell },
  { label: "Tech Fest", value: "tech-fest", icon: Trophy },
  { label: "Competition", value: "competition", icon: Trophy },
  { label: "Workshop", value: "workshop", icon: Sparkles },
];

const StudentDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [events, setEvents] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChip, setActiveChip] = useState("all");
  const [department, setDepartment] = useState("all");
  const [showFilter, setShowFilter] = useState(true);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("events");

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [allEventsRes, recsRes] = await Promise.all([
        api.get("/events"),
        api.get("/events/student/recommendations"),
      ]);
      setEvents(allEventsRes.data);
      setRecommendations(recsRes.data);
      setRegisteredEvents(
        allEventsRes.data.filter((e) =>
          e.registeredStudents?.some((s) => (s._id || s) === user._id)
        )
      );
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) fetchDashboardData();
  }, [user]);

  const handleRegister = async (eventId) => {
    try {
      const res = await api.post(`/events/${eventId}/register`);
      const waitlisted = res.data?.waitlisted;
      const ev = events.find((e) => e._id === eventId);

      if (waitlisted) {
        toast({
          title: "Added to Waitlist",
          description: `You're on the waitlist for "${ev?.title}". We'll notify you if a seat opens.`,
          duration: 5000,
        });
      } else {
        toast({
          title: "🎉 Registration Confirmed!",
          description: (
            <div className="space-y-2">
              <p className="font-bold text-slate-800">{ev?.title}</p>
              <p className="text-sm text-slate-500">
                {ev?.date ? new Date(ev.date).toLocaleDateString("en-IN", { dateStyle: "long" }) : ""}
                {ev?.venue ? `  ${ev.venue}` : ""}
              </p>
              {ev && (
                <a
                  href={buildCalendarLink(ev)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-indigo-600 font-semibold text-sm hover:underline"
                >
                  + Add to Google Calendar
                </a>
              )}
            </div>
          ),
          duration: 8000,
        });
      }

      fetchDashboardData();
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const applyFilters = (data) => {
    let filtered = data;

    // Text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.title?.toLowerCase().includes(q) ||
          e.description?.toLowerCase().includes(q) ||
          e.category?.toLowerCase().includes(q) ||
          e.type?.toLowerCase().includes(q) ||
          e.venue?.toLowerCase().includes(q)
      );
    }

    // Chip filters
    if (activeChip === "today") {
      const today = new Date();
      filtered = filtered.filter((e) => {
        const d = new Date(e.date);
        return (
          d.getFullYear() === today.getFullYear() &&
          d.getMonth() === today.getMonth() &&
          d.getDate() === today.getDate()
        );
      });
    } else if (activeChip === "upcoming") {
      filtered = filtered.filter((e) => new Date(e.date) >= new Date());
    } else if (activeChip !== "all") {
      filtered = filtered.filter(
        (e) =>
          e.type === activeChip ||
          e.category?.toLowerCase() === activeChip
      );
    }

    // Department filter
    if (department !== "all") {
      filtered = filtered.filter((e) => e.department === department);
    }

    return filtered;
  };

  const filteredEvents = applyFilters(events);
  const filteredRegisteredEvents = applyFilters(registeredEvents);

  return (
    <>
      <Helmet>
        <title>Dashboard | CampusBuzz</title>
      </Helmet>

      <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 text-slate-900">
        {/* ===== PREMIUM HEADER ===== */}
        <header className="relative mb-8 overflow-hidden rounded-3xl bg-slate-900 p-6 md:p-8 shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm uppercase tracking-wider mb-2">
                <Sparkles size={16} />
                <span>Student Portal</span>
              </div>
              <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white">
                Welcome back,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                  {user?.fullName?.split(" ")[0] || "Explorer"}
                </span>
              </h1>
              <p className="mt-2 text-slate-400 text-sm max-w-md">
                Dept: <span className="text-indigo-400 font-bold">{user?.department || "General"}</span> &nbsp;|&nbsp; XP:{" "}
                <span className="text-indigo-400 font-bold">{user?.points || 0}</span>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              {/* Ranking Grid - Responsive */}
              <div className="w-full sm:w-auto flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                <div className="flex-shrink-0 min-w-[100px] bg-white/5 backdrop-blur-md border border-white/10 p-3 rounded-2xl">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">College</p>
                  <p className="text-indigo-400 font-bold text-lg">#{user?.ranking?.college || "-"}</p>
                </div>
                <div className="flex-shrink-0 min-w-[100px] bg-white/5 backdrop-blur-md border border-white/10 p-3 rounded-2xl">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">State</p>
                  <p className="text-purple-400 font-bold text-lg">#{user?.ranking?.state || "-"}</p>
                </div>
                <div className="flex-shrink-0 min-w-[100px] bg-white/5 backdrop-blur-md border border-white/10 p-3 rounded-2xl">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">National</p>
                  <p className="text-emerald-400 font-bold text-lg">#{user?.ranking?.national || "-"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 pl-4 border-l border-white/10 self-end sm:self-center">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-white leading-none">{user?.fullName?.split(" ")[0]}</p>
                  <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider mt-1">Student</p>
                </div>
                <Avatar className="h-12 w-12 border-2 border-white/20 shadow-xl">
                  <AvatarImage src={getAvatarUrl(user)} />
                  <AvatarFallback className="bg-indigo-600 text-white font-bold">{user?.fullName?.[0]}</AvatarFallback>
                </Avatar>
              </div>

              <NotificationCenter />
            </div>
          </div>
          <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-[-20%] left-[10%] w-72 h-72 bg-purple-600/10 rounded-full blur-3xl" />
        </header>

        <AIChatbot />

        {/* ===== SEARCH BAR ===== */}
        <div className="relative mb-5">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search events by name, category, venue…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* ===== QUICK FILTER CHIPS ===== */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {FILTER_CHIPS.map((chip) => (
            <button
              key={chip.value}
              onClick={() => setActiveChip(chip.value)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all border
                ${activeChip === chip.value
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200"
                  : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
                }`}
            >
              <chip.icon size={14} />
              {chip.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* ===== FILTER SIDEBAR ===== */}
          <AnimatePresence>
            {showFilter && (
              <motion.aside
                initial={{ width: 0, opacity: 0, x: -20 }}
                animate={{ width: 256, opacity: 1, x: 0 }}
                exit={{ width: 0, opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="hidden md:block overflow-hidden"
              >
                <div className="sticky top-8 w-64 pr-4">
                  <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <Filter size={18} className="text-indigo-600" />
                        Refine Feed
                      </h2>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">Department</p>
                      <div className="grid grid-cols-1 gap-1.5">
                        {["all", "Computer", "IT", "Mechanical", "MBA", "Electronics"].map((opt) => (
                          <button
                            key={opt}
                            onClick={() => setDepartment(opt)}
                            className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                              ${department === opt
                                ? "bg-slate-800 dark:bg-slate-700 text-white shadow-md font-bold"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                              }`}
                          >
                            <span className="capitalize">{opt}</span>
                            {department === opt && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Mobile Filter Toggle (Conditional) */}
          {/* ... mobile filter could be added here if needed, but keeping it simple for now ... */}

          {/* ===== CONTENT AREA ===== */}
          <main className="flex-1 min-w-0">
            {/* Desktop Sidebar Toggle */}
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="hidden md:flex mb-6 items-center gap-2 text-xs font-black tracking-widest text-slate-400 hover:text-indigo-600 transition-all group"
            >
              <motion.div
                animate={{ rotate: showFilter ? 0 : 180 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <ChevronLeft size={16} />
              </motion.div>
              <span>{showFilter ? "COLLAPSE FILTERS" : "EXPAND FILTERS"}</span>
            </button>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="inline-flex h-12 items-center justify-center rounded-xl bg-slate-200/50 p-1 text-slate-500 mb-8 w-full md:w-auto">
                <TabsTrigger
                  value="events"
                  className="flex-1 md:flex-none px-6 rounded-lg data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
                >
                  Discover
                </TabsTrigger>
                <TabsTrigger
                  value="registered"
                  className="flex-1 md:flex-none px-6 rounded-lg data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
                >
                  My Journey
                </TabsTrigger>
                <TabsTrigger
                  value="profile"
                  className="flex-1 md:flex-none px-6 rounded-lg data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
                >
                  Profile
                </TabsTrigger>
                <TabsTrigger
                  value="certificates"
                  className="flex-1 md:flex-none px-6 rounded-lg data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
                >
                  Certificates
                </TabsTrigger>
              </TabsList>

              <div className="mt-4">
                <TabsContent value="events" className="focus-visible:outline-none focus-visible:ring-0">
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Recommendations */}
                    {recommendations.length > 0 && !searchQuery && activeChip === "all" && (
                      <div className="mb-10">
                        <div className="flex items-center gap-2 mb-4">
                          <h2 className="text-xl font-bold text-slate-800">Recommended for You</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {recommendations.map((event) => (
                            <div
                              key={event._id}
                              className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-xl hover:scale-[1.02] transition-transform cursor-pointer overflow-hidden relative group"
                            >
                              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Sparkles size={80} />
                              </div>
                              <div className="relative z-10">
                                <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-2 py-1 rounded-full mb-3 inline-block">
                                  {event.participationLevel} Level
                                </span>
                                <h3 className="text-xl font-bold mb-2 line-clamp-1">{event.title}</h3>
                                <p className="text-indigo-100 text-sm mb-4 line-clamp-2">{event.description}</p>
                                <button
                                  onClick={() => handleRegister(event._id)}
                                  className="w-full py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-lg"
                                >
                                  Quick Register
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Results count */}
                    {!loading && (
                      <p className="text-sm text-slate-500 mb-4">
                        Showing <span className="font-bold text-slate-800">{filteredEvents.length}</span> events
                        {searchQuery && <> for <span className="font-bold text-indigo-600">"{searchQuery}"</span></>}
                        {activeChip !== "all" && <> • Filter: <span className="font-bold text-indigo-600">{activeChip}</span></>}
                      </p>
                    )}

                    {loading ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="h-64 rounded-3xl bg-slate-200 animate-pulse" />
                        ))}
                      </div>
                    ) : filteredEvents.length === 0 ? (
                      <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                        <Search size={40} className="mx-auto text-slate-300 mb-4" />
                        <p className="text-slate-500 font-medium">No events found</p>
                        <button onClick={() => { setSearchQuery(""); setActiveChip("all"); }} className="mt-3 text-indigo-600 text-sm font-semibold hover:underline">
                          Clear filters
                        </button>
                      </div>
                    ) : (
                      <AvailableEvents
                        events={filteredEvents}
                        onRegister={handleRegister}
                        registeredEventIds={registeredEvents.map((e) => e._id)}
                        buildCalendarLink={buildCalendarLink}
                      />
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="registered" className="focus-visible:outline-none focus-visible:ring-0">
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {loading ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="h-48 rounded-3xl bg-slate-200 animate-pulse" />
                        ))}
                      </div>
                    ) : (
                      <MyEvents
                        registeredEvents={filteredRegisteredEvents}
                        buildCalendarLink={buildCalendarLink}
                      />
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="profile" className="focus-visible:outline-none focus-visible:ring-0">
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <ProfileSection user={user} />
                  </div>
                </TabsContent>

                <TabsContent value="certificates" className="focus-visible:outline-none focus-visible:ring-0">
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <CertificatesTab registeredEvents={filteredRegisteredEvents} />
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </main>
        </div>

        {/* ===== MOBILE BOTTOM NAV ===== */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 flex items-stretch">
          {[
            { label: "Discover", value: "events", icon: "🔍" },
            { label: "My Journey", value: "registered", icon: "📌" },
            { label: "Certificates", value: "certificates", icon: "📜" },
            { label: "Profile", value: "profile", icon: "👤" },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setActiveTab(item.value)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-semibold transition-colors
                ${activeTab === item.value ? "text-indigo-600" : "text-slate-400"}`}
            >
              <span className="text-xl">{item.icon}</span>
              {item.label}
              {activeTab === item.value && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-indigo-600 rounded-full" />
              )}
            </button>
          ))}
        </nav>
        <div className="h-20 md:hidden" /> {/* spacer for bottom nav */}
      </div>
    </>
  );
};

export default StudentDashboard;
