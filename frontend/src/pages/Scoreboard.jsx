import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Trophy, Medal, Star, Target, Zap, Search, Building, GraduationCap, ChevronRight, Globe, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarUrl } from "@/lib/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from "@/lib/axios";

const Scoreboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scope, setScope] = useState("college");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchLeadeboard = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/users/leaderboard?scope=${scope}`);
      setLeaders(data);
    } catch (error) {
      console.error("Leaderboard fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeadeboard();
  }, [scope]);

  const filteredLeaders = leaders.filter(l => 
    l.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.collegeName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <Helmet><title>Leaderboard | CampusBuzz</title></Helmet>

      {/* Hero Section */}
      <div className="bg-slate-900 pt-32 pb-48 px-6 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-6">
              <Trophy size={14} /> The Elite Arena
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
              Top <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Performers</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto">
              Celebrating students who go above and beyond. Participate in events, win prizes, and climb the ranks.
            </p>
          </motion.div>
        </div>

        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 -mt-32 relative z-20">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Top 3 Spotlight */}
          <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
             {filteredLeaders.slice(0, 3).map((player, idx) => (
                <motion.div
                  key={player._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className={`h-full border-0 shadow-2xl overflow-hidden rounded-[2.5rem] ${
                    idx === 0 ? "bg-gradient-to-br from-indigo-600 to-violet-700 text-white scale-105" : "bg-white text-slate-900"
                  }`}>
                    <CardContent className="p-8 text-center flex flex-col items-center">
                      <div className="relative mb-6">
                        <Avatar className={`h-24 w-24 border-4 ${idx === 0 ? "border-white/20" : "border-slate-100"}`}>
                          <AvatarImage src={getAvatarUrl(player)} />
                          <AvatarFallback className="text-2xl font-black">{player.fullName?.[0]}</AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg font-black text-lg ${
                          idx === 0 ? "bg-amber-400 text-amber-900" : 
                          idx === 1 ? "bg-slate-200 text-slate-800" : "bg-orange-200 text-orange-800"
                        }`}>
                          {idx + 1}
                        </div>
                      </div>
                      <h3 className="text-xl font-black truncate w-full">{player.fullName}</h3>
                      <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${idx === 0 ? "text-indigo-200" : "text-slate-400"}`}>
                        {player.collegeName || "CampusBuzz Student"}
                      </p>
                      
                      <div className={`mt-6 pt-6 border-t w-full flex justify-around ${idx === 0 ? "border-white/10" : "border-slate-50"}`}>
                        <div>
                          <p className="text-[10px] font-black uppercase opacity-60">Level</p>
                          <p className="font-black text-xl">{Math.floor((player.points || 0) / 100) + 1}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase opacity-60">XP Score</p>
                          <p className="font-black text-xl text-amber-400">{player.points || 0}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
             ))}
          </div>

          {/* Left: Controls */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="rounded-[2rem] border-0 shadow-sm overflow-hidden">
              <CardContent className="p-8 space-y-8">
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Filter size={14} className="text-indigo-600" /> Rank Scope
                  </h4>
                  <div className="flex flex-col gap-2">
                    {[
                      { id: "college", label: "My College", icon: Building },
                      { id: "state", label: "State Level", icon: MapPin },
                      { id: "national", label: "National Wide", icon: Globe },
                    ].map(item => (
                      <button
                        key={item.id}
                        onClick={() => setScope(item.id)}
                        className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                          scope === item.id 
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" 
                            : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                        }`}
                      >
                        <item.icon size={18} /> {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-100 text-center">
                  <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Target size={32} />
                  </div>
                  <h5 className="font-bold text-slate-800 mb-2">Want to climb?</h5>
                  <p className="text-xs text-slate-400 leading-relaxed px-4">
                    Higher positions give you early access to elite workshops and special event invites!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Full List */}
          <div className="lg:col-span-8">
            <Card className="rounded-[2.5rem] border-0 shadow-sm overflow-hidden">
              <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-black">All Rankings</CardTitle>
                  <CardDescription className="text-xs font-bold uppercase text-slate-400 mt-1">
                    Displaying results for {scope} scope
                  </CardDescription>
                </div>
                <div className="relative w-64 hidden sm:block">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input
                    type="text"
                    placeholder="Search name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 h-10 rounded-xl bg-slate-100 border-none text-xs focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-50">
                   {loading ? (
                     <div className="p-20 text-center">
                        <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto" />
                     </div>
                   ) : filteredLeaders.length === 0 ? (
                     <div className="p-20 text-center text-slate-400 font-medium">No students found for this scope.</div>
                   ) : (
                     filteredLeaders.map((player, idx) => (
                        <div key={player._id} className="flex items-center justify-between p-6 hover:bg-slate-50/50 transition-colors group">
                           <div className="flex items-center gap-6">
                             <span className="w-8 text-center font-black text-slate-300 group-hover:text-indigo-400 transition-colors">
                               #{idx + 1}
                             </span>
                             <div className="flex items-center gap-4">
                               <Avatar className="h-12 w-12 ring-2 ring-white shadow-sm">
                                 <AvatarImage src={getAvatarUrl(player)} />
                                 <AvatarFallback>{player.fullName?.[0]}</AvatarFallback>
                               </Avatar>
                               <div>
                                 <p className="font-bold text-slate-800 text-sm group-hover:text-indigo-600">{player.fullName}</p>
                                 <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest flex items-center gap-1.5">
                                   <GraduationCap size={10} /> {player.department || "Student"} • {player.collegeName || "Campus"}
                                 </p>
                               </div>
                             </div>
                           </div>
                           <div className="flex items-center gap-8">
                              <div className="text-right hidden sm:block">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Points</p>
                                <p className="font-black text-indigo-600">{player.points || 0} XP</p>
                              </div>
                              <Badge className="bg-slate-100 text-slate-500 border-0 rounded-lg h-10 w-10 flex items-center justify-center p-0">
                                <ChevronRight size={16} />
                              </Badge>
                           </div>
                        </div>
                     ))
                   )}
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Scoreboard;
