import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle2, Calendar, Clock, ExternalLink, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { generateCertificate } from "@/lib/certificateUtils";
import { useToast } from "@/components/ui/use-toast";
import api from "@/lib/axios";
import { Link } from "react-router-dom";

// Countdown helper
const getCountdown = (date) => {
  const diff = new Date(date) - new Date();
  if (diff < 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (days > 0) return `${days}d ${hours}h away`;
  if (hours > 0) return `${hours}h away`;
  return "Today!";
};

const MyEvents = ({ registeredEvents, buildCalendarLink }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [feedbackOpen, setFeedbackOpen] = useState(null);
  const [feedbackData, setFeedbackData] = useState({ rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);

  const getStatusColor = (status) => {
    const colors = {
      approved: "bg-green-100 text-green-700 border-green-200",
      pending: "bg-orange-100 text-orange-700 border-orange-200",
      rejected: "bg-red-100 text-red-700 border-red-200",
      completed: "bg-slate-100 text-slate-700 border-slate-200",
    };
    return colors[status] || "bg-slate-100 text-slate-700";
  };

  const handleDownload = (event) => {
    generateCertificate({
      studentName: user?.fullName,
      eventTitle: event.title,
      date: event.date,
      organizer: event.organizer?.fullName || "CampusBuzz Faculty",
      certificateId: `CB-CERT-${event._id.toString().toUpperCase().slice(-6)}-${user?._id.toString().toUpperCase().slice(-4)}`,
    });
  };

  const handleFeedbackSubmit = async (eventId) => {
    setSubmitting(true);
    try {
      await api.post(`/events/${eventId}/feedback`, feedbackData);
      toast({ title: " Feedback submitted!", description: "Thank you for your response." });
      setFeedbackOpen(null);
      setFeedbackData({ rating: 5, comment: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to submit feedback",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (registeredEvents.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
        <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500 font-medium">You haven't registered for any events yet</p>
        <p className="text-slate-400 text-sm mt-1">Explore available events and register!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500 font-medium">
        {registeredEvents.length} event{registeredEvents.length !== 1 ? "s" : ""} registered
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {registeredEvents.map((event) => {
          const isAttended = event.attendedStudents?.some(
            (id) => (id._id || id) === user?._id
          );
          const hasFeedback = event.feedback?.some(
            (f) => (f.studentId?._id || f.studentId) === user?._id
          );
          const countdown = getCountdown(event.date);

          return (
            <Card
              key={event._id}
              className={`bg-white border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow ${isAttended && event.status === "completed" && !hasFeedback ? "ring-2 ring-indigo-500 shadow-indigo-100" : ""
                }`}
            >
              <CardContent className="p-6 flex flex-col gap-4">
                {/* Top row */}
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-1.5 text-xs font-bold uppercase tracking-wider">
                    <div className="flex gap-1.5 flex-wrap">
                      <Badge className={`${getStatusColor(event.status)} border text-[10px]`}>
                        {event.status}
                      </Badge>
                      {isAttended && (
                        <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px] flex items-center gap-1">
                          <CheckCircle2 size={10} /> Attended
                        </Badge>
                      )}
                      {isAttended && event.status === "completed" && !hasFeedback && (
                        <Badge className="bg-indigo-600 text-white border-0 text-[10px] animate-pulse">
                          Feedback Required
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px] text-slate-400 capitalize">
                    {event.type || event.category}
                  </Badge>
                </div>

                {/* Title */}
                <div>
                  <h3 className="text-lg font-bold text-slate-800 leading-snug">{event.title}</h3>
                  <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                    <Calendar size={13} />
                    {new Date(event.date).toLocaleDateString("en-IN", { dateStyle: "long" })}
                    {event.venue && <><span className="opacity-30">•</span> {event.venue}</>}
                  </p>
                  {countdown && (
                    <p className="text-xs font-semibold text-indigo-600 mt-1 flex items-center gap-1">
                      <Clock size={12} /> {countdown}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-auto pt-3 border-t border-slate-100 space-y-2">
                  {/* Calendar + Details */}
                  <div className="flex gap-2">
                    {buildCalendarLink && (
                      <a
                        href={buildCalendarLink(event)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors"
                      >
                        <Calendar size={14} /> Add to Calendar
                      </a>
                    )}
                    <Link
                      to={`/event/${event._id}`}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl transition-colors"
                      title="View Details"
                    >
                      <ExternalLink size={14} />
                    </Link>
                  </div>

                  {/* Certificate or Verification Status */}
                  {isAttended ? (
                    <div className="space-y-2">
                      {event.verifiedStudents?.some(id => (id._id || id) === user?._id) ? (
                        <Button
                          onClick={() => handleDownload(event)}
                          className="w-full rounded-xl font-bold h-10 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100"
                        >
                          <Download className="h-4 w-4 mr-2" /> Download Certificate
                        </Button>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <Button
                            disabled
                            className="w-full rounded-xl font-bold h-10 bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                          >
                            <Clock className="h-4 w-4 mr-2" /> Pending Verification
                          </Button>
                          <p className="text-[10px] text-center text-slate-400 font-medium italic">
                            Faculty will verify your participation soon.
                          </p>
                        </div>
                      )}

                      {/* Feedback */}
                      {hasFeedback ? (
                        <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
                          <CheckCircle2 size={14} /> Feedback Submitted
                        </div>
                      ) : feedbackOpen === event._id ? (
                        <div className="bg-slate-50 rounded-2xl p-4 space-y-3 border border-indigo-100">
                          <p className="text-sm font-bold text-slate-700">How was the {event.type || event.category}?</p>
                          {/* Star Rating */}
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <button
                                key={s}
                                onClick={() => setFeedbackData((f) => ({ ...f, rating: s }))}
                                className="transition-transform hover:scale-110"
                              >
                                <Star
                                  size={22}
                                  className={s <= feedbackData.rating ? "text-amber-400 fill-amber-400" : "text-slate-300"}
                                />
                              </button>
                            ))}
                          </div>
                          <textarea
                            value={feedbackData.comment}
                            onChange={(e) => setFeedbackData((f) => ({ ...f, comment: e.target.value }))}
                            placeholder="Share your thoughts about this event…"
                            rows={3}
                            className="w-full text-sm px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400/30 resize-none"
                          />
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleFeedbackSubmit(event._id)}
                              disabled={submitting}
                              className="flex-1 rounded-xl h-9 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold"
                            >
                              {submitting ? "Submitting…" : "Submit Feedback"}
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => setFeedbackOpen(null)}
                              className="h-9 rounded-xl text-slate-500"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setFeedbackOpen(event._id)}
                          className={`w-full text-center py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5
                            ${event.status === "completed"
                              ? "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                              : "text-slate-400 hover:text-indigo-600"}`}
                        >
                          <Star size={12} className={event.status === "completed" ? "fill-indigo-600" : ""} />
                          {event.status === "completed" ? "Leave Feedback Now" : "Leave Feedback"}
                        </button>
                      )}
                    </div>
                  ) : (
                    <Button
                      disabled
                      className="w-full rounded-xl font-bold h-10 bg-slate-100 text-slate-400 cursor-not-allowed"
                    >
                      <Download className="h-4 w-4 mr-2" /> Certificate Locked
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default MyEvents;
