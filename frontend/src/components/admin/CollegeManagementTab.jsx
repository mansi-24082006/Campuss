import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Building2,
  MapPin,
  Users,
  Search,
  ShieldCheck,
  ArrowUpRight,
  Filter,
  CalendarDays,
  Activity
} from "lucide-react";
import api from "@/lib/axios";

const CollegeManagementTab = () => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchColleges = async () => {
    try {
      setLoading(true);
      const res = await api.get("/events/admin/reports");
      setColleges(res.data.collegeStats || []);
    } catch (err) {
      console.error("Critical: Analytics Fetch Failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchColleges(); }, []);

  const filteredColleges = useMemo(() =>
    colleges.filter(c =>
      c._id?.toLowerCase().includes(search.toLowerCase()) ||
      c.state?.toLowerCase().includes(search.toLowerCase())
    ), [colleges, search]
  );

  const stats = useMemo(() => ({
    totalColleges: colleges.length,
    activeRegions: new Set(colleges.map(c => c.state)).size
  }), [colleges]);

  if (loading) return <CollegeSkeleton />;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* High-Impact Insight Header */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-200">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex gap-10">
            <div>
              <p className="text-indigo-400 text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em] mb-2">Registered Units</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black tabular-nums">{stats.totalColleges}</span>
                <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">Institutions</span>
              </div>
            </div>
            <div className="w-px h-16 bg-slate-800 hidden sm:block" />
            <div>
              <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Regional Coverage</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black tabular-nums">{stats.activeRegions}</span>
                <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">States</span>
              </div>
            </div>
          </div>

          <div className="relative group w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Filter Registry..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-slate-800/50 border border-slate-700 rounded-2xl text-sm font-bold text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all backdrop-blur-md"
            />
          </div>
        </div>
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] -mr-20 -mt-20" />
      </div>

      {/* Grid Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredColleges.map((college, i) => (
            <motion.div
              key={college._id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, delay: i * 0.02 }}
            >
              <Card className="group relative bg-white border-slate-200 hover:border-indigo-300 rounded-[2.5rem] transition-all duration-500 hover:shadow-[0_22px_50px_-12px_rgba(79,70,229,0.15)] overflow-hidden">
                <CardContent className="p-7">
                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-indigo-600 transition-colors duration-500 shadow-inner">
                      <Building2 size={24} className="text-slate-900 group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100 shadow-sm">
                        <MapPin size={10} />
                        <span className="text-[10px] font-black uppercase tracking-wider">{college.state || "National"}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400">
                        <ShieldCheck size={10} className="text-emerald-500" />
                        ACTIVE UNIT
                      </div>
                    </div>
                  </div>

                  {/* Institution Identity */}
                  <div className="mb-8">
                    <h4 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight mb-1">
                      {college._id}
                    </h4>
                    <p className="text-xs font-bold text-slate-400 tracking-tight">Institutional Registry Record</p>
                  </div>

                  {/* Metrics Dashboard */}
                  <div className="grid grid-cols-2 gap-3 mb-8">
                    <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Users size={14} className="text-slate-400" />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Enrollment</span>
                      </div>
                      <p className="text-xl font-black text-slate-900">{college.totalStudents.toLocaleString()}</p>
                    </div>
                    <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity size={14} className="text-slate-400" />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Events</span>
                      </div>
                      <p className="text-xl font-black text-slate-900">{Math.floor(college.totalPoints / 100) || 1}</p>
                    </div>
                  </div>

                  {/* Action Link */}
                  <button className="w-full flex items-center justify-between px-6 py-4 bg-slate-900 rounded-2xl text-white group-hover:bg-indigo-600 transition-all duration-300">
                    <span className="text-xs font-black uppercase tracking-widest">View Archives</span>
                    <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredColleges.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-32 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
          <Filter size={48} className="text-slate-300 mb-4" />
          <h3 className="text-lg font-black text-slate-900">No matching units</h3>
          <p className="text-slate-500 text-sm font-medium">Try adjusting your registry filters.</p>
        </motion.div>
      )}
    </div>
  );
};

/* --- Refined Skeleton --- */
const CollegeSkeleton = () => (
  <div className="space-y-8 animate-pulse">
    <div className="h-48 bg-slate-200 rounded-[2.5rem]" />
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="h-[400px] bg-slate-100 rounded-[2.5rem]" />
      ))}
    </div>
  </div>
);

export default CollegeManagementTab;