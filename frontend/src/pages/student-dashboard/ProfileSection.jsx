import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, Edit2, Save, Phone, Building2, Briefcase, MapPin, Zap, ShieldCheck, Trophy, User as UserIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getAvatarUrl } from "@/lib/avatar";
import { useToast } from "@/components/ui/use-toast";
import api from "@/lib/axios";

const ProfileSection = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState({
    fullName: "",
    phoneNumber: "",
    department: "",
    collegeName: "",
    state: "",
  });

  useEffect(() => {
    if (user) {
      setEditData({
        fullName: user.fullName || "",
        phoneNumber: user.phoneNumber || "",
        department: user.department || "",
        collegeName: user.collegeName || "",
        state: user.state || "Gujarat",
      });
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data } = await api.patch("/users/profile", editData);
      updateUser(data);
      setIsEditing(false);
      toast({ title: "Profile Updated!", description: "Your changes have been saved successfully." });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <Card className="bg-white border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <CardHeader className="p-6 md:p-8 border-b border-slate-50 bg-gradient-to-br from-indigo-50/50 to-purple-50/30">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-20 w-20 ring-4 ring-white shadow-lg flex-shrink-0">
              <AvatarImage src={getAvatarUrl(user)} />
              <AvatarFallback className="bg-indigo-600 text-white text-xl font-black">
                {user?.fullName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                    {isEditing ? (
                      <Input
                        value={editData.fullName}
                        onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                        className="text-lg font-bold h-9 w-full md:w-64 bg-white/50 border-indigo-200"
                        placeholder="Full Name"
                      />
                    ) : (
                      <h2 className="text-xl md:text-2xl font-black text-slate-900 truncate">{user?.fullName}</h2>
                    )}
                    <Badge className="bg-indigo-100 text-indigo-700 border-0 rounded-lg text-[9px] uppercase font-bold px-2 py-0.5 shrink-0">
                      {user?.role}
                    </Badge>
                  </div>
                  <p className="text-slate-500 font-medium text-xs">{user?.email}</p>
                </div>

                <div className="flex justify-center md:justify-end gap-2">
                  {isEditing ? (
                    <>
                      <Button size="sm" onClick={handleSave} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-[11px] font-bold h-9 px-5 rounded-xl">
                        {loading ? "Saving..." : <><Save size={14} className="mr-2" /> Save</>}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} className="h-9 px-4 rounded-xl text-slate-500 text-[11px]">Cancel</Button>
                    </>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="border-slate-200 text-slate-600 rounded-xl h-9 px-5 font-bold hover:bg-slate-50 text-[11px]">
                      <Edit2 size={14} className="mr-2" /> Edit Profile
                    </Button>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  <Zap size={12} className="text-indigo-400" /> Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : 'April 2026'}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Identity Information</h4>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { label: "Department", value: user?.department, icon: Briefcase, field: "department" },
                    { label: "College", value: user?.collegeName, icon: Building2, field: "collegeName" },
                    { label: "Phone", value: user?.phoneNumber, icon: Phone, field: "phoneNumber" },
                    { label: "State", value: user?.state || "Gujarat", icon: MapPin, field: "state" },
                  ].map((item) => (
                    <div key={item.label} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4 group transition-all">
                      <div className="h-9 w-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-all shrink-0"><item.icon size={16} /></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
                        {isEditing ? (
                          <Input value={editData[item.field]} onChange={(e) => setEditData({ ...editData, [item.field]: e.target.value })} className="h-8 mt-1 border-indigo-200/50 bg-white/50 text-xs font-semibold" />
                        ) : (
                          <p className="font-bold text-slate-800 text-sm truncate">{item.value || "Not set"}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-[2rem] p-6 md:p-8 text-white relative overflow-hidden flex flex-col justify-between min-h-[350px]">
              <div className="relative z-10">
                <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em] mb-10">Platform Integrity</h4>
                <div className="space-y-10">
                  <div className="flex items-center gap-5">
                    <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center text-white shrink-0"><ShieldCheck size={24} /></div>
                    <div>
                      <p className="text-[10px] font-bold text-indigo-200/60 uppercase tracking-widest">Account Status</p>
                      <p className="font-black text-xl">Verified Student</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-5">
                    <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center text-white shrink-0"><Building2 size={24} /></div>
                    <div>
                      <p className="text-[10px] font-bold text-indigo-200/60 uppercase tracking-widest">Institution</p>
                      <p className="font-black text-xl truncate max-w-[220px]">{user?.collegeName || "SSASIT"}</p>
                    </div>
                  </div>

                  <p className="text-slate-400 text-xs leading-relaxed font-medium pt-4 border-t border-white/5">Verified student profile active in registry. Automated certificate generation enabled.</p>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px]" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSection;
