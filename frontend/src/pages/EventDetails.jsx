import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { Calendar, Clock, MapPin, Users, ArrowLeft, ExternalLink, Sparkles, Award, ShieldCheck, X } from 'lucide-react';
import { getAvatarUrl } from "@/lib/avatar";
import api from "@/lib/axios";
import { getEventImageUrl } from "@/lib/utils";
import Reveal from '@/components/ui/Reveal';
import Magnetic from '@/components/ui/Magnetic';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/events/${id}`);
      setEvent(data);
    } catch (error) {
      console.error("Error fetching event:", error);
      toast({
        title: "Error",
        description: "Failed to load event details. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchEvent();
  }, [id]);

  const handleRegister = async () => {
    try {
      const res = await api.post(`/events/${id}/register`);
      toast({
        title: res.data?.waitlisted ? "Added to Waitlist!" : "Registration Successful!",
        description: res.data?.waitlisted 
          ? `You're on the waitlist for ${event?.title}`
          : `You've been successfully registered for ${event?.title}`,
      });
      fetchEvent();
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 border-r-4 border-r-transparent"></div>
          <p className="text-slate-500 font-medium animate-pulse">Loading Event Details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
        <Card className="max-w-md w-full text-center p-8 rounded-3xl shadow-xl border-0">
          <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="text-red-500" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Event Not Found</h2>
          <p className="text-slate-500 mb-8">The event you're looking for doesn't exist or has been removed.</p>
          <Button 
            onClick={() => navigate('/student')} 
            className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-xl py-6 font-bold"
          >
            Go Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  // Helper formatting
  const eventDate = event.date ? new Date(event.date).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : "Date TBD";

  const eventTime = event.date ? new Date(event.date).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  }) : "Time TBD";

  return (
    <>
      <Helmet>
        <title>{event.title || "Event Details"} | CampusBuzz</title>
        <meta name="description" content={event.description} />
      </Helmet>

      <div className="min-h-screen bg-white pb-20 selection:bg-indigo-100 selection:text-indigo-900">
        {/* --- IMMERSIVE HERO SECTION --- */}
        <div className="relative h-[65vh] md:h-[75vh] w-full overflow-hidden bg-slate-900">
          <motion.img
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.7 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            alt={event.title}
            className="w-full h-full object-cover"
            src={getEventImageUrl(event.image, event.category)} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent" />
          <div className="absolute inset-0 bg-slate-900/20" />
          
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-16 lg:p-24">
            <div className="max-w-7xl mx-auto w-full">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-6 md:space-y-8"
              >
                <div className="flex flex-col gap-6">
                  <Button
                    variant="ghost"
                    onClick={() => window.close()}
                    className="w-fit text-slate-600 hover:bg-slate-100 flex items-center gap-2 -ml-2 font-bold mb-4"
                  >
                    <X size={18} />
                    <span>Close Window</span>
                  </Button>
                </div>
                <div className="flex flex-wrap gap-3">
                   <Badge className="bg-indigo-600/90 backdrop-blur-md text-white border-0 py-2 px-5 text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-indigo-600/20">
                    {event.category || event.type || "Global Event"}
                  </Badge>
                  <Badge variant="outline" className="bg-white/10 backdrop-blur-md text-slate-900 border-white/20 py-2 px-5 text-[10px] font-black uppercase tracking-widest rounded-full">
                    {event.participationLevel || "All"} Level
                  </Badge>
                  <Badge variant="outline" className="bg-white/10 backdrop-blur-md text-emerald-600 border-emerald-500/20 py-2 px-5 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Registration
                  </Badge>
                </div>
                
                <Reveal>
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter max-w-4xl drop-shadow-sm">
                    {event.title}
                  </h1>
                </Reveal>
                
                <Reveal delay={0.4}>
                  <div className="flex flex-wrap items-center gap-8 text-slate-600 font-bold text-sm md:text-base">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                        <Calendar size={20} className="text-indigo-600" />
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[10px] uppercase text-slate-400 tracking-widest">Timeline</span>
                         <span>{eventDate}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                        <MapPin size={20} className="text-rose-500" />
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[10px] uppercase text-slate-400 tracking-widest">Location</span>
                         <span>{event.venue || "Campus Main Portal"}</span>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </motion.div>
            </div>
          </div>
        </div>

        {/* --- CONTENT LAYOUT --- */}
        <div className="max-w-7xl mx-auto px-6 mt-12">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            
            {/* Main Content Area */}
            <div className="lg:col-span-8 space-y-16">
              
              {/* Narrative Section */}
              <section className="space-y-6">
                <Reveal>
                  <div className="flex items-center gap-4 text-slate-300">
                     <div className="h-px flex-1 bg-slate-100" />
                     <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">The Narrative</h2>
                     <div className="h-px flex-1 bg-slate-100" />
                  </div>
                </Reveal>
                
                <Reveal delay={0.3}>
                  <p className="text-xl md:text-2xl text-slate-600 leading-relaxed font-medium selection:bg-indigo-600 selection:text-white">
                    {event.description || "Initializing event parameters... This event represents a unique opportunity for student growth and collaboration."}
                  </p>
                </Reveal>
                
                {/* Visual Highlights Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
                   <Reveal delay={0.4}>
                     <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 h-full flex flex-col gap-6 group hover:bg-white hover:shadow-xl transition-all">
                        <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 group-hover:rotate-6 transition-transform">
                           <ShieldCheck size={24} />
                        </div>
                        <div>
                          <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm mb-3">Protocol & Rules</h3>
                          <p className="text-slate-500 text-sm leading-relaxed line-clamp-4">
                            {event.rules || "Standard campus security protocols apply. Please ensure registration is confirmed before arrival."}
                          </p>
                        </div>
                     </div>
                   </Reveal>
                   <Reveal delay={0.5}>
                     <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white h-full flex flex-col gap-6 group hover:translate-y-[-4px] transition-all">
                        <div className="w-12 h-12 bg-amber-400 text-slate-900 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-400/20 group-hover:rotate-6 transition-transform">
                           <Award size={24} />
                        </div>
                        <div>
                          <h3 className="font-black text-amber-400 uppercase tracking-widest text-sm mb-3">Rewards & Value</h3>
                          <p className="text-slate-400 text-sm leading-relaxed">
                            {event.prizeDetails || "Certificates of completion, global XP points, and exclusive networking opportunities await all certified attendees."}
                          </p>
                        </div>
                     </div>
                   </Reveal>
                </div>
              </section>

              {/* Speaker Ecosystem */}
              {event.speakers?.length > 0 && (
                <section className="space-y-10">
                  <Reveal>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Event Ecosystem</h2>
                  </Reveal>
                  <div className="grid sm:grid-cols-2 gap-8">
                    {event.speakers.map((speaker, idx) => (
                      <Reveal key={idx} delay={idx * 0.1}>
                        <div className="group relative">
                          <div className="absolute inset-0 bg-indigo-600 rounded-[2.5rem] rotate-1 group-hover:rotate-2 transition-transform opacity-10" />
                          <div className="relative p-6 md:p-8 bg-white border border-slate-100 rounded-[2.5rem] flex items-center gap-6 shadow-sm hover:shadow-xl transition-all">
                            <Avatar className="h-20 w-20 md:h-24 md:w-24 border-4 border-slate-50 shadow-sm">
                              <AvatarImage src={getAvatarUrl(speaker)} alt={speaker.name} />
                              <AvatarFallback className="bg-slate-900 text-white font-black text-xl">
                                {speaker.name?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <h3 className="font-black text-xl text-slate-900 truncate">{speaker.name}</h3>
                              <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mt-1">{speaker.organization || "Keynote Expert"}</p>
                              <p className="text-sm text-slate-400 mt-2 line-clamp-2">{speaker.bio || "Bringing years of specialized experience to this session."}</p>
                            </div>
                          </div>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar: Action Panel */}
            <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
              <Reveal>
                <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-indigo-600/10 border border-slate-100 flex flex-col gap-8">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Management Unit</span>
                      <Badge variant="ghost" className="bg-indigo-50 text-indigo-600 font-black text-[9px] uppercase">Active</Badge>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <Avatar className="h-14 w-14 border-2 border-indigo-100 p-0.5">
                        <AvatarImage src={getAvatarUrl(event.organizer)} className="rounded-full" />
                        <AvatarFallback className="bg-white text-indigo-600 font-black">{event.organizer?.fullName?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-black text-slate-900 leading-none truncate">{event.organizer?.fullName || "Faculty Admin"}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 truncate">{event.organizer?.collegeName || "SSASIT Campus"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-slate-100 w-full" />

                  <div className="space-y-6">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400"><Clock size={18} /></div>
                           <p className="text-sm font-bold text-slate-900">{eventTime}</p>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400"><Users size={18} /></div>
                           <p className="text-sm font-bold text-slate-900">{event.registeredStudents?.length || 0} / {event.registrationLimit || "∞"}</p>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <Magnetic>
                      <Button
                        onClick={handleRegister}
                        className="w-full h-16 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/30 transition-all active:scale-95"
                      >
                        Confirm Registration
                      </Button>
                    </Magnetic>
                    
                    <Button
                      variant="outline"
                      onClick={() => {
                          const start = new Date(event.date).toISOString().replace(/-|:|\.\d+/g, "");
                          const end = new Date(new Date(event.date).getTime() + 2 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d+/g, "");
                          const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${start}/${end}&details=${encodeURIComponent(event.description || "")}&location=${encodeURIComponent(event.venue || "Campus")}`;
                          window.open(url, "_blank");
                      }}
                      className="w-full h-14 border-2 border-slate-100 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 text-slate-500"
                    >
                      <Calendar size={16} className="mr-3" /> Sync Schedule
                    </Button>
                  </div>

                  <p className="text-center text-[9px] font-bold text-slate-400 uppercase tracking-tight leading-relaxed">
                    Join hundreds of students in this exclusive learning experience. Limited seats available.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.4}>
                <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white overflow-hidden relative group">
                   <div className="relative z-10 space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Pro Tip</h4>
                      <p className="text-sm font-medium leading-relaxed">Turn on desktop notifications to get notified 15 mins before this event starts!</p>
                   </div>
                   <Sparkles size={80} className="absolute -bottom-6 -right-6 text-white/5 group-hover:scale-110 transition-transform" />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventDetails;
