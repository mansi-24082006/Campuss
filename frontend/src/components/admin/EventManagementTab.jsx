import React, { useState } from "react";
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
} from "lucide-react";

const EventManagementTab = ({ events, toast }) => {
  const [viewMode, setViewMode] = useState("list"); // 'grid' or 'list'

  const handleAction = (type) => {
    toast({
      title: `🚧 ${type} isn't implemented yet—request it in your next prompt! 🚀`,
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      active:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      upcoming:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      completed:
        "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            Event Management
          </h2>
          <p className="text-sm text-slate-500">
            Manage, monitor, and organize campus activities
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* View Toggle Switch */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <Button
              variant={viewMode === "grid" ? "white" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className={`h-8 w-10 p-0 rounded-lg transition-all ${
                viewMode === "grid"
                  ? "bg-white shadow-sm dark:bg-slate-700"
                  : "text-slate-500"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "white" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className={`h-8 w-10 p-0 rounded-lg transition-all ${
                viewMode === "list"
                  ? "bg-white shadow-sm dark:bg-slate-700"
                  : "text-slate-500"
              }`}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          <Button
            onClick={() => handleAction("Creation")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex-1 sm:flex-none"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span>Create Event</span>
          </Button>
        </div>
      </div>

      {/* Events Container */}
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
              key={event.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              {viewMode === "grid" ? (
                /* GRID CARD DESIGN */
                <Card className="h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] overflow-hidden hover:shadow-xl transition-all group">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <Badge
                        className={`${getStatusColor(
                          event.status
                        )} border-0 rounded-lg`}
                      >
                        {event.status}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="dark:border-slate-700"
                      >
                        {event.category}
                      </Badge>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">
                      {event.title}
                    </h3>
                    <p className="text-xs text-slate-500 mb-4">
                      By {event.organizer}
                    </p>

                    <div className="space-y-2 mb-6 flex-grow">
                      <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                        <Calendar className="h-4 w-4 mr-2 text-indigo-500" />
                        {event.date}
                      </div>
                      <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                        <Users className="h-4 w-4 mr-2 text-indigo-500" />
                        {event.participants} registered
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 rounded-xl"
                        onClick={() => handleAction("Editing")}
                      >
                        <Edit className="h-3 w-3 mr-1" /> Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="px-3 rounded-xl"
                        onClick={() => handleAction("Deletion")}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                /* LIST ROW DESIGN */
                <div className="group flex flex-col md:flex-row items-center justify-between p-4 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-indigo-300 dark:hover:border-indigo-500 transition-all gap-4">
                  <div className="flex items-center gap-4 flex-1 w-full">
                    <div className="hidden sm:flex h-12 w-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl items-center justify-center font-bold">
                      {event.title.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-800 dark:text-white">
                          {event.title}
                        </h3>
                        <Badge
                          className={`${getStatusColor(
                            event.status
                          )} text-[10px] h-5`}
                        >
                          {event.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500">
                        {event.organizer} • {event.category}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full md:w-auto gap-8">
                    <div className="hidden lg:block text-right">
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {event.date}
                      </p>
                      <p className="text-[10px] text-slate-500 uppercase">
                        Event Date
                      </p>
                    </div>
                    <div className="hidden md:block text-right">
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {event.participants}
                      </p>
                      <p className="text-[10px] text-slate-500 uppercase">
                        Participants
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-600 dark:text-slate-400"
                        onClick={() => handleAction("Editing")}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500"
                        onClick={() => handleAction("Deletion")}
                      >
                        <Trash2 className="h-4 w-4" />
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
  );
};

export default EventManagementTab;
