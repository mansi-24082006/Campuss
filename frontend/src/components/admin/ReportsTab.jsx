import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Trophy,
  Users,
  Star,
  Download,
  TrendingUp,
  Calendar,
  ArrowUpDown,
  MessageSquare,
} from "lucide-react";
import api from "@/lib/axios";
import FeedbackViewerModal from "./FeedbackViewerModal";

const ReportsTab = () => {
  const [data, setData] = useState({ topEvents: [], topStudents: [] });
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState("registered");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventFeedback, setEventFeedback] = useState([]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await api.get("/events/admin/reports");
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleViewFeedback = async (eventId, title) => {
    setSelectedEvent(title);
    try {
      const res = await api.get(`/events/${eventId}/feedback`);
      setEventFeedback(res.data);
      setShowFeedbackModal(true);
    } catch (err) {
      console.error("Failed to fetch feedback:", err);
    }
  };

  const sortedEvents = [...data.topEvents].sort((a, b) => b[sortField] - a[sortField]);

  const exportEventsCSV = () => {
    const headers = ["Title", "Category", "Type", "Status", "Date", "Organizer", "Registered", "Attended", "Avg Rating"];
    const rows = sortedEvents.map((e) => [
      e.title,
      e.category || "",
      e.type || "",
      e.status,
      e.date ? new Date(e.date).toLocaleDateString() : "",
      e.organizer || "",
      e.registered,
      e.attended,
      e.avgRating || "N/A",
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "event-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportStudentsCSV = () => {
    const headers = ["Name", "Email", "Department", "Points", "Events Attended", "Badges"];
    const rows = data.topStudents.map((s) => [
      s.fullName,
      s.email,
      s.department || "",
      s.points,
      s.eventsAttended?.length || 0,
      (s.badges || []).join("; "),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "student-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-16 rounded-2xl bg-slate-200 animate-pulse" />
        ))}
      </div>
    );
  }

  // Summary stats
  const totalRegistered = data.topEvents.reduce((s, e) => s + e.registered, 0);
  const totalAttended = data.topEvents.reduce((s, e) => s + e.attended, 0);
  const overallRate = totalRegistered ? Math.round((totalAttended / totalRegistered) * 100) : 0;
  const totalFeedback = data.topEvents.reduce((s, e) => s + e.feedbackCount, 0);

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Events", value: data.topEvents.length, icon: Calendar, color: "bg-blue-50 text-blue-600" },
          { label: "Total Registered", value: totalRegistered, icon: Users, color: "bg-purple-50 text-purple-600" },
          { label: "Attendance Rate", value: `${overallRate}%`, icon: TrendingUp, color: "bg-emerald-50 text-emerald-600" },
          { label: "Total Feedback", value: totalFeedback, icon: Star, color: "bg-amber-50 text-amber-600" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white border border-slate-200 rounded-2xl p-4"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
              <stat.icon size={20} />
            </div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Events Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div className="flex items-center gap-2">
            <BarChart3 size={20} className="text-indigo-600" />
            <h3 className="font-bold text-slate-900">Event Performance</h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Sort by:</span>
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
              >
                <option value="registered">Registrations</option>
                <option value="attended">Attendance</option>
                <option value="feedbackCount">Feedback</option>
              </select>
            </div>
            <button
              onClick={exportEventsCSV}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors"
            >
              <Download size={13} /> Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-5 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wide">Event</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wide">Status</th>
                <th className="text-center px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wide">Registered</th>
                <th className="text-center px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wide">Attended</th>
                <th className="text-center px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wide">Rate</th>
                <th className="text-center px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wide">Avg Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {sortedEvents.map((event, i) => {
                const rate = event.registered ? Math.round((event.attended / event.registered) * 100) : 0;
                const statusColors = {
                  approved: "bg-green-100 text-green-700",
                  pending: "bg-amber-100 text-amber-700",
                  rejected: "bg-red-100 text-red-700",
                  completed: "bg-slate-100 text-slate-600",
                };
                return (
                  <motion.tr
                    key={event._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-slate-800 line-clamp-1">{event.title}</p>
                      <p className="text-xs text-slate-400 capitalize">{event.type || event.category}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${statusColors[event.status] || "bg-slate-100 text-slate-600"}`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center font-bold text-slate-700">{event.registered}</td>
                    <td className="px-4 py-3.5 text-center font-bold text-slate-700">{event.attended}</td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${rate}%` }} />
                        </div>
                        <span className="text-xs font-bold text-slate-600">{rate}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      {event.avgRating ? (
                        <button 
                          onClick={() => handleViewFeedback(event._id, event.title)}
                          className="font-bold text-amber-600 hover:underline flex items-center justify-center gap-1 mx-auto"
                        >
                          <Star size={14} className="fill-amber-500 text-amber-500" /> {event.avgRating}
                        </button>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
          {sortedEvents.length === 0 && (
            <p className="text-center py-12 text-slate-400">No events data yet</p>
          )}
        </div>
      </div>

      <FeedbackViewerModal 
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        eventTitle={selectedEvent}
        feedback={eventFeedback}
      />

      {/* Top Students */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Trophy size={20} className="text-amber-500" />
            <h3 className="font-bold text-slate-900">Top 10 Students by Points</h3>
          </div>
          <button
            onClick={exportStudentsCSV}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors"
          >
            <Download size={13} /> Export CSV
          </button>
        </div>

        <div className="divide-y divide-slate-50">
          {data.topStudents.map((student, i) => (
            <motion.div
              key={student._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/50 transition-colors"
            >
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black ${
                i === 0 ? "bg-amber-100 text-amber-600" : i === 1 ? "bg-slate-200 text-slate-600" : i === 2 ? "bg-orange-100 text-orange-600" : "bg-slate-100 text-slate-500"
              }`}>
                {i + 1}
              </span>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                {student.fullName?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-800 text-sm line-clamp-1">{student.fullName}</p>
                <p className="text-xs text-slate-400">{student.department || "General"} • {student.eventsAttended?.length || 0} events</p>
              </div>
              {student.badges?.length > 0 && (
                <span className="text-xs bg-purple-50 text-purple-700 font-semibold px-2 py-1 rounded-full border border-purple-100 hidden md:block">
                  🏅 {student.badges.length} badge{student.badges.length > 1 ? "s" : ""}
                </span>
              )}
              <div className="text-right">
                <p className="text-lg font-black text-indigo-600">{student.points}</p>
                <p className="text-[10px] text-slate-400 uppercase font-bold">XP</p>
              </div>
            </motion.div>
          ))}
          {data.topStudents.length === 0 && (
            <p className="text-center py-12 text-slate-400">No student data yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsTab;
