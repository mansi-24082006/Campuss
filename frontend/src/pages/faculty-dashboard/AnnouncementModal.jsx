import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Megaphone, Send, Target, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/axios";
import { useToast } from "@/components/ui/use-toast";

const AnnouncementModal = ({ isOpen, onClose, events = [], onSuccess }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    eventId: "",
    message: "",
    type: "info",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.eventId || !formData.message) {
      return toast({ title: "Error", description: "Please fill all fields", variant: "destructive" });
    }

    setLoading(true);
    try {
      if (formData.eventId === "all_my_students") {
        await api.post("/notifications/faculty-broadcast", {
          message: formData.message,
          type: formData.type
        });
      } else {
        await api.post(`/notifications/broadcast/${formData.eventId}`, {
          message: formData.message,
          type: formData.type
        });
      }

      toast({ title: "Sent!", description: "Announcement sent successfully." });
      setFormData({ eventId: "", message: "", type: "info" });
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      toast({ 
        title: "Failed to send", 
        description: error.response?.data?.message || "Something went wrong", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col"
      >
        <div className="px-8 py-10 border-b border-slate-50 flex justify-between items-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-14 h-14 rounded-[1.25rem] bg-indigo-600 flex items-center justify-center text-white shadow-2xl shadow-indigo-200 rotate-[-5deg] group-hover:rotate-0 transition-transform">
              <Megaphone size={28} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Push Announcement</h2>
              <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-2 opacity-60">Broadcast to {events.length || 0} Events</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-slate-100 h-10 w-10">
            <X size={24} className="text-slate-300" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2 mb-1">
              <Target size={14} className="text-indigo-500" /> Target Event
            </label>
            <Select 
              value={formData.eventId} 
              onValueChange={(v) => setFormData({ ...formData, eventId: v })}
            >
              <SelectTrigger className="rounded-xl border-slate-200 h-11">
                <SelectValue placeholder="Select event to notify students" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_my_students" className="font-bold text-indigo-600 italic">
                  🚀 All My Students (System-wide)
                </SelectItem>
                <div className="h-px bg-slate-100 my-1" />
                {events.map((e) => (
                  <SelectItem key={e._id} value={e._id}>{e.title}</SelectItem>
                ))}
                {events.length === 0 && <SelectItem value="none" disabled>No active events</SelectItem>}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2 mb-1">
              <Users size={14} className="text-indigo-500" /> Announcement Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["info", "success", "warning"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: t })}
                  className={`py-3 text-[11px] font-black uppercase rounded-xl border-2 transition-all flex items-center justify-center ${
                    formData.type === t 
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100 scale-[1.02]" 
                    : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2 mb-1">
              Message Content
            </label>
            <textarea
              className="w-full min-h-[140px] rounded-[1.5rem] border-2 border-slate-100 p-5 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none bg-slate-50/30 text-slate-700 font-medium placeholder:text-slate-300"
              placeholder="e.g. 'Event starts in 10 minutes at the Main Audi! Bring your IDs.'"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
          >
            {loading ? "Broadcasting..." : <><Send size={18} /> Send to Students</>}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default AnnouncementModal;
