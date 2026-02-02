import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChevronRight, ChevronLeft, Filter, Sparkles } from "lucide-react";

import eventsData from "./data/events.json";
import registeredData from "./data/registeredEvents.json";

import AvailableEvents from "./AvailableEvents";
import MyEvents from "./MyEvents";
import ProfileSection from "./ProfileSection";

import { useAuth } from "@/contexts/AuthContext";

const StudentDashboard = () => {
  const { user } = useAuth();

  const [events, setEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [eventType, setEventType] = useState("all");
  const [department, setDepartment] = useState("all");
  const [showFilter, setShowFilter] = useState(true);

  useEffect(() => {
    setEvents(eventsData);
    setRegisteredEvents(registeredData);
  }, []);

  const applyFilters = (data) => {
    return data.filter((event) => {
      const typeMatch = eventType === "all" || event.type === eventType;
      const deptMatch = department === "all" || event.department === department;
      return typeMatch && deptMatch;
    });
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
        <header className="relative mb-8 overflow-hidden rounded-3xl bg-slate-900 p-8 shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm uppercase tracking-wider mb-2">
                <Sparkles size={16} />
                <span>Student Portal</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                Welcome back,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                  {user?.name || "Explorer"}
                </span>
              </h1>
              <p className="mt-2 text-slate-400 max-w-md">
                Discover, track, and manage your campus journey in one unified
                workspace.
              </p>
            </div>
            <div className="hidden lg:block bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl">
              <p className="text-xs text-slate-500 uppercase font-bold mb-1">
                Status
              </p>
              <p className="text-emerald-400 font-medium flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                Active Member
              </p>
            </div>
          </div>
          {/* Decorative Background Elements */}
          <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-[-20%] left-[10%] w-72 h-72 bg-purple-600/10 rounded-full blur-3xl" />
        </header>

        <div className="flex flex-col md:flex-row gap-8">
          {/* ===== ENHANCED FILTER SIDEBAR ===== */}
          <aside
            className={`${
              showFilter ? "w-full md:w-72" : "w-full md:w-0"
            } transition-all duration-500 ease-in-out`}
          >
            <div
              className={`${
                !showFilter && "md:opacity-0 md:pointer-events-none"
              } sticky top-8 transition-opacity duration-300`}
            >
              <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-slate-800 flex items-center gap-2">
                    <Filter size={18} className="text-indigo-600" />
                    Refine Feed
                  </h2>
                  <button
                    onClick={() => setShowFilter(false)}
                    className="md:hidden text-slate-400"
                  >
                    Close
                  </button>
                </div>

                {/* Filter Groups */}
                {[
                  {
                    label: "Category",
                    state: eventType,
                    setState: setEventType,
                    options: ["all", "technical", "non-technical"],
                    activeColor: "bg-indigo-600",
                  },
                  {
                    label: "Department",
                    state: department,
                    setState: setDepartment,
                    options: ["all", "Computer", "IT", "Mechanical", "MBA"],
                    activeColor: "bg-slate-800",
                  },
                ].map((group) => (
                  <div key={group.label} className="space-y-3">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">
                      {group.label}
                    </p>
                    <div className="grid grid-cols-1 gap-1.5">
                      {group.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => group.setState(opt)}
                          className={`group flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                            ${
                              group.state === opt
                                ? `${group.activeColor} text-white shadow-md shadow-indigo-100`
                                : "text-slate-600 hover:bg-slate-50"
                            }`}
                        >
                          <span className="capitalize">{opt}</span>
                          {group.state === opt && (
                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* ===== CONTENT AREA ===== */}
          <main className="flex-1 min-w-0">
            {/* Desktop Sidebar Toggle */}
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="hidden md:flex mb-4 items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
            >
              {showFilter ? (
                <ChevronLeft size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
              {showFilter ? "HIDE FILTERS" : "SHOW FILTERS"}
            </button>

            <Tabs defaultValue="events" className="w-full">
              <TabsList className="inline-flex h-12 items-center justify-center rounded-xl bg-slate-200/50 p-1 text-slate-500 mb-8">
                <TabsTrigger
                  value="events"
                  className="px-8 rounded-lg data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
                >
                  Available
                </TabsTrigger>
                <TabsTrigger
                  value="registered"
                  className="px-8 rounded-lg data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
                >
                  My Journey
                </TabsTrigger>
                <TabsTrigger
                  value="profile"
                  className="px-8 rounded-lg data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
                >
                  Profile
                </TabsTrigger>
              </TabsList>

              <div className="mt-4">
                <TabsContent
                  value="events"
                  className="focus-visible:outline-none focus-visible:ring-0"
                >
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <AvailableEvents events={filteredEvents} />
                  </div>
                </TabsContent>

                <TabsContent
                  value="registered"
                  className="focus-visible:outline-none focus-visible:ring-0"
                >
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <MyEvents registeredEvents={filteredRegisteredEvents} />
                  </div>
                </TabsContent>

                <TabsContent
                  value="profile"
                  className="focus-visible:outline-none focus-visible:ring-0"
                >
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <ProfileSection user={user} />
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </main>
        </div>
      </div>
    </>
  );
};

export default StudentDashboard;
