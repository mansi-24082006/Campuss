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

const AnnouncementModal = ({ isOpen, onClose, events = [] }) => {
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
      // We will use a general notification endpoint or dedicated announcement one if it exists
      // For now, let's assume the backend has a way to broadcast to event registrants
      await api.post(`/notifications/broadcast/${formData.eventId}`, {
        message: formData.message,
        type: formData.type
      });

      toast({ title: "Sent! 📢", description: "Announcement sent to all registered students." });
      setFormData({ eventId: "", message: "", type: "info" });
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
        className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col"
      >
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-indigo-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Megaphone size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Push Announcement</h2>
              <p className="text-xs text-slate-500 font-medium tracking-tight">Send updates to all participants</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-2">
              <Target size={12} /> Target Event
            </label>
            <Select 
              value={formData.eventId} 
              onValueChange={(v) => setFormData({ ...formData, eventId: v })}
            >
              <SelectTrigger className="rounded-xl border-slate-200 h-11">
                <SelectValue placeholder="Select event to notify students" />
              </SelectTrigger>
              <SelectContent>
                {events.map((e) => (
                  <SelectItem key={e._id} value={e._id}>{e.title}</SelectItem>
                ))}
                {events.length === 0 && <SelectItem value="none" disabled>No events available</SelectItem>}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-2">
              <Users size={12} /> Announcement Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["info", "success", "warning"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: t })}
                  className={`py-2 text-[10px] font-bold uppercase rounded-lg border-2 transition-all ${
                    formData.type === t 
                    ? "bg-indigo-50 border-indigo-500 text-indigo-700" 
                    : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-2">
              Message Content
            </label>
            <textarea
              className="w-full min-h-[120px] rounded-2xl border-slate-200 p-4 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none bg-slate-50/50"
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
