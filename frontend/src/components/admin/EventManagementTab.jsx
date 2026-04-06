import React, { useState } from "react";
import api from "@/lib/axios";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Edit,
  Trash2,
  LayoutGrid,
  List,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  MapPin,
} from "lucide-react";
import CreateEventModal from "@/pages/faculty-dashboard/CreateEventModal";

const EventManagementTab = ({ events, onStatusUpdate, toast }) => {
  const [viewMode, setViewMode] = useState("list");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const handleStatusUpdate = async (eventId, newStatus) => {
    try {
      await api.patch(`/events/${eventId}/status`, { status: newStatus });
      toast({
        title: `Event ${newStatus.toUpperCase()}!`,
        description: `Successfully updated the event status to ${newStatus}.`,
      });
      onStatusUpdate();
    } catch (error) {
      toast({
        title: "Status Update Failed",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive"
      });
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event? This cannot be undone.")) {
      try {
        await api.delete(`/events/${eventId}`);
        onStatusUpdate();
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  const handleCreateEvent = () => {
    setEditingEvent(null);
    setShowCreateModal(true);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setShowCreateModal(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      approved: "bg-emerald-100 text-emerald-700",
      pending: "bg-orange-100 text-orange-700",
      rejected: "bg-rose-100 text-rose-700",
      completed: "bg-slate-100 text-slate-600",
      active: "bg-blue-100 text-blue-700",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const pendingCount = events.filter((e) => e.status === "pending").length;

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Event Management</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {events.length} events total
              {pendingCount > 0 && (
                <span className="ml-2 text-orange-600 font-semibold">
                  • {pendingCount} pending approval
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* View Toggle */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("grid")}
                className={`h-8 w-10 p-0 rounded-lg transition-all ${
                  viewMode === "grid" ? "bg-white shadow-sm" : "text-slate-500"
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("list")}
                className={`h-8 w-10 p-0 rounded-lg transition-all ${
                  viewMode === "list" ? "bg-white shadow-sm" : "text-slate-500"
                }`}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            <Button
              onClick={handleCreateEvent}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex-1 sm:flex-none shadow-md shadow-indigo-100"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </div>
        </div>

        {/* Empty State */}
        {events.length === 0 && (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">No events yet</p>
            <p className="text-slate-400 text-sm mt-1">Create your first event to get started</p>
            <Button
              onClick={handleCreateEvent}
              className="mt-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
            >
              <Plus className="h-4 w-4 mr-2" /> Create Event
            </Button>
          </div>
        )}

        {/* Events List / Grid */}
        <AnimatePresence mode="popLayout">
          <motion.div
            layout
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-3"
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
                  /* ——— GRID CARD ——— */
                  <Card className="h-full bg-white border border-slate-200 rounded-[2rem] overflow-hidden hover:shadow-lg transition-all group">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex justify-between items-start mb-3">
                        <Badge className={`${getStatusColor(event.status)} border-0 rounded-lg capitalize text-[11px] font-bold`}>
                          {event.status}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] capitalize">
                          {event.type || event.category}
                        </Badge>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 mb-1 line-clamp-1">{event.title}</h3>
                      <p className="text-xs text-slate-400 mb-3">By {event.organizer?.fullName || "Admin"}</p>

                      <div className="space-y-1.5 mb-4 flex-grow text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 text-indigo-400 flex-shrink-0" />
                          {new Date(event.date).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                        </div>
                        {event.venue && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5 text-indigo-400 flex-shrink-0" />
                            <span className="line-clamp-1">{event.venue}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Users className="h-3.5 w-3.5 text-indigo-400 flex-shrink-0" />
                          {event.registeredStudents?.length || 0} registered
                        </div>
                      </div>

                      <div className="flex gap-2 pt-3 border-t border-slate-100">
                        {event.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                              onClick={() => handleStatusUpdate(event._id, "approved")}
                            >
                              <CheckCircle className="h-3.5 w-3.5 mr-1" /> Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 rounded-xl text-rose-600 border-rose-100 hover:bg-rose-50 text-xs font-bold"
                              onClick={() => handleStatusUpdate(event._id, "rejected")}
                            >
                              <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
                            </Button>
                          </>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                          onClick={() => handleEditEvent(event)}
                          title="Edit Event"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          onClick={() => handleDeleteEvent(event._id)}
                          title="Delete Event"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  /* ——— LIST ROW ——— */
                  <div className="group flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-indigo-300 hover:shadow-sm transition-all gap-4">
                    <div className="flex items-center gap-4 flex-1 w-full min-w-0">
                      <div className="hidden sm:flex h-11 w-11 bg-indigo-50 text-indigo-600 rounded-xl items-center justify-center font-black text-lg flex-shrink-0">
                        {event.title.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-slate-800 text-sm line-clamp-1">{event.title}</h3>
                          <Badge className={`${getStatusColor(event.status)} text-[10px] h-5 font-bold capitalize border-0`}>
                            {event.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          By {event.organizer?.fullName || "Admin"} &nbsp;•&nbsp; {event.type || event.category}
                          {event.venue && <> &nbsp;•&nbsp; 📍 {event.venue}</>}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full md:w-auto gap-6">
                      <div className="hidden lg:block text-right">
                        <p className="text-xs font-bold text-slate-700">
                          {new Date(event.date).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                        </p>
                        <p className="text-[10px] text-slate-400 uppercase">Date</p>
                      </div>
                      <div className="hidden md:block text-right">
                        <p className="text-xs font-black text-slate-700">{event.registeredStudents?.length || 0}</p>
                        <p className="text-[10px] text-slate-400 uppercase">Enrolled</p>
                      </div>

                      <div className="flex gap-1.5">
                        {event.status === "pending" && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="rounded-lg text-emerald-600 hover:bg-emerald-50 text-xs font-bold"
                              onClick={() => handleStatusUpdate(event._id, "approved")}
                            >
                              ✓ Approve
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="rounded-lg text-rose-500 hover:bg-rose-50 text-xs font-bold"
                              onClick={() => handleStatusUpdate(event._id, "rejected")}
                            >
                              ✕ Reject
                            </Button>
                          </>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 h-8 w-8 p-0"
                          onClick={() => handleEditEvent(event)}
                          title="Edit"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 h-8 w-8 p-0"
                          onClick={() => handleDeleteEvent(event._id)}
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Create / Edit Event Modal */}
      <CreateEventModal
        key={editingEvent ? editingEvent._id : "admin-new-event"}
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setEditingEvent(null);
        }}
        onSuccess={() => {
          onStatusUpdate();
          setShowCreateModal(false);
          setEditingEvent(null);
        }}
        eventData={editingEvent}
      />
    </>
  );
};

export default EventManagementTab;
