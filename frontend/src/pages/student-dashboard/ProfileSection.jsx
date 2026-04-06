import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trophy, Star, Zap, Target, Edit2, Save, X, Phone, Building, Briefcase } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getAvatarUrl } from "@/lib/avatar";
import { useToast } from "@/components/ui/use-toast";
import api from "@/lib/axios";

// XP level thresholds
const getLevelInfo = (points) => {
  const levels = [
    { name: "Explorer", min: 0, max: 100, color: "text-slate-600", bg: "bg-slate-100", next: "Participant" },
    { name: "Participant", min: 100, max: 250, color: "text-blue-600", bg: "bg-blue-100", next: "Achiever" },
    { name: "Achiever", min: 250, max: 500, color: "text-indigo-600", bg: "bg-indigo-100", next: "Champion" },
    { name: "Champion", min: 500, max: 1000, color: "text-purple-600", bg: "bg-purple-100", next: "Legend" },
    { name: "Legend", min: 1000, max: Infinity, color: "text-amber-600", bg: "bg-amber-100", next: null },
  ];
  const level = levels.find((l) => points >= l.min && points < l.max) || levels[4];
  const progress = level.max === Infinity ? 100 : Math.round(((points - level.min) / (level.max - level.min)) * 100);
  return { ...level, progress };
};

const BADGE_ICONS = ["🏆", "🥇", "🥈", "🥉", "⭐", "🎖️", "🏅", "💡"];

const ProfileSection = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState({
    fullName: user?.fullName || "",
    phoneNumber: user?.phoneNumber || "",
    department: user?.department || "",
    collegeName: user?.collegeName || "",
  });

  const levelInfo = getLevelInfo(user?.points || 0);

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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="bg-white border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
        {/* Header */}
        <CardHeader className="p-6 md:p-8 border-b border-slate-50 bg-gradient-to-br from-indigo-50/50 to-purple-50/30">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative group">
              <Avatar className="h-24 w-24 ring-4 ring-white shadow-xl shadow-indigo-100 flex-shrink-0">
                <AvatarImage src={getAvatarUrl(user)} />
                <AvatarFallback className="bg-indigo-600 text-white text-2xl font-black">
                  {user?.fullName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <Edit2 size={16} className="text-white" />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                    {isEditing ? (
                      <Input
                        value={editData.fullName}
                        onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                        className="text-xl font-bold h-10 w-full md:w-64 bg-white/50 border-indigo-200"
                        placeholder="Your full name"
                      />
                    ) : (
                      <h2 className="text-2xl md:text-3xl font-black text-slate-900">{user?.fullName}</h2>
                    )}
                    <Badge className="bg-indigo-100 text-indigo-700 border-0 rounded-lg text-[10px] uppercase font-bold">
                      {user?.role}
                    </Badge>
                  </div>
                  <p className="text-slate-500 font-medium text-sm">{user?.email}</p>
                </div>

                <div className="flex justify-center md:justify-end gap-2">
                  {isEditing ? (
                    <>
                      <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-indigo-600 hover:bg-indigo-700 text-sm font-bold h-10 px-6 rounded-xl shadow-lg shadow-indigo-100"
                      >
                        {loading ? "Saving..." : <><Save size={16} className="mr-2" /> Save Changes</>}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditing(false)}
                        className="h-10 px-4 rounded-xl text-slate-500"
                      >
                        <X size={16} className="mr-1" /> Clear
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="border-slate-200 text-slate-600 rounded-xl h-10 px-6 font-bold hover:bg-slate-50 transition-all"
                    >
                      <Edit2 size={16} className="mr-2" /> Edit Profile
                    </Button>
                  )}
                </div>
              </div>

              {/* XP + Level Progress */}
              <div className="space-y-2 max-w-xs mx-auto md:mx-0">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-black px-2.5 py-1 rounded-full ${levelInfo.bg} ${levelInfo.color}`}>
                    {levelInfo.name}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">{user?.points || 0} XP</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000"
                    style={{ width: `${levelInfo.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-8">
              {/* Profile Details Selection */}
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Core Information</h4>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { label: "Department", value: user?.department, icon: Briefcase, field: "department" },
                    { label: "College", value: user?.collegeName, icon: Building, field: "collegeName" },
                    { label: "Phone", value: user?.phoneNumber, icon: Phone, field: "phoneNumber" },
                  ].map((item) => (
                    <div key={item.label} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4 group transition-all">
                      <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-all shadow-sm">
                        <item.icon size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
                        {isEditing ? (
                          <Input
                            value={editData[item.field]}
                            onChange={(e) => setEditData({ ...editData, [item.field]: e.target.value })}
                            className="h-8 mt-1 border-indigo-200/50 bg-white/50 text-sm font-semibold"
                          />
                        ) : (
                          <p className="font-bold text-slate-800">{item.value || "Not set"}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Badges */}
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                  Badges & Achievements
                </h4>
                {user?.badges?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {user.badges.map((badge, i) => (
                      <span
                        key={i}
                        className="flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl py-1.5 px-3 text-xs font-bold"
                      >
                        {BADGE_ICONS[i % BADGE_ICONS.length]} {badge}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <Trophy size={28} className="mx-auto text-slate-300 mb-2" />
                    <p className="text-xs text-slate-400 italic font-medium">Attend events to earn badges!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Rankings Card */}
            <div className="flex flex-col gap-6">
              <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden flex-1 flex flex-col justify-between">
                <div className="relative z-10">
                  <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-6">Competetive Ranking</h4>
                  <div className="space-y-5 mb-8">
                    {[
                      { label: "College", value: user?.ranking?.college, icon: "🏫" },
                      { label: "State", value: user?.ranking?.state, icon: "🗺️" },
                      { label: "National", value: user?.ranking?.national, icon: "🇮🇳" },
                    ].map((rank) => (
                      <div
                        key={rank.label}
                        className="flex justify-between items-center border-b border-white/5 pb-4 last:border-0"
                      >
                        <span className="text-indigo-200/60 text-sm flex items-center gap-3">
                          <span className="text-xl">{rank.icon}</span> {rank.label}
                        </span>
                        <span className="font-black text-2xl tracking-tight">
                          {rank.value ? `#${rank.value}` : "—"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => window.location.href = "/scoreboard"}
                  className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-2xl font-black py-6 tracking-widest uppercase text-xs"
                >
                  Global Leaderboard
                </Button>

                <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/20 rounded-full blur-[80px]" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/20 rounded-full blur-[80px]" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSection;
