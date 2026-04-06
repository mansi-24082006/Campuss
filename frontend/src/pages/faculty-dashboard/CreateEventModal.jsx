import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Calendar, MapPin, Users, Info, Sparkles, Award, Plus, Trash2, Mic, Link, Clock, ToggleLeft, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/axios";
import AnimatedSwitch from "@/components/ui/AnimatedSwitch";
import { Check } from "lucide-react";

const defaultSpeaker = () => ({
  name: "",
  organization: "",
  bio: "",
  sessionTitle: "",
  sessionTime: "",
  photoUrl: "",
  socialLinks: { linkedin: "", twitter: "", website: "" },
});

const CreateEventModal = ({ isOpen, onClose, onSuccess, eventData = null }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState(
    eventData
      ? {
          title: eventData.title || "",
          date: eventData.date ? new Date(eventData.date).toISOString().slice(0, 16) : "",
          endDate: eventData.endDate ? new Date(eventData.endDate).toISOString().slice(0, 16) : "",
          category: eventData.category || "Technical",
          type: eventData.type || "other",
          venue: eventData.venue || "",
          registrationLimit: eventData.registrationLimit || "",
          enableWaitlist: eventData.enableWaitlist || false,
          participationLevel: eventData.participationLevel || "College",
          description: eventData.description || "",
          prizeDetails: eventData.prizeDetails || "",
          rules: eventData.rules || "",
          assignedFaculty: eventData.assignedFaculty?._id || eventData.assignedFaculty || "",
        }
      : {
          title: "",
          date: "",
          endDate: "",
          category: "Technical",
          type: "other",
          venue: "",
          registrationLimit: "",
          enableWaitlist: false,
          participationLevel: "College",
          description: "",
          prizeDetails: "",
          rules: "",
          assignedFaculty: "",
        }
  );

  const [speakers, setSpeakers] = useState(
    eventData?.speakers?.length > 0 ? eventData.speakers : []
  );
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("basic");

  useEffect(() => {
    const fetchFaculties = async () => {
      if (user?.role === "admin") {
        try {
          const { data } = await api.get("/users");
          setFaculties(data.filter((u) => u.role === "faculty"));
        } catch (error) {
          console.error("Failed to fetch faculties:", error);
        }
      }
    };
    if (isOpen) fetchFaculties();
  }, [isOpen, user]);

  const updateSpeaker = (idx, field, value) => {
    setSpeakers((prev) => {
      const updated = [...prev];
      if (field.includes(".")) {
        const [parent, child] = field.split(".");
        updated[idx] = { ...updated[idx], [parent]: { ...updated[idx][parent], [child]: value } };
      } else {
        updated[idx] = { ...updated[idx], [field]: value };
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        registrationLimit: Number(formData.registrationLimit) || 0,
        speakers: speakers.filter((s) => s.name.trim()),
      };

      if (eventData) {
        await api.put(`/events/${eventData._id}`, payload);
      } else {
        await api.post("/events", payload);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to save event:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const sections = [
    { id: "basic", label: "📝 Basic Info" },
    { id: "speakers", label: "🎤 Speakers" },
    { id: "details", label: "📋 Details" },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-purple-50">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="text-indigo-600" size={20} />
              {eventData ? "Edit Event" : "Create New Event"}
            </h2>
            <p className="text-sm text-slate-500">
              {eventData ? "Update your event details" : "Draft your next big campus experience"}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X size={20} />
          </Button>
        </div>

        {/* Section Tabs */}
        <div className="flex border-b border-slate-100 bg-white">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`flex-1 py-3 text-sm font-bold transition-colors border-b-2 ${activeSection === s.id
                  ? "text-indigo-600 border-indigo-600"
                  : "text-slate-400 border-transparent hover:text-slate-600"
                }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 overflow-y-auto flex-1 space-y-5">

            {/* ======= BASIC INFO ======= */}
            {activeSection === "basic" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Event Title *</label>
                  <Input
                    required
                    placeholder="e.g. Annual Hackathon 2025"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="rounded-xl border-slate-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Event Type</label>
                  <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                    <SelectTrigger className="rounded-xl border-slate-200">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent className="z-[120]">
                      {["hackathon", "seminar", "tech-fest", "competition", "workshop", "other"].map((t) => (
                        <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Category</label>
                  <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                    <SelectTrigger className="rounded-xl border-slate-200">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent className="z-[120]">
                      {["Technical", "Non-Technical", "Seminar", "Workshop", "Hackathon", "Cultural", "Sports"].map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Participation Level</label>
                  <Select value={formData.participationLevel} onValueChange={(v) => setFormData({ ...formData, participationLevel: v })}>
                    <SelectTrigger className="rounded-xl border-slate-200">
                      <SelectValue placeholder="Select Level" />
                    </SelectTrigger>
                    <SelectContent className="z-[120]">
                      <SelectItem value="College">College Level</SelectItem>
                      <SelectItem value="State">State Level</SelectItem>
                      <SelectItem value="National">National Level</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Start Date & Time *</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      required
                      type="datetime-local"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="pl-10 rounded-xl border-slate-200"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">End Date & Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      type="datetime-local"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="pl-10 rounded-xl border-slate-200"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Venue *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      required
                      placeholder="Auditorium, Lab, Online..."
                      value={formData.venue}
                      onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                      className="pl-10 rounded-xl border-slate-200"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Registration Limit</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      type="number"
                      min="0"
                      placeholder="0 = unlimited"
                      value={formData.registrationLimit}
                      onChange={(e) => setFormData({ ...formData, registrationLimit: e.target.value })}
                      className="pl-10 rounded-xl border-slate-200"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <AnimatedSwitch
                    checked={formData.enableWaitlist}
                    onChange={(val) => setFormData({ ...formData, enableWaitlist: val })}
                    iconOn={<Check size={12} />}
                  />
                  <label className="text-sm font-semibold text-slate-700">Enable Waitlist</label>
                </div>

                {user?.role === "admin" && (
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-2">
                      <ShieldCheck size={14} /> Assign to Faculty Manager
                    </label>
                    <Select 
                      value={formData.assignedFaculty} 
                      onValueChange={(v) => setFormData({ ...formData, assignedFaculty: v })}
                    >
                      <SelectTrigger className="rounded-xl border-indigo-200 bg-indigo-50/30">
                        <SelectValue placeholder="Select a Faculty member to manage this event" />
                      </SelectTrigger>
                      <SelectContent className="z-[120]">
                        <SelectItem value="none">No dedicated faculty (Admin managed)</SelectItem>
                        {faculties.map((f) => (
                          <SelectItem key={f._id} value={f._id}>
                            {f.fullName} ({f.collegeName || "Faculty"})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-[10px] text-slate-400">
                      The assigned faculty will be able to mark attendance and manage registrations.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ======= SPEAKERS ======= */}
            {activeSection === "speakers" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">Add speakers, panelists, or guests for this event.</p>
                  <Button
                    type="button"
                    onClick={() => setSpeakers((p) => [...p, defaultSpeaker()])}
                    size="sm"
                    className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs"
                  >
                    <Plus size={14} className="mr-1" /> Add Speaker
                  </Button>
                </div>

                {speakers.length === 0 && (
                  <div className="text-center py-12 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400">
                    <Mic size={32} className="mx-auto mb-3 opacity-40" />
                    <p>No speakers added yet</p>
                  </div>
                )}

                {speakers.map((sp, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-2xl p-5 space-y-4 border border-slate-200">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-700 text-sm">Speaker {idx + 1}</h4>
                      <button
                        type="button"
                        onClick={() => setSpeakers((p) => p.filter((_, i) => i !== idx))}
                        className="text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Name *</label>
                        <Input
                          placeholder="Dr. Jane Smith"
                          value={sp.name}
                          onChange={(e) => updateSpeaker(idx, "name", e.target.value)}
                          className="rounded-xl border-slate-200 text-sm h-9"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Organization</label>
                        <Input
                          placeholder="Google, IIT, etc."
                          value={sp.organization}
                          onChange={(e) => updateSpeaker(idx, "organization", e.target.value)}
                          className="rounded-xl border-slate-200 text-sm h-9"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Session Title</label>
                        <Input
                          placeholder="Talk on AI Ethics"
                          value={sp.sessionTitle}
                          onChange={(e) => updateSpeaker(idx, "sessionTitle", e.target.value)}
                          className="rounded-xl border-slate-200 text-sm h-9"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Session Time</label>
                        <Input
                          placeholder="10:00 AM – 11:00 AM"
                          value={sp.sessionTime}
                          onChange={(e) => updateSpeaker(idx, "sessionTime", e.target.value)}
                          className="rounded-xl border-slate-200 text-sm h-9"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Bio</label>
                        <Textarea
                          placeholder="Short bio about the speaker..."
                          value={sp.bio}
                          onChange={(e) => updateSpeaker(idx, "bio", e.target.value)}
                          rows={2}
                          className="rounded-xl border-slate-200 text-sm resize-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">LinkedIn URL</label>
                        <Input
                          placeholder="https://linkedin.com/in/..."
                          value={sp.socialLinks?.linkedin}
                          onChange={(e) => updateSpeaker(idx, "socialLinks.linkedin", e.target.value)}
                          className="rounded-xl border-slate-200 text-sm h-9"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Photo URL</label>
                        <Input
                          placeholder="https://..."
                          value={sp.photoUrl}
                          onChange={(e) => updateSpeaker(idx, "photoUrl", e.target.value)}
                          className="rounded-xl border-slate-200 text-sm h-9"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ======= DETAILS ======= */}
            {activeSection === "details" && (
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Event Description *</label>
                  <Textarea
                    required
                    placeholder="Tell us more about the event..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="rounded-xl border-slate-200 min-h-[120px]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Prize Details</label>
                  <div className="relative">
                    <Award className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="e.g. 1st ₹5000, 2nd ₹3000, 3rd ₹1000"
                      value={formData.prizeDetails}
                      onChange={(e) => setFormData({ ...formData, prizeDetails: e.target.value })}
                      className="pl-10 rounded-xl border-slate-200"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Rules & Regulations</label>
                  <Textarea
                    placeholder="Enter event rules..."
                    value={formData.rules}
                    onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                    className="rounded-xl border-slate-200 min-h-[100px]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-slate-100 flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-2xl h-11 font-bold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl h-11 font-bold shadow-lg shadow-indigo-100"
            >
              {loading ? "Saving..." : eventData ? "Update Event" : "Submit for Approval"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateEventModal;
