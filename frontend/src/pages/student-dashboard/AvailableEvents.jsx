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
  Star,
  Mic,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import SpeakerProfileModal from "./SpeakerProfileModal";

const CATEGORY_COLORS = {
  Hackathon: "bg-purple-100 text-purple-800 border-purple-200",
  hackathon: "bg-purple-100 text-purple-800 border-purple-200",
  Seminar: "bg-blue-100 text-blue-800 border-blue-200",
  seminar: "bg-blue-100 text-blue-800 border-blue-200",
  Workshop: "bg-emerald-100 text-emerald-800 border-emerald-200",
  workshop: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Technical: "bg-indigo-100 text-indigo-800 border-indigo-200",
  "tech-fest": "bg-orange-100 text-orange-800 border-orange-200",
  competition: "bg-red-100 text-red-800 border-red-200",
  "Non-Technical": "bg-slate-100 text-slate-800 border-slate-200",
};

const getEventTag = (event) => {
  const now = new Date();
  const eventDate = new Date(event.date);
  const diffHours = (eventDate - now) / (1000 * 60 * 60);

  if (diffHours < 0 && diffHours > -24) return { label: "Live Now 🔴", color: "bg-red-500 text-white" };
  if (diffHours >= 0 && diffHours < 24) return { label: "Today", color: "bg-amber-500 text-white" };
  if (diffHours >= 24 && diffHours < 72) return { label: "In 2-3 days", color: "bg-indigo-500 text-white" };
  if (diffHours < 0) return { label: "Past", color: "bg-slate-400 text-white" };
  return null;
};

const getSeatStatus = (event) => {
  if (!event.registrationLimit || event.registrationLimit === 0) return null;
  const registered = event.registeredStudents?.length || 0;
  const limit = event.registrationLimit;
  const remaining = limit - registered;
  if (remaining <= 0) return { label: "Seats Full", color: "text-red-600 bg-red-50", full: true };
  if (remaining <= 5) return { label: `Only ${remaining} left!`, color: "text-amber-600 bg-amber-50", full: false };
  return { label: `${remaining} seats left`, color: "text-emerald-600 bg-emerald-50", full: false };
};

const AvailableEvents = ({ events = [], onRegister, registeredEventIds = [], buildCalendarLink }) => {
  const [selectedSpeaker, setSelectedSpeaker] = useState(null);
  const [expandedCards, setExpandedCards] = useState({});

  const toggleExpand = (id) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (events.length === 0) return null;

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, index) => {
          const isRegistered = registeredEventIds.includes(event._id);
          const tag = getEventTag(event);
          const seatStatus = getSeatStatus(event);
          const isExpanded = expandedCards[event._id];
          const categoryLabel = event.type || event.category;
          const catColor = CATEGORY_COLORS[event.category] || CATEGORY_COLORS[event.type] || "bg-gray-100 text-gray-800";

          return (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
            >
              <Card className="relative overflow-hidden h-full flex flex-col group hover:shadow-lg transition-shadow duration-300 border-slate-200 rounded-3xl">
                {/* Top Badge */}
                <div className="absolute top-3 left-3 z-10 flex gap-2 flex-wrap">
                  {tag && (
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${tag.color}`}>
                      {tag.label}
                    </span>
                  )}
                </div>
                <div className="absolute top-3 right-3 z-10">
                  <Badge className={`border ${catColor} text-[11px] font-bold capitalize`}>
                    {categoryLabel}
                  </Badge>
                </div>

                {/* Event Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={event.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80"}
                    alt={event.title}
                    className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Participation level */}
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full">
                      {event.participationLevel} Level
                    </span>
                  </div>
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="line-clamp-1 text-base">{event.title}</CardTitle>
                  <AnimatePresence initial={false}>
                    {isExpanded ? (
                      <motion.p
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="text-sm text-slate-600 dark:text-slate-400 mt-2 overflow-hidden"
                      >
                        {event.description}
                      </motion.p>
                    ) : (
                      <CardDescription className="line-clamp-2 text-sm">
                        {event.description}
                      </CardDescription>
                    )}
                  </AnimatePresence>
                  {event.description?.length > 80 && (
                    <button
                      onClick={() => toggleExpand(event._id)}
                      className="text-indigo-600 dark:text-indigo-400 text-xs font-semibold flex items-center gap-0.5 mt-2 hover:underline focus:outline-none"
                    >
                      {isExpanded ? <><ChevronUp size={12} /> Show Less</> : <><ChevronDown size={12} /> Show More</>}
                    </button>
                  )}
                </CardHeader>

                <CardContent className="space-y-2.5 text-sm flex-grow pb-4">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="h-4 w-4 text-indigo-500 flex-shrink-0" />
                    <span>{new Date(event.date).toLocaleDateString("en-IN", { dateStyle: "medium" })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="h-4 w-4 text-indigo-500 flex-shrink-0" />
                    <span className="line-clamp-1">{event.venue || "Campus Hall"}</span>
                  </div>
                  {event.registrationLimit > 0 && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-indigo-500 flex-shrink-0" />
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${seatStatus?.color || "text-slate-600"}`}>
                        {seatStatus?.label || `${event.registeredStudents?.length || 0} registered`}
                      </span>
                    </div>
                  )}

                  {/* Speakers */}
                  {event.speakers?.length > 0 && (
                    <div className="pt-1 border-t border-slate-100">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Speakers</p>
                      <div className="flex flex-wrap gap-1.5">
                        {event.speakers.slice(0, 2).map((sp, i) => (
                          <button
                            key={i}
                            onClick={() => setSelectedSpeaker(sp)}
                            className="flex items-center gap-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 text-[11px] font-semibold px-2.5 py-1 rounded-full transition-colors"
                          >
                            <Mic size={10} />
                            {sp.name}
                          </button>
                        ))}
                        {event.speakers.length > 2 && (
                          <span className="text-[11px] text-slate-400 self-center">+{event.speakers.length - 2} more</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-2 space-y-2 mt-auto">
                    {isRegistered ? (
                      <div className="flex gap-2">
                        <div className="flex-1 py-2 bg-emerald-50 text-emerald-700 font-bold text-sm rounded-xl text-center border border-emerald-200">
                          ✓ Registered
                        </div>
                        {buildCalendarLink && (
                          <a
                            href={buildCalendarLink(event)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
                            title="Add to Google Calendar"
                          >
                            <Calendar size={16} />
                          </a>
                        )}
                      </div>
                    ) : seatStatus?.full && event.enableWaitlist ? (
                      <Button
                        className="w-full rounded-xl font-bold h-10 bg-orange-500 hover:bg-orange-600 text-white"
                        onClick={() => onRegister(event._id)}
                      >
                        <Clock size={14} className="mr-2" /> Join Waitlist
                      </Button>
                    ) : seatStatus?.full ? (
                      <Button className="w-full rounded-xl font-bold h-10" disabled variant="secondary">
                        Seats Full
                      </Button>
                    ) : (
                      <Button
                        className="w-full rounded-xl font-bold h-10 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100"
                        onClick={() => onRegister(event._id)}
                      >
                        Register Now
                      </Button>
                    )}
                    <Link
                      to={`/event/${event._id}`}
                      className="flex items-center justify-center gap-1 text-xs text-slate-400 hover:text-indigo-600 transition-colors font-medium"
                    >
                      <ExternalLink size={12} /> View Full Details
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Speaker Modal */}
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
