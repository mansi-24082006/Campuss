import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  Sparkles, Filter, ChevronLeft, Search, Clock, CalendarDays, Zap,
  Trophy, Target, Bell, MapPin, FileText, User, Award, X, LayoutGrid,
  History, GraduationCap, UserCircle, MessageSquarePlus, Menu, ShieldCheck,
  LayoutDashboard, Star, LogOut, Heart
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarUrl } from "@/lib/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// Components
import AvailableEvents from "./AvailableEvents";
import MyEvents from "./MyEvents";
import ProfileSection from "./ProfileSection";
import CertificatesTab from "./CertificatesTab";
import NotificationCenter from "@/components/NotificationCenter";
import Footer from "@/components/layout/Footer";
import { DEPARTMENTS } from "@/lib/departments";
import { EVENT_DOMAINS, EVENT_CATEGORIES } from "@/lib/eventCategories";

const FILTER_CHIPS = [
  { label: "All Hubs", value: "all", icon: LayoutGrid },
  { label: "Technical", value: "Technical", icon: Target },
  { label: "Non-Technical", value: "Non-Technical", icon: Sparkles },
  { label: "Cultural", value: "Cultural", icon: Heart },
  { label: "Academic", value: "Academic", icon: GraduationCap },
  { label: "Gaming", value: "Gaming & Fun", icon: Trophy },
];

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const [events, setEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChip, setActiveChip] = useState("all");
  const [activeCategory, setActiveCategory] = useState("all");
  const [department, setDepartment] = useState("all");
  const [showFilter, setShowFilter] = useState(true);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("events");
  const [dateFilter, setDateFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [modeFilter, setModeFilter] = useState("all");
  const [feedback, setFeedback] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

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

  const handleRegister = async (eventId) => {
    try {
      const res = await api.post(`/events/${eventId}/register`);
      const waitlisted = res.data?.waitlisted;
      const ev = events.find((e) => e._id === eventId);
      if (waitlisted) {
        toast({ title: "Added to Waitlist", description: `You're on the waitlist for "${ev?.title}".`, duration: 5000 });
      } else {
        toast({
          title: "Registration Confirmed!",
          description: (
            <div className="space-y-2 text-slate-900">
              <p className="font-bold">{ev?.title}</p>
              <p className="text-sm opacity-80">{new Date(ev.date).toLocaleDateString("en-IN", { dateStyle: "long" })}</p>
              <a href={buildCalendarLink(ev)} target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-semibold text-xs hover:underline">+ Google Calendar</a>
            </div>
          ),
          duration: 8000,
        });
      }
      fetchDashboardData();
    } catch (error) {
      toast({ title: "Registration Failed", description: error.response?.data?.message || "Something went wrong", variant: "destructive" });
    }
  };

  const submitSuggestions = async () => {
    if (!feedback.trim()) return;
    setSubmittingFeedback(true);
    try {
      await api.post("/feedback", { message: feedback });
      toast({ title: "Thank you!", description: "Your suggestions have been sent to the admin team." });
      setFeedback("");
      setActiveTab("events");
    } catch (error) {
      toast({ title: "Error", description: "Failed to send feedback", variant: "destructive" });
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (department !== "all") params.append("department", department);

      // Handle Quick Filter Chips
      if (activeChip !== "all") {
        params.append("type", activeChip);
        if (activeCategory !== "all") {
          params.append("category", activeCategory);
        }
      }

      // Sidebar Filters (Override chips if set)
      if (dateFilter !== "all") params.delete("dateFilter"); // clear chip if sidebar is used? 
      if (dateFilter !== "all") params.append("dateFilter", dateFilter);
      if (levelFilter !== "all") params.append("level", levelFilter);
      if (modeFilter !== "all") params.append("mode", modeFilter);

      const [allEventsRes] = await Promise.all([
        api.get(`/events?${params.toString()}`)
      ]);
      console.log("[DEBUG] StudentDashboard: Fetched events:", allEventsRes.data);
      setEvents(allEventsRes.data);
      setRegisteredEvents(
        allEventsRes.data.filter((e) =>
          e.registeredStudents?.some((s) => (s._id || s) === user?._id)
        )
      );
    } catch (error) {
      console.error("Dashboard Sync Failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) fetchDashboardData();
  }, [user, searchQuery, activeChip, activeCategory, department, dateFilter, levelFilter, modeFilter]);

  const NavItems = [
    { id: "events", label: "Discovery", icon: LayoutDashboard },
    { id: "registered", label: "My Feed", icon: Target },
    { id: "certificates", label: "Achievements", icon: Award },
    { id: "profile", label: "Settings", icon: UserCircle },
    { id: "feedback", label: "Feedback", icon: MessageSquarePlus },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Helmet><title>Student Hub | CampusBuzz</title></Helmet>

      {/* --- SIDEBAR: Fixed on Left for Desktop --- */}
      <aside className="hidden lg:flex w-72 flex-col fixed top-20 bottom-0 left-0 z-50 bg-white border-r border-slate-200">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
              <ShieldCheck size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-900 leading-none">StudentHub</span>
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-1">Exploration Mode</span>
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
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 lg:ml-72 min-w-0 flex flex-col pb-20 lg:pb-0">

        {/* Header */}
        <header className="h-20 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-20 z-40 px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4 lg:hidden">
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
                    <span className="font-black text-xl tracking-tight text-slate-900 leading-none">StudentHub</span>
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-1">Exploration Mode</span>
                  </div>
                </div>
                <nav className="flex-1 px-4 space-y-2 mt-4">
                  {NavItems.map(item => (
                    <button
                      key={item.id}
                      onClick={() => { setActiveTab(item.id); setIsSheetOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold ${activeTab === item.id ? "bg-indigo-600 text-white" : "text-slate-500"}`}
                    >
                      <item.icon size={20} /> {item.label}
                    </button>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            <ShieldCheck className="text-indigo-600 w-8 h-8" />
          </div>

          <div className="flex-1 max-w-xl mx-8 hidden md:block group">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
              <input
                placeholder="Search hackathons, workshops, or venues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium focus:ring-4 ring-indigo-500/10 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <NotificationCenter />
            <div className="h-8 w-px bg-slate-200 hidden sm:block" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-slate-900 leading-none">{user?.fullName}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Student Learner</p>
              </div>
              <Avatar className="h-10 w-10 border-2 border-white ring-2 ring-slate-100 transition-transform hover:scale-105">
                <AvatarImage src={getAvatarUrl(user)} />
                <AvatarFallback>{user?.fullName?.[0]}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 md:p-10 max-w-[1400px] mx-auto space-y-10 flex-1 w-full">

          {activeTab === "events" && (
            <section className="space-y-10">
              <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
                <div>
                  <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em] mb-3">
                    <Sparkles size={14} /> Explorer View
                  </div>
                  <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900">
                    Your next <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">Big Win?</span>
                  </h1>
                  <p className="text-slate-500 mt-2 font-medium">Discover opportunities to learn, compete, and grow.</p>
                </div>

                {/* Bento Stats */}
                <div className="flex items-center gap-4">
                  <Card className="border-none shadow-sm rounded-2xl hover:shadow-md transition-shadow">
                    <CardContent className="p-4 md:p-5 flex items-center gap-4">
                      <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl"><History size={20} /></div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Registrations</p>
                        <p className="text-2xl font-black text-slate-900 tracking-tighter">{registeredEvents.length}</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-900 border-none rounded-2xl shadow-xl shadow-slate-200/50">
                    <CardContent className="p-4 md:p-5 flex items-center gap-4 text-white">
                      <div className="p-2.5 bg-white/10 text-amber-400 rounded-xl"><Award size={20} /></div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Completed</p>
                        <p className="text-2xl font-black tracking-tighter">{user?.eventsAttended?.length || 0}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Quick Filters - Level 1: Domain */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
                  {FILTER_CHIPS.map((chip) => (
                    <button
                      key={chip.value}
                      onClick={() => { setActiveChip(chip.value); setActiveCategory("all"); }}
                      className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border
                              ${activeChip === chip.value
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-600/20"
                          : "bg-white text-slate-500 border-slate-200 hover:border-indigo-200 hover:text-indigo-600"
                        }`}
                    >
                      <chip.icon size={16} /> {chip.label}
                    </button>
                  ))}
                </div>

                {/* Quick Filters - Level 2: Specific Categories */}
                {activeChip !== "all" && EVENT_CATEGORIES[activeChip] && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar border-t border-slate-100 pt-6"
                   >
                    <button
                      onClick={() => setActiveCategory("all")}
                      className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-wider whitespace-nowrap transition-all border
                        ${activeCategory === "all" 
                          ? "bg-slate-900 text-white border-slate-900" 
                          : "bg-slate-50 text-slate-400 border-slate-100 hover:bg-white hover:text-indigo-600"}`}
                    >
                      All {activeChip}
                    </button>
                    {EVENT_CATEGORIES[activeChip].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-wider whitespace-nowrap transition-all border
                          ${activeCategory === cat 
                            ? "bg-indigo-50 text-indigo-700 border-indigo-200" 
                            : "bg-white text-slate-500 border-slate-100 hover:border-indigo-100 hover:text-indigo-600"}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>

              <div className="flex flex-col lg:flex-row gap-8 mt-4">
                {/* SIDEBAR FILTERS */}
                <AnimatePresence>
                  {showFilter && (
                    <motion.aside
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="hidden xl:block w-72 shrink-0 space-y-6"
                    >
                      <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                          <h2 className="font-black text-slate-900 uppercase tracking-widest text-[11px] flex items-center gap-2">
                            <Filter size={16} className="text-indigo-600" /> Filter Engine
                          </h2>
                          <button onClick={() => { setDepartment("all"); setDateFilter("all"); setLevelFilter("all"); setModeFilter("all"); setActiveChip("all"); }} className="text-[10px] font-black text-indigo-600 hover:underline uppercase tracking-widest">Reset</button>
                        </div>

                        <div className="space-y-2 mb-8">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Vertical</p>
                          <div className="flex flex-col gap-1.5 pt-2">
                            {["all", ...DEPARTMENTS].map((opt) => (
                              <button
                                key={opt}
                                onClick={() => setDepartment(opt)}
                                className={`w-full flex items-center justify-between px-5 py-3 rounded-xl text-[11px] font-black uppercase tracking-tight transition-all duration-300
                                  ${department === opt
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 ring-2 ring-indigo-600/20"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent hover:border-slate-100"
                                  }`}
                              >
                                <span>{opt}</span>
                                {department === opt && <Zap size={12} className="fill-white text-white" />}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-6 pt-6 border-t border-slate-100">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Timeline</p>
                          <Select value={dateFilter} onValueChange={setDateFilter}>
                            <SelectTrigger className="rounded-xl border-slate-200 text-xs h-11 font-bold">
                              <SelectValue placeholder="Date" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              <SelectItem value="all">Unlimited Horizon</SelectItem>
                              <SelectItem value="today">Happening Today</SelectItem>
                              <SelectItem value="week">This Week</SelectItem>
                              <SelectItem value="month">This Month</SelectItem>
                              <SelectItem value="upcoming">Future Events</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-6 pt-8 border-t border-slate-100 mt-6">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Specifications</p>
                          <div className="flex flex-col gap-3">
                            <Select value={levelFilter} onValueChange={setLevelFilter}>
                              <SelectTrigger className="rounded-xl border-slate-200 text-xs h-11 font-bold">
                                <SelectValue placeholder="Scope" />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl">
                                <SelectItem value="all">Global Scope</SelectItem>
                                <SelectItem value="College">Intra-College</SelectItem>
                                <SelectItem value="State">Statewide</SelectItem>
                                <SelectItem value="National">National Level</SelectItem>
                              </SelectContent>
                            </Select>
                            <Select value={modeFilter} onValueChange={setModeFilter}>
                              <SelectTrigger className="rounded-xl border-slate-200 text-xs h-11 font-bold">
                                <SelectValue placeholder="Format" />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl">
                                <SelectItem value="all">Any Format</SelectItem>
                                <SelectItem value="Offline">On-Campus</SelectItem>
                                <SelectItem value="Online">Virtual / Remote</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </motion.aside>
                  )}
                </AnimatePresence>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-black text-slate-900 tracking-tight tracking-tight">Available Events</h2>
                    <button onClick={() => setShowFilter(!showFilter)} className="hidden xl:flex items-center gap-3 text-[10px] font-black tracking-widest text-slate-400 hover:text-indigo-600 uppercase transition-all">
                      <ChevronLeft size={16} className={`transition-transform duration-500 ${!showFilter ? "rotate-180" : ""}`} />
                      {showFilter ? "Maximize Feed" : "Show Engine"}
                    </button>
                  </div>

                  {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {[...Array(4)].map((_, i) => (
                        <Card key={i} className="h-80 rounded-[2.5rem] bg-white border border-slate-200 animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <AvailableEvents
                      events={events}
                      onRegister={handleRegister}
                      registeredEventIds={registeredEvents.map((e) => e._id)}
                      buildCalendarLink={buildCalendarLink}
                    />
                  )}
                </div>
              </div>
            </section>
          )}

          {activeTab === "registered" && (
            <div className="space-y-8">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2">My Schedule</p>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight tracking-tight">Personal Event Feed</h2>
                </div>
              </div>
              <MyEvents registeredEvents={registeredEvents} />
            </div>
          )}

          {activeTab === "certificates" && <CertificatesTab registeredEvents={registeredEvents} />}
          {activeTab === "profile" && <ProfileSection user={user} />}

          {activeTab === "feedback" && (
            <div className="bg-white border border-slate-200 rounded-[3rem] p-10 md:p-16 shadow-sm text-center max-w-2xl mx-auto mt-10">
              <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-sm shadow-indigo-100">
                <MessageSquarePlus size={40} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Share Your Insight</h2>
              <p className="text-slate-500 mb-10 font-medium leading-relaxed">Help us build the ultimate campus experience. Feature requests, bugs, or general feedback—we read everything.</p>
              <Textarea
                placeholder="Ex: I'd love to see more weekend hackathons..."
                className="min-h-[150px] rounded-3xl border-slate-200 focus:ring-4 ring-indigo-500/10 mb-8 font-medium p-6"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
              <Button
                onClick={submitSuggestions}
                disabled={submittingFeedback || !feedback.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-7 rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-[0.98]"
              >
                {submittingFeedback ? "Dispatching..." : "Publish Insight"}
              </Button>
            </div>
          )}
        </div>

        <Footer />
      </main>

      {/* --- FLOATING MOBILE NAV --- */}
      <nav className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl flex items-center justify-around px-2 py-4">
        {NavItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-2 transition-all duration-300
              ${activeTab === item.id ? "text-indigo-400" : "text-slate-500 hover:text-slate-400"}`}
          >
            <item.icon size={24} className={activeTab === item.id ? "scale-110 drop-shadow-[0_0_15px_rgba(99,102,241,0.8)]" : ""} />
            <span className={`text-[8px] font-black uppercase tracking-widest ${activeTab === item.id ? "opacity-100" : "opacity-60"}`}>
              {item.label === "Discovery" ? "Explore" : item.label.split(' ')[0]}
            </span>
          </button>
        ))}
      </nav>
    </div >
  );
};

export default StudentDashboard;