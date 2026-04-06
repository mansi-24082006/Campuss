import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, MessageCircle, BarChart3, TrendingUp, AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/axios";

const StarDisplay = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={14}
        className={s <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"}
      />
    ))}
  </div>
);

const FeedbackTab = ({ events }) => {
  const [selectedEventId, setSelectedEventId] = useState("");
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFeedback = async (id) => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await api.get(`/events/${id}/feedback`);
      setFeedback(res.data || []);
    } catch (err) {
      console.error("Failed to fetch feedback:", err);
      setFeedback([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedEventId) fetchFeedback(selectedEventId);
  }, [selectedEventId]);

  const avgRating = feedback.length
    ? (feedback.reduce((s, f) => s + f.rating, 0) / feedback.length).toFixed(1)
    : null;

  const ratingDist = [5, 4, 3, 2, 1].map((r) => ({
    rating: r,
    count: feedback.filter((f) => f.rating === r).length,
  }));

  return (
    <div className="space-y-6 p-1">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <MessageCircle size={24} className="text-indigo-600" />
            Event Feedback
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">View student feedback for your events</p>
        </div>

        <Select onValueChange={setSelectedEventId}>
          <SelectTrigger className="w-full md:w-[280px] rounded-xl border-slate-200 shadow-sm">
            <SelectValue placeholder="Select an Event" />
          </SelectTrigger>
          <SelectContent>
            {events.map((e) => (
              <SelectItem key={e._id} value={e._id}>{e.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!selectedEventId ? (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-slate-400">
          <BarChart3 className="mx-auto mb-3 w-12 h-12 opacity-40" />
          <p className="font-medium">Select an event to view feedback</p>
        </div>
      ) : loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-slate-200 animate-pulse" />
          ))}
        </div>
      ) : feedback.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-slate-400">
          <AlertCircle className="mx-auto mb-3 w-10 h-10 opacity-40" />
          <p>No feedback received yet for this event</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Average Rating */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5 text-center border border-indigo-100">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Avg Rating</p>
              <p className="text-5xl font-black text-indigo-600 mb-1">{avgRating}</p>
              <StarDisplay rating={Number(avgRating)} />
            </div>

            {/* Total Responses */}
            <div className="bg-white rounded-2xl p-5 text-center border border-slate-200">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Responses</p>
              <p className="text-5xl font-black text-slate-900">{feedback.length}</p>
              <p className="text-xs text-slate-400 mt-1">students reviewed</p>
            </div>

            {/* Rating Distribution */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Distribution</p>
              <div className="space-y-1.5">
                {ratingDist.map(({ rating, count }) => (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 w-4">{rating}★</span>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-700"
                        style={{ width: `${feedback.length ? (count / feedback.length) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-400 w-4">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Individual Feedback */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">All Comments</h3>
            {feedback.map((fb, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                      {(fb.studentName || "A")[0]}
                    </div>
                    <span className="text-sm font-bold text-slate-800">{fb.studentName || "Anonymous"}</span>
                  </div>
                  <StarDisplay rating={fb.rating} />
                </div>
                {fb.comment && (
                  <p className="text-sm text-slate-600 leading-relaxed pl-10">{fb.comment}</p>
                )}
                {fb.createdAt && (
                  <p className="text-[11px] text-slate-400 pl-10">
                    {new Date(fb.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackTab;
