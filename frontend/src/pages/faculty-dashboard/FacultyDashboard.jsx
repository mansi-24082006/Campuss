import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  Calendar,
  BarChart3,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

import eventsData from "./data/events.json";
import studentsData from "./data/students.json";

import MyEvents from "./MyEvents";
import StudentList from "./StudentList";
import ProfileSection from "./ProfileSection";

const FacultyDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [events, setEvents] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    setEvents(eventsData || []);
    setStudents(studentsData || []);
  }, []);

  const handleCreateEvent = () =>
    toast({
      title: "Opening Event Studio",
      description: "Redirecting to management interface...",
    });

  const stats = [
    {
      label: "Active Events",
      value: events.length,
      icon: Calendar,
      color: "bg-blue-50 text-blue-600",
      trend: "+2 this week",
    },
    {
      label: "Total Students",
      value: students.length,
      icon: Users,
      color: "bg-purple-50 text-purple-600",
      trend: "Stable",
    },
    {
      label: "Avg. Attendance",
      value: "88%",
      icon: BarChart3,
      color: "bg-emerald-50 text-emerald-600",
      trend: "+5%",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Faculty Command | CampusBuzz</title>
      </Helmet>

      {/* Main Container - Added selection and smooth scrolling */}
      <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-100 overflow-x-hidden">
        {/* Navigation Bar - Responsive height and padding */}
        <nav className="sticky top-0 z-50 h-16 md:h-20 w-full bg-white/70 backdrop-blur-xl border-b border-slate-200/60 px-4 sm:px-8 lg:px-14 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3 group cursor-pointer">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-600 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:rotate-6 transition-transform">
              <ShieldCheck size={22} className="md:w-[26px]" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base md:text-lg leading-tight tracking-tight">
                Campus Faculty
              </span>
              <span className="hidden xs:block text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                Management Suite
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4 bg-white p-1 md:p-1.5 md:pl-4 rounded-xl md:rounded-2xl border border-slate-100 shadow-sm">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-slate-800">
                Prof. {user?.name}
              </p>
              <p className="text-[10px] text-indigo-600 font-bold uppercase">
                Lead Admin
              </p>
            </div>
            <Avatar className="h-8 w-8 md:h-10 md:h-10 border-2 border-slate-50 ring-2 ring-indigo-50">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="bg-indigo-600 text-white font-bold">
                {user?.name?.[0]}
              </AvatarFallback>
            </Avatar>
          </div>
        </nav>

        {/* MAIN CONTENT - Max width 2xl/3xl for ultra-wide screens */}
        <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-6 md:py-10 space-y-6 md:space-y-10">
          {/* Stats Section - Changed to auto-fit grid */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group relative bg-white border border-slate-200/80 p-5 md:p-7 rounded-[1.5rem] md:rounded-[2.5rem] shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4 md:mb-6">
                  <div
                    className={`${stat.color} w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center`}
                  >
                    <stat.icon size={24} className="md:w-[28px]" />
                  </div>
                  <span className="text-[9px] md:text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 md:px-3 md:py-1.5 rounded-full ring-1 ring-inset ring-emerald-600/10">
                    {stat.trend}
                  </span>
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] md:text-[11px] font-bold uppercase tracking-widest mb-1">
                    {stat.label}
                  </p>
                  <p className="text-2xl md:text-4xl font-black text-slate-900 leading-none">
                    {stat.value}
                  </p>
                </div>
              </motion.div>
            ))}
          </section>

          {/* Interface Section - Responsive rounding and min-height */}
          <section className="bg-white border border-slate-200/60 rounded-[1.5rem] md:rounded-[3rem] shadow-sm overflow-hidden flex flex-col">
            <Tabs defaultValue="events" className="h-full flex flex-col">
              {/* Tabs Header - Horizontal scroll on mobile */}
              <div className="px-4 md:px-8 py-4 md:py-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 bg-slate-50/30">
                <TabsList className="bg-slate-200/50 p-1 rounded-xl md:rounded-2xl h-auto self-start overflow-x-auto max-w-full">
                  {["events", "students", "profile"].map((tab) => (
                    <TabsTrigger
                      key={tab}
                      value={tab}
                      className="px-4 md:px-8 py-2 md:py-2.5 text-xs md:text-sm font-bold rounded-lg md:rounded-xl transition-all data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <div className="hidden xs:flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-emerald-50 rounded-full border border-emerald-100 self-start sm:self-auto">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[9px] md:text-[11px] font-bold text-emerald-700 uppercase tracking-tighter">
                    System Optimal
                  </span>
                </div>
              </div>

              {/* Tabs Body - Responsive padding */}
              <div className="flex-1 p-4 sm:p-6 md:p-8">
                <AnimatePresence mode="wait">
                  <TabsContent value="events" className="mt-0 outline-none">
                    <MyEvents
                      events={events}
                      handleCreateEvent={handleCreateEvent}
                    />
                  </TabsContent>
                  <TabsContent value="students" className="mt-0 outline-none">
                    <StudentList students={students} />
                  </TabsContent>
                  <TabsContent value="profile" className="mt-0 outline-none">
                    <ProfileSection user={user} toast={toast} />
                  </TabsContent>
                </AnimatePresence>
              </div>
            </Tabs>
          </section>
        </main>
      </div>
    </>
  );
};

export default FacultyDashboard;
