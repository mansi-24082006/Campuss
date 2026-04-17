import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  LayoutGrid,
  List,
  Trash2,
  Plus,
  Users,
  Calendar,
} from "lucide-react";

const MyEvents = ({ events, handleEditEvent }) => {
  const [viewMode, setViewMode] = useState("list");

  const getStatusColor = (status) => {
    const colors = {
      approved: "bg-emerald-100 text-emerald-700",
      active: "bg-blue-100 text-blue-700",
      pending: "bg-orange-100 text-orange-700",
      rejected: "bg-rose-100 text-rose-700",
    };
    return colors[status?.toLowerCase()] || "bg-gray-100 text-gray-600";
  };

  if (events.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed">
        <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold">No Events Yet</h3>
        <p className="text-xs text-gray-500 mt-2">
          Start by creating your first event 🚀
        </p>

        <Button
          onClick={() => handleEditEvent(null)}
          className="mt-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-5 py-2 text-xs"
        >
          <Plus size={16} className="mr-2" />
          Create Event
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            My Events
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {events.length} events total
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">

          {/* Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-xl border">
            <Button
              variant="ghost"
              onClick={() => setViewMode("grid")}
              className={`h-9 w-10 ${viewMode === "grid" ? "bg-white shadow-sm" : "text-slate-500"
                }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              onClick={() => setViewMode("list")}
              className={`h-9 w-10 ${viewMode === "list" ? "bg-white shadow-sm" : "text-slate-500"
                }`}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Create */}
          <Button
            onClick={() => handleEditEvent(null)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-5 py-2 text-xs"
          >
            <Plus size={16} className="mr-2" />
            Create
          </Button>
        </div>
      </div>

      {/* EVENTS */}
      <AnimatePresence mode="popLayout">
        <motion.div
          layout
          className={
            viewMode === "grid"
              ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
              : "space-y-4"
          }
        >
          {events.map((event, index) => (
            <motion.div
              key={event._id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2, delay: index * 0.03 }}
            >
              {viewMode === "grid" ? (
                /* GRID */
                <div className="bg-white border rounded-2xl p-5 hover:shadow-md transition">

                  <div className="flex justify-between mb-4">
                    <Badge className={`${getStatusColor(event.status)} text-[10px] px-3 py-1 capitalize`}>
                      {event.status}
                    </Badge>

                    <Button 
                      size="icon" 
                      variant="ghost"
                      onClick={() => handleEditEvent(event)}
                      className="hover:text-indigo-600"
                    >
                      <Edit size={16} />
                    </Button>
                  </div>

                  <h3 className="text-base font-semibold text-slate-800">
                    {event.title}
                  </h3>

                  <p className="text-xs text-slate-500 mt-2">
                    {event.category} • {event.venue}
                  </p>

                  <div className="mt-5 space-y-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      {new Date(event.date).toLocaleDateString()}
                    </div>

                    <div className="flex items-center gap-2">
                      <Users size={14} />
                      {event.registeredStudents?.length || 0} students
                    </div>
                  </div>
                </div>
              ) : (
                /* LIST */
                <div className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-white border rounded-2xl hover:shadow-md transition gap-4">

                  {/* LEFT */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                      {event.title.charAt(0)}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-semibold text-slate-800">
                          {event.title}
                        </h3>

                        <Badge className={`${getStatusColor(event.status)} text-[10px] px-3 py-1 capitalize`}>
                          {event.status}
                        </Badge>
                      </div>

                      <p className="text-xs text-slate-500 mt-1">
                        {event.category} • {event.venue}
                      </p>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="flex items-center gap-6">

                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {new Date(event.date).toLocaleDateString()}
                      </p>
                      <p className="text-[10px] text-gray-400">DATE</p>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {event.registeredStudents?.length || 0}
                      </p>
                      <p className="text-[10px] text-gray-400">ENROLLED</p>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        size="icon" 
                        variant="ghost"
                        onClick={() => handleEditEvent(event)}
                        className="hover:text-indigo-600"
                      >
                        <Edit size={16} />
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-gray-500 hover:text-red-500"
                        onClick={async () => {
                          if (window.confirm("Permanently delete this event?")) {
                            try {
                              await api.delete(`/events/${event._id}`);
                              window.location.reload(); // Simple refresh for now
                            } catch (e) {
                              console.error("Delete failed");
                            }
                          }
                        }}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>

                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default MyEvents;