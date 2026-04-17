import React, { useState, useEffect } from "react";
import {
  X,
  Calendar,
  MapPin,
  Sparkles,
  Award,
  Plus,
  Trash2,
  Users,
  Clock,
  Info,
  Layout,
} from "lucide-react";
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
import { useToast } from "@/components/ui/use-toast";
import api from "@/lib/axios";
import { getEventImageUrl } from "@/lib/utils";
import { DEPARTMENTS } from "@/lib/departments";
import { EVENT_DOMAINS, EVENT_CATEGORIES } from "@/lib/eventCategories";

const defaultSpeaker = () => ({
  name: "",
  organization: "",
  bio: "",
  photoUrl: "",
});

const CreateEventModal = ({ isOpen, onClose, onSuccess, eventData = null }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("basic");

  // Format date for datetime-local input (YYYY-MM-DDTHH:mm)
  const formatDateTime = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const tzOffset = d.getTimezoneOffset() * 60000;
    const localISOTime = new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
    return localISOTime;
  };

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    endDate: "",
    category: "",
    type: "seminar",
    venue: "",
    registrationLimit: 150,
    participationLevel: "College",
    mode: "Offline",
    department: "Computer",
    description: "",
    rules: "",
    prizeDetails: "",
    organizerName: "SSASIT Admin",
    enableWaitlist: true,
    assignedFaculty: "none",
  });
  const [speakers, setSpeakers] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const resetForm = () => {
    setFormData({
      title: eventData?.title || "",
      date: formatDateTime(eventData?.date),
      endDate: formatDateTime(eventData?.endDate),
      category: eventData?.category || "", // Empty to force selection
      type: eventData?.type || "seminar",
      venue: eventData?.venue || "",
      registrationLimit: eventData?.registrationLimit || 150,
      participationLevel: eventData?.participationLevel || "College",
      mode: eventData?.mode || "Offline",
      department: eventData?.department || "Computer",
      description: eventData?.description || "",
      rules: eventData?.rules || "",
      prizeDetails: eventData?.prizeDetails || "",
      organizerName: eventData?.organizerName || "SSASIT Admin",
      enableWaitlist: eventData?.enableWaitlist ?? true,
      assignedFaculty: eventData?.assignedFaculty?._id || "none",
    });
    setSpeakers(eventData?.speakers || []);
    setImagePreview(eventData?.image || "");
    setImageFile(null);
    setActiveSection("basic");
  };

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen, eventData]);

  useEffect(() => {
    if (isOpen && user?.role === "admin") {
      api.get("/users").then(({ data }) =>
        setFaculties(data.filter((u) => u.role === "faculty"))
      );
    }
  }, [isOpen, user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.category || !formData.description) {
      return toast({ title: "Required Fields", description: "Title, Date, Category, and Description are required.", variant: "destructive" });
    }

    if (formData.endDate && formData.date) {
      const start = new Date(formData.date);
      const end = new Date(formData.endDate);
      if (end < start) {
        return toast({ 
          title: "Timeline Error", 
          description: `Your end time (${end.toLocaleTimeString()}) is set before the start time (${start.toLocaleTimeString()}). Please check the AM/PM settings.`, 
          variant: "destructive" 
        });
      }
    }

    setLoading(true);
    try {
      // Use FormData for file upload
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        // Only append if value exists to avoid "null"/"undefined" strings
        if (formData[key] !== null && formData[key] !== undefined) {
          data.append(key, formData[key]);
        }
      });
      data.append('speakers', JSON.stringify(speakers));
      if (imageFile) {
        data.append('image', imageFile);
      } else if (eventData?.image) {
        data.append('image', eventData.image);
      }

      if (eventData) {
        await api.put(`/events/${eventData._id}`, data);
        toast({ title: "Success", description: "Event updated successfully" });
      } else {
        await api.post("/events", data);
        toast({ 
          title: "Success", 
          description: user.role === "admin" ? "Event created and approved!" : "Event submitted for approval!" 
        });
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Save error", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save event",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const sections = [
    { id: "basic", label: "Core", icon: <Layout size={14} /> },
    { id: "specs", label: "Specs", icon: <Info size={14} /> },
    { id: "speakers", label: "Speakers", icon: <Users size={14} /> },
    { id: "prizes", label: "Rewards", icon: <Award size={14} /> },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 bg-[#0a0f18]/90 backdrop-blur-sm">
      <div className="bg-white md:rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col h-full md:h-[90vh] lg:h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 md:px-8 md:py-6 border-b border-slate-100 bg-[#0f172a] text-white flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-lg md:text-xl font-black tracking-tight flex items-center gap-3">
              <Sparkles className="text-blue-400" size={20} />
              {eventData ? "Modify Event" : "Create Event"}
            </h2>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">
              Configuration Panel v2.0
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Section Selector (Mobile: Top Bar, Desktop: Sidebar) */}
          <div className="flex md:flex-col overflow-x-auto md:overflow-y-auto bg-[#f8fafc] border-b md:border-b-0 md:border-r border-slate-200 p-2 md:p-6 gap-2 shrink-0 no-scrollbar">
            {sections.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveSection(s.id)}
                className={`flex items-center gap-2 md:gap-3 px-6 py-3 md:py-4 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-[0.15em] transition-all whitespace-nowrap md:w-full ${
                  activeSection === s.id
                    ? "bg-indigo-600 text-white shadow-xl shadow-indigo-200"
                    : "text-slate-400 hover:bg-white hover:text-indigo-600 hover:shadow-sm"
                }`}
              >
                {s.icon}
                {s.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden bg-white">
            <div className="p-6 md:p-8 flex-1 overflow-y-auto space-y-8 scrollbar-hide">
              {activeSection === "basic" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Event Title</label>
                      <Input
                        placeholder="e.g. Code Odyssey 2026"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="h-12 text-base font-bold rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-indigo-500/20 shadow-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Event Domain (Category)</label>
                      <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v, category: "" })}>
                        <SelectTrigger className="h-12 rounded-xl font-bold bg-slate-50/50">
                          <SelectValue placeholder="Select Domain" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {EVENT_DOMAINS.map(d => <SelectItem key={d} value={d} className="font-medium text-xs py-2">{d}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Event Banner (from PC/Browser)</label>
                    <div className="flex flex-col md:flex-row gap-4 items-start">
                      <div className="flex-1 w-full">
                        <Input 
                          type="file" 
                          accept="image/*"
                          onChange={handleImageChange}
                          className="h-12 rounded-xl border-slate-200 font-bold bg-slate-50 file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-[9px] file:font-black file:uppercase file:bg-indigo-600 file:text-white cursor-pointer"
                        />
                      </div>
                      {imagePreview && (
                        <div className="w-full md:w-32 h-20 rounded-2xl overflow-hidden border border-slate-100 shadow-sm shrink-0 bg-slate-100">
                           <img src={imagePreview.startsWith('blob') ? imagePreview : getEventImageUrl(imagePreview, formData.category)} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>

                   <div className="grid grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 text-indigo-600">Specific Event Type</label>
                      <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })} disabled={!formData.type || formData.type === 'other'}>
                        <SelectTrigger className={`h-12 rounded-xl font-bold text-xs tracking-wide transition-all ${!formData.type ? 'bg-slate-50 opacity-50' : 'bg-slate-50/50 ring-2 ring-indigo-500/10'}`}>
                          <SelectValue placeholder={formData.type ? "Search specifics..." : "Select Domain first"} />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {(EVENT_CATEGORIES[formData.type] || []).map(cat => (
                            <SelectItem key={cat} value={cat} className="font-semibold text-xs py-2.5">{cat}</SelectItem>
                          ))}
                          <SelectItem value="Other" className="font-semibold text-xs py-2.5 text-slate-400">Other / Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Engagement Mode</label>
                      <Select value={formData.mode} onValueChange={(v) => setFormData({ ...formData, mode: v })}>
                        <SelectTrigger className="h-12 rounded-xl font-bold bg-slate-50/50 text-xs text-slate-600 tracking-wide">
                          <SelectValue placeholder="Mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Offline">Offline</SelectItem>
                          <SelectItem value="Online">Online</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center justify-between">
                        Start Timeline
                        <span className="text-[9px] text-indigo-500 font-black lowercase">(AM/PM)</span>
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 pointer-events-none" size={16} />
                        <Input type="datetime-local" className="pl-12 h-12 rounded-xl border-slate-200 font-bold text-xs" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center justify-between">
                        End Timeline
                        <span className="text-[9px] text-slate-400 font-black lowercase">(AM/PM)</span>
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                        <Input type="datetime-local" className="pl-12 h-12 rounded-xl border-slate-200 font-bold text-xs" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Venue / Platform</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 pointer-events-none" size={16} />
                      <Input placeholder="Main Auditorium or Meeting Link" className="pl-12 h-12 rounded-xl border-slate-200 font-bold text-xs bg-slate-50/50" value={formData.venue} onChange={(e) => setFormData({ ...formData, venue: e.target.value })} />
                    </div>
                  </div>

                  <div className="space-y-2 pt-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Event Description</label>
                    <Textarea 
                      placeholder="Detail the event objectives, agenda, and guidelines..."
                      className="min-h-[120px] rounded-2xl border-slate-200 focus:ring-indigo-500/20 font-medium p-4"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {activeSection === "specs" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Host Department</label>
                      <Select value={formData.department} onValueChange={(v) => setFormData({ ...formData, department: v })}>
                        <SelectTrigger className="h-12 rounded-xl font-bold">
                          <SelectValue placeholder="Department" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {DEPARTMENTS.map(d => (
                            <SelectItem key={d} value={d} className="font-medium text-xs py-2.5">
                              {d}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Participation Reach</label>
                       <Select value={formData.participationLevel} onValueChange={(v) => setFormData({ ...formData, participationLevel: v })}>
                         <SelectTrigger className="h-12 rounded-xl font-bold">
                           <SelectValue placeholder="Select Reach" />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="College">College Only</SelectItem>
                           <SelectItem value="State">State Level</SelectItem>
                           <SelectItem value="National">National Level</SelectItem>
                         </SelectContent>
                       </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Attendee Limit</label>
                      <div className="relative">
                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                        <Input type="number" className="pl-12 h-12 rounded-xl font-bold" value={formData.registrationLimit} onChange={(e) => setFormData({ ...formData, registrationLimit: e.target.value })} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Quick Toggle</label>
                      <div className="flex items-center gap-3 h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl">
                        <input type="checkbox" id="waitlist" className="w-5 h-5 accent-indigo-600 rounded-md cursor-pointer" checked={formData.enableWaitlist} onChange={(e) => setFormData({ ...formData, enableWaitlist: e.target.checked })} />
                        <label htmlFor="waitlist" className="text-xs font-bold text-slate-600 cursor-pointer">Enable Waitlist</label>
                      </div>
                    </div>
                  </div>

                  {user?.role === "admin" && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assign Responsible Faculty</label>
                      <Select value={formData.assignedFaculty} onValueChange={(v) => setFormData({ ...formData, assignedFaculty: v })}>
                        <SelectTrigger className="h-12 rounded-xl border-indigo-100 font-bold"><SelectValue placeholder="Current Admin" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Self (System Admin)</SelectItem>
                          {faculties.map(f => <SelectItem key={f._id} value={f._id}>{f.fullName}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Organizer Unit</label>
                    <Input className="h-12 rounded-xl font-bold" value={formData.organizerName} onChange={(e) => setFormData({ ...formData, organizerName: e.target.value })} />
                  </div>
                </div>
              )}

              {activeSection === "speakers" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest">Speaker Directory</h3>
                    <Button type="button" size="sm" onClick={() => setSpeakers([...speakers, defaultSpeaker()])} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 font-bold text-[10px] uppercase tracking-wider">
                      <Plus size={14} className="mr-1.5" /> Add Profile
                    </Button>
                  </div>
                  {speakers.length === 0 && (
                    <div className="text-center py-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                      <Users className="mx-auto mb-2 text-slate-300" size={32} />
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">No speakers added yet</p>
                    </div>
                  )}
                  {speakers.map((s, idx) => (
                    <div key={idx} className="p-4 border border-slate-100 rounded-2xl bg-white shadow-sm flex gap-4 items-start relative group">
                      <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 text-[10px] font-black shrink-0">{idx + 1}</div>
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input placeholder="Full Name" value={s.name} onChange={(e) => { const n = [...speakers]; n[idx].name = e.target.value; setSpeakers(n); }} className="h-10 rounded-lg font-bold" />
                        <Input placeholder="Organization / Portfolio" value={s.organization} onChange={(e) => { const n = [...speakers]; n[idx].organization = e.target.value; setSpeakers(n); }} className="h-10 rounded-lg font-bold" />
                        <Textarea placeholder="Short Biography" className="md:col-span-2 rounded-lg resize-none text-xs font-medium" rows={2} value={s.bio} onChange={(e) => { const n = [...speakers]; n[idx].bio = e.target.value; setSpeakers(n); }} />
                      </div>
                      <button type="button" onClick={() => setSpeakers(speakers.filter((_, i) => i !== idx))} className="absolute right-4 top-4 text-slate-300 hover:text-rose-600 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
              )}

              {activeSection === "prizes" && (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Rules & Guidelines</label>
                    <Textarea className="min-h-[160px] rounded-3xl border-slate-200 p-6 font-medium leading-relaxed shadow-inner bg-slate-50/50" placeholder="List the rules, eligibility, or code of conduct..." value={formData.rules} onChange={(e) => setFormData({ ...formData, rules: e.target.value })} />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Gratification / Rewards</label>
                    <div className="relative">
                      <Award className="absolute left-5 top-1/2 -translate-y-1/2 text-amber-500 pointer-events-none" size={24} />
                      <Input placeholder="Certificates, Prizes, Internship opportunities..." className="pl-14 h-16 rounded-3xl border-slate-200 font-bold" value={formData.prizeDetails} onChange={(e) => setFormData({ ...formData, prizeDetails: e.target.value })} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 md:px-8 md:py-6 bg-white border-t border-slate-100 flex items-center justify-between gap-4 shrink-0">
              <Button type="button" variant="ghost" onClick={onClose} className="px-10 rounded-xl h-12 font-black uppercase text-[10px] tracking-widest text-slate-400 hover:text-slate-600 hover:bg-slate-50">Cancel</Button>
              <Button type="submit" disabled={loading} className="min-w-[240px] bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-14 font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-indigo-600/30 active:scale-95 transition-all">
                {loading ? "Processing..." : eventData ? "Synchronize Updates" : "Initialize Event"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEventModal;