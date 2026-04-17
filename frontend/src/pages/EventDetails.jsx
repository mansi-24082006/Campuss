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

      <div className="min-h-screen bg-[#f8fafc] pb-20">
        {/* Banner Section */}
        <div className="relative h-[300px] md:h-[450px] w-full overflow-hidden bg-slate-900">
          <img
            alt={event.title}
            className="w-full h-full object-cover opacity-60"
            src={getEventImageUrl(event.image, event.category)} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Button
                  variant="ghost"
                  onClick={() => navigate(-1)}
                  className="mb-6 text-white hover:bg-white/10 flex items-center gap-2 -ml-2"
                >
                  <ArrowLeft size={18} />
                  <span>Back to Events</span>
                </Button>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className="bg-indigo-600 hover:bg-indigo-700 text-white border-0 py-1 px-3">
                    {event.category || event.type || "Event"}
                  </Badge>
                  <Badge variant="outline" className="text-white border-white/30 backdrop-blur-md py-1 px-3">
                    {event.participationLevel || "Open"} Level
                  </Badge>
                </div>
                
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight">
                  {event.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 text-indigo-100/80 font-medium">
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-indigo-400" />
                    <span>{eventDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-indigo-400" />
                    <span>{event.venue || "Campus Location"}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-10">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Left Column: Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100"
              >
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                  <Sparkles className="text-indigo-600" /> About the Event
                </h2>
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-wrap">
                    {event.description || "No description provided for this event."}
                  </p>
                </div>
              </motion.section>

              {/* Speakers (if any) */}
              {event.speakers?.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100"
                >
                  <h2 className="text-2xl font-bold text-slate-800 mb-8">Featured Speakers</h2>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {event.speakers.map((speaker, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <Avatar className="h-16 w-16 border-2 border-indigo-100">
                          <AvatarImage src={getAvatarUrl(speaker)} alt={speaker.name} />
                          <AvatarFallback className="bg-indigo-600 text-white font-bold">
                            {speaker.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-bold text-slate-800">{speaker.name}</h3>
                          <p className="text-xs text-indigo-600 font-semibold">{speaker.organization || "Expert"}</p>
                          <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{speaker.bio || "Event Speaker"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Rules & Prizes */}
              <div className="grid sm:grid-cols-2 gap-6">
                <motion.section
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100"
                >
                  <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                    <ShieldCheck className="text-emerald-500" /> Rules
                  </h2>
                  <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                    {event.rules || "No specific rules provided. Standard campus guidelines apply."}
                  </p>
                </motion.section>

                <motion.section
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="bg-indigo-600 rounded-3xl p-8 shadow-xl shadow-indigo-100 text-white"
                >
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                    <Award className="text-indigo-200" /> Prizes & Recognition
                  </h2>
                  <p className="text-indigo-50 text-sm leading-relaxed whitespace-pre-wrap">
                    {event.prizeDetails || "Participants will receive certificates and XP points for the global leaderboard!"}
                  </p>
                </motion.section>
              </div>
            </div>

            {/* Right Column: Sidebar */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100 sticky top-24"
              >
                <div className="mb-8">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Event Info</h3>
                  <div className="space-y-5">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <Clock size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-bold uppercase">Time</p>
                        <p className="text-slate-700 font-semibold">{eventTime}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                        <Users size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-bold uppercase">Capacity</p>
                        <p className="text-slate-700 font-semibold">
                          {event.registeredStudents?.length || 0} / {event.registrationLimit || "No Limit"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <p className="text-xs text-slate-400 font-bold uppercase mb-2">Organizer</p>
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                      <AvatarImage src={getAvatarUrl(event.organizer)} />
                      <AvatarFallback className="bg-slate-900 text-white font-bold text-xs">
                        {event.organizer?.fullName?.charAt(0) || "C"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{event.organizer?.fullName || "Campus Faculty"}</p>
                      <p className="text-[10px] text-slate-500">{event.organizer?.collegeName || "CampusBuzz Platform"}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Google Calendar Link */}
                  {event.date && (
                    <Button
                      variant="outline"
                      className="w-full h-12 rounded-2xl font-bold border-2 border-indigo-100 text-indigo-600 hover:bg-indigo-50 border-dashed"
                      onClick={() => {
                        const start = new Date(event.date).toISOString().replace(/-|:|\.\d+/g, "");
                        const end = new Date(new Date(event.date).getTime() + 2 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d+/g, "");
                        const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${start}/${end}&details=${encodeURIComponent(event.description || "")}&location=${encodeURIComponent(event.venue || "Campus")}`;
                        window.open(url, "_blank");
                      }}
                    >
                      <Calendar size={16} className="mr-2" /> Add to Calendar
                    </Button>
                  )}
                  <Button
                    onClick={handleRegister}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 h-14 rounded-2xl font-extrabold text-lg shadow-lg shadow-indigo-100"
                  >
                    Register Now
                  </Button>
                  <p className="text-center text-[10px] text-slate-400 px-4">
                    By registering, you agree to the event rules and campus conduct guidelines.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventDetails;
