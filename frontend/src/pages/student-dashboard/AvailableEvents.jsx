import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  ExternalLink,
  Mic,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import SpeakerProfileModal from "./SpeakerProfileModal";
import CountdownTimer from "@/components/CountdownTimer";
import { getEventImageUrl } from "@/lib/utils";

const CATEGORY_COLORS = {
  Hackathon: "bg-indigo-100 text-indigo-700 border-indigo-200",
  hackathon: "bg-indigo-100 text-indigo-700 border-indigo-200",
  Seminar: "bg-blue-100 text-blue-700 border-blue-200",
  seminar: "bg-blue-100 text-blue-700 border-blue-200",
  Workshop: "bg-emerald-100 text-emerald-700 border-emerald-200",
  workshop: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Technical: "bg-indigo-100 text-indigo-700 border-indigo-200",
  "tech-fest": "bg-orange-100 text-orange-700 border-orange-200",
  competition: "bg-rose-100 text-rose-700 border-rose-200",
};

const getEventTag = (event) => {
  const now = new Date();
  const eventDate = new Date(event.date);
  const diffHours = (eventDate - now) / (1000 * 60 * 60);

  if (diffHours < 0 && diffHours > -24) return { label: "Live Now", color: "bg-rose-600 text-white" };
  if (diffHours >= 0 && diffHours < 24) return { label: "Today", color: "bg-amber-600 text-white" };
  if (diffHours >= 24 && diffHours < 72) return { label: "Upcoming", color: "bg-indigo-600 text-white" };
  if (diffHours < 0) return { label: "Closed", color: "bg-slate-400 text-white" };
  return null;
};

const getSeatStatus = (event) => {
  if (!event.registrationLimit || event.registrationLimit === 0) return null;
  const registered = event.registeredStudents?.length || 0;
  const limit = event.registrationLimit;
  const remaining = limit - registered;
  if (remaining <= 0) return { label: "Full Capacity", color: "text-rose-600 bg-rose-50", full: true };
  if (remaining <= 5) return { label: `${remaining} Spots Left`, color: "text-amber-600 bg-amber-50", full: false };
  return { label: `${remaining} Seats Available`, color: "text-emerald-700 bg-emerald-50", full: false };
};

const AvailableEvents = ({ events = [], onRegister, registeredEventIds = [], buildCalendarLink }) => {
  const [selectedSpeaker, setSelectedSpeaker] = useState(null);
  const [expandedCards, setExpandedCards] = useState({});

  const toggleExpand = (id) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (events.length === 0) {
    return (
      <div className="text-center py-20 bg-white border border-slate-100 rounded-[3rem]">
        <Calendar className="h-12 w-12 text-slate-200 mx-auto mb-4" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No matching events detected</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {events.map((event) => {
          const isRegistered = registeredEventIds.includes(event._id);
          const tag = getEventTag(event);
          const seatStatus = getSeatStatus(event);
          const isExpanded = expandedCards[event._id];
          const categoryLabel = event.type || event.category;
          const catColor = CATEGORY_COLORS[event.category] || CATEGORY_COLORS[event.type] || "bg-slate-100 text-slate-700";

          return (
            <div key={event._id} className="group hover-lift">
              <Card className="relative overflow-hidden h-full flex flex-col border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-300 bg-white border-0 ring-1 ring-slate-100">
                {/* Event Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={getEventImageUrl(event.image, event.category)}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                  
                  <div className="absolute top-4 left-4 flex gap-2">
                    {tag && (tag.label === "Live Now" || tag.label === "Today" ? (
                      <div className="scale-75 origin-top-left"><CountdownTimer targetDate={event.date} /></div>
                    ) : (
                      <Badge className={`text-[9px] font-black uppercase tracking-widest ${tag.color} border-0`}>{tag.label}</Badge>
                    ))}
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                    <Badge className={`text-[9px] font-black uppercase tracking-widest bg-white/20 backdrop-blur-md text-white border-0`}>
                      {categoryLabel}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="p-6 md:p-8 space-y-3">
                  <div className="flex justify-between items-start gap-4">
                    <CardTitle className="text-xl font-black text-slate-900 leading-tight tracking-tight line-clamp-2">
                      {event.title}
                    </CardTitle>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-slate-500 font-bold text-xs">
                      <Calendar className="h-4 w-4 text-indigo-600" />
                      {new Date(event.date).toLocaleDateString("en-IN", { dateStyle: "long" })}
                    </div>
                    <div className="flex items-center gap-3 text-slate-500 font-bold text-xs">
                      <MapPin className="h-4 w-4 text-rose-500" />
                      <span className="line-clamp-1">{event.venue || "Campus Venue"}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="px-6 md:px-8 pb-8 flex-grow flex flex-col gap-6">
                  <div className="relative">
                    <p className={`text-slate-500 text-[13px] font-medium leading-relaxed ${!isExpanded ? 'line-clamp-3' : ''}`}>
                      {event.description}
                    </p>
                    {event.description?.length > 120 && (
                      <button
                        onClick={() => toggleExpand(event._id)}
                        className="text-indigo-600 text-[10px] font-black uppercase tracking-widest mt-2 flex items-center gap-1 hover:underline"
                      >
                        {isExpanded ? <><ChevronUp size={12} /> Collapse</> : <><ChevronDown size={12} /> Read Narrative</>}
                      </button>
                    )}
                  </div>

                  {event.speakers?.length > 0 && (
                    <div className="space-y-3 border-t border-slate-50 pt-6">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Speakers</p>
                      <div className="flex flex-wrap gap-2">
                        {event.speakers.map((sp, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setSelectedSpeaker(sp)}
                            className="bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 py-1.5 px-3 rounded-xl border border-slate-100 flex items-center gap-2 transition-all"
                          >
                            <Mic size={10} className="shrink-0" />
                            <span className="text-[11px] font-black tracking-tight">{sp.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-auto space-y-4">
                    {seatStatus && (
                      <div className={`text-[10px] font-black uppercase tracking-widest text-center py-2 rounded-xl border ${seatStatus.color} border-current opacity-70`}>
                        {seatStatus.label}
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-3 pt-2">
                      {isRegistered ? (
                        <div className="flex gap-2">
                          <div className="flex-1 py-4 bg-emerald-50 text-emerald-700 font-black text-[10px] uppercase tracking-widest rounded-2xl text-center border border-emerald-100">
                            ✓ Successlly Registered
                          </div>
                          {buildCalendarLink && (
                            <a
                              href={buildCalendarLink(event)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-5 py-4 bg-white border border-slate-100 text-slate-400 rounded-2xl hover:bg-slate-50 hover:text-indigo-600 transition-all flex items-center justify-center"
                              title="Add to Schedule"
                            >
                              <Calendar size={18} />
                            </a>
                          )}
                        </div>
                      ) : (
                        <Button
                          disabled={seatStatus?.full && !event.enableWaitlist}
                          className={`w-full py-7 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 ${
                            seatStatus?.full 
                            ? "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-100" 
                            : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100"
                          }`}
                          onClick={() => onRegister(event._id)}
                        >
                          {seatStatus?.full ? (event.enableWaitlist ? "Enter Waitlist" : "Seats Full") : "Enroll Now"}
                        </Button>
                      )}
                      <a
                        href={`/event/${event._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-center text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center justify-center gap-2 hover:text-indigo-600 transition-colors"
                      >
                        <ExternalLink size={12} /> Full Analytics & Insight
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      {selectedSpeaker && (
        <SpeakerProfileModal
          speaker={selectedSpeaker}
          onClose={() => setSelectedSpeaker(null)}
        />
      )}
    </>
  );
};

export default AvailableEvents;
