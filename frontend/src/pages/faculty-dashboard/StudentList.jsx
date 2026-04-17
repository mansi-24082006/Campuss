import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CheckCircle, Users, Download, CheckCheck, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/axios";
import { useToast } from "@/components/ui/use-toast";

const StudentList = ({ events }) => {
  const { toast } = useToast();
  const [selectedEventId, setSelectedEventId] = useState("");
  const [eventData, setEventData] = useState(null);
  const [marking, setMarking] = useState(null);
  const [bulkMarking, setBulkMarking] = useState(false);
  const [winners, setWinners] = useState([]);
  const [saveLoading, setSaveLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchEventWithStudents = async (id) => {
    if (!id) return;
    try {
      const res = await api.get(`/events/${id}`);
      setEventData(res.data);
      setWinners(res.data.winners || []);
    } catch (error) {
      console.error("Failed to fetch event data:", error);
    }
  };

  useEffect(() => {
    if (selectedEventId) fetchEventWithStudents(selectedEventId);
  }, [selectedEventId]);

  const handleMarkAttendance = async (studentId) => {
    setMarking(studentId);
    try {
      await api.post(`/events/${selectedEventId}/attendance`, { studentIds: [studentId] });
      fetchEventWithStudents(selectedEventId);
    } catch (error) {
      console.error("Failed to mark attendance:", error);
    } finally {
      setMarking(null);
    }
  };

  const handleMarkAllPresent = async () => {
    if (!eventData?.registeredStudents?.length) return;
    setBulkMarking(true);
    try {
      const allIds = eventData.registeredStudents.map(s => s._id);
      await api.post(`/events/${selectedEventId}/attendance`, { studentIds: allIds });
      toast({ title: "✅ All Marked!", description: `${allIds.length} students marked present.` });
      fetchEventWithStudents(selectedEventId);
    } catch (error) {
      toast({ title: "Error", description: "Failed to bulk mark attendance", variant: "destructive" });
    } finally {
      setBulkMarking(false);
    }
  };

  const handleExportCSV = () => {
    if (!eventData?.registeredStudents?.length) return;
    const headers = ["Name", "Email", "Department", "Attended"];
    const rows = eventData.registeredStudents.map(s => [
      s.fullName,
      s.email,
      s.department || "",
      eventData.attendedStudents?.some(a => (a._id || a) === s._id) ? "Yes" : "No",
    ]);
    const csvContent = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${eventData.title || "participants"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAwardWinner = (studentId, position) => {
    const pointsMap = { "1st": 100, "2nd": 50, "3rd": 25 };
    const newWinner = { studentId, position, points: pointsMap[position] };
    setWinners(prev => {
      const existingIndex = prev.findIndex(w => (w.studentId?._id || w.studentId) === studentId);
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = newWinner;
        return updated;
      }
      return [...prev, newWinner];
    });
  };

  const handleSaveWinners = async () => {
    setSaveLoading(true);
    try {
      await api.post(`/events/${selectedEventId}/winners`, { winners });
      toast({ title: "Success", description: "Winners updated successfully!" });
      fetchEventWithStudents(selectedEventId);
    } catch (error) {
      toast({ title: "Error", description: "Failed to update winners", variant: "destructive" });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleRemoveWinner = (studentId) => {
    setWinners(prev => prev.filter(w => (w.studentId?._id || w.studentId) !== studentId));
  };

  const attendancePercent = eventData?.registeredStudents?.length
    ? Math.round((eventData.attendedStudents?.length / eventData.registeredStudents.length) * 100)
    : 0;

  const dashboardEvents = events.filter(e => ["approved", "active", "completed"].includes(e.status));

  const filteredStudents = eventData?.registeredStudents?.filter(s => 
    s.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.department?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-lg font-black text-slate-900 leading-tight">Attendance Desk</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Manage students and verify certificates</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 h-10 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all shadow-sm"
            />
          </div>
          
          <Select onValueChange={setSelectedEventId}>
            <SelectTrigger className="w-full md:w-[280px] rounded-xl border-slate-200 shadow-sm h-10">
              <SelectValue placeholder="Select an Event" />
            </SelectTrigger>
            <SelectContent>
              {dashboardEvents.map(e => (
                <SelectItem key={e._id} value={e._id} className="cursor-pointer">
                  <div className="flex items-center justify-between w-full min-w-[220px]">
                    <span className="font-medium truncate">{e.title}</span>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ml-2 ${
                      e.status === 'completed' ? 'bg-slate-100 text-slate-500' : 
                      e.status === 'active' ? 'bg-green-100 text-green-700' : 
                      'bg-indigo-100 text-indigo-700'
                    }`}>
                      {e.status}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedEventId && eventData && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleExportCSV}
                className="rounded-xl border-slate-200 text-slate-600 text-xs font-bold gap-1.5 h-10"
              >
                <Download size={14} /> Export
              </Button>
              <Button
                size="sm"
                onClick={handleMarkAllPresent}
                disabled={bulkMarking}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold gap-1.5 h-10 px-4"
              >
                <CheckCheck size={14} /> {bulkMarking ? "..." : "All Present"}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Attendance Progress */}
      {selectedEventId && eventData && eventData.registeredStudents?.length > 0 && (
        <div className="mb-6 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-slate-700">Attendance Statistics</span>
            <span className="text-sm font-black text-indigo-600">{attendancePercent}%</span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-emerald-400 rounded-full transition-all duration-1000"
              style={{ width: `${attendancePercent}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            <span>{eventData.attendedStudents?.length || 0} Attended</span>
            <span>{eventData.registeredStudents?.length || 0} Total Registered</span>
          </div>
        </div>
      )}

      {!selectedEventId ? (
        <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 shadow-sm">
          <Users className="h-12 w-12 text-slate-200 mx-auto mb-4" />
          <p className="text-slate-400 font-medium tracking-tight">Select an event to view the student register.</p>
        </div>
      ) : (
        <Card className="bg-white border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
          <CardContent className="p-8 space-y-4">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
              <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-base">
                {eventData?.registeredStudents?.length || 0}
              </div>
              <div>
                <h3 className="font-bold text-slate-800 tracking-tight">{eventData?.title}</h3>
                <p className="text-[10px] text-indigo-400 uppercase tracking-widest font-black">Student Participation List</p>
              </div>
            </div>

            {filteredStudents?.length === 0 && (
              <p className="text-center py-10 text-slate-400 font-medium">No matching students found.</p>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredStudents?.map((student, index) => {
                const isAttended = eventData.attendedStudents?.some(s => (s._id || s) === student._id);
                return (
                  <motion.div
                    key={student._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-white transition-all group"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-11 w-11 ring-2 ring-white shadow-md">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.email}`} />
                        <AvatarFallback className="bg-indigo-600 text-white font-bold">{student.fullName?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-xs text-slate-800 tracking-tight">{student.fullName}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{student.department || "General"}</p>
                          <span className="text-slate-300">•</span>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{student.collegeName || "Year 1"}</p>
                        </div>
                        <p className="text-[10px] text-indigo-500 font-medium mt-1">{student.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {isAttended ? (
                        <div className="flex items-center gap-2">
                          <div className="flex flex-col items-end gap-1.5">
                            {winners.find(w => (w.studentId?._id || w.studentId) === student._id) ? (
                              <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200 cursor-pointer flex items-center gap-1 group/badge text-[9px] font-bold" onClick={() => handleRemoveWinner(student._id)}>
                                {winners.find(w => (w.studentId?._id || w.studentId) === student._id).position}
                                <span className="hidden group-hover/badge:inline ml-1 text-slate-400">×</span>
                              </Badge>
                            ) : (
                              <Select onValueChange={(pos) => handleAwardWinner(student._id, pos)}>
                                <SelectTrigger className="h-7 w-20 rounded-lg text-[9px] font-bold bg-white border-slate-200">
                                  <SelectValue placeholder="Award" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1st">1st Place</SelectItem>
                                  <SelectItem value="2nd">2nd Place</SelectItem>
                                  <SelectItem value="3rd">3rd Place</SelectItem>
                                </SelectContent>
                              </Select>
                            )}

                            {/* Verification Toggle */}
                            {eventData.verifiedStudents?.some(id => (id._id || id) === student._id) ? (
                              <Badge className="bg-indigo-600 text-white border-0 rounded-lg py-1 px-2 text-[9px] font-bold">
                                Verified ✅
                              </Badge>
                            ) : (
                              <Button
                                size="sm"
                                onClick={async () => {
                                  try {
                                    await api.post(`/events/${selectedEventId}/verify-certificate`, { studentId: student._id });
                                    toast({ title: "Verified!", description: `${student.fullName} is now eligible for certificate.` });
                                    fetchEventWithStudents(selectedEventId);
                                  } catch (e) {
                                    toast({ title: "Error", description: "Failed to verify student", variant: "destructive" });
                                  }
                                }}
                                className="rounded-lg h-7 text-[9px] bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border-indigo-100 border font-bold px-3 transition-colors"
                              >
                                Verify Cert
                              </Button>
                            )}
                          </div>
                          <Badge className="bg-emerald-100 text-emerald-700 border-0 rounded-lg h-9 px-3 text-[10px] font-bold">
                            Present
                          </Badge>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="secondary"
                          disabled={marking === student._id}
                          onClick={() => handleMarkAttendance(student._id)}
                          className="rounded-xl h-9 text-[11px] font-bold px-4 bg-slate-200 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                        >
                          {marking === student._id ? "..." : "Mark Present"}
                        </Button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider text-center sm:text-left">
                Winners receive extra points and badges upon saving.
              </p>
              <Button
                onClick={handleSaveWinners}
                disabled={saveLoading || winners.length === 0}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl px-12 py-5 text-xs shadow-xl shadow-indigo-100 transition-all hover:scale-[1.02]"
              >
                {saveLoading ? "Saving..." : "Save Leaderboard"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default StudentList;
