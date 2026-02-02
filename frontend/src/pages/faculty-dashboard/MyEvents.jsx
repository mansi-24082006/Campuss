import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Edit, Plus, LayoutGrid, List } from "lucide-react";

const MyEvents = ({ events, handleCreateEvent, handleEditEvent }) => {
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"

  const getStatusColor = (status) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      upcoming: "bg-blue-100 text-blue-800",
      completed: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Event Management
          </h2>
          <p className="text-slate-500 text-sm">
            Organize and monitor your campus activities
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Toggle Switch */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <Button
              variant={viewMode === "grid" ? "white" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className={`h-8 w-10 p-0 rounded-lg transition-all ${
                viewMode === "grid" ? "bg-white shadow-sm" : "text-slate-500"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "white" : "ghost"}
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
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-2 flex-1 sm:flex-none"
          >
            <Plus className="h-4 w-4 mr-2" /> <span>Create Event</span>
          </Button>
        </div>
      </div>

      {/* Content Section */}
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              : "flex flex-col gap-3"
          }
        >
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              {viewMode === "grid" ? (
                /* Grid Card (Column Wise) */
                <Card className="group bg-white border border-slate-200 rounded-[2rem] overflow-hidden hover:shadow-xl hover:border-indigo-100 transition-all h-full">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <Badge
                        className={`${getStatusColor(
                          event.status
                        )} rounded-lg border-0 px-3 py-1 font-bold text-[10px] uppercase tracking-wider`}
                      >
                        {event.status}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditEvent(event.id)}
                        className="h-8 w-8 rounded-full"
                      >
                        <Edit className="h-4 w-4 text-slate-400" />
                      </Button>
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-800">
                      {event.title}
                    </CardTitle>
                    <CardDescription className="font-medium text-indigo-600">
                      {event.date}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mt-4 bg-slate-50 p-3 rounded-2xl">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-slate-400" />
                        <span className="text-xs font-bold text-slate-600">
                          {event.participants} Students
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-[10px] border-slate-200 text-slate-500"
                      >
                        {event.category}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                /* List Row (Row Wise) */
                <div className="group flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-indigo-200 hover:shadow-md transition-all">
                  <div className="flex items-center gap-6 flex-1">
                    <div className="hidden xs:flex h-12 w-12 bg-indigo-50 text-indigo-600 rounded-xl items-center justify-center font-black">
                      {event.title.charAt(0)}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-1 flex-1">
                      <div>
                        <h3 className="font-bold text-slate-800 truncate">
                          {event.title}
                        </h3>
                        <p className="text-[11px] text-slate-400 uppercase font-bold tracking-tighter">
                          Event Title
                        </p>
                      </div>
                      <div className="hidden sm:block">
                        <p className="text-sm font-semibold text-slate-600">
                          {event.date}
                        </p>
                        <p className="text-[11px] text-slate-400 uppercase font-bold tracking-tighter">
                          Schedule
                        </p>
                      </div>
                      <div className="hidden lg:flex items-center gap-2">
                        <Badge
                          className={`${getStatusColor(
                            event.status
                          )} rounded-md border-0`}
                        >
                          {event.status}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-slate-400 border-slate-200"
                        >
                          {event.category}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 ml-4">
                    <div className="hidden md:flex flex-col items-end">
                      <span className="text-sm font-black text-slate-800">
                        {event.participants}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                        Joined
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditEvent(event.id)}
                      className="rounded-xl border-slate-200 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      <Edit className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Edit</span>
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {events.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-medium">
            No events found. Start by creating your first one!
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default MyEvents;
